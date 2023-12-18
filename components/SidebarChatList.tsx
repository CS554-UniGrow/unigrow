"use client"

import { pusherClient } from "@/lib/pusher"
import { chatHrefConstructor, toPusherKey } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import UnseenChatToast from "./UnseenChatToast"
import Link from "next/link"

interface SidebarChatListProps {
  friends: any[]
  sessionId: string
}

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [activeChats, setActiveChats] = useState<User[]>(friends)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const newFriendHandler = (newFriend: any) => {
      setActiveChats((prev) => [...prev, newFriend])
    }

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/chat/newChat/${chatHrefConstructor(sessionId, message.senderId)}`

      if (!shouldNotify) return

      // should be notified
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ))

      setUnseenMessages((prev) => [...prev, message])
    }

    pusherClient.bind("new_message", chatHandler)
    pusherClient.bind("new_friend", newFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

      pusherClient.unbind("new_message", chatHandler)
      pusherClient.unbind("new_friend", newFriendHandler)
    }
  }, [pathname, sessionId, router])

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role="list" className="-mx-2 max-h-[25rem] space-y-1 overflow-y-auto">
      {activeChats.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length

        return (
          <li key={friend.id}>
            <Link
              href={`/chat/newChat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-gray-50 hover:text-indigo-600"
            >
              {friend.name}
              {unseenMessagesCount > 0 ? (
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                  {unseenMessagesCount}
                </div>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default SidebarChatList
