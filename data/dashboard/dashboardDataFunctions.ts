import { users } from "@/config/mongo/mongoCollections"
import logger from "@/lib/logger"
import { decrypt } from "@/lib/utils"
import axios, { AxiosError } from "axios"

export const getCanvasToken = async (uid: string) => {
  const user = await users()
  const currentUser = await user.findOne({ _id: uid })
  const apiKey = decrypt(currentUser.apiKey_hashed)
  return apiKey.trim()
}
export const getCanvasToDo = async (uid: string) => {
  const token = await getCanvasToken(uid)
  const url = `${process.env.NEXT_PUBLIC_CANVAS_BASE_URL}users/self/todo`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    logger.info(response.status)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      logger.error("Axios Error:", axiosError.message)
      throw axiosError
    } else {
      throw new Error("An error occurred while fetching data")
    }
  }
}
