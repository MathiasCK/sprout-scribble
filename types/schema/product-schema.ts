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

export const variantSchema = z.object({
  productId: z.number(),
  id: z.number().optional(),
  editMode: z.boolean(),
  productType: z.string().min(3, {
    message: "Product type should be at least 3 characters long",
  }),
  color: z.string().min(3, {
    message: "Color should be at least 3 characters long",
  }),
  variantTags: z.array(z.string()).min(1, {
    message: "At least one tag is required",
  }),
  variantImages: z.array(
    z.object({
      url: z.string().refine(url => url.search("blob:") !== 0, {
        message: "Please wait for the image to upload before saving.",
      }),
      size: z.number(),
      key: z.string().optional(),
      id: z.number().optional(),
      name: z.string(),
    }),
  ),
});
