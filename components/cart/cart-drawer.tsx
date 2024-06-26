"use client";

import { ShoppingBagIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";

import { useCart } from "~/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { CartItems } from "~/components/cart";

const CartDrawer = () => {
  const { cart } = useCart();

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBagIcon />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <CartItems />
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
