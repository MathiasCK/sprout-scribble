"use server";

import bcrypt from "bcrypt";
import { createSafeActionClient } from "next-safe-action";
import { loginSchema, registerSchema } from "~/types";
import db from "~/server";
import { eq } from "drizzle-orm";
import { emailTokens, users } from "~/server/schema";
import {
  generateEmailVerificationToken,
  getVerificationTokenByEmail,
  sendVerificationEmail,
} from "~/server/utils";

import { AuthError } from "next-auth";
import { signIn } from "~/server/auth";

const action = createSafeActionClient();

export const emailSignIn = action(loginSchema, async ({ email, password }) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: "Invalid credentials" };
    }

    if (!existingUser?.emailVerified) {
      const verificationToken = await generateEmailVerificationToken(
        existingUser.email,
      );
      const response = await sendVerificationEmail(
        email,
        verificationToken[0].token,
      );

      return response.error
        ? { error: response.error }
        : { success: response.success };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: email };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "AccessDenied":
          return { error: "Access denied" };
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }

    if (error instanceof Error) {
      return { error: error.message };
    }
    return {
      error: "An unexpected error occurred",
    };
  }
});

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
        const response = await sendVerificationEmail(
          email,
          verificationToken[0].token,
          true,
        );

        return response.error
          ? { error: response.error }
          : { success: response.success };
      }
      return { error: "Email already in use" };
    }

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);
    const response = await sendVerificationEmail(
      email,
      verificationToken[0].token,
    );

    return response.error
      ? { error: response.error }
      : { success: response.success };
  },
);

export const verifyEmailVerificationToken = async (token: string) => {
  const existingToken = await getVerificationTokenByEmail(token);

  if (!existingToken) {
    return { error: "Token not found" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  });

  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));

  return { success: "Email verified" };
};
