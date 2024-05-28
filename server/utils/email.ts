"use server";

import db from "~/server";
import { eq, is } from "drizzle-orm";
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
    const confirmLink = `${domain}/verify?token=${token}`;
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Sprout & scribble - Verify your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to verify your email</p>`,
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
