import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credetials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import db from "~/server";
import { loginSchema } from "~/types";
import { users } from "~/server/schema";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  secret: process.env.AUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Credetials({
      authorize: async credentials => {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, validatedFields.data.email),
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          validatedFields.data.password,
          user.password,
        );

        if (!passwordMatch) return null;

        return user;
      },
    }),
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
