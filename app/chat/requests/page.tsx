import FriendRequests from "@/components/FriendRequests"
import { fetchRedis } from "@/helpers/redis"
import { options } from "../../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

const page = async () => {
  const session = await getServerSession(options)
  if (!session) notFound()
  // ids of people who sent current logged in user a friend requests
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user._id}:incoming_friend_requests`
  )) as string[]

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string
      const senderParsed = JSON.parse(sender) as any
      return {
        senderId,
        senderEmail: senderParsed?.email
      }
    })
  )

  return (
    <main className="pt-8">
      <h1 className="mb-8 text-5xl font-bold">Chat Requests</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user._id}
        />
      </div>
    </main>
  )
}

export default page
