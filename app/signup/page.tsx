"use client"

import { Button } from "@/components/ui/button"
import logger from "@/lib/logger"
import { signIn } from "next-auth/react"
import { FaGoogle } from "react-icons/fa"

const Signup = ({ searchParams: { error } }: any) => {
  const handleGoogleAuthSignUp = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/onboarding"
      })
      logger.info(result)
    } catch (e) {
      logger.error(e)
    }
  }

  return (
    <>
      <div className="mx-auto mt-44 grid max-w-lg gap-10 rounded-xl border-2 border-solid">
        <h1 className="mt-10 text-center text-4xl font-medium">
          Sign Up with Google
        </h1>
        <h3
          className={`text-center ${
            error === "AccessDenied" && "text-xl text-red-400"
          } `}
        ></h3>
        <Button
          className="mx-3 mb-5"
          onClick={handleGoogleAuthSignUp}
          variant="outline"
          type="button"
        >
          <FaGoogle />
        </Button>
      </div>

      <div className="mt-10 text-center font-thin">
        <p>
          Currently we only support sign in with google, please make sure you
          have a Gmail account handy
        </p>
      </div>
    </>
  )
}

export default Signup
