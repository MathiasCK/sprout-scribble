"use client";

import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useCart } from "~/hooks";
import getStripe from "~/lib/stripe";
import { PaymentForm } from "~/components/cart";

const stripe = getStripe();

const Payment = () => {
  const { cart } = useCart();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.variant.quantity,
    0
  );

  return (
    <motion.div className="mx-auto max-w-2xl">
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          currency: "usd",
          amount: totalPrice * 100,
        }}
      >
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </motion.div>
  );
};

export default Payment;
