import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"
import { semesters } from "./constants"
import { JoiningTerm } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/encryption.ts

const algorithm = "aes-256-cbc"
const hashKey = process.env.NEXT_PUBLIC_HASHING_KEY! || ""
const key = Buffer.from(hashKey) // Replace with your own secret key
const iv = randomBytes(16)

export const encrypt = (text: string): string => {
  const cipher = createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, "utf-8", "hex")
  encrypted += cipher.final("hex")
  return `${iv.toString("hex")}:${encrypted}`
}

export const decrypt = (text: string): string => {
  const [ivString, encrypted] = text.split(":")
  const decipher = createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivString, "hex")
  )
  let decrypted = decipher.update(encrypted, "hex", "utf-8")
  decrypted += decipher.final("utf-8")
  return decrypted
}

export const fetchUserDetails = (result: any) => {
  return {
    username: result?.user?.providerData[0]?.displayName,
    email: result?.user?.providerData[0]?.email,
    phone: result?.user?.providerData[0]?.phoneNumber,
    profile_pic: result?.user?.providerData[0]?.photoURL,
    uid: result?.user?.uid,
    isVerified: result?.user?.emailVerified,
    metadata: result?.user?.metadata,
    isAuthenticated: Object.keys(result).length > 1 ? true : false
  }
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__")
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort()
  return `${sortedIds[0]}--${sortedIds[1]}`
}

export const generateJoiningTerms = (): JoiningTerm[] => {
  const currentYear = new Date().getFullYear()
  const rangeStart = currentYear - 2
  const rangeEnd = currentYear + 1

  const joiningTerms: JoiningTerm[] = []

  for (let year = rangeStart; year <= rangeEnd; year++) {
    ;[semesters[0], semesters[1], semesters[4]].forEach((semester) => {
      const term = `${year} ${semester}`
      joiningTerms.push({ term, value: term })
    })
  }

  return joiningTerms
}
