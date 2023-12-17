import { getServerSession } from "next-auth"
import { options } from "@/app/api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { users } from "@/config/mongo/mongoCollections"
const UNAUTHENTICATED_REDIRECT = "/signup"
const ONBOARDING_REDIRECT = "/onboarding"
const PROTECTED_ROUTES = ["/dashboard"]
const ROUTES = ["/", "/signup", "/onboarding"]

export const getSessionServer = async (pathname?: string) => {
  // TODO: Add types to session
  const session = await getServerSession(options)
  // TODO : DHRUV check if the session is of valid user i.e based on the sign in rules in options
  // const email = session?.user?.email

  // const usersCollection = await users()
  // const userExists = await usersCollection.findOne({
  //   email: email
  // })

  // console.log("userExists", userExists)

  // if (!userExists) {
  //   redirect(UNAUTHENTICATED_REDIRECT)
  // }

  return session
}

// TODO: Think a better way to do this
export const useSessionClient = () => {
  const router = useRouter()
  const session = useSession()

  if (!session) {
    redirect(UNAUTHENTICATED_REDIRECT)
  }

  const { user }: any = session
}
