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
        let avatar_url = undefined
        try {
          const usersCollection = await users()
          const userExists = await usersCollection.findOne({
            email: profile?.email,
            _id: profile?.sub
          })

          if (userExists) {
            avatar_url = userExists?.avatar_url
          }
        } catch (e) {}

        return {
          id: profile.sub,
          name: profile?.name,
          email: profile?.email,
          image: profile?.picture,
          avatar_url: avatar_url
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      const isStudentEmail = profile?.email?.endsWith("@stevens.edu")
      const isEmailVerified = profile?.email_verified
      const usersCollection = await users()
      let userExists = await usersCollection.findOne({
        email: profile?.email
      })

      if (!userExists) {
        let newUser = {
          _id: user.id,
          email: profile?.email,
          name: profile?.name,
          image: profile?.picture,
          token: credentials?.accessToken,
          createdAt: new Date(),
          updatedAt: new Date(),
          isOnboarded: !isStudentEmail,
          isEmailVerified: profile?.email_verified,
          refreshToken: credentials?.refreshToken,
          provider: "google",
          googleId: user?.id,
          ...(isStudentEmail
            ? {}
            : {
                apiKey_hashed: null,
                avatar_url: profile?.picture,
                bio: "Guest User",
                courses: [
                  "CPE 590",
                  "CS 561",
                  "CS 583",
                  "CS 513",
                  "CS 545",
                  "FE 511",
                  "FE 520",
                  "CS 541",
                  "CS 562",
                  "FE 513"
                ],
                id: null,
                login_id: profile?.email,
                primary_email: profile?.email,
                sortable_name: profile?.name,
                canvasToken_hashed: null,
                joiningTerm: null,
                major: "Mechanical Engineering"
              })
        }

        const insertInfo = await usersCollection.insertOne(newUser)
        if (insertInfo.insertedCount === 0) {
          throw new Error("Could not add user")
        }

        userExists = newUser
      }

      account.sessionData = {
        _id: userExists._id,
        isOnboarded: userExists.isOnboarded,
        isEmailVerified: userExists.isEmailVerified,
        isAuthenticated: true,
        avatar_url: userExists.avatar_url
      }

      return true
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
