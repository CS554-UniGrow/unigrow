// // export { default } from "next-auth/middleware"
// import { getServerSession } from "next-auth"
// import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
// import { NextRequest, NextResponse } from "next/server"
// import { options } from "./app/api/auth/[...nextauth]/options"

// import { NextResponse } from "next/server";

// export { default } from "next-auth/middleware"

// export default withAuth(
//   async function middleware(request: NextRequestWithAuth) {

//     return NextResponse.next(request)
//   }, {
//   callbacks: {
//     authorized: async ({ req, token }) => {

//       return !!token
//     }
//   }
// }
// )

// import type { NextRequest } from 'next/server'
// const protectedRoutes = ['/dashboard', '/coureses', '/people', '/profile'];

// export default async function middleware(req: NextRequest) {
// const session = await getServerSession(options);
// let session = {}
// if (session?.user?.isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
//   const absoluteURL = new URL("/signup", req.nextUrl.origin);
//   return NextResponse.redirect(absoluteURL.toString());
// }

//   return NextResponse.next()
// }

// export const config = { matcher: ['/dashboard'] }
