import { timestamp, pgTable, text, primaryKey } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

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
