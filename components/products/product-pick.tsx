"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "~/lib/utils";

const ProductPick = ({
  id,
  color,
  productType,
  title,
  price,
  productId,
  image,
}: {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  productId: number;
  image: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || productType;

  return (
    <div
      style={{ backgroundColor: color }}
      className={cn(
        "h-8 w-8 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:opacity-75",
        selectedType === productType ? "opacity-100" : "opacity-50"
      )}
      onClick={() =>
        router.push(
          `/products/${id}?&productId=${productId}&price=${price}&title=${title}&type=${productType}&image=${image}`,
          { scroll: false }
        )
      }
    ></div>
  );
};

export default ProductPick;
