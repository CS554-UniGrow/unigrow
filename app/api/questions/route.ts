import { NextRequest, NextResponse } from "next/server";
import { getUserProfileDetails } from "@/data/canvas_extractor/canvas_api_extractor";
import logger from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const temp = await req.json();
    const canvasToken_hashed = temp.canvasToken_hashed;
    const uid = temp.uid;

    if (!canvasToken_hashed) {
      return NextResponse.json({ error: "User ID is required" });
    }
    logger.info(canvasToken_hashed);

    const data = await getUserProfileDetails(canvasToken_hashed, uid);

    if (data) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "User not found" });
    }
  } catch (e) {
    logger.error(e);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

// export async function GET(request: Request) {
//   return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// }
