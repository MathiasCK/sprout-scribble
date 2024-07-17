"use server";

import { createSafeActionClient } from "next-safe-action";
import { orderSchema } from "~/types";
import { auth } from "~/server/auth";
import db from "~/server";
import { orders, orderProduct } from "~/server/schema";

const action = createSafeActionClient();

export const createOrder = action(
  orderSchema,
  async ({ products, status, total, paymentIntentId }) => {
    try {
      const user = await auth();

      if (!user) {
        return {
          error: "User not found",
        };
      }

      const order = await db
        .insert(orders)
        .values({
          status,
          total,
          paymentIntentId,
          userId: user.user.id,
        })
        .returning();

      products.forEach(async product => {
        await db.insert(orderProduct).values({
          quantity: product.quantity,
          orderId: order[0].id,
          productId: product.productId,
          productVariantId: product.variantId,
        });
      });

      return { success: "Order has been processed" };
    } catch (error) {
      return { error: "An error occuerd when creating order" };
    }
  }
);
