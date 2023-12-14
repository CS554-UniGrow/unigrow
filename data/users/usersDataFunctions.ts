import { users } from "@/config/mongo/mongoCollections";
import logger from "@/lib/logger";

export const getUserById = async (uid: string) => {
  const user = await users();
  return await user.findOne({ _id: uid });
};

export const getAllUsers = async () => {
  const user = await users();
  logger.info("getAllUsers");
  logger.info(user);
  return await user.find({}).toArray();
};
