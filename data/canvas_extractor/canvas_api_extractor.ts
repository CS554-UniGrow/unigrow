import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Course, CourseApiReturn, UserProfile } from "@/lib/types";
import { courseListType, semesters } from "@/lib/constants";
let domain = "https://sit.instructure.com/api/v1/";

async function getUserProfileDetails(apiKey: string) {
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
      console.log(error);
    });
  // map the response to the UserProfile type
  response = {
    _id: uuidv4(),
    id: response.id,
    name: response.name,
    sortable_name: response.sortable_name,
    avatar_url: response.avatar_url,
    bio: response.bio,
    primary_email: response.primary_email,
    login_id: response.login_id
  };

  return response;
}

async function getUsersCourseDetails(apiKey: string) {
  let url = domain + "courses/?include[]=teachers&include[]=term";
  let response = {} as Course;
  response = await axios
    .get(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiKey
      }
    })
    .then((response) => {
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
          course_code: course_code_first,
          course_title: course_name,
          course_professors: [teacher]
        };
      });
      return result;
    })

    .catch((error) => {
      console.log(error);
    });
  return response;
}

export { getUserProfileDetails, getUsersCourseDetails };
