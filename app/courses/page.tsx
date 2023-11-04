import { getAllCourses } from "./data";
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

const Courses = async () => {
  const data = await getAllCourses(true);

  return (
    <div className="">
      <div className="header flex flex-col gap-8">
        <h3 className="text-5xl">All Courses</h3>
        <span className="text-2xl">Courses in CS</span>
      </div>
      <div className="grid grid-cols-4 py-4">
        {data?.map((course:any) => (
          <Card key={course?.id}>
            <CardHeader>
              <Link href={`/courses/${course?.id}`}>
                <CardTitle className="text-2xl">{course.course_name}</CardTitle>
              </Link>
              <CardDescription className="text-lg">
                {course.course_code}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Professor: <span>{course.professor}</span>
              </p>
              <p>
                Email: <span>{course.professor_email}</span>
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/courses/${course?.id}`}>
                <Button variant={"ghost"} className="text-sm">
                  Learn More
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
