import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { products, users } from "~/server/schema";

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: real("rating").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    productId: serial("productId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    comment: text("comment").notNull(),
    created: timestamp("created").defaultNow(),
  },
  table => ({
    productIdx: index("productIdx").on(table.productId),
    userIdx: index("userIdx").on(table.userId),
  })
);

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
    relationName: "userReviews",
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
    relationName: "productReviews",
  }),
}));
