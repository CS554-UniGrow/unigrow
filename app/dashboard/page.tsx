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
    console.log("data is in the state")
    console.log(todoData)
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
  const user = session.user

  const user_id = user._id
  const { data, error, loading } = useFetchPerson(user_id as string)
  const { todoData, todoError, todoLoading } = useFetchTodo(user_id as string)
  const { peopleData, peopleError, peopleLoading } = useFetchPeople()

  console.log(data)

  const filteredData = peopleData?.filter(
    (user: any) => user?.major === data?.major && user?.email != data?.email
  )

  if (error || todoError) {
    return <div>Error</div>
  }
  if (loading && todoLoading) {
    return <Loading />
  }
  return (
    <div>
      <div className="text-6xl">Welcome to UniGrow, {user.name}</div>
      <br />
      <br />
      <div className="text-3xl">Your Major</div>
      <div text-3xl>
        <p className="font-large text- text-center ">
          {departmentMapper[data?.major]}
        </p>
      </div>
      <div>
        <p>Your Courses:</p>
        <NavigationMenu>
          <NavigationMenuList className="grid grid-cols-5 gap-5">
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
      <div className="text-3xl">Your TO-DO List:</div>
      <div>
        {todoData?.map((todo: any) => (
          <div key={todo.assignment.id}>
            <h3>{todo.context_name}</h3>
            <div
              dangerouslySetInnerHTML={{ __html: todo.assignment.description }}
            />
            <p>Due At: {new Date(todo.assignment.due_at).toLocaleString()}</p>
            <a href={todo.html_url} target="_blank" rel="noopener noreferrer">
              Go to Assignment
            </a>
          </div>
        ))}
      </div>
      <div className="text-3xl">People who are doing your major:</div>

      <div className="grid grid-cols-1 gap-5 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData?.map((user: any) => (
          <Card key={user._id}>
            <CardHeader>
              <Link href={`/people/${user._id}/`}>{user?.sortable_name}</Link>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Link href={`/people/${user._id}/`}>
                      <Avatar>
                        <AvatarImage
                          src={user?.avatar_url || user?.image || loadingLogo}
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
                                {user.courses.map((course: string) => (
                                  <Link
                                    key={user._id + course}
                                    href={`/course/${course}`}
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

      {/* Write code for "Discover people in your major" */}
    </div>
  )
}
export default Dashboard
