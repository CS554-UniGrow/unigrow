import {
  createReview,
  updateReview,
  findReviewByUIDAndCourseID
} from "@/data/reviews/reviewFunctions"
import { NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"
import { getSessionServer } from "@/lib/hooks"
import { getServerSession } from "next-auth"
import { options } from "../../auth/[...nextauth]/options"

export async function GET(
  request: NextRequest,
  params: { params: { courseId: string } }
) {
  try {
    const session: any = await getServerSession(options)

    const user_id = session.user._id
    const course_id = params?.params?.courseId
    const data = await findReviewByUIDAndCourseID(user_id, course_id)
    return NextResponse.json(data)
  } catch (e) {
    logger.error(e)
    return NextResponse.json({ error: "Internal Server Error" })
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  try {
    const session: any = await getServerSession(options)
    const data = await updateReview(body.courseId, body.userId, body.rating)
    return NextResponse.json(data)
  } catch (e) {
    logger.error(e)
    return NextResponse.json({ error: "Internal Server Error" })
  }
}
