import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id"
import { fetchRedis } from "@/helpers/redis"
import { options } from "../api/auth/[...nextauth]/options"
import { chatHrefConstructor } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

const page = async ({}) => {
  const session = await getServerSession(options)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user._id)
  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user._id, friend.id)}:messages`,
        -1,
        -1
      )) as string[]

      const lastMessage = lastMessageRaw
        ? (JSON.parse(lastMessageRaw) as Message)
        : ({} as Message)

      return {
        ...friend,
        lastMessage
      }
    })
  )

  return (
    <div className="container">
      <h1 className="mb-8 text-5xl font-bold">Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-lg">Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative rounded-md border border-zinc-200 p-3"
          >
            <div className="absolute inset-y-0 right-4 flex items-center">
              <ChevronRight className="h-7 w-7" />
            </div>

            <Link
              href={`/chat/newChat/${chatHrefConstructor(
                session.user._id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md truncate">
                  <span className="text-zinc-400">
                    {friend.lastMessage?.senderId === session.user._id
                      ? "You: "
                      : ""}
                  </span>
                  {friend.lastMessage?.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}

export default page
