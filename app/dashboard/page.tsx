"use client"

import People from "../people/page"
import { getSessionServer } from "@/lib/hooks"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import loadingLogo from "@/public/loading.png"
import { useEffect, useState } from "react"
import Loading from "@/components/ui/loading"
import { departmentMapper } from "@/lib/constants"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@radix-ui/react-navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@radix-ui/react-icons"

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

function useFetchTodo(user_id: string) {
  const [todoData, setTodoData] = useState([] as any[])
  const [todoError, setTodoError] = useState(null)
  const [todoLoading, setTodoLoading] = useState(false)

  useEffect(() => {
    const fetchToDoData = async () => {
      setTodoLoading(true)
      await fetch(`/api/dashboard/${user_id}`)
        .then((res) => res.json())
        .then((data: any) => {
          setTodoData(data)
          setTodoLoading(false)
        })
        .catch((error) => {
          setTodoError(error)
          setTodoLoading(false)
        })
    }
    fetchToDoData()
  }, [user_id])

  return { todoData, todoError, todoLoading }
}
function useFetchPeople() {
  const [peopleData, setPeopleData] = useState([])
  const [peopleError, setPeopleError] = useState(null)
  const [peopleLoading, setPeopleLoading] = useState(false)

  useEffect(() => {
    setPeopleLoading(true)
    fetch("/api/people", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setPeopleData(data)
        setPeopleLoading(false)
      })
      .catch((error) => {
        setPeopleError(error)
        setPeopleLoading(false)
      })
  }, [])

  return { peopleData, peopleError, peopleLoading }
}

const Dashboard = () => {
  const { data: session, status }: any = useSession()

  if (!session) {
    redirect("/signout")
  }
  const user = session?.user
  const user_id = user?._id
  const { peopleData, peopleError, peopleLoading } = useFetchPeople()
  const { data, error, loading } = useFetchPerson(user_id as string)
  const { todoData, todoError, todoLoading } = useFetchTodo(user_id as string)

  const filteredData = peopleData?.filter(
    (user: any) => user?.major === data?.major && user?.email != data?.email
  )

  if (error || todoError || peopleError) {
    return <div>Error</div>
  }
  if (loading || todoLoading || peopleLoading) {
    return <Loading />
  }
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-6xl font-bold">
          Welcome to UniGrow, {user.name}
        </h1>
        <p className="mb-20 text-2xl">
          Discover your academic tools and resources.
        </p>
      </div>
      <section className="mb-20">
        <div className="flex justify-center">
          <div className="max-w-md rounded-lg px-8 py-4 shadow-md">
            <h3 className="mb-2 text-center text-xl font-semibold">Major</h3>
            <p className="text-center text-lg">
              {departmentMapper[data?.major]}
            </p>
          </div>
        </div>
      </section>
      <section className="mb-20">
        <h2 className="mb-8 text-center text-2xl font-bold">Your Courses</h2>
        <NavigationMenu>
          <NavigationMenuList className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {data?.courses?.map((course: string) => (
              <NavigationMenuItem
                key={course}
                className="rounded-lg border p-4 shadow-md hover:shadow-lg"
              >
                <Link
                  legacyBehavior
                  passHref
                  href={`/course/${encodeURI(course)}`}
                >
                  <NavigationMenuLink className="text-lg font-semibold">
                    {course}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </section>
      <section className="mb-20">
        <h2 className="mb-8 text-center text-2xl font-bold">Your TO-DO List</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {todoData?.map((todo: any) => (
            <div
              key={todo.assignment.id}
              className="flex flex-col rounded-lg border p-4 shadow hover:shadow-lg"
            >
              <h3 className="mb-2 text-xl font-semibold">
                {todo.context_name}
              </h3>
              <h2 className="mb-2 text-xl font-semibold">
                {todo.assignment.name}
              </h2>

              <div className="mb-2 text-lg">
                Due At: {new Date(todo.assignment.due_at).toLocaleString()}
              </div>
              <a
                href={todo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto text-blue-600 hover:text-blue-800"
              >
                Go to Assignment
              </a>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-8 text-center text-2xl font-bold">
          People in Your Major
        </h2>
        {filteredData?.length > 0 ? (
          <div className="mb-12 grid grid-cols-1 gap-5 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredData?.map((user: any) => (
              <Card key={user._id}>
                <CardHeader>
                  <Link href={`/people/${user._id}/`}>
                    {user?.sortable_name}
                  </Link>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`/people/${user._id}/`}>
                          <Avatar>
                            <AvatarImage
                              src={
                                user?.avatar_url ||
                                user?.image ||
                                loadingLogo.src
                              }
                            />
                            <AvatarFallback>{user?.name}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div>
                          <p className="text-sm ">{user?.primary_email}</p>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="ml-auto">
                                Courses{" "}
                                <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search Course..." />
                                <CommandList>
                                  <CommandEmpty>No courses found.</CommandEmpty>
                                  <CommandGroup>
                                    {user?.courses?.map((course: string) => (
                                      <Link
                                        key={user?._id + course}
                                        href={`/course/${encodeURI(course)}`}
                                      >
                                        <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                          <p>{course}</p>
                                        </CommandItem>
                                      </Link>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mb-12 text-center text-xl">
            We couldn&apos;t find people in your major.
          </div>
        )}
      </section>

      {/* Write code for "Discover people in your major" */}
    </div>
  )
}
export default Dashboard
