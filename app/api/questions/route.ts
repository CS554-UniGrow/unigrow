import { NextRequest, NextResponse } from "next/server";
import { getUserProfileDetails } from "@/data/canvas_extractor/canvas_api_extractor";
import { logger } from "@/lib/logger";
export async function POST(req: Request) {
  try {
    const { canvasToken } = await req.json();

    if (!canvasToken) {
      return NextResponse.json({ error: "User ID is required" });
    }
    logger.info(canvasToken);

    const data = await getUserProfileDetails(canvasToken);

    if (data) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "User not found" });
    }
  } catch (e) {
    console.error(e);
    logger.error(e);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

// export async function GET(request: Request) {
//   return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// }
