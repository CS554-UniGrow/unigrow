export const dynamic = "force-dynamic"
import { options } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { ReactNode } from "react"
import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions"
import { fetchRedis } from "@/helpers/redis"
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id"
import SidebarChatList from "@/components/SidebarChatList"
import MobileChatLayout from "@/components/MobileChatLayout"
import { SidebarOption } from "@/types/typings"
import { MessageCircleMore } from "lucide-react"
import Link from "next/link"

interface LayoutProps {
  children: ReactNode
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
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList sessionId={session.user._id} friends={friends} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6">Overview</div>

              <ul className="-mx-2 space-y-1">
                <li>
                  <FriendRequestSidebarOptions
                    sessionId={session.user._id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
                <li>
                  <Link
                    href="/chat"
                    className="hover:border-3 group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6  hover:border-black/20"
                  >
                    <div className="border-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-gray-200 text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
                      <MessageCircleMore className="h-6 w-6" />
                    </div>
                    <p className="truncate text-lg">Recent Chats</p>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container max-h-screen w-full">{children}</div>
    </div>
  )
}

export default Layout
