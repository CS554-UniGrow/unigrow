"use client"
import { getCourseByDepartment } from "@/data/courses/course"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { courseList, departmentMapper } from "@/lib/constants"
import ReviewRating from "@/components/ReviewRating"
import { Button } from "@/components/ui/button"
import { Course, UserProfile } from "@/lib/types"
import { getCourseById } from "@/app/courses/data"
import { notFound, redirect, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Loading from "@/components/ui/loading"
import Link from "next/link"
import { useSession } from "next-auth/react"
import Error from "@/components/Error"

function useFetchCourse(course_code: string) {
  const [data, setData] = useState({} as Course)
  const [error, setError] = useState(null as any)
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(0)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/course/${course_code}`)
      const data = await response.json()
      setData(data)
      setRating(data?.course_rating)
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [course_code, rating])

  return { data, error, loading, rating, fetchData }
}

const CourseById = () => {
  const params = useParams()
  const { data: session, status }: any = useSession()
  const course_code = params.course_code as string
  const { data, error, loading, rating, fetchData } = useFetchCourse(
    course_code as string
  )

  if (error) {
    return <Error error={error} />
  }
  if (loading) {
    return <Loading />
  }
  // throw 404 page error if no data
  if (courseList[decodeURI(course_code)] == undefined) {
    notFound()
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
                        <Button key={prereq} asChild className="mr-4">
                          <Link href={`/course/${encodeURI(prereq)}`}>
                            {prereq}
                          </Link>
                        </Button>
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
                  <div className="grid grid-cols-3 items-center gap-4 px-4 py-6">
                    <dt className="col-span-1 text-sm font-medium leading-6">
                      Course Rating
                    </dt>
                    <dd className="col-span-1 mt-1 text-sm leading-6">
                      {rating || 0} / 5
                      <div className="col-span-1 flex justify-end">
                        {data?.currently_enrolled?.includes(session.user._id) ||
                        data?.previously_enrolled?.includes(
                          session.user._id
                        ) ? (
                          <ReviewRating
                            courseId={data._id}
                            courseCode={data.course_code}
                            fetchData={fetchData}
                          />
                        ) : null}
                      </div>
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
                      <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
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
                  <Button asChild>
                    <a
                      target="_blank"
                      href={data?.stevens_course_link}
                      rel="noopener noreferrer"
                    >
                      View on Website
                    </a>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      }
    </div>
  )
}

export default CourseById
