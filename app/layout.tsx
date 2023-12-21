process.setMaxListeners(15)
import type { Metadata } from "next"
import "./globals.css"
import Nav from "@/components/nav"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "@/context/AuthProvider"
import NextTopLoader from "nextjs-toploader"
import { getServerSession } from "next-auth"
import { options } from "./api/auth/[...nextauth]/options"
import { Toaster } from "react-hot-toast"

// add cron job here to call /test

// export const metadata: Metadata = {
//   title: "Unigrow",
//   description: "Stevens University Portal"
// }

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(options)

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <meta name="description" content="Stevens University Portal" /> */}
        <title>Unigrow</title>
      </head>
      <body>
        <AuthProvider session={session}>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex min-h-screen flex-col">
              {/* <NextTopLoader showSpinner={false} shadow={false} /> */}
              <Nav />

              <div className="mt-16 flex-1 p-10">{children}</div>
            </div>
          </ThemeProvider>
        </AuthProvider>
        <footer className="footer-section">
          <div className="container mx-auto text-center">
            <div className="footer-links mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <a href="/" className="text-base hover:text-blue-600">
                Home
              </a>
              <a href="/faq" className="text-base hover:text-blue-600">
                FAQ
              </a>
              <a href="/aboutus" className="text-base hover:text-blue-600">
                About
              </a>
              <a href="/resources" className="text-base hover:text-blue-600">
                Resources
              </a>
            </div>
            <p>© {new Date().getFullYear()} UniGrow. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
