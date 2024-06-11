"use server";

import { createSafeActionClient } from "next-safe-action";
import { productSchema } from "~/types";
import db from "~/server";
import { eq } from "drizzle-orm";
import { products } from "~/server/schema";

const action = createSafeActionClient();

export const createProduct = action(
  productSchema,
  async ({ description, price, title, id }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        if (!currentProduct) {
          return {
            error: "Product not found",
          };
        }

        await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id));

        return { success: `Product "${title}" has been updated` };
      }

      await db.insert(products).values({
        description,
        price,
        title,
        created: new Date(),
      });

      return { success: `Product "${title}" has been created` };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  },
);
