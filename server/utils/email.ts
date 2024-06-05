"use server";

import db from "~/server";
import { eq } from "drizzle-orm";
import { emailTokens } from "~/server/schema";
import { getBaseURL } from "~/lib/utils";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const token = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    });

    return token;
  } catch (error) {
    return null;
  }
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
  isResending = false,
) => {
  try {
    const confirmLink = `${domain}/auth/verify?token=${token}`;
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Sprout & scribble - Verify your email",
      html: /*html*/ `<p>Click <a href="${confirmLink}">here</a> to verify your email</p>`,
    });

    if (error) {
      return { error: error.message };
    }

    return {
      success: isResending
        ? "Email confirmation resent"
        : "Email confirmation sent",
    };
  } catch (error) {
    return { error: "Failed to send email" };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `${domain}/auth/reset-password?token=${token}`;
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Sprout & scribble - Reset your password",
      html: /*html*/ `<p>Click <a href="${confirmLink}">here</a> to reset your password</p>`,
    });

    if (error) {
      return { error: error.message };
    }

    return {
      success: "Password reset email sent",
    };
  } catch (error) {
    return { error: "Failed to send password reset email" };
  }
};
