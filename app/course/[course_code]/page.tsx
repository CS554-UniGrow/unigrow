"use client";
import { getCourseByDepartment } from "@/data/courses/course";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { courseList, departmentMapper } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Course, UserProfile } from "@/lib/types";
import { getCourseById } from "@/app/courses/data";
import { notFound, redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";
import Link from "next/link";
import { useSession } from "next-auth/react";

function useFetchCourse(course_code: string) {
  const [data, setData] = useState({} as Course);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetch(`/api/course/${course_code}`)
        .then((res) => res.json())
        .then((data: Course) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    };
    fetchData();
  }, [course_code]);

  return { data, error, loading };
}

const CourseById = () => {
  const params = useParams();
  const { data: session, status }: any = useSession();
  const course_code = params.course_code as string;

  const { data, error, loading } = useFetchCourse(course_code as string);

  if (!session?.user?.isAuthenticated) {
    redirect("/signup");
  }

  if (!session?.user?.isOnboarded) {
    redirect("/onboarding");
  }

  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <Loading />;
  }
  // throw 404 page error if no data
  if (courseList[decodeURI(course_code)] == undefined) {
    notFound();
  }
  return (
    <div className="mx-auto max-w-4xl">
      {
        <Accordion type="single" key={data?._id} defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              {data?.course_code} - {data?.course_title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-6 rounded-lg border-2 border-gray-100 p-2 dark:border-slate-600">
                <dl className="divide-y divide-gray-100 dark:divide-slate-700">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Professor Name
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {data?.course_professors?.map((professor) => (
                        <span className="mr-4" key={professor.display_name}>
                          {professor.display_name}
                        </span>
                      ))}{" "}
                      {data?.course_professors?.length === 0 && <span>-</span>}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {data?.course_description || <span>-</span>}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">Credits</dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {data?.course_credits}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Course Prerequisites
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {data?.course_prereqs?.map((prereq) => (
                        <Link href={`/course/${prereq}`} key={prereq}>
                          <Button className="mr-4">{prereq}</Button>
                        </Link>
                      ))}{" "}
                      {data?.course_prereqs?.length === 0 && <span>-</span>}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Semester Offered
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {data?.course_offered_in?.map((semester) => (
                        <span className="mr-4" key={semester}>
                          {semester}
                        </span>
                      ))}{" "}
                      {data?.course_offered_in?.length === 0 && (
                        <span>Fall Spring Summer </span>
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Course Rating
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      {data?.course_rating || 0} / 5
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Students Enrolled Currently
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      <span className="mr-4">
                        {(data?.currently_enrolled?.length ?? 0) != 0 &&
                          data.currently_enrolled.length}
                        {(data?.currently_enrolled?.length ?? 0) === 0 && "-"}
                      </span>
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 ">
                      Students Enrolled Previously
                    </dt>
                    <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                      <span className="mr-4">
                        {(data?.previously_enrolled?.length ?? 0) +
                          (data?.currently_enrolled?.length ?? 0) !=
                          0 &&
                          data.previously_enrolled.length +
                            data.currently_enrolled.length}
                        {(data?.previously_enrolled?.length ?? 0) +
                          (data?.currently_enrolled?.length ?? 0) ===
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
                                {data?.course_syllabus != "" &&
                                  data?.download_size != 0 && (
                                    <>{data?.download_size}KB</>
                                  )}
                              </span>

                              {data?.course_syllabus != "" &&
                              data?.download_size != 0 ? (
                                <div className="ml-4 flex-shrink-0">
                                  <a
                                    href={`${data?.course_syllabus}`}
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
                    href={data?.stevens_course_link}
                    rel="noopener noreferrer"
                  >
                    <Button>View on Website</Button>
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      }
    </div>
  );
};

export default CourseById;
