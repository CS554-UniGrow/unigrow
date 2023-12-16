import { users } from "@/config/mongo/mongoCollections"
import logger from "@/lib/logger"
import { ObjectId } from "mongodb"

export const getUserById = async (uid: string) => {
  const user = await users()
  // TODO Change back to uuid
  return await user.findOne({ _id: new ObjectId(uid) })
}

export const getAllUsers = async () => {
  const user = await users()
  return await user.find({}).toArray()
}
