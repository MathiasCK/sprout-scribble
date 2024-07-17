"use client";

import { motion } from "framer-motion";
import { CheckIcon, CreditCardIcon, ShoppingCartIcon } from "lucide-react";
import { useCart } from "~/hooks";

const CartProgress = () => {
  const { checkoutProgress } = useCart();
  return (
    <div className="flex items-center justify-center pb-6">
      <div className="relative h-3 w-64 rounded-md bg-muted">
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-between">
          <motion.span
            className="absolute left-0 top-0 z-30 h-full rounded-md bg-primary px-2 ease-in-out"
            initial={{ width: 0 }}
            animate={{
              width:
                checkoutProgress === "cart"
                  ? 0
                  : checkoutProgress === "payment"
                    ? "50%"
                    : "100%",
            }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25 }}
            className="z-50 rounded-full bg-primary p-2"
          >
            <ShoppingCartIcon size={14} className="text-white" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale:
                checkoutProgress === "payment"
                  ? 1
                  : 0 || checkoutProgress === "confirmation"
                    ? 1
                    : 0,
            }}
            transition={{ delay: 0.25 }}
            className="z-50 rounded-full bg-primary p-2"
          >
            <CreditCardIcon size={14} className="text-white" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: checkoutProgress === "confirmation" ? 1 : 0 }}
            transition={{ delay: 0.25 }}
            className="z-50 rounded-full bg-primary p-2"
          >
            <CheckIcon size={14} className="text-white" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartProgress;
