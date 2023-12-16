import { getUserById } from "@/data/users/usersDataFunctions";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { getCourseByCode } from "@/app/courses/data";

export async function GET(
  request: NextRequest,
  params: { params: { course_code: string } }
) {
  try {
    const course_code = params?.params?.course_code;
    const data = await getCourseByCode(course_code);
    return NextResponse.json(data);
  } catch (e) {
    logger.error(e);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
