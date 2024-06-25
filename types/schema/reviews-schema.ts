import * as z from "zod";

export const reviewsSchema = z.object({
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1 star" })
    .max(5, { message: "Rating must be at most 5 stars" }),
  comment: z.string().min(10, {
    message: "Comment should be at least 10 characters long",
  }),
  productId: z.number(),
});
