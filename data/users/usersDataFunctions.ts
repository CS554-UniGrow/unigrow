import { users } from "@/config/mongo/mongoCollections";

export const getUserById = async (uid: string) => {
  const user = await users();
  return await user.findOne({ _id: uid });
};

export const getAllUsers = async () => {
  const user = await users();
  return await user.find({}).toArray();
};
