import type { Metadata } from "next"
import "./globals.css"
import Nav from "@/components/nav"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "@/context/AuthProvider"
import NextTopLoader from "nextjs-toploader"

export const metadata: Metadata = {
  title: "Unigrow",
  description: "Stevens University Portal"
}

import { getServerSession } from "next-auth"
import { options } from "./api/auth/[...nextauth]/options"
import { Toaster } from "react-hot-toast"

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(options)

  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <Toaster position="top-center" reverseOrder={false} />
            <NextTopLoader />
            <div className="flex min-h-screen flex-col">
              <Nav />
              <div className="mt-16 flex-1 p-10">{children}</div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
