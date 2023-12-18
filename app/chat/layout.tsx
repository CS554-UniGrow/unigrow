export const dynamic = "force-dynamic"
import { Icon, Icons } from "@/components/Icons"
import SignOutButton from "@/components/SignOutButton"
import { options } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FC, ReactNode } from "react"
import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions"
import { fetchRedis } from "@/helpers/redis"
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id"
import SidebarChatList from "@/components/SidebarChatList"
import MobileChatLayout from "@/components/MobileChatLayout"
import { SidebarOption } from "@/types/typings"

interface LayoutProps {
  children: ReactNode
}

// Done after the video and optional: add page metadata
export const metadata = {
  title: "Unigrow Chat App Section",
  description: "Your dashboard"
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/chat/add",
    Icon: "UserPlus"
  }
]

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(options)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user._id)

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user._id}:incoming_friend_requests`
    )) as any[]
  ).length

  return (
    <div className="flex h-full w-full">
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>

      <div className="hidden h-full w-full max-w-[18rem] grow flex-col gap-y-5 overflow-y-auto px-6 md:flex">
        {friends.length > 0 ? (
          <div className="text-xs font-semibold leading-6">Your chats</div>
        ) : null}

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList sessionId={session.user._id} friends={friends} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6">Overview</div>

              <ul role="list" className="-mx-2 space-y-1">
                <li>
                  <FriendRequestSidebarOptions
                    sessionId={session.user._id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      <aside className="container max-h-screen w-full">{children}</aside>
    </div>
  )
}

export default Layout
