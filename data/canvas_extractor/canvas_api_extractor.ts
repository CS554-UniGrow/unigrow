import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import logger from "@/lib/logger"
import fs from "fs"
import axios, { AxiosError } from "axios"
import { Course, CourseApiReturn, UserProfile } from "@/lib/types"
import { courseList, semester_mapper, semesters } from "@/lib/constants"
import { courses, users } from "@/config/mongo/mongoCollections"
import path from "path"
import { decrypt } from "@/lib/utils"
import { storage } from "@/firebase"
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
  let response = {} as UserProfile
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
    // { $push: { currently_enrolled: uid } }
    //based on term_taken_in add uid to the currently_enrolled array or the previous_enrolled array
    let term_taken_in = course.term_taken_in
    let term_taken_in_array = term_taken_in.split(" ")
    let year = term_taken_in_array[0]
    let semester = term_taken_in_array[1]
    let semester_index = semesters.indexOf(semester)
    let year_index = parseInt(year)
    let current_year = semester_mapper.current_year
    let current_semester = semester_mapper.current_semester
    let current_semester_index = semesters.indexOf(current_semester)
    let current_year_index = current_year
    let courseInMongo_currently_enrolled = courseInMongo.currently_enrolled
    let courseInMongo_previously_enrolled = courseInMongo.previously_enrolled
    if (year_index > current_year_index) {
      await coursesCollection.updateOne(
        { course_code: course.course_code },
        {
          $push: { currently_enrolled: uid },
          $pull: { previously_enrolled: uid }
        }
      )
    } else if (year_index === current_year_index) {
      if (semester_index > current_semester_index) {
        await coursesCollection.updateOne(
          { course_code: course.course_code },
          {
            $push: { currently_enrolled: uid },
            $pull: { previously_enrolled: uid }
          }
        )
      } else if (semester_index === current_semester_index) {
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
    } else {
      await coursesCollection.updateOne(
        { course_code: course.course_code },
        {
          $push: { previously_enrolled: uid },
          $pull: { currently_enrolled: uid }
        }
      )
    }

    logger.info("Course updated successfully for " + course.course_code)
  })
}
async function extractSyllabusFromStudentCourseDetails(
  apiKey: string,
  updatedCoursesToExtractSyllabus: any
) {
  for (const course of updatedCoursesToExtractSyllabus) {
    let url = domain + "courses/" + course.course_id + "/modules"
    let response = await axios.get(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiKey
      }
    })

    if (response.data.length === 0) {
      continue
    }

    let moduleIds = response.data.map((module: any) => module.id)

    for (const moduleId of moduleIds) {
      try {
        let url =
          domain +
          "courses/" +
          course.course_id +
          "/modules/" +
          moduleId +
          "/items"
        let moduleItems = await axios.get(url, {
          method: "get",
          headers: {
            Authorization: "Bearer " + apiKey
          }
        })

        let content_ids = moduleItems.data
          .map((item: any) => item.content_id) // Map to get content_ids
          .filter((content_id: any) => content_id !== undefined) // Filter out undefined values

        for (const content_id of content_ids) {
          try {
            let url = domain + "files/" + content_id
            let response = await axios.get(url, {
              method: "get",
              headers: {
                Authorization: "Bearer " + apiKey
              }
            })

            if (response.data.filename.toLowerCase().includes("syllabus")) {
              //download the syllabus from the url and store it in the database
              let fileStreamResult = await axios.get(response.data.url, {
                responseType: "arraybuffer"
              })
              // let directoryPath = "./public/data/syllabus/";
              let fileName =
                (course.course_code + " " + course.term_taken_in).replace(
                  " ",
                  "_"
                ) + ".pdf"
              const fileRef = ref(
                storage,
                `syllabus/${course.course_code.replace(" ", "_")}/${fileName}`
              )
              // 'file' comes from the Blob or File API
              const file = fileStreamResult.data

              let coursesCollection = await courses()
              let courseInMongo = await coursesCollection.findOne({
                course_code: course.course_code
              })
              if (courseInMongo === null) {
                logger.error(
                  "Course not found in the database for the course code " +
                    course.course_code
                )
              } else if (
                courseInMongo!.course_syllabus === "" ||
                courseInMongo!.course_syllabus === undefined ||
                courseInMongo!.course_syllabus === null
              ) {
                const upload = await uploadBytes(fileRef, file, {
                  customMetadata: {
                    x_api_key: process.env.NEXT_API_SEED_SECRET as string
                  },
                  contentType: "application/pdf"
                })
                const download_url = await getDownloadURL(upload.ref)
                logger.info("Uploaded a blob or file!")
                const fileSizeKB = file.byteLength / 1000
                let updateResult = await coursesCollection.updateOne(
                  { course_code: course.course_code },
                  {
                    $set: {
                      course_syllabus: download_url,
                      download_size: fileSizeKB
                    }
                  }
                )
                logger.info(updateResult.modifiedCount + " document(s) updated")
                logger.info(
                  "Syllabus updated successfully for " +
                    course.course_code +
                    " and the syllabus is stored at " +
                    download_url
                )
                logger.info(updateResult.modifiedCount + " document(s) updated")
              } else if (courseInMongo.course_syllabus != "") {
                logger.info(
                  "Syllabus already exists for " +
                    course.course_code +
                    " and the syllabus is stored at " +
                    courseInMongo.course_syllabus
                )
                const courseInMongo_urlObject = new URL(
                  courseInMongo.course_syllabus
                )
                const courseInMongo_pathArray =
                  courseInMongo_urlObject.pathname.split("/")
                const courseInMongo_fileName = decodeURIComponent(
                  courseInMongo_pathArray[courseInMongo_pathArray.length - 1]
                ).split(" " || ".")
                // check if course url is of a more recent semester or not and update it if it is not the most recent
                let course_semester = course.term_taken_in.split(" ")[1]
                let course_year = course.term_taken_in.split(" ")[0]
                let course_semester_index = semesters.indexOf(course_semester)
                let course_year_index = parseInt(course_year)
                let courseInMongo_semester = courseInMongo_fileName[2]
                let courseInMongo_year = courseInMongo_fileName[1]
                let courseInMongo_semester_index = semesters.indexOf(
                  courseInMongo_semester
                )
                let courseInMongo_year_index = parseInt(courseInMongo_year)
                if (course_year_index > courseInMongo_year_index) {
                  const upload = await uploadBytes(fileRef, file, {
                    customMetadata: {
                      x_api_key: process.env.NEXT_API_SEED_SECRET as string
                    },
                    contentType: "application/pdf"
                  })
                  const download_url = await getDownloadURL(upload.ref)
                  logger.info("Uploaded a blob or file!")
                  logger.info(
                    "Course " +
                      course.course_code +
                      " is of a more recent semester and the syllabus is stored at " +
                      download_url
                  )
                  const fileSizeKB = file.byteLength / 1000

                  let updateResult = await coursesCollection.updateOne(
                    { course_code: course.course_code },
                    {
                      $set: {
                        course_syllabus: download_url,
                        download_size: fileSizeKB
                      }
                    }
                  )
                  logger.info(
                    updateResult.modifiedCount + " document(s) updated"
                  )
                } else if (course_year_index === courseInMongo_year_index) {
                  if (course_semester_index > courseInMongo_semester_index) {
                    const upload = await uploadBytes(fileRef, file, {
                      customMetadata: {
                        x_api_key: process.env.NEXT_API_SEED_SECRET as string
                      },
                      contentType: "application/pdf"
                    })
                    const download_url = await getDownloadURL(upload.ref)
                    logger.info("Uploaded a blob or file!")
                    logger.info(
                      "Course " +
                        course.course_code +
                        " is of a more recent semester and the syllabus is stored at " +
                        download_url
                    )
                    const fileSizeKB = file.byteLength / 1000

                    let updateResult = await coursesCollection.updateOne(
                      { course_code: course.course_code },
                      {
                        $set: {
                          course_syllabus: download_url,
                          download_size: fileSizeKB
                        }
                      }
                    )
                    logger.info(
                      updateResult.modifiedCount + " document(s) updated"
                    )
                  }
                } else {
                  logger.info(
                    "Syllabus already exists for " +
                      course.course_code +
                      " and the syllabus is stored at " +
                      courseInMongo.course_syllabus
                  )
                  let fileStreamResult = await axios.get(
                    courseInMongo.course_syllabus,
                    {
                      responseType: "arraybuffer"
                    }
                  )
                  const file = fileStreamResult.data
                  const fileSizeKB = file.byteLength / 1000

                  let updateResult = await coursesCollection.updateOne(
                    { course_code: course.course_code },
                    { $set: { download_size: fileSizeKB } }
                  )
                  logger.info(
                    updateResult.modifiedCount + " document(s) updated"
                  )
                }
              }
            }
          } catch (error) {
            logger.error(" Error: " + error + " for the url " + url)
          }
        }
      } catch (error) {
        logger.error("Axios Error: " + error + " for the url " + url)
      }
    }
  }
}

async function getUsersCourseDetails(apiKey: string, uid: string) {
  try {
    let url = domain + "courses/?include[]=teachers&include[]=term"

    let response = await axios.get(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiKey
      }
    })
    let result = response.data.map((course: CourseApiReturn) => {
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
  try {
    await updateCourseCollection(result, uid)
    logger.info("Courses updated successfully")
  } catch (error) {
    // TODO something with error
    logger.error(error)
  }
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
