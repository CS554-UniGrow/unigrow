import { users } from "@/config/mongo/mongoCollections";

export const getAllUsers = async () => {
  const user = await users();
  return await user.find({}).toArray();
};
