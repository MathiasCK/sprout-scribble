"use server";

import { createSafeActionClient } from "next-safe-action";
import { reviewsSchema } from "~/types";
import { auth } from "~/server/auth";
import db from "~/server";
import { and, eq } from "drizzle-orm";
import { reviews } from "~/server/schema";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const createReview = action(
  reviewsSchema,
  async ({ rating, comment, productId }) => {
    try {
      const session = await auth();

      if (!session) {
        return {
          error: "Please sign in",
        };
      }

      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productId, productId),
          eq(reviews.userId, session.user.id)
        ),
      });

      if (reviewExists) {
        return {
          error: "You already reviewed this product",
        };
      }

      await db.insert(reviews).values({
        rating,
        comment,
        productId,
        userId: session.user.id,
      });

      revalidatePath(`/products/${productId}`);

      return {
        success: "Review created successfully",
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred creating the review",
      };
    }
  }
);
