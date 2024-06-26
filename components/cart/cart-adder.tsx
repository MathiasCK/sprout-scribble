"use client";

import { useState } from "react";
import { useCart } from "~/hooks";
import { Button } from "~/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const CartAdder = () => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const id = Number(pathname.split("/").pop());
  const productId = Number(searchParams.get("productId"));
  const title = searchParams.get("title");
  const type = searchParams.get("type");
  const price = Number(searchParams.get("price"));
  const image = searchParams.get("image");

  if (!id || !productId || !title || !type || !price || !image) {
    toast.error("Product not found");
    return redirect("/");
  }

  return (
    <>
      <div className="my-4 flex items-center justify-stretch gap-4">
        <Button
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
          variant={"secondary"}
          className="text-primary"
        >
          <MinusIcon size={18} strokeWidth={3} />
        </Button>
        <Button variant={"secondary"} className="flex-1">
          Quantity: {quantity}
        </Button>
        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
          variant={"secondary"}
          className="text-primary"
        >
          <PlusIcon size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          toast.success(`Added ${title + " " + type} to your cart!`);
          addToCart({
            id: productId,
            variant: { variantId: id, quantity },
            name: title + " " + type,
            price,
            image,
          });
        }}
      >
        Add to cart
      </Button>
    </>
  );
};

export default CartAdder;
