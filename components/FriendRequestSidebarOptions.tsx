"use client"

import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { User } from "lucide-react"
import Link from "next/link"
import { FC, useEffect, useState } from "react"

interface FriendRequestSidebarOptionsProps {
  sessionId: string
  initialUnseenRequestCount: number
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
  sessionId,
  initialUnseenRequestCount
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  )

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1)
    }

    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1)
    }

    pusherClient.bind("incoming_friend_requests", friendRequestHandler)
    pusherClient.bind("new_friend", addedFriendHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

      pusherClient.unbind("new_friend", addedFriendHandler)
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler)
    }
  }, [sessionId])

  return (
    <Link
      href="/chat/requests"
      className="hover:border-3 group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:border-black/20"
    >
      <div className="border-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-gray-200 text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
        <User className="h-6 w-6" />
      </div>
      <p className="truncate text-lg">Chat requests</p>

      {unseenRequestCount > 0 ? (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
          {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  )
}

export default FriendRequestSidebarOptions
