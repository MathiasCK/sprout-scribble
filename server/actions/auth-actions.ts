"use server";

import bcrypt from "bcrypt";
import { createSafeActionClient } from "next-safe-action";
import { loginSchema, registerSchema } from "~/types";
import db from "~/server";
import { eq } from "drizzle-orm";
import { users } from "~/server/schema";
import {
  generateEmailVerificationToken,
  sendVerificationEmail,
} from "~/server/utils";

const action = createSafeActionClient();

export const emailSignIn = action(
  loginSchema,
  async ({ email, password, code }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: "Email not found" };
    }

    if (!existingUser?.emailVerified) {
      // TODO: Send email verification
    }

    return { success: email };
  },
);

export const emailRegister = action(
  registerSchema,
  async ({ email, password, name }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(email, verificationToken[0].token);

        return { success: "Email confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(email, verificationToken[0].token);

    return { success: "Email confirmation sent" };
  },
);
