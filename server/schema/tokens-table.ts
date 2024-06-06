import { timestamp, pgTable, text, primaryKey } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "~/server/schema";

export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  vt => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  }),
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  vt => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  }),
);

export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  },
  vt => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  }),
);
