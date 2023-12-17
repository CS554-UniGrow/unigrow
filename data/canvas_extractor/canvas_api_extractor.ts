import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import logger from "@/lib/logger"
import fs from "fs"
import axios, { AxiosError } from "axios"
import { courseList, semester_mapper, semesters } from "@/lib/constants"
import { courses, users } from "@/config/mongo/mongoCollections"
import path from "path"
import { decrypt } from "@/lib/utils"
import { storage } from "@/firebase"
import { extractSyllabusFromStudentCourseDetails } from "./updated_extractor"
let domain = process.env.NEXT_PUBLIC_CANVAS_BASE_URL

async function getUserProfileDetails({
  apiKey_hashed,
  uid,
  refreshToken
}: {
  apiKey_hashed: string
  uid: string
  refreshToken: string
}) {
  const apiKey = decrypt(apiKey_hashed)
  let url = domain + "users/self/profile"
  // use UserProfile type with the axios call
  let response = {} as any
  response = await axios
    .get(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiKey
      }
    })
    .then((response) => {
      return { ...response.data }
    })
    .catch((error) => {
      logger.error(error)
    })
  const data = await getUsersCourseDetails(apiKey, uid)
  // map the response to the UserProfile type
  response = {
    id: response.id,
    name: response.name,
    sortable_name: response.sortable_name,
    avatar_url: response.avatar_url,
    bio: response.bio,
    primary_email: response.primary_email,
    login_id: response.login_id,
    courses: data.map((course: any) => {
      return course.course_code
    }),
    apiKey_hashed: apiKey_hashed,
    isOnboarded: true,
    refreshToken: refreshToken
  }
  // insert user profile details into the database
  let usersCollection = await users()
  let userInDB = await usersCollection.findOne({
    id: response.id,
    login_id: response.login_id,
    primary_email: response.primary_email
  })

  const res = await usersCollection.updateOne({ _id: uid }, { $set: response })
  return response
}

async function updateCourseCollection(updatedCourseDetails: any, uid: string) {
  let coursesCollection = await courses()
  await updatedCourseDetails.forEach(async (course: any) => {
    let courseInMongo = await coursesCollection.findOne({
      course_code: course.course_code
    })
    let teacherInDB = courseInMongo.course_professors.find(
      (teacher: any) =>
        teacher.display_name === course.course_professors[0].display_name
    )
    if (teacherInDB === undefined) {
      await coursesCollection.updateOne(
        { course_code: course.course_code },
        { $push: { course_professors: course.course_professors[0] } }
      )
    }

    logger.info("Course updated successfully for " + course.course_code)
  })
}

async function getUsersCourseDetails(apiKey: string, uid: string) {
  try {
    let url =
      domain +
      "courses/?include[]=teachers&include[]=term&include[]=total_students&include[]=concluded"

    let response = await axios.get(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiKey
      }
    })
    let result = response.data.map((course: any) => {
      const regex = /[A-Z]{2,4}\s\d{3}/g
      let course_code = course.name.match(regex)
      if (course_code === null || typeof course_code[0] !== "string") {
        return null
      }
      let course_code_first: string = course_code[0]
      let course_name = courseList[course_code_first]
      if (course_name === undefined) {
        return null
      }
      let teacher = {
        display_name: course.teachers[0].display_name,
        teacher_avatar: course.teachers[0].avatar_image_url
      }
      return {
        term_taken_in: course.term.name,
        course_id: course.id,
        course_code: course_code_first,
        course_title: course_name,
        course_professors: [teacher]
      }
    })
    // remove nulls from result
    result = result.filter((course: any) => course !== null)

    // TODO put in separate API
    await processStudentCourseDetails(apiKey, result, uid)
    return result
  } catch (error) {
    logger.error(error)
  }
}

async function processStudentCourseDetails(
  apiKey: string,
  result: any,
  uid: string
) {
  // TODO MAKE Child sub process API call and thread
  try {
    await updateCourseCollection(result, uid)
    logger.info("Courses updated successfully")
  } catch (error) {
    // TODO something with error
    logger.error(error)
  }

  // TODO MAKE Child sub process API call and thread

  try {
    await extractSyllabusFromStudentCourseDetails(apiKey, result)
    logger.info("Syllabus extracted successfully")
  } catch (error: any) {
    logger.error(
      `${error.code}:${error.message} for the url ${error.config.url}`
    )
  }
}

async function getAllUsersCourseDetails() {
  logger.info("Getting all users course details")
  let usersCollection = await users()
  let usersInDB = await usersCollection.find({}).toArray()
  for (let user of usersInDB) {
    const apiKey = decrypt(user.apiKey_hashed)
    await getUsersCourseDetails(apiKey, user._id)
  }
}

export {
  getUserProfileDetails,
  getUsersCourseDetails,
  getAllUsersCourseDetails
}
