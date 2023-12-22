import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import logger from "@/lib/logger"
import fs from "fs"
import { courseList, semester_mapper, semesters } from "@/lib/constants"
import { courses, users } from "@/config/mongo/mongoCollections"
import path from "path"
import { decrypt } from "@/lib/utils"
import { storage } from "@/firebase"
import { extractSyllabusFromStudentCourseDetails } from "./updated_extractor"
let domain = process.env.NEXT_PUBLIC_CANVAS_BASE_URL

function getFetchOptions(apiKey: string) {
  return {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/pdf"
    }
  }
}
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
  response = await fetch(url, {
    ...getFetchOptions(apiKey),
    cache: "no-store"
  })
    .then((response) => {
      return response.json()
    })
    .catch((error) => {
      logger.error(error)
    })
  const data = await getUsersCourseDetails(apiKey, uid)
  //data schema
  // {
  //   term_taken_in: '2023 Fall Semester',
  //   course_id: 68917,
  //   course_code: 'CS 703',
  //   course_title: 'Practicum in Computer Science',
  //   course_professors: [ [Object] ]
  // },
  // {
  //   term_taken_in: '2023 Spring Semester',
  //   course_id: 63256,
  //   course_code: 'CS 559',
  //   course_title: 'Machine Learning: Fundamentals and Applications',
  //   course_professors: [ [Object] ]
  // },

  // let joining_term_complete = data.sort((a: any, b: any) => {
  //   const a_term = a.term_taken_in.split(" ")
  //   const b_term = b.term_taken_in.split(" ")
  //   const a_year = parseInt(a_term[0])
  //   const b_year = parseInt(b_term[0])
  //   const a_semester = a_term[1]
  //   const b_semester = b_term[1]
  //   if (a_year < b_year) {
  //     return -1
  //   } else if (a_year > b_year) {
  //     return 1
  //   } else {
  //     if (semesters.indexOf(a_semester) < semesters.indexOf(b_semester)) {
  //       return -1
  //     } else if (
  //       semesters.indexOf(a_semester) > semesters.indexOf(b_semester)
  //     ) {
  //       return 1
  //     }
  //     return 0
  //   }
  // })[0].term_taken_in

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
    // joining_term_complete: joining_term_complete.replace(" Semester", ""),
    // joining_year: joining_term_complete.split(" ")[0],
    // joining_semester: joining_term_complete.split(" ")[1]
  }
  // insert user profile details into the database
  let usersCollection = await users()
  let userInDB = await usersCollection.findOne({
    id: response.id,
    login_id: response.login_id,
    primary_email: response.primary_email
  })

  const res = await usersCollection.updateOne({ _id: uid }, { $set: response })
  userInDB = await usersCollection.findOne({
    id: response.id,
    login_id: response.login_id,
    primary_email: response.primary_email
  })
  return userInDB
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
    // { $push: { currently_enrolled: uid } }
    //based on term_taken_in add uid to the currently_enrolled array or the previous_enrolled array
    let term_taken_in = course.term_taken_in
    let term_taken_in_array = term_taken_in.split(" ")
    let year = parseInt(term_taken_in_array[0])
    let semester = term_taken_in_array[1]
    let semester_index = semesters.indexOf(semester)
    let current_year = semester_mapper.current_year
    let current_semester = semester_mapper.current_semester
    let current_semester_index = semesters.indexOf(current_semester)
    if (year < current_year) {
      await coursesCollection.updateOne(
        { course_code: course.course_code },
        {
          $push: { previously_enrolled: uid },
          $pull: { currently_enrolled: uid }
        }
      )
    } else if (year === current_year) {
      if (semester_index > current_semester_index) {
        await coursesCollection.updateOne(
          { course_code: course.course_code },
          {
            $push: { currently_enrolled: uid },
            $pull: { previously_enrolled: uid }
          }
        )
      } else if (semester_index == current_semester_index) {
        await coursesCollection.updateOne(
          { course_code: course.course_code },
          {
            $push: { currently_enrolled: uid },
            $pull: { previously_enrolled: uid }
          }
        )
      } else {
        await coursesCollection.updateOne(
          { course_code: course.course_code },
          {
            $push: { previously_enrolled: uid },
            $pull: { currently_enrolled: uid }
          }
        )
      }
    }

    logger.info("Course updated successfully for " + course.course_code)
  })
}

async function getUsersCourseDetails(apiKey: string, uid: string) {
  try {
    let url =
      domain +
      "courses/?include[]=teachers&include[]=term&include[]=total_students&include[]=concluded"

    let response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + apiKey
      },
      cache: "no-cache"
    }).then((response) => response.json())
    let result = response.map((course: any) => {
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

  let result = await Promise.all(
    usersInDB.map((user: any) =>
      getUsersCourseDetails(decrypt(user?.apiKey_hashed), user?._id)
    )
  )
  // for (let user of usersInDB) {
  //   const apiKey = decrypt(user.apiKey_hashed)
  //   await getUsersCourseDetails(apiKey, user._id)
  // }
}

export {
  getUserProfileDetails,
  getUsersCourseDetails,
  getAllUsersCourseDetails
}
