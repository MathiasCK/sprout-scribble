import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email adress",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const registerSchema = loginSchema
  .extend({
    passwordConfirm: z.string().min(1, {
      message: "Password confirmation is required",
    }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters long",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        path: ["passwordConfirm"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });
