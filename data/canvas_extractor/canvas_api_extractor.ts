import { getStorage, ref, uploadBytes } from "firebase/storage";
import logger from "@/lib/logger";
import fs from "fs";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import { Course, CourseApiReturn, UserProfile } from "@/lib/types";
import { courseList, semesters } from "@/lib/constants";
import { courses } from "@/config/mongo/mongoCollections";
import path from "path";
import { decrypt } from "@/lib/utils";
import { storage } from "@/firebase";
let domain = "https://sit.instructure.com/api/v1/";

async function getUserProfileDetails(apiKey_hashed: string) {
  const apiKey = decrypt(apiKey_hashed);
  let url = domain + "users/self/profile";
  // use UserProfile type with the axios call
  let response = {} as UserProfile;
  response = await axios
    .get(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiKey
      }
    })
    .then((response) => {
      return { ...response.data };
    })
    .catch((error) => {
      logger.error(error);
    });
  const data = await getUsersCourseDetails(apiKey);
  // map the response to the UserProfile type
  response = {
    _id: uuidv4(),
    id: response.id,
    name: response.name,
    sortable_name: response.sortable_name,
    avatar_url: response.avatar_url,
    bio: response.bio,
    primary_email: response.primary_email,
    login_id: response.login_id,
    courses: data.map((course: any) => {
      return course.course_id;
    })
  };

  return response;
}

async function updateCourseCollection(updatedCourseDetails: any) {
  let coursesCollection = await courses();
  await updatedCourseDetails.forEach(async (course: any) => {
    let courseInMongo = await coursesCollection.findOne({
      course_code: course.course_code
    });
    let teacherInDB = courseInMongo.course_professors.find(
      (teacher: any) =>
        teacher.display_name === course.course_professors[0].display_name
    );
    if (teacherInDB === undefined) {
      await coursesCollection.updateOne(
        { course_code: course.course_code },
        { $push: { course_professors: course.course_professors[0] } }
      );
    }
  });
}
async function extractSyllabusFromStudentCourseDetails(
  apiKey: string,
  updatedCoursesToExtractSyllabus: any
) {
  for (const course of updatedCoursesToExtractSyllabus) {
    let url = domain + "courses/" + course.course_id + "/modules";
    let response = await axios.get(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiKey
      }
    });

    if (response.data.length === 0) {
      continue;
    }

    let syllabusDoc = "";
    let moduleIds = response.data.map((module: any) => module.id);

    for (const moduleId of moduleIds) {
      try {
        let url =
          domain +
          "courses/" +
          course.course_id +
          "/modules/" +
          moduleId +
          "/items";
        let moduleItems = await axios.get(url, {
          method: "get",
          headers: {
            Authorization: "Bearer " + apiKey
          }
        });

        let content_ids = moduleItems.data
          .map((item: any) => item.content_id) // Map to get content_ids
          .filter((content_id: any) => content_id !== undefined); // Filter out undefined values

        for (const content_id of content_ids) {
          try {
            let url = domain + "files/" + content_id;
            let response = await axios.get(url, {
              method: "get",
              headers: {
                Authorization: "Bearer " + apiKey
              }
            });

            if (response.data.filename.toLowerCase().includes("syllabus")) {
              // TODO CHANGE TO STORE SYLLABUS IN some sort of storage
              //download the syllabus from the url and store it in the database
              let fileStreamResult = await axios.get(response.data.url, {
                responseType: "arraybuffer"
              });
              // let directoryPath = "./public/data/syllabus/";
              let fileName = course.course_code.replace(" ", "_") + ".pdf";
              const storageRef = storage;
              const fileRef = ref(storage, `syllabus/${fileName}`);
              // 'file' comes from the Blob or File API
              const file = fileStreamResult.data;
              const upload = await uploadBytes(fileRef, file);
              logger.info("Uploaded a blob or file!");

              // let coursesCollection = await courses();
              // let updateResult = await coursesCollection.updateOne(
              //   { course_code: course.course_code },
              //   { $set: { course_syllabus: directoryPath + fileName } }
              // );
              // logger.info(
              //   "Syllabus updated successfully for " +
              //     course.course_code +
              //     " and the syllabus is stored at " +
              //     directoryPath +
              //     fileName
              // );
            }
          } catch (error) {
            logger.error(" Error: " + error + " for the url " + url);
          }
        }
      } catch (error) {
        logger.error("Axios Error: " + error + " for the url " + url);
      }
    }
  }
}

async function getUsersCourseDetails(apiKey: string) {
  try {
    let url = domain + "courses/?include[]=teachers&include[]=term";

    let response = await axios.get(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiKey
      }
    });
    let result = response.data.map((course: CourseApiReturn) => {
      const regex = /[A-Z]{2,4}\s\d{3}/g;
      let course_code = course.name.match(regex);
      if (course_code === null || typeof course_code[0] !== "string") {
        return null;
      }
      let course_code_first: string = course_code[0];
      let course_name = courseList[course_code_first];
      if (course_name === undefined) {
        return null;
      }
      let teacher = {
        display_name: course.teachers[0].display_name,
        teacher_avatar: course.teachers[0].avatar_image_url
      };
      return {
        course_id: course.id,
        course_code: course_code_first,
        course_title: course_name,
        course_professors: [teacher]
      };
    });
    // remove nulls from result
    result = result.filter((course: any) => course !== null);

    //TODO REFACTOR TO orchestrate it better
    try {
      await extractSyllabusFromStudentCourseDetails(apiKey, result);
      logger.info("Syllabus extracted successfully");
    } catch (error: any) {
      logger.error(
        error.code + ":" + error.message + "for the url " + error.config.url
      );
    }
    try {
      await updateCourseCollection(result);
      logger.info("Courses updated successfully");
    } catch (error) {
      // TODO something with error
      logger.error(error);
    }
    return result;
  } catch (error) {
    logger.error(error);
  }
}

function getRegisteredCourseDetails_mongo() {
  return [];
}
export {
  getUserProfileDetails,
  getUsersCourseDetails,
  getRegisteredCourseDetails_mongo
};
