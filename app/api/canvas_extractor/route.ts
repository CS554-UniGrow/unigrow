import { NextRequest, NextResponse } from "next/server";
import {
  getUserProfileDetails,
  getUsersCourseDetails
} from "@/data/canvas_extractor/canvas_api_extractor";

let apiKey =
  "1030~TCfHh7IJelFPFkVOJN32200RmzM7JOjv2GM8Z2ybEESe44cED1egxSNku6W9dkgG";

export async function GET(request: NextRequest, response: NextResponse) {
  let result = await getUsersCourseDetails(apiKey);
  return NextResponse.json({ result });
}
