import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import db from "~/server";
import { orders } from "~/server/schema";

export const POST = async (req: NextRequest) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2024-06-20",
  });

  const sig = req.headers.get("stripe-signature") || "";
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  const reqText = await req.text();
  const reqBuffer = Buffer.from(reqText);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
  } catch (err) {
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const retrievedOrder = await stripe.paymentIntents.retrieve(
        event.data.object.id, {
          expand: ['latest_charge']
        }
      );
      const charge = retrievedOrder.latest_charge as Stripe.Charge;

      await db
        .update(orders)
        .set({
          status: "succeeded",
          receiptURL: charge.receipt_url,
        })
        .where(eq(orders.paymentIntentId, event.data.object.id));

      break;

    default:
      return NextResponse.json({ received: false });
  }

  return NextResponse.json({ received: true });
};
