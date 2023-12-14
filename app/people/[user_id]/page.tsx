"use client";
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
import { UserProfile } from "@/lib/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import loadingLogo from "@/public/loading.png";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function useFetchPerson(user_id: string) {
  const [data, setData] = useState({} as UserProfile);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetch(`/api/people/${user_id}`)
        .then((res) => res.json())
        .then((data: UserProfile) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    };
    fetchData();
  }, []);

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
    <Card>
      <CardHeader>{data?.sortable_name} </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image
                height={100}
                width={100}
                src={data?.avatar_url}
                sizes=""
                alt=""
              />
              <div>
                <p className="text-sm ">{data?.primary_email}</p>
              </div>
              <br></br>

              {data?.courses?.map((course) => (
                <div key={course}>
                  <Link href={`/course/${course}`}>
                    <Badge>{course}</Badge>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default User_Profile;
