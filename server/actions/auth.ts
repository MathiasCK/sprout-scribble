"use server";

import { createSafeActionClient } from "next-safe-action";
import { loginSchema } from "~/types";

const action = createSafeActionClient();

export const emailSignIn = action(
  loginSchema,
  async ({ email, password, code }) => {
    return { email, password, code };
  },
);
