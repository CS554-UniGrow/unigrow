import ChatInput from "@/components/ChatInput"
import Messages from "@/components/Messages"
import { fetchRedis } from "@/helpers/redis"
import { options } from "../../../api/auth/[...nextauth]/options"
import { messageArrayValidator } from "@/lib/validations/message"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { notFound } from "next/navigation"

// The following generateMetadata functiion was written after the video and is purely optional
export async function generateMetadata({
  params
}: {
  params: { chatId: string }
}) {
  const session = await getServerSession(options)
  if (!session) notFound()
  const [userId1, userId2] = params.chatId.split("--")
  const { user } = session

  const chatPartnerId = user.sub === userId1 ? userId2 : userId1
  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as any

  return { title: `FriendZone | ${chatPartner?.name} chat` }
}

interface PageProps {
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    )

    const dbMessages = results.map((message) => JSON.parse(message) as Message)

    const reversedDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages
  } catch (error) {
    notFound()
  }
}

const page = async ({ params }: PageProps) => {
  const { chatId } = params
  const session = await getServerSession(options)
  if (!session) notFound()

  const { user } = session

  const [userId1, userId2] = chatId.split("--")

  if (user.sub !== userId1 && user.sub !== userId2) {
    notFound()
  }

  const chatPartnerId = user.sub === userId1 ? userId2 : userId1
  // new

  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string
  const chatPartner = JSON.parse(chatPartnerRaw) as any
  const initialMessages = await getChatMessages(chatId)

  return (
    <div className="flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col justify-between">
      <div className="flex justify-between border-b-2 border-gray-200 py-3 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative h-8 w-8 sm:h-12 sm:w-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner?.image}
                alt={`${chatPartner?.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center text-xl">
              <span className="mr-3 font-semibold text-gray-700">
                {chatPartner?.name}
              </span>
            </div>

            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.sub}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  )
}

export default page
