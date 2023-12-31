import { fetchRedis } from "@/helpers/redis"
import { options } from "../../auth/[...nextauth]/options"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body)

    const session = await getServerSession(options)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    // verify both users are not already friends

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user._id}:friends`,
      idToAdd
    )

    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 })
    }

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user._id}:incoming_friend_requests`,
      idToAdd
    )

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 })
    }

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis("get", `user:${session.user._id}`),
      fetchRedis("get", `user:${idToAdd}`)
    ])) as [string, string]

    const user = JSON.parse(userRaw) as any
    const friend = JSON.parse(friendRaw) as any

    // notify added user

    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:friends`),
        "new_friend",
        user
      ),
      pusherServer.trigger(
        toPusherKey(`user:${session.user._id}:friends`),
        "new_friend",
        friend
      ),
      db.sadd(`user:${session.user._id}:friends`, idToAdd),
      db.sadd(`user:${idToAdd}:friends`, session.user._id),
      db.srem(`user:${session.user._id}:incoming_friend_requests`, idToAdd)
    ])

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 })
    }

    return new Response("Invalid request", { status: 400 })
  }
}
