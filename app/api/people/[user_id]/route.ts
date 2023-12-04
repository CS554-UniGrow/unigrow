import { getUserById } from "@/data/users/usersDataFunctions";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function GET(request: NextRequest, { params }) {
  try {
    const user_id = params?.user_id;
    const data = await getUserById(user_id);
    return NextResponse.json(data);
  } catch (e) {
    logger.error(e);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
