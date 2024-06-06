"use server";

import bcrypt from "bcrypt";
import { createSafeActionClient } from "next-safe-action";
import { settingsSchema } from "~/types";
import { auth } from "~/server/auth";
import db from "~/server";
import { eq } from "drizzle-orm";
import { users } from "~/server/schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const updateSettings = action(settingsSchema, async values => {
  const user = await auth();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.user.id),
  });

  if (!dbUser) {
    return { error: "User not found" };
  }

  if (user.user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordMatch) {
      return { error: "Invalid password" };
    }

    const samePassword = await bcrypt.compare(
      values.newPassword,
      dbUser.password,
    );

    if (samePassword) {
      return { error: "New password must be different" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db
    .update(users)
    .set({
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.image,
      isTwoFactorEnabled: values.isTwoFactorEnabled,
    })
    .where(eq(users.id, user.user.id));

  revalidatePath("/dashboard/settings");

  return { success: "User settings updated" };
});
