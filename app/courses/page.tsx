"use client";
export const dynamic = "force-dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { departmentList } from "@/lib/constants";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Departments = () => {
  const { data: session, status }: any = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  if (!session?.user?.isAuthenticated) {
    redirect("/signup");
  }
  if (!session?.user?.isOnboarded) {
    redirect("/onboarding");
  }

  const filteredData = departmentList.filter((department) => {
    return (
      department.course_code
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      department.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="">
      <div className="header flex flex-col gap-8">
        <h3 className="text-4xl">
          All Departments under Stevens Institute of Technology
        </h3>
        <div className="w-full">
          <Input
            type="text"
            placeholder="Search by Course name or course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData?.map((department: any) => (
          <Card
            key={department.course_code}
            className="flex flex-col justify-center"
          >
            <CardHeader>
              <Link href={`/courses/${department?.course_code?.toLowerCase()}`}>
                <CardTitle className="text-2xl">
                  {department.department}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Link href={`/courses/${department?.course_code.toLowerCase()}`}>
                <Button className="text-sm">
                  View Courses in {department?.course_code}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Departments;
