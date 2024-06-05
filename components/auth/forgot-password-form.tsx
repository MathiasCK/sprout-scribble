"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { AuthCard, FormError, FormSuccess } from "~/components/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "~/types";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { forgotPassword } from "~/server/actions";

const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const { status, execute } = useAction(forgotPassword, {
    onSuccess: data => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) =>
    execute(values);

  return (
    <AuthCard
      cardTitle="Forgot your password?"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example@email.com"
                      type="email"
                      disabled={status === "executing"}
                      autoComplete="current-email"
                    />
                  </FormControl>{" "}
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
          </div>
          <Button
            type="submit"
            className={cn("w-full my-2", {
              "animate-pulse": status === "executing",
            })}
          >
            Reset password
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default ForgotPasswordForm;
