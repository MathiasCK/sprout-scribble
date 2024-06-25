"use client";

import Image from "next/image";
import Link from "next/link";
import { VariantsWithProduct } from "~/lib/infer-type";
import { Badge } from "~/components/ui/badge";
import { formatPrice } from "~/lib/utils";

const Products = ({ variants }: { variants: VariantsWithProduct[] }) => {
  return (
    <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {variants.map(variant => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?productId=${variant.productId}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          {variant.variantImages[0].url && (
            <Image
              className="rounded-md pb-2"
              src={variant.variantImages[0].url}
              alt={variant.productType}
              width={720}
              height={480}
              loading="lazy"
            />
          )}
          <div className="flex justify-between">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Products;
