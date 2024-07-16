import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credetials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import db from "~/server";
import { loginSchema } from "~/types";
import { accounts, users } from "~/server/schema";
import bcrypt from "bcrypt";
import Stripe from "stripe";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  secret: process.env.AUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET!, {
        apiVersion: "2024-06-20",
      });

      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      });

      await db
        .update(users)
        .set({ customerId: customer.id })
        .where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role as string;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isOAuth = token.isOauth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });

      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser!.id),
      });

      token.isOauth = !!existingAccount;
      token.name = existingUser?.name;
      token.email = existingUser?.email;
      token.role = existingUser?.role;
      token.isTwoFactorEnabled = existingUser?.isTwoFactorEnabled;
      token.image = existingUser?.image;

      return token;
    },
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
          user.password
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
