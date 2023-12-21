// pages/signout.tsx
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

const SignOut: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    signOut({
      callbackUrl: "/signup"
    })
    // Redirect to the home page or any other desired destination
    router.push("/")
  }, [router])

  return <p>Signing out...</p> // You can customize the content if needed
}

export default SignOut
