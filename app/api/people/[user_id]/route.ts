import { getUserById } from "@/data/users/usersDataFunctions";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
export const dynamic = "force-dynamic";
export async function GET(
  request: NextRequest,
  params: { params: { user_id: string } }
) {
  try {
    const user_id = params?.params?.user_id;
    const data = await getUserById(user_id);
    return NextResponse.json(data);
  } catch (e) {
    logger.error(e);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
