"use server";

import { TQuestionnaire } from "@/lib/schemas";
import { users } from "@/config/mongo/mongoCollections";
import { getUserProfileDetails } from "@/data/canvas_extractor/canvas_api_extractor";
import { encrypt } from "./utils";

export const checkCanvasToken = async (token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CANVAS_BASE_URL}users/self/profile`,
    { cache: "no-store", headers: { Authorization: `Bearer ${token}` } }
  );
  return response.ok;
};

export const handleSubmitAction = async (
  values: TQuestionnaire,
  uid: string,
  refreshToken: string
) => {
  let { major, joiningTerm, canvasToken } = values;
  canvasToken = encrypt(canvasToken);
  const data = await getUserProfileDetails({
    apiKey_hashed: canvasToken,
    uid,
    refreshToken: refreshToken
  });

  if (data) {
    const usersCollection = await users();
    const userExists = await usersCollection.findOne({ _id: uid });
    if (userExists) {
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
      );
      if (updateInfo.modifiedCount === 0) {
        throw "Could not update user";
      }
    }
    return data;
  }
};
