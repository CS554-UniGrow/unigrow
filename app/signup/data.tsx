import { db, app } from "@/firebase"
import { getAuth } from "firebase/auth"
import { redirect } from "next/navigation"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth"
import logger from "@/lib/logger"

const auth = getAuth(app)

//create user with plain email and password
export const createPlainUser = async (email: string, password: string) => {
  try {
    if (!email.endsWith("stevens.edu")) {
      throw "Must use a Stevens college ID only"
    }
    const created_user = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    if (created_user) {
      return created_user
    }
  } catch (e) {
    logger.error(e)
  }
}
// plain email and password login
export const loginEmailPassword = async (email: string, password: string) => {
  try {
    const user_credentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    if (user_credentials) {
      return user_credentials
    }
  } catch (e) {
    logger.error(e)
  }
}

//Logout function
export const logout = async () => {
  await signOut(auth)
}

export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const data = await signInWithPopup(auth, provider)
    if (data) {
      return data
    }
  } catch (error) {
    logger.error("Error signing in with Google:", error)
    throw error
  }
}
