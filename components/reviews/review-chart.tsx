"use client";

import { ReviewsWithUser } from "~/lib/infer-type";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { getReviewAverage } from "~/lib/utils";
import { useMemo } from "react";

const ReviewChart = ({ reviews }: { reviews: ReviewsWithUser[] }) => {
  const getRatingsByStars = useMemo(() => {
    const ratingValues = Array.from({ length: 5 }, () => 0);
    for (const review of reviews) {
      const starIndex = review.rating - 1;

      if (starIndex >= 0 && starIndex < 5) {
        ratingValues[starIndex]++;
      }
    }

    return ratingValues.map(rating => (rating / reviews.length) * 100);
  }, [reviews]);

  const totalRating = getReviewAverage(reviews.map(r => r.rating));
  return (
    <Card className="flex flex-col gap-4 rounded-md p-8">
      <div className="flex flex-col gap-2">
        <CardTitle>Product Rating:</CardTitle>
        <CardDescription className="text-lg font-medium">
          {totalRating.toFixed(1)} stars
        </CardDescription>
      </div>
      {getRatingsByStars.map((rating, index) => (
        <div key={index} className="flex items-center justify-between gap-2">
          <p className="flex gap-1 text-xs font-medium">
            {index + 1}
            <span> stars</span>
          </p>
          <Progress value={rating} />
        </div>
      ))}
    </Card>
  );
};

export default ReviewChart;
