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
    async signIn({ user, account, profile, email, credentials }: any) {
      const isEmailVerified = profile?.email_verified && profile?.email?.endsWith("@stevens.edu")
      if (isEmailVerified) {
        const usersCollection = await users();
        const userExists = await usersCollection.findOne({ email: profile?.email })

        if (!userExists) {
          const newUser = {
            email: profile?.email,
            name: profile?.name,
            image: profile?.picture,
            token: credentials?.accessToken,
            createdAt: new Date(),
            updatedAt: new Date(),
            isOnboarded: false,
            isEmailVerified: isEmailVerified,
            refreshToken: credentials?.refreshToken,
            provider: "google"
          }

          const insertInfo = await usersCollection.insertOne(newUser);
          if (insertInfo.insertedCount === 0) {
            throw "Could not add user";
          }
          account.sessionData = { _id: insertInfo.insertedId.toString(), isOnboarded: false, isEmailVerified: isEmailVerified, isAuthenticated: true }
          return true
        }

        account.sessionData = { _id: userExists._id.toString(), isOnboarded: userExists.isOnboarded, isEmailVerified: userExists.isEmailVerified, isAuthenticated: true, avatar_url: userExists?.avatar_url }
      }
      return isEmailVerified
    },
    session: async ({ session, user, token }: any) => {
      if (session && session.user) {
        session.user.isAuthenticated = true;
        session.user = { ...session.user, ...token }
      }
      return session
    },
    redirect: async ({ url, baseUrl }) => {
      return baseUrl.includes(url) ? baseUrl : url
    },
    jwt: async ({ account, token, user, profile, session, trigger }: any) => {
      if (account) {
        token.accessToken = account?.access_token;
        token.refreshToken = account?.refresh_token;
        token.id_token = account?.id_token;
        token.expiresAt = account?.expires_at;
        token.provider = account?.provider;
        token.token_type = account?.token_type;
        token._id = account?.sessionData?._id;
        token.isOnboarded = account?.sessionData?.isOnboarded;
        token.isEmailVerified = account?.sessionData?.isEmailVerified;
        token.isAuthenticated = account?.sessionData?.isAuthenticated;
        token.avatar_url = account?.sessionData?.avatar_url;
      }

      if (trigger === "update") {
        token.isOnboarded = session?.isOnboarded;
      }

      return token
    }
  },
  pages: {
    signIn: "/signup",
    error: "/signup",
    newUser: "/questions"
  }
}