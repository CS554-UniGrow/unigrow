import { getCourseByDepartment } from "@/data/courses/course";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { departmentMapper } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Course } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import Link from "next/link";

const DepertmentCourses = async ({ params }: { params: { code: string } }) => {
  const { code } = params;

  const courses: Course[] = await getCourseByDepartment(code);
  const course_level_unique = [
    ...new Set(courses.map((course) => course.course_level))
  ];
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl">
        All courses Levels under Department of{" "}
        {departmentMapper[code.toUpperCase()]}
      </h1>

      <div className="grid grid-cols-1 gap-8 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {course_level_unique.map((course_level) => (
          <Card key={course_level} className="flex flex-col justify-center">
            <CardHeader>
              <Link href={`/courses/${code}/${course_level}`}>
                <CardTitle className="text-2xl">{course_level}</CardTitle>
              </Link>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Link href={`/courses/${code}/${course_level}`}>
                <Button className="text-sm">
                  View Courses in {course_level}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepertmentCourses;
