import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { getSession, signOut } from "next-auth/react"
import { NextResponse } from "next/server"

const sensitiveRoutes = [
  "/dashboard",
  "/courses",
  "/people",
  "/chat",
  "/course"
]

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname

    // Manage route protection
    const isAuth = await getToken({ req })

    const isLoginPage = pathname.startsWith("/signup")
    const isHomePage = pathname === "/"

    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    )

    console.log({ isAuth, isLoginPage, isHomePage, isAccessingSensitiveRoute })
    if (pathname.startsWith("/signout") && !isAuth) {
      return NextResponse.redirect(new URL("/signup", req.url))
    }
    if (pathname.startsWith("/signout") && isAuth) {
      return NextResponse.next()
    }

    // check if session available
    if (
      isAccessingSensitiveRoute &&
      (!isAuth || !isAuth?._id || !isAuth?.email || !isAuth?.expiresAt)
    ) {
      return NextResponse.redirect(new URL("/signout", req.url))
    }

    if (!isAuth && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/signup", req.url))
    }

    if (
      isAccessingSensitiveRoute &&
      !pathname.startsWith("/signup") &&
      (!isAuth || !isAuth?._id || !isAuth?.email || !isAuth?.expiresAt)
    ) {
      return NextResponse.redirect(new URL("/signup", req.url))
    }

    // check if user in mongo based on session uid
    // if (isAuth && isAuth._id && isAuth.email && isAuth.expiresAt) {
    //   let expirytimestamp = new Date(
    //     (isAuth.expiresAt as number) * 1000
    //   ).toLocaleString("en-US", { timeZone: "America/New_York" })
    //   if (
    //     !expirytimestamp ||
    //     expirytimestamp <
    //       new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
    //   ) {
    //     return NextResponse.redirect(new URL("/signout", req.url))
    //   }
    // }

    if (isLoginPage || isHomePage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      } else {
        return NextResponse.next()
      }
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/signup", req.url))
    }

    if (isAuth?.isOnboarded && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (
      !isAuth?.isOnboarded &&
      pathname !== "/onboarding" &&
      isAccessingSensitiveRoute
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }
    return NextResponse.next()
  },

  {
    callbacks: {
      async authorized({ req, token }) {
        return true
      }
    }
  }
)
