"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { googleSignIn, createPlainUser } from "./data";
import { SyntheticEvent } from "react";
import { UserContext } from "@/components/userContext";
import { useRouter } from "next/navigation";
import logger from "@/lib/logger";

const Signup = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { currentUser, setCurrentUser } = React.useContext(UserContext);
  const [redirectUser, setRedirectUser] = React.useState(false);

  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  async function handleSignup() {
    if (!isLoading) {
      setIsLoading(true);
      const created_user = await createPlainUser(email, password);
      if (created_user) {
        console.log("setting the created user in sign up");
        setCurrentUser(created_user.user);
        setRedirectUser(true);
      }
    }
  }

  function handleEmailChange(e: SyntheticEvent) {
    setEmail((e.target as HTMLInputElement).value);
  }

  function handlePasswordChange(e: SyntheticEvent) {
    setPassword((e.target as HTMLInputElement).value);
  }

  async function handleGoogleSignup() {
    try {
      const result = await googleSignIn();

      if (result) {
        const required_result = {
          username: result?.user.providerData[0].displayName,
          email: result?.user.providerData[0].email,
          phone: result?.user.providerData[0].phoneNumber,
          profile_pic: result?.user.providerData[0].photoURL,
          uid: result?.user.uid,
          isVerified: result?.user.emailVerified,
          metadata: result?.user.metadata,
          isAuthenticated: true
        };

        logger.info(required_result);
        console.log("setting the created user in sign up");
        setCurrentUser(required_result);

        setRedirectUser(true);
      }
    } catch (e) {
      logger.error(e);
    }
  }
  React.useEffect(() => {
    // Redirect to '/questions' after setCurrentUser updates the user
    if (redirectUser) {
      router.push("/questions");
    } else {
      router.push("/signup");
    }
  }, [redirectUser, currentUser, router]);

  return (
    <div
      className={cn(
        "border-1 border-black/4 0 mx-auto grid max-w-lg gap-10 rounded-xl"
      )}
    >
      <h1 className="text-center">Create an account</h1>
      <h3 className="text-center">
        Enter a .edu email password below to create your account
      </h3>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="username@example.edu"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onChange={handleEmailChange}
            />
          </div>

          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Enter a Password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              onChange={handlePasswordChange}
            />
          </div>
          <Button disabled={isLoading} onClick={handleSignup}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        onClick={handleGoogleSignup}
        variant="outline"
        type="button"
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
};

export default Signup;
