import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import dayjs from "dayjs";
import { semesters } from "@/lib/constants";
import AuthProvider from "@/context/AuthProvider";
export const metadata: Metadata = {
  title: "Unigrow",
  description: "Generated by create next app"
};

import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { options } from "./api/auth/[...nextauth]/options";
export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <Nav />
              <div className="mt-16 flex-1 p-10">{children}</div>
            </div>
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
