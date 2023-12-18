import {
  createReview,
  updateReview,
  findReviewByUIDAndCourseID
} from "@/data/reviews/reviewFunctions"
import { NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"

export async function POST(request: NextRequest) {
  const body = await request.json()
  try {
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
