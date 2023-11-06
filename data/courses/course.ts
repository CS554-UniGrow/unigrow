import { courses as courseCollection } from "@/config/mongo/mongoCollections";

export const getCourseByDepartment = async (department: string) => {
  const course = await courseCollection();
  let courses = await course.find({ department_code: department }).toArray();
  return courses;
};
