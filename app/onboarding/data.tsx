import { getDatabase, ref, set } from "firebase/database"
import { User } from "@/lib/types"
import logger from "@/lib/logger"
import { users } from "@/config/mongo/mongoCollections"
import { dbConnection } from "@/config/mongo/mongoConnection"

export function writeUserData(user_data: any) {
  const db = getDatabase()
  set(ref(db, `users/${user_data?.userId}`), user_data)
    .then(() => {
      logger.info("Data successfully written!")
    })
    .catch((error) => {
      logger.error("Error writing data:", error)
    })
}
