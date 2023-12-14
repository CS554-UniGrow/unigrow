import { NextRequest, NextResponse } from "next/server";
import { courses as courseColleciton } from "@/config/mongo/mongoCollections";
import { getAllUsersCourseDetails } from "@/data/canvas_extractor/canvas_api_extractor";
export async function GET(request: NextRequest, response: NextResponse) {
  //await getAllUsersCourseDetails();
  return NextResponse.json({ completed: true });
}
