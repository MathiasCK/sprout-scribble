"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { VariantsWithImagesTags } from "~/lib/infer-type";

const ProductType = ({ variants }: { variants: VariantsWithImagesTags[] }) => {
  const searchparams = useSearchParams();
  const selectedType = searchparams.get("type") || variants[0].productType;

  return variants.map(variant => {
    if (variant.productType === selectedType) {
      return (
        <motion.div
          key={variant.id}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 4 }}
          className="font-medium text-secondary-foreground"
        >
          {selectedType}
        </motion.div>
      );
    }
  });
};

export default ProductType;
