"use client";

import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCart } from "~/hooks";
import { formatPrice } from "~/lib/utils";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import emptyCart from "~/public/empty-box.json";

const CartItems = () => {
  const { cart, addToCart, removeFromCart } = useCart();

  return (
    <motion.div className="flex flex-col items-center">
      {cart.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-center text-2xl text-muted-foreground">
              Your cart is empty
            </h2>
            <Lottie className="h-64" animationData={emptyCart} />
          </motion.div>
        </div>
      ) : (
        <div className="max-h-80 w-full overflow-y-auto">
          <Table className="mx-auto max-w-2xl">
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map(item => (
                <TableRow key={(item.id + item.variant.variantId).toString()}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        width={48}
                        height={48}
                        src={item.image}
                        alt={item.name}
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <MinusCircleIcon
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantId: item.variant.variantId,
                            },
                          });
                        }}
                        className="cursor-pointer transition-colors duration-300 hover:text-muted-foreground"
                        size={14}
                      />
                      <p className="text-md font-bold">
                        {item.variant.quantity}
                      </p>
                      <PlusCircleIcon
                        className="cursor-pointer transition-colors duration-300 hover:text-muted-foreground"
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantId: item.variant.variantId,
                            },
                          });
                        }}
                        size={14}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

export default CartItems;
