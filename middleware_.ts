// // export { default } from "next-auth/middleware"
import { getServerSession } from "next-auth"
import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { options } from "./app/api/auth/[...nextauth]/options"

// export { default } from "next-auth/middleware"

// export default withAuth(
//   async function middleware(request: NextRequestWithAuth) {
//     console.log(request.credentials)

//     return NextResponse.next(request)
//   }, {
//   callbacks: {
//     authorized: async ({ req, token }) => {
//       console.log("authorized", token)
//       return !!token
//     }
//   }
// }
// )


import type { NextRequest } from 'next/server'
const protectedRoutes = ['/dashboard', '/coureses', '/people', '/profile'];

export default async function middleware(req: NextRequest) {
  // const session = await getServerSession(options);
  let session = {}
  if (session?.user?.isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/signup", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

// export const config = { matcher: ['/dashboard'] }