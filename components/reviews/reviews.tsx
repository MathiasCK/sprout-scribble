import { desc, eq } from "drizzle-orm";
import { ProductReviews, ReviewChart, ReviewsForm } from "~/components/reviews";
import db from "~/server";
import { reviews } from "~/server/schema";

const Reviews = async ({ productId }: { productId: number }) => {
  const productReviews = await db.query.reviews.findMany({
    with: { user: true },
    where: eq(reviews.productId, productId),
    orderBy: [desc(reviews.created)],
  });

  return (
    <section className="py-4">
      <div className="flex flex-col justify-stretch gap-2 lg:flex-row lg:gap-12">
        <div className="flex-1">
          <h2 className="mb-4 text-2xl font-bold">Product Reviews</h2>
          <ReviewsForm />
          <ProductReviews reviews={productReviews} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <ReviewChart reviews={productReviews} />
        </div>
      </div>
    </section>
  );
};

export default Reviews;
