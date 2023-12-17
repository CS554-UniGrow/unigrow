import { getServerSession } from "next-auth"
import { options } from "@/app/api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const UNAUTHENTICATED_REDIRECT = "/signup"
const ONBOARDING_REDIRECT = "/onboarding"
const PROTECTED_ROUTES = ["/dashboard"]
const ROUTES = ["/", "/signup", "/onboarding"]

export const getSessionServer = async (pathname?: string) => {
  // TODO: Add types to session
  const session = await getServerSession(options)
  // TODO : DHRUV check if the session is of valid user i.e based on the sign in rules in options
  // const isEmailVerified =
  //       profile?.email_verified && profile?.email?.endsWith("@stevens.edu")
  //     if (isEmailVerified) {
  //       const usersCollection = await users()
  //       const userExists = await usersCollection.findOne({
  //         email: profile?.email
  //       })

  // If the user is not authenticated, redirect to login page
  if (!session) {
    redirect(UNAUTHENTICATED_REDIRECT)
  }

  const { user }: any = session

  if (
    user?.isAuthenticated &&
    user?.isOnboarded &&
    (pathname === ONBOARDING_REDIRECT || ROUTES.includes(pathname!))
  ) {
    redirect("/dashboard")
  }

  // If user is authenticated but not onboarded, redirect to onboarding page
  if (
    user?.isAuthenticated &&
    !user?.isOnboarded &&
    pathname !== ONBOARDING_REDIRECT
  ) {
    redirect(ONBOARDING_REDIRECT)
  }

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
