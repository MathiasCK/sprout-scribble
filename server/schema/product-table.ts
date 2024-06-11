import { pgTable, text, serial, timestamp, real } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  created: timestamp("created").notNull(),
  price: real("price").notNull(),
});
