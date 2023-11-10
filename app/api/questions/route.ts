import { NextRequest, NextResponse } from "next/server";
import { getUserProfileDetails } from "@/data/canvas_extractor/canvas_api_extractor";

export async function GET(req: Request) {
  try {
    const token = req.url.split("?")[1];
    const userId = token.split("canvas=")[1];

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" });
    }

    const data = await getUserProfileDetails(userId);

    if (data) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "User not found" });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

// export async function GET(request: Request) {
//   return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// }
