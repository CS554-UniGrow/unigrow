"use client";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";

import { SessionProvider } from "next-auth/react";

const publicPaths = ["/signup", "/"];

export default function AuthProvider({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) {
  const pathname = usePathname();

  if (
    session?.user?.isAuthenticated &&
    (pathname === "/signup" || pathname === "/")
  ) {
    redirect("/dashboard");
  }

  if (!session?.user?.isAuthenticated && publicPaths.includes(pathname)) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
  }

  // useLayoutEffect(() => {
  //   console.log("in layout effect");
  //   if (!session?.user?.isAuthenticated && !publicPaths.includes(pathname)) {
  //     redirect("/signup");
  //   }
  // }, []);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
