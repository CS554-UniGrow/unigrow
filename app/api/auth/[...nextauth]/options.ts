import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { users } from "@/config/mongo/mongoCollections"
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter"
import { db } from "@/lib/db"

export const options: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
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
      },
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile?.name,
          email: profile?.email,
          image: profile?.picture
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      const isEmailVerified =
        profile?.email_verified && profile?.email?.endsWith("@stevens.edu")
      if (isEmailVerified) {
        const usersCollection = await users()
        const userExists = await usersCollection.findOne({
          email: profile?.email
        })

        if (!userExists) {
          const newUser = {
            _id: user.id,
            email: profile?.email,
            name: profile?.name,
            image: profile?.picture,
            token: credentials?.accessToken,
            createdAt: new Date(),
            updatedAt: new Date(),
            isOnboarded: false,
            isEmailVerified: isEmailVerified,
            refreshToken: credentials?.refreshToken,
            provider: "google",
            googleId: user?.id
          }

          const insertInfo = await usersCollection.insertOne(newUser)
          if (insertInfo.insertedCount === 0) {
            throw "Could not add user"
          }
          account.sessionData = {
            _id: newUser._id,
            isOnboarded: false,
            isEmailVerified: isEmailVerified,
            isAuthenticated: true
          }
          return true
        }

        account.sessionData = {
          _id: userExists?._id,
          isOnboarded: userExists.isOnboarded,
          isEmailVerified: userExists.isEmailVerified,
          isAuthenticated: true,
          avatar_url: userExists?.avatar_url
        }
      }
      return isEmailVerified
    },
    session: async ({ session, user, token }: any) => {
      if (session && session.user) {
        session.user.isAuthenticated = true
        // TODO CHECK IF SUB VALUE BELOW AFFECTS ANYTHING
        session.user = { ...session.user, ...token, sub: session.user._id }
      }
      return session
    },
    redirect: async ({ url, baseUrl }) => {
      return baseUrl.includes(url) ? baseUrl : url
    },
    jwt: async ({ account, token, user, profile, session, trigger }: any) => {
      if (account) {
        token.accessToken = account?.access_token
        token.refreshToken = account?.refresh_token
        token.id_token = account?.id_token
        token.expiresAt = account?.expires_at
        token.provider = account?.provider
        token.token_type = account?.token_type
        token._id = account?.sessionData?._id
        token.isOnboarded = account?.sessionData?.isOnboarded
        token.isEmailVerified = account?.sessionData?.isEmailVerified
        token.isAuthenticated = account?.sessionData?.isAuthenticated
        token.avatar_url = account?.sessionData?.avatar_url
      }

      if (trigger === "update") {
        token = { ...token, ...session }
      }

      return token
    }
  },
  pages: {
    signIn: "/signup",
    error: "/signup",
    newUser: "/onboarding"
  }
}
