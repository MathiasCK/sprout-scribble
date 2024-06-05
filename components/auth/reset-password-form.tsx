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
import { resetPasswordSchema } from "~/types";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { resetPassword } from "~/server/actions";
import { useSearchParams } from "next/navigation";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const { status, execute } = useAction(resetPassword, {
    onSuccess: data => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) =>
    execute({ ...values, token });

  return (
    <AuthCard
      cardTitle="Enter a new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="*********"
                      type="password"
                      disabled={status === "executing"}
                      autoComplete="current-password"
                    />
                  </FormControl>{" "}
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="*********"
                      type="password"
                      disabled={status === "executing"}
                      autoComplete="current-password"
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

export default ResetPasswordForm;
