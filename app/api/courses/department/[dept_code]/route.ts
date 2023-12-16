import { getUserById } from "@/data/users/usersDataFunctions"
import { NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"
import { getCourseByDept } from "@/app/courses/data"

export async function GET(
  request: NextRequest,
  params: { params: { dept_code: string } }
) {
  try {
    const dept_code = params?.params?.dept_code
    const data = await getCourseByDept(dept_code)
    return NextResponse.json(data)
  } catch (e) {
    logger.error(e)
    return NextResponse.json({ error: "Internal Server Error" })
  }
}
