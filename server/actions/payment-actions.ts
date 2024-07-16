"use server";

import { createSafeActionClient } from "next-safe-action";
import Stripe from "stripe";
import { paymentIntentSchema } from "~/types";
import { auth } from "~/server/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET!);
const action = createSafeActionClient();

export const createPaymentIntent = action(
  paymentIntentSchema,
  async ({ amount, currency, cart }) => {
    try {
      const user = await auth();

      if (!user) {
        return { error: "Please login to continue" };
      }

      if (!amount) {
        return { error: "No products to checkout" };
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          cart: JSON.stringify(cart),
        },
      });

      return {
        success: {
          paymentIntentId: paymentIntent.id,
          clientSecretId: paymentIntent.client_secret,
          user: user.user.email,
        },
      };
    } catch (e) {
      return { error: "An error occuerd whilst processing payment" };
    }
  }
);
