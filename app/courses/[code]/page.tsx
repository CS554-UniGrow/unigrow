"use client"
export const dynamic = "force-dynamic"

import { getCourseByDepartment } from "@/data/courses/course"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { departmentMapper } from "@/lib/constants"
import Rating from "@/components/Rating"

import { Button } from "@/components/ui/button"
import { Course } from "@/lib/types"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect, notFound } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Link2, Underline } from "lucide-react"

function useFetchCourse(code: string) {
  const [data, setData] = useState([] as Course[])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetch(`/api/courses/department/${code}`)
        .then((res) => res.json())
        .then((data: Course[]) => {
          setData(data)
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }
    fetchData()
  }, [code])

  return { data, error, loading }
}

const DepertmentCourses = ({ params }: { params: { code: string } }) => {
  const { data: session, status }: any = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  if (!session?.user?.isAuthenticated) {
    redirect("/signup")
  }

  if (!session?.user?.isOnboarded) {
    redirect("/onboarding")
  }

  const { code } = params
  if (departmentMapper[code.toUpperCase()] === undefined) {
    notFound()
  }

  const { data, error, loading } = useFetchCourse(code)
  const filteredData = data?.filter(
    (course: any) =>
      course?.course_title
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase()) ||
      course?.course_description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      course?.course_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.course_level?.includes(searchQuery.toLowerCase()) ||
      course?.course_professors
        ?.map((professor: any) => professor.display_name)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  )
  const course_level_unique = [
    ...new Set(filteredData.map((course) => course.course_level))
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <div className="header flex flex-col gap-8">
        <h1 className="text-3xl">
          All courses Levels under Department of{" "}
          {departmentMapper[code.toUpperCase()]}
        </h1>
        <div className="w-full">
          <Input
            type="text"
            placeholder="Search by Course name or course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-rows-4 gap-8 py-4 sm:grid-rows-2 lg:grid-rows-3 xl:grid-rows-4">
        <Accordion type="single" collapsible>
          {course_level_unique.map((course_level) => (
            <AccordionItem key={course_level} value={course_level}>
              <AccordionTrigger>Course Level : {course_level}</AccordionTrigger>
              <AccordionContent>
                {filteredData.map((course) => (
                  <Accordion type="single" key={course.course_code} collapsible>
                    {course.course_level === course_level ? (
                      <AccordionItem value={course.course_code}>
                        <AccordionTrigger>
                          {course.course_code} - {course.course_title}{" "}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="mt-6 rounded-lg border-2 border-gray-100 p-2 dark:border-slate-600">
                            <Link href={`/course/${course.course_code}`}>
                              <div className="flex gap-2">
                                Open in New Tab
                                <Link2></Link2>
                              </div>
                            </Link>
                            <dl className="divide-y divide-gray-100 dark:divide-slate-700">
                              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 ">
                                  Professor Name
                                </dt>
                                <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                                  {course?.course_professors.map(
                                    (professor) => (
                                      <span
                                        className="mr-4"
                                        key={professor.display_name}
                                      >
                                        {professor.display_name}
                                      </span>
                                    )
                                  )}{" "}
                                  {course?.course_professors.length === 0 && (
                                    <span>-</span>
                                  )}
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
                                <dt className="text-sm font-medium leading-6 ">
                                  Credits
                                </dt>
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
                                    <Link
                                      href={`/course/${prereq}`}
                                      key={prereq}
                                    >
                                      <Button className="mr-4">{prereq}</Button>
                                    </Link>
                                  ))}{" "}
                                  {course?.course_prereqs.length === 0 && (
                                    <span>-</span>
                                  )}
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
                                    {(course?.currently_enrolled?.length ??
                                      0) != 0 &&
                                      course?.currently_enrolled?.length}
                                    {(course?.currently_enrolled?.length ??
                                      0) === 0 && "-"}
                                  </span>
                                </dd>
                              </div>
                              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 ">
                                  Students Enrolled Previously
                                </dt>
                                <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">
                                  <span className="mr-4">
                                    {(course?.previously_enrolled?.length ??
                                      0) +
                                      (course?.currently_enrolled?.length ??
                                        0) !=
                                      0 &&
                                      course?.previously_enrolled?.length +
                                        course?.currently_enrolled?.length}
                                    {(course?.previously_enrolled?.length ??
                                      0) +
                                      (course?.currently_enrolled?.length ??
                                        0) ===
                                      0 && "-"}
                                  </span>
                                </dd>
                              </div>

                              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 ">
                                  Syllabus
                                </dt>
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
                                <Button>View on Stevens Website</Button>
                              </a>
                            </div>
                            <Rating
                              courseId={course._id}
                              courseCode={course.course_code}
                            ></Rating>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ) : null}
                  </Accordion>
                ))}
                <br></br>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default DepertmentCourses
