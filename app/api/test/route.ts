import { NextRequest, NextResponse } from "next/server"
import { courses as courseColleciton } from "@/config/mongo/mongoCollections"
import { getAllUsersCourseDetails } from "@/data/canvas_extractor/canvas_api_extractor"
import logger from "@/lib/logger"
export async function GET(request: NextRequest, response: NextResponse) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey == process.env.NEXT_API_SEED_SECRET) {
    logger.info("Running Cron Job")
    await getAllUsersCourseDetails()
    return NextResponse.json({ message: "Completed Cron Job", completed: true })
  } else {
    return NextResponse.json({ message: "Invalid API key", completed: false })
  }
}
