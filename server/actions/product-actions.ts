"use server";

import * as z from "zod";
import { createSafeActionClient } from "next-safe-action";
import { productSchema } from "~/types";
import db from "~/server";
import { eq } from "drizzle-orm";
import { products } from "~/server/schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const getProduct = action(
  z.object({
    id: z.number(),
  }),
  async ({ id }) => {
    try {
      if (!id) return { error: "Product is missing id" };

      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
      });

      if (!product) {
        return {
          error: "Product not found",
        };
      }

      return { success: product };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred when fetching product",
      };
    }
  },
);

export const deleteProduct = action(
  z.object({
    id: z.number(),
  }),
  async ({ id }) => {
    try {
      if (!id) return { error: "Product is missing id" };

      const currentProduct = await db.query.products.findFirst({
        where: eq(products.id, id),
      });

      if (!currentProduct) {
        return {
          error: "Product not found",
        };
      }

      await db.delete(products).where(eq(products.id, id));

      revalidatePath("/dashboard/products");

      return { success: `Product "${currentProduct.title}" has been deleted` };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred when deleting product",
      };
    }
  },
);

export const handleProduct = action(
  productSchema,
  async ({ id, description, price, title }) => {
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

        revalidatePath("/dashboard/products");

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
        error:
          error instanceof Error
            ? error.message
            : "An error occurred when creating product",
      };
    }
  },
);
