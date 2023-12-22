import { getUserById } from "@/data/users/usersDataFunctions"
import { NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"
import { options } from "../../auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import { fetchRedis } from "@/helpers/redis"

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  params: { params: { user_id: string } }
) {
  try {
    throw new Error("test")
    const user_id = params?.params?.user_id
    const data = await getUserById(user_id)

    const session = await getServerSession(options)

    const idToAdd = await fetchRedis("get", `user:email:${data?.email}`)
    const selfId = await fetchRedis("get", `user:email:${session?.user?.email}`)

    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session?.user._id
    )) as 0 | 1

    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session?.user._id}:friends`,
      idToAdd
    )) as 0 | 1

    data.isAlreadyFriends = !!isAlreadyFriends
    data.isAlreadyAdded = !!isAlreadyAdded
    data.isSelf = idToAdd === selfId

    return NextResponse.json(data)
  } catch (e) {
    logger.error(e)
    throw new Error("Internal Server Error")
  }
}
