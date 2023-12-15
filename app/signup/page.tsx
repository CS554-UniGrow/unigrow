"use client";

import { Button } from "@/components/ui/button";
import logger from "@/lib/logger";
import { signIn } from "next-auth/react";

const Signup = ({ searchParams: { error } }: any) => {
  const handleGoogleAuthSignUp = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/onboarding"
      });
      logger.info(result);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <div className="border-1 border-black/4 0 mx-auto grid max-w-lg gap-10 rounded-xl">
      <h1 className="text-center text-4xl">Continue with Google </h1>
      <h3
        className={`text-center ${
          error === "AccessDenied" && "text-xl text-red-400"
        } `}
      >
        Note: Only users with <code>stevens.edu</code> can access the
        application.
      </h3>
      <Button onClick={handleGoogleAuthSignUp} variant="outline" type="button">
        Google
      </Button>
    </div>
  );
};

export default Signup;
