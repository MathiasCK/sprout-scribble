"use client";

import { useCart } from "~/hooks";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import orderConfirmed from "~/public/order-confirmed.json";

const Confirmation = () => {
  const { setCheckoutProgress, setCartOpen } = useCart();
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Lottie className="my-4 h-56" animationData={orderConfirmed} />
      </motion.div>
      <h2 className="text-2xl font-medium">Thank you for your purchase!</h2>
      <Link href={"/dashboard/orders"}>
        <Button
          variant={"secondary"}
          onClick={() => {
            setCheckoutProgress("cart");
            setCartOpen(false);
          }}
        >
          View your order
        </Button>
      </Link>
    </div>
  );
};

export default Confirmation;
