export const dynamic = "force-dynamic";

import { getCourseByDepartment } from "@/data/courses/course";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { departmentMapper } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Course } from "@/lib/types";
const DepertmentCourses = async ({
  params
}: {
  params: { code: string; level: string };
}) => {
  const { code } = params;
  const { level } = params;
  const courses: Course[] = await getCourseByDepartment(code, level);
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl">
        All course at level {level}under Department of{" "}
        {departmentMapper[code.toUpperCase()]}
      </h1>
      {courses.map((course) => (
        <Accordion type="single" key={course._id} collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              {course.course_code} - {course.course_title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-6 rounded-lg border-2 border-gray-100 p-2 dark:border-slate-600">
                <dl className="divide-y divide-gray-100 dark:divide-slate-700">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Professor Name
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {course?.course_professors.map((professor) => (
                        <span className="mr-4" key={professor.display_name}>
                          {professor.display_name}
                        </span>
                      ))}{" "}
                      {course?.course_professors.length === 0 && <span>-</span>}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {course?.course_description || <span>-</span>}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">Credits</dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {course?.course_credits}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Course Prerequisites
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {course?.course_prereqs?.map((prereq) => (
                        <span className="mr-4" key={prereq}>
                          {prereq}
                        </span>
                      ))}{" "}
                      {course?.course_prereqs.length === 0 && <span>-</span>}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Semester Offered
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {course?.course_offered_in.map((semester) => (
                        <span className="mr-4" key={semester}>
                          {semester}
                        </span>
                      ))}{" "}
                      {course?.course_offered_in.length === 0 && (
                        <span>Fall Spring Summer </span>
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Course Rating
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {course?.course_rating || 0} / 5
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Students Enrolled Currently
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      <span className="mr-4">
                        {(course?.currently_enrolled?.length ?? 0) != 0 &&
                          course?.currently_enrolled?.length}
                        {(course?.currently_enrolled?.length ?? 0) === 0 && "-"}
                      </span>
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Students Enrolled Previously
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      <span className="mr-4">
                        {(course?.previously_enrolled?.length ?? 0) +
                          (course?.currently_enrolled?.length ?? 0) !=
                          0 &&
                          course?.previously_enrolled?.length +
                            course?.currently_enrolled?.length}
                        {(course?.previously_enrolled?.length ?? 0) +
                          (course?.currently_enrolled?.length ?? 0) ===
                          0 && "-"}
                      </span>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">Syllabus</dt>
                    <dd className="mt-2 text-sm  sm:col-span-2 sm:mt-0">
                      <ul
                        role="list"
                        className="divide-y divide-gray-100 rounded-md border border-gray-200"
                      >
                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                          <div className="flex w-0 flex-1 items-center">
                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                              <span className="flex-shrink-0 text-gray-400">
                                {course?.course_syllabus != "" &&
                                  course?.download_size != 0 && (
                                    <>{course?.download_size}KB</>
                                  )}
                              </span>

                              {course?.course_syllabus != "" &&
                              course?.download_size != 0 ? (
                                <div className="ml-4 flex-shrink-0">
                                  <a
                                    href={`${course.course_syllabus}`}
                                    target="_blank"
                                    className="flex font-medium hover:text-indigo-500"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-arrow-down-to-line"
                                    >
                                      <path d="M12 17V3" />
                                      <path d="m6 11 6 6 6-6" />
                                      <path d="M19 21H5" />
                                    </svg>
                                    Download
                                  </a>
                                </div>
                              ) : (
                                <p>No Syllabus Available Yet!</p>
                              )}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
                </dl>
                <div className="flex justify-center">
                  <a
                    target="_blank"
                    href={course.stevens_course_link}
                    rel="noopener noreferrer"
                  >
                    <Button>View on Website</Button>
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default DepertmentCourses;
