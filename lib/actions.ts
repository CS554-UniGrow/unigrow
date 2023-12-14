"use server";

import { TQuestionnaire } from "@/components/Questionnaire";
import { encrypt } from "./utils";
import { users } from "@/config/mongo/mongoCollections";
import { ObjectId } from "mongodb";

export const handleSubmitAction = async (values: TQuestionnaire, uid: string, refreshToken: string) => {
  let { major, joiningTerm, canvasToken } = values;
  const canvasToken_hashed = encrypt(canvasToken);
  const response = await fetch(`http://localhost:3000/api/questions`, {
    method: "POST",
    body: JSON.stringify({
      apiKey_hashed: canvasToken_hashed,
      uid: uid,
      refreshToken: refreshToken
    })
  });

  if (response) {
    const usersCollection = await users();
    const userExists = await usersCollection.findOne({ _id: new ObjectId(uid) })
    if (userExists) {
      const updateInfo = await usersCollection.updateOne({ _id: new ObjectId(uid) }, { $set: { major: major, joiningTerm: joiningTerm, canvasToken_hashed: canvasToken_hashed, isOnboarded: true } });
      if (updateInfo.modifiedCount === 0) {
        throw "Could not update user";
      }
    }
  }

}