"use client"

import { chatHrefConstructor } from "@/lib/utils"
import { addFriendValidator } from "@/lib/validations/add-friend"
import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"
import { Button } from "./ui/button"
import { useSession } from "next-auth/react"

type AddFriendButtonProps = {
  email: string
  isSelf: boolean
  isAlreadyAdded: boolean
  isAlreadyFriends: boolean
  userId: string
}

const AddFriendButton = ({
  email,
  isSelf,
  isAlreadyAdded,
  isAlreadyFriends,
  userId
}: AddFriendButtonProps) => {
  const { data: session } = useSession()
  const [isRequestSent, setIsRequestSent] = useState(isAlreadyAdded) // Initialize with isAlreadyAdded
  const [isClicked, setIsClicked] = useState(isAlreadyAdded) // Initialize with isAlreadyAdded

  const addFriendRequest = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email })
      const response = await axios.post("/api/friends/add", {
        email: validatedEmail // Corrected payload format
      })
      if (response?.data?.ok === "OK") {
        toast.success("Friend request sent!")
      }
      setIsRequestSent(true)
    } catch (error) {
      toast.error(error?.response?.data || "An error occurred")
    }
  }

  const handleAddFriend = () => {
    if (!isRequestSent) {
      addFriendRequest(email)
    }
  }

  const renderButton = () => {
    if (isSelf) {
      return null
    } else if (isAlreadyFriends) {
      return (
        <Link
          className="cursor-pointer"
          href={`/chat/newChat/${chatHrefConstructor(
            session?.user?._id,
            userId
          )}`}
        >
          <Button>
            Chat with{" "}
            <span className="mx-2 font-bold">@{email?.split("@")[0]}</span>
          </Button>
        </Link>
      )
    } else {
      return (
        <Button
          className="cursor-pointer"
          onClick={handleAddFriend}
          disabled={isRequestSent}
        >
          {isRequestSent
            ? "Chat request sent"
            : `Add @${email?.split("@")[0]} to chat`}
        </Button>
      )
    }
  }

  return renderButton()
}

export default AddFriendButton
