import { users } from "@/config/mongo/mongoCollections"
import logger from "@/lib/logger"

export const getUserById = async (uid: string) => {
  const user = await users()
  return await user.findOne(
    { _id: uid },
    {
      projection: {
        name: 1,
        major: 1,
        avatar_url: 1,
        bio: 1,
        courses: 1,
        email: 1,
        id: 1,
        image: 1,
        isEmailVerified: 1,
        isOnboarded: 1,
        joiningTerm: 1,
        primary_email: 1,
        _id: 1,
        joining_term_complete: 1
      }
    }
  )
}

export const getAllUsers = async () => {
  const user = await users()
  return await user.find({}).toArray()
}
