"use client";
import { Mail } from "lucide-react";
import { getCourseByDepartment } from "@/data/courses/course";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { departmentMapper } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/types";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import loadingLogo from "@/public/loading.png";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@radix-ui/react-navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

function useFetchPerson(user_id: string) {
  const [data, setData] = useState({} as any);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetch(`/api/people/${user_id}`)
        .then((res) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    };
    fetchData();
  }, [user_id]);

  return { data, error, loading };
}

const User_Profile = () => {
  const { data: session, status }: any = useSession();
  if (!session?.user?.isAuthenticated) {
    redirect("/signup");
  }

  const params = useParams();
  const { user_id } = params;
  const { data, error, loading } = useFetchPerson(user_id as string);
  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="container mt-20 ">
      <div className="relative mx-auto w-1/2  justify-items-center  rounded-lg border p-20 shadow">
        <div className="flex justify-center">
          <Image
            width={100}
            height={100}
            src={data?.avatar_url ?? loadingLogo}
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

          <div className="grid grid-cols-2 gap-2">
            {/* email logo */}

            <Button
              onClick={() => {
                window.location.href = `mailto:${data?.primary_email}`;
              }}
            >
              <Mail className="mr-2 h-4 w-4" /> {data?.primary_email}
            </Button>
            <Button>
              Chat with{" "}
              <span className="font-bold">
                @ {data?.primary_email?.split("@")[0]}
              </span>
            </Button>
          </div>

          <div className="justify-items-center ">
            <h3 className="text-left font-medium ">Courses</h3>
            <br></br>
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
        </div>
      </div>
    </div>
  );
};

export default User_Profile;
