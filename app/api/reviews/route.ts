import {
  createReview,
  updateReview,
  findReviewByUIDAndCourseID
} from "@/data/reviews/reviewFunctions"
import { NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"
import { getSessionServer } from "@/lib/hooks"

export async function POST(request: NextRequest) {
  const body = await request.json()
  try {
    // if (!courseId || !userId || !rating || !courseCode) {
    //   throw "Invalid input parameters"
    // }
    const data = await createReview(
      body.courseId,
      body.userId,
      body.rating,
      body.courseCode
    )
    return NextResponse.json(data)
  } catch (error) {
    logger.error(`Error in POST request: ${error}`)

    return NextResponse.json({ message: "Internal Server Error" })
  }
}

export async function GET(request: NextRequest, params: { courseId: string }) {
  try {
    const session = await getSessionServer()
    const user_id = session.user._id
    const course_id = params?.courseId
    console.log(user_id)
    console.log(course_id)
    const data = await findReviewByUIDAndCourseID(course_id, user_id)
    return NextResponse.json(data)
  } catch (e) {
    logger.error(e)
    return NextResponse.json({ error: "Internal Server Error" })
  }
}
