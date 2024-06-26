"use client";

import { useCart } from "~/hooks";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DrawerDescription, DrawerTitle } from "~/components/ui/drawer";

const CartMessage = () => {
  const { checkoutProgress, setCheckoutProgress } = useCart();
  return (
    <motion.div
      className="text-center"
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 10 }}
    >
      <DrawerTitle>
        {checkoutProgress === "cart" ? "Your Cart Items" : null}
        {checkoutProgress === "payment" ? "Choose a payment method" : null}
        {checkoutProgress === "confirmation" ? "Order Confirmed" : null}
      </DrawerTitle>
      <DrawerDescription className="py-1">
        {checkoutProgress === "cart" ? "  View and edit your bag." : null}
        {checkoutProgress === "payment" ? (
          <span
            onClick={() => setCheckoutProgress("cart")}
            className="flex cursor-pointer items-center justify-center gap-1 hover:text-primary"
          >
            <ArrowLeft size={14} /> Head back to cart
          </span>
        ) : null}
        {checkoutProgress === "confirmation"
          ? "You will recieve an email with your receipt!"
          : null}
      </DrawerDescription>
    </motion.div>
  );
};

export default CartMessage;
