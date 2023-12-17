"use client"
export const dynamic = "force-dynamic"

import { Mail } from "lucide-react"
import { getCourseByDepartment } from "@/data/courses/course"

import { departmentMapper } from "@/lib/constants"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Loading from "@/components/ui/loading"

import { useParams } from "next/navigation"
import Link from "next/link"
import loadingLogo from "@/public/loading.png"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@radix-ui/react-navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { addFriendRequest } from "@/lib/actions"
import toast from "react-hot-toast"

function useFetchPerson(user_id: string) {
  const [data, setData] = useState({} as any)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetch(`/api/people/${user_id}`)
        .then((res) => res.json())
        .then((data: any) => {
          setData(data)
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }
    fetchData()
  }, [user_id])

  return { data, error, loading }
}

const User_Profile = () => {
  const { data: session, status }: any = useSession()
  if (!session?.user?.isAuthenticated) {
    redirect("/signup")
  }

  if (!session?.user?.isOnboarded) {
    redirect("/onboarding")
  }

  const params = useParams()
  const { user_id } = params
  const { data, error, loading } = useFetchPerson(user_id as string)
  console.log({ data, error, loading })

  if (error) {
    return <div>Error</div>
  }
  if (loading) {
    return <Loading />
  }

  const handleAddFriend = async () => {
    try {
      // TODO: Check for the response and show toast accordingly
      const res = await addFriendRequest(data?.primary_email)
    } catch (e) {
      toast.error(`Error adding ${data?.name}`)
    }
  }

  return (
    <div className="container mt-20">
      <div className="relative mx-auto max-w-xl justify-items-center rounded-lg border p-8 shadow lg:p-20">
        <div className="flex justify-center">
          <Image
            width={100}
            height={100}
            src={data?.avatar_url || data?.image || loadingLogo}
            alt=""
            className="absolute -top-20 mx-auto h-32 w-32 transform rounded-full border-4  shadow-md transition duration-200 hover:scale-110"
          />
        </div>

        <div className="grid gap-5">
          <div className="grid grid-rows-2 gap-2">
            <h1 className="text-center text-3xl font-bold ">{data?.name}</h1>
            <p className="text-center text-sm font-medium ">
              {departmentMapper[data?.major]}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* email logo */}

            <Button
              onClick={() => {
                window.location.href = `mailto:${data?.primary_email}`
              }}
            >
              <Mail className="mr-2 h-4 w-4" /> {data?.primary_email}
            </Button>
            <Button onClick={handleAddFriend}>
              Add {"  "}
              <span className="mx-2 font-bold">
                @{data?.primary_email?.split("@")[0]}
              </span>
              to chat
            </Button>
          </div>

          <div className="justify-items-center ">
            <h3 className="text-left font-medium ">Courses</h3>
            <br></br>
            <NavigationMenu>
              <NavigationMenuList className="grid grid-cols-3 gap-8 sm:grid-cols-5">
                {data?.courses?.map((course: string) => (
                  <NavigationMenuItem key={course}>
                    <Link legacyBehavior passHref href={`/course/${course}`}>
                      <NavigationMenuLink
                        className={`${navigationMenuTriggerStyle()} rounded border`}
                      >
                        {course}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User_Profile
