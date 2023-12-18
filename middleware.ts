import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
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
