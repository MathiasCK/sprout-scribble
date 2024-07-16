"use client";

import { ShoppingBagIcon } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "~/components/ui/drawer";

import { useCart } from "~/hooks";
import { AnimatePresence, motion } from "framer-motion";
import {
  CartItems,
  Payment,
  Confirmation,
  CartMessage,
} from "~/components/cart";

const CartDrawer = () => {
  const { cart, checkoutProgress, cartOpen, setCartOpen } = useCart();

  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
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
      <DrawerContent className="fixed bottom-0 left-0 max-h-[70vh] min-h-[50vh]">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        <div className="overflow-auto p-4">
          {checkoutProgress === "cart" && <CartItems />}
          {checkoutProgress === "payment" && <Payment />}
          {checkoutProgress === "confirmation" && <Confirmation />}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
