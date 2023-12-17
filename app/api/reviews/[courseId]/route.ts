import {
  createReview,
  updateReview,
  findReviewByUIDAndCourseID
} from "@/data/reviews/reviewFunctions"
import { NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"
import { getSessionServer } from "@/lib/hooks"

export async function GET(
  request: NextRequest,
  params: { params: { courseId: string } }
) {
  try {
    const session = await getSessionServer()
    const user_id = session.user._id
    const course_id = params?.params?.courseId
    const data = await findReviewByUIDAndCourseID(course_id, user_id)
    return NextResponse.json(data)
  } catch (e) {
    logger.error(e)
    return NextResponse.json({ error: "Internal Server Error" })
  }
}
