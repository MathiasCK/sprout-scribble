import * as z from "zod";

export const productSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: "Title should be at least 5 characters long",
  }),
  description: z.string().min(10, {
    message: "Description should be at least 10 characters long",
  }),
  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive({
      message: "Price should be a positive number",
    }),
});
