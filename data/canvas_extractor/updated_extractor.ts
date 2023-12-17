import { courses } from "@/config/mongo/mongoCollections"
import { storage } from "@/firebase"
import { semesters } from "@/lib/constants"
import logger from "@/lib/logger"
import { T } from "@upstash/redis/zmscore-415f6c9f"
import axios from "axios"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

let domain = process.env.NEXT_PUBLIC_CANVAS_BASE_URL

async function uploadAndUpdateSyllabus(
  course: any,
  fileRef: any,
  fileArrayBuffer: any,
  coursesCollection: any
) {
  try {
    const upload = await uploadBytes(fileRef, fileArrayBuffer, {
      customMetadata: {
        x_api_key: process.env.NEXT_API_SEED_SECRET as string
      },
      contentType: "application/pdf"
    })
    const download_url = await getDownloadURL(upload.ref)
    logger.info("Uploaded a blob or file!")

    const fileSizeKB = fileArrayBuffer.byteLength / 1000
    const updateResult = await coursesCollection.updateOne(
      { course_code: course.course_code },
      {
        $set: {
          course_syllabus: download_url,
          download_size: fileSizeKB
        }
      }
    )

    logger.info(`${updateResult.modifiedCount} document(s) updated`)
    logger.info(
      `Syllabus updated successfully for ${course.course_code} and stored at ${download_url}`
    )
  } catch (error) {
    logger.error(`Error uploading and updating syllabus: ${error}`)
  }
}

async function downloadAndStoreSyllabus(
  course: any,
  content_id: any,
  apiKey: string
) {
  try {
    const fileResponse = await axios.get(
      `${domain}files/${content_id}`,
      getAxiosOptions(apiKey)
    )

    if (!fileResponse.data) {
      throw new Error(
        `Failed to download syllabus for course ${course.course_code}`
      )
    }

    let coursesCollection = await courses()
    let courseInMongo = await coursesCollection.findOne({
      course_code: course.course_code
    })

    if (!courseInMongo) {
      logger.error(
        `Course not found in the database for the course code ${course.course_code}`
      )
      return
    }

    let fileName = `${course.course_code} ${course.term_taken_in.replace(
      /\s/g,
      "_"
    )}.pdf`.replace(" ", "_")

    // let fileDownloadResponse = null
    // await fetch(fileResponse.data.url, {
    //   ...getFetchOptions(apiKey),
    //   cache: "no-store"
    // }).then(async (response) => {
    //   await fetch(response.url, {
    //     ...getFetchOptions(apiKey),
    //     cache: "no-store"
    //   }).then((response) => {
    //     fileDownloadResponse = response
    //   })
    // })

    const fileRef = ref(
      storage,
      `syllabus/${course.course_code.replace(" ", "_")}/${fileName}`
    )

    const hasSyllabus =
      courseInMongo.course_syllabus !== null &&
      courseInMongo.course_syllabus !== undefined &&
      courseInMongo.course_syllabus !== ""

    if (
      fileResponse.data.filename.toLowerCase().includes("syllabus") ||
      fileResponse.data.display_name.toLowerCase().includes("syllabus")
    ) {
      let fileDownloaded = await fetch(fileResponse.data.url, {
        ...getFetchOptions(apiKey),
        cache: "no-store"
      }).then((response) => response.arrayBuffer())
      if (!hasSyllabus) {
        await uploadAndUpdateSyllabus(
          course,
          fileRef,
          fileDownloaded,
          coursesCollection
        )
      }
    } else if (courseInMongo.course_syllabus !== "") {
      logger.info(
        `Syllabus already exists for ${course.course_code} and is stored at ${courseInMongo.course_syllabus}`
      )

      const courseInMongo_urlObject = new URL(courseInMongo.course_syllabus)
      const courseInMongo_pathArray =
        courseInMongo_urlObject.pathname.split("/")
      const courseInMongo_fileName = decodeURIComponent(
        courseInMongo_pathArray[courseInMongo_pathArray.length - 1]
      ).split(" " || ".")

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
        await uploadAndUpdateSyllabus(
          course,
          fileRef,
          fileDownloaded,
          coursesCollection
        )
      } else if (course_year_index === courseInMongo_year_index) {
        if (course_semester_index > courseInMongo_semester_index) {
          await uploadAndUpdateSyllabus(
            course,
            fileRef,
            fileDownloaded,
            coursesCollection
          )
        }
      }
    }
  } catch (error) {
    logger.error({
      url: `${domain}files/${content_id}`,
      content_id: content_id,
      course_code: course.course_code
    })
    logger.error(
      `Error downloading syllabus for course ${course.course_code}: ${error}`
    )
  }
}
function getFetchOptions(apiKey: string) {
  return {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/pdf"
    }
  }
}

function getAxiosOptions(apiKey: string) {
  return {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/pdf"
    }
  }
}

async function processCourse(course: any, apiKey: string) {
  try {
    const moduleResponse = await axios.get(
      `${domain}courses/${course.course_id}/modules?include[]=items&include[]=content_details`,
      getAxiosOptions(apiKey)
    )

    if (!moduleResponse.data) {
      throw new Error(
        `Failed to fetch modules for course ${course.course_code}`
      )
    }

    const moduleData = moduleResponse.data

    if (moduleData.length === 0) {
      return
    }

    const contentIds = moduleData
      .map((module: any) => module.items)
      .flat()
      .map((item: any) => item.content_id)
      .filter(
        (content_id: any) => content_id !== null && content_id !== undefined
      )

    await Promise.all(
      contentIds.map(async (contentId: any) => {
        await downloadAndStoreSyllabus(course, contentId, apiKey)
      })
    )
  } catch (error) {
    logger.error(`Error processing course ${course.course_code}: ${error}`)
  }
}

export async function extractSyllabusFromStudentCourseDetails(
  apiKey: string,
  updatedCoursesToExtractSyllabus: any
) {
  let result = await Promise.all(
    updatedCoursesToExtractSyllabus.map((course: any) =>
      processCourse(course, apiKey)
    )
  )
  logger.info(result)
}
