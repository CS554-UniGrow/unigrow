"use server"

import { TQuestionnaire } from "@/lib/schemas"
import { users } from "@/config/mongo/mongoCollections"
import { getUserProfileDetails } from "@/data/canvas_extractor/canvas_api_extractor"
import { encrypt } from "./utils"
import { db } from "./db"
import logger from "./logger"
import { API } from "./constants"

import axios, { Axios, AxiosError } from "axios"
import { addFriendValidator } from "./validations/add-friend"
import { ZodError, ZodIssue } from "zod"

export const checkCanvasToken = async (token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CANVAS_BASE_URL}users/self/profile`,
    { cache: "no-store", headers: { Authorization: `Bearer ${token}` } }
  )
  return response.ok
}

export const handleSubmitAction = async (
  values: TQuestionnaire,
  uid: string,
  refreshToken: string
) => {
  let { major, joiningTerm, canvasToken } = values
  canvasToken = encrypt(canvasToken)
  const data = await getUserProfileDetails({
    apiKey_hashed: canvasToken,
    uid,
    refreshToken: refreshToken
  })

  if (data) {
    let isJoiningTermValid = joiningTerm === data?.joining_term_complete
    if (!isJoiningTermValid) {
      return {
        message: "Joining Term invalid",
        path: ["joiningTerm"],
        status: 400
      }
    }

    const usersCollection = await users()
    const userExists = await usersCollection.findOne({ _id: uid })
    if (userExists && data.login_id.trim() === userExists.login_id.trim()) {
      const updateInfo = await usersCollection.updateOne(
        { _id: uid },
        {
          $set: {
            major: major,
            joiningTerm: joiningTerm,
            canvasToken_hashed: canvasToken,
            isOnboarded: true
          }
        }
      )
      if (updateInfo.modifiedCount === 0) {
        return {
          message: "Could not update user",
          path: ["root"],
          status: 500
        }

        // throw "Could not update user"
      }
    }
    return data
  } else {
    return {
      message: "User Does Not Exist",
      path: ["root"],
      status: 500
    }
    // throw "User Does Not Exist"
  }
}

export const overrideUpstashKeys = async (session: any) => {
  const upStashID = await db.get(`user:email:${session.user.email}`)

  await db.set(`user:email:${session.user.email}`, `${session.user._id}`)

  await db.del(`user:${upStashID}`)

  await db.set(
    `user:${session.user._id}`,
    JSON.stringify({
      email: session.user.email,
      name: session.user.name,
      image: session?.user?.avatar_url || session?.user?.image,
      id: session.user._id,
      email_verified: session.user.email_verified
    })
  )

  const upstashTokenDetails = (await db.get(
    `user:account:google:${session.user._id}`
  )) as any

  await db.set(
    `user:account:google:${session.user._id}`,
    JSON.stringify({ ...upstashTokenDetails, userId: session.user._id })
  )

  await db.del(`user:account:by-user-id:${upStashID}`)
  await db.set(`user:account:by-user-id:${session.user._id}`, session.user._id)
}

export const addFriendRequest = async (email: string) => {
  try {
    addFriendValidator.parse({ email })
    const response = await axios.post("/api/friends/add", { email: { email } })
    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      return false
    }
    logger.error(error)
  }
}
