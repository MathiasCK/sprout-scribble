"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ReviewsWithUser } from "~/lib/infer-type";
import { Card } from "~/components/ui/card";
import { formatDistance, subDays } from "date-fns";
import { Stars } from "~/components/reviews";

const ProductReviews = ({ reviews }: { reviews: ReviewsWithUser[] }) => {
  return (
    <motion.div className="my-2 flex flex-col gap-4">
      {reviews.map(review => (
        <Card key={review.id} className="p-4">
          <div className="flex items-center gap-2">
            <Image
              className="rounded-full"
              width={32}
              height={32}
              alt={review.user.name!}
              src={review.user?.image!}
            />
            <div>
              <p className="text-sm font-bold">{review.user.name}</p>
              <div className="flex items-center gap-2">
                <Stars rating={review.rating} />
                <p className="text-bold text-xs text-muted-foreground">
                  {formatDistance(subDays(review.created!, 0), new Date())}
                </p>
              </div>
            </div>
          </div>
          <p className="py-2 font-medium">{review.comment}</p>
        </Card>
      ))}
    </motion.div>
  );
};

export default ProductReviews;
