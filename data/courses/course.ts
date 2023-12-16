import { courses as courseCollection } from "@/config/mongo/mongoCollections"

export const getCourseByDepartment = async (
  department: string,
  level: string = ""
) => {
  let departmentPattern = new RegExp("^" + department + "$", "i")
  const course = await courseCollection()
  let courses = await course
    .find({ department_code: departmentPattern })
    .toArray()
  if (level !== "") {
    courses = courses.filter((course: any) => course.course_level === level)
  }
  return courses
}
