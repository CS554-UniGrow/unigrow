import { NextRequest, NextResponse } from "next/server";
import { courses as courseColleciton } from "../../../config/mongo/mongoCollections";
export async function GET(request: NextRequest, response: NextResponse) {
  const courses = await courseColleciton();
  return NextResponse.json({ courses: await courses.find({}).toArray() });
}
