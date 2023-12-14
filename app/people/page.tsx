"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function useFetchPeople() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  if (!session?.user?.isAuthenticated) {
    redirect("/signup");
  }

  useEffect(() => {
    setLoading(true);
    fetch("/api/people", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return { data, error, loading };
}

const People = () => {
  const { data, error, loading } = useFetchPeople();
  const [searchQuery, setSearchQuery] = useState("");
  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <Loading />;
  }
  const filteredData = data?.filter(
    (user: UserProfile) =>
      user?.sortable_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      user?.courses?.some((course: string) =>
        course.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div>
      <div>
        <Input
          type="text"
          placeholder="Search by name or course code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display filtered data */}
      <div className="grid grid-cols-1 gap-10 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData?.map((user: UserProfile) => (
          <Card key={user?._id}>
            <CardHeader>
              <Link href={`/people/${user._id}/`}>{user?.sortable_name}</Link>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Link href={`/people/${user._id}/`}>
                      <Avatar>
                        <AvatarImage src={user?.avatar_url} />
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
    </div>
  );
};

export default People;
