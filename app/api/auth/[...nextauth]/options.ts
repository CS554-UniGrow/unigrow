import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { users } from "@/config/mongo/mongoCollections";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isEmailVerified = profile?.email_verified && profile?.email?.endsWith("@stevens.edu")
      console.log('in sign in', { user, account, profile, email, credentials })
      if (isEmailVerified) {
        const usersCollection = await users();
        const userExists = await usersCollection.findOne({ email: profile?.email })
        if (userExists?.isOnboarded) {
          return '/dashboard'
        } else {
          const newUser = {
            email: profile?.email,
            name: profile?.name,
            image: profile?.picture,
            token: credentials?.accessToken,
            createdAt: new Date(),
            updatedAt: new Date(),
            isOnboarded: false,
            isEmailVerified: isEmailVerified,
            courses: []
          }

          const insertInfo = await usersCollection.insertOne(newUser);
          if (insertInfo.insertedCount === 0) {
            throw "Could not add user";
          }
          return '/questions'
        }
      }
      return isEmailVerified
    },
    session: async ({ session, token, user }) => {
      console.log("session", { session, token, user })
      if (session && session.user) {
        session.user.isAuthenticated = true;
        session.user.token = token
      }
      return session
    }
  },
  pages: {
    signIn: "/signup",
    error: "/signup"
  }
}