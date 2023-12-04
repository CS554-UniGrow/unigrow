import { getAllUsers } from "@/data/users/usersDataFunctions";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const data = await getAllUsers();
    return NextResponse.json(data);
  } catch (e) {
    logger.error(e);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
