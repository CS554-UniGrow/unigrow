import { NextRequest, NextResponse } from "next/server"
import { getUserProfileDetails } from "@/data/canvas_extractor/canvas_api_extractor"
import logger from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const temp = await req.json()
    const apiKey_hashed = temp.apiKey_hashed
    const uid = temp.uid
    const refreshToken = temp.refreshToken

    if (!apiKey_hashed) {
      return NextResponse.json({ error: "User ID is required" })
    }

    const data = await getUserProfileDetails({
      apiKey_hashed,
      uid,
      refreshToken: refreshToken
    })

    if (data) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: "User not found" })
    }
  } catch (e) {
    logger.error(e)
    return NextResponse.json({ error: "Internal Server Error" })
  }
}

// export async function GET(request: Request) {
//   return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// }
