import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import db from "~/server";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  secret: process.env.AUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
});
