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
      where: eq(emailTokens.email, email),
    });

    return token;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return verificationToken;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sprout & scribble - Verify your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email</p>`,
  });
};
