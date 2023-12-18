import { z } from "zod"

export const addFriendValidator = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .endsWith("@stevens.edu", {
      message: "Must be a Stevens email"
    })
    .email()
})
