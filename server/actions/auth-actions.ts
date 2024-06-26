"use server";

import bcrypt from "bcrypt";
import { createSafeActionClient } from "next-safe-action";
import {
  loginSchema,
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
} from "~/types";
import db from "~/server";
import { eq } from "drizzle-orm";
import {
  emailTokens,
  passwordResetTokens,
  twoFactorTokens,
  users,
} from "~/server/schema";
import {
  generateEmailVerificationToken,
  getVerificationTokenByEmail,
  sendVerificationEmail,
  getPasswordResetTokenByToken,
  generatePasswordResetToken,
  sendPasswordResetEmail,
  getTwoFactorTokenByEmail,
  generateTwoFactorToken,
  sendTwoFactorTokenByEmail,
} from "~/server/utils";

import { AuthError } from "next-auth";
import { signIn } from "~/server/auth";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const action = createSafeActionClient();

export const emailSignIn = action(
  loginSchema,
  async ({ email, password, code }) => {
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

      if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email,
          );
          if (!twoFactorToken) {
            return { error: "Invalid two factor token" };
          }

          if (twoFactorToken.token !== code) {
            return { error: "Invalid two factor token" };
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date();

          if (hasExpired) {
            return { error: "Two factor token has expired" };
          }

          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          if (!token) {
            return { error: "Token not generated!" };
          }

          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);

          return { twoFactor: "Two factor token sent to email" };
        }
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

export const forgotPassword = action(
  forgotPasswordSchema,
  async ({ email }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    if (!passwordResetToken) {
      return { error: "Failed to generate password reset token" };
    }

    const response = await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token,
    );

    return response.error
      ? { error: response.error }
      : { success: response.success };
  },
);

export const resetPassword = action(
  resetPasswordSchema,
  async ({ password, token }) => {
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
    const dbPool = drizzle(pool);

    if (!token) {
      return { error: "Token is required" };
    }

    const existingToken = await getPasswordResetTokenByToken(token);

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
      return { error: "User not found" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async tx => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));

      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });

    return { success: "Password updated" };
  },
);
