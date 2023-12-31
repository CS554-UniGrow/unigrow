import { fetchRedis } from "@/helpers/redis"
import { options } from "../../auth/[...nextauth]/options"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email: emailToAdd } = addFriendValidator.parse(body.email)

    const idToAdd = await fetchRedis("get", `user:email:${emailToAdd}`)

    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 400 })
    }

    const session: any = await getServerSession(options)

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    if (idToAdd === session?.user._id || emailToAdd === session?.user.email) {
      return new Response("You cannot add yourself as a friend", {
        status: 400
      })
    }

    // check if user is already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session?.user._id
    )) as 0 | 1

    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 })
    }

    // check if user is already added
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.user._id}:friends`,
      idToAdd
    )) as 0 | 1

    if (isAlreadyFriends) {
      return new Response("Already friends with this user", { status: 400 })
    }

    // valid request, send friend request
    try {
      await pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
        "incoming_friend_requests",
        {
          senderId: session.user._id,
          senderEmail: session.user.email
        }
      )
    } catch (e) {}

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user._id)

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 })
    }

    return new Response("Invalid request", { status: 400 })
  }
}
