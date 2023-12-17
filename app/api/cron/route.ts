import { NextRequest, NextResponse } from "next/server"
import { getAllUsersCourseDetails } from "@/data/canvas_extractor/canvas_api_extractor"
import logger from "@/lib/logger"
export async function GET(request: NextRequest, response: NextResponse) {
  const apiKey = request.headers.get("Authorization")
  logger.info(apiKey)
  logger.info(`Bearer ${process.env.CRON_SECRET}`)
  if (apiKey == `Bearer ${process.env.CRON_SECRET}`) {
    logger.info("Running Cron Job")
    await getAllUsersCourseDetails()
    return NextResponse.json(
      {
        message: "Completed Cron Job",
        completed: true
      },
      { status: 200 }
    )
  } else {
    return NextResponse.json(
      {
        message: "Invalid API key",
        completed: false
      },
      { status: 401 }
    )
  }
}
