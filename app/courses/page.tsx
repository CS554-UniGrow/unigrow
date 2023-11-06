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

const Departments = async () => {
  return (
    <div className="">
      <div className="header flex flex-col gap-8">
        <h3 className="text-4xl">
          All Departments under Stevens Institute of Technology
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-8 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {departmentList?.map((department: any) => (
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
              {/* <CardDescription className="text-lg">
                {course.course_code}
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              {/* <p>
                Professor: <span>{course.professor}</span>
              </p>
              <p>
                Email: <span>{course.professor_email}</span>
              </p> */}
            </CardContent>
            <CardFooter>
              <Link href={`/courses/${department?.course_code}`}>
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
