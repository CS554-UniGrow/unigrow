import { courses as courseCollection } from "@/config/mongo/mongoCollections";

export const getCourseByDepartment = async (department: string) => {
  let departmentPattern = new RegExp("^" + department + "$", "i");
  const course = await courseCollection();
  let courses = await course.find({ department_code: departmentPattern }).toArray();
  return courses;
};
