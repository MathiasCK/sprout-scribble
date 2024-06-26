"use client";

import { cn } from "~/lib/utils";
import { StarIcon } from "lucide-react";

const Stars = ({
  rating,
  totalReviews,
  size = 14,
}: {
  rating: number;
  totalReviews?: number;
  size?: number;
}) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <StarIcon
          size={size}
          key={star}
          className={cn(
            "bg-transparent text-primary transition-all duration-300 ease-in-out",
            rating >= star ? "fill-primary" : "fill-transparent"
          )}
        />
      ))}
      {totalReviews ? (
        <span className="ml-2 text-sm font-bold text-secondary-foreground">
          {totalReviews} reviews
        </span>
      ) : null}
    </div>
  );
};

export default Stars;
