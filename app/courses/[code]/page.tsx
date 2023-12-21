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
import ReviewRating from "@/components/ReviewRating"

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
import Loading from "@/app/loading"

function useFetchCourse(code: string) {
  const [data, setData] = useState([] as Course[])
  const [userData, setUserData] = useState([] as User[])
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

  if (error) {
    return <div>Error</div>
  }

  if (loading) {
    return <Loading />
  }

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
            onChange={(e) => setSearchQuery(e.target.value.trim())}
            maxLength={40}
          />
        </div>
      </div>

      <div className="grid grid-rows-4 gap-8 py-4 sm:grid-rows-2 lg:grid-rows-3 xl:grid-rows-4">
        <Accordion type="single" collapsible>
          {course_level_unique.map((course_level) => (
            <AccordionItem key={course_level} value={course_level}>
              <AccordionTrigger>Course Level : {course_level}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 border p-2">
                  {filteredData
                    .filter((course) => course.course_level === course_level)
                    .map((course) => (
                      <Link
                        className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline "
                        href={`/course/${encodeURI(course.course_code)}`}
                        key={course.course_code}
                      >
                        {course.course_code} {course.course_title}
                      </Link>
                    ))}
                  <br />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default DepertmentCourses
