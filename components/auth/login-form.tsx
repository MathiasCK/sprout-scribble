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
import { loginSchema } from "~/types";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { emailSignIn } from "~/server/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const router = useRouter();

  const { status, execute } = useAction(emailSignIn, {
    onSuccess: data => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
        router.push("/");
      }
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => execute(values);

  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials
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
                      autoComplete="email"
                    />
                  </FormControl>{" "}
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      autoComplete="current-passwprd"
                    />
                  </FormControl>{" "}
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button size="sm" variant="link" asChild>
              <Link href="/auth/reset">Forgot your password?</Link>
            </Button>
          </div>
          <Button
            type="submit"
            className={cn("w-full my-2", {
              "animate-pulse": status === "executing",
            })}
          >
            Login
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginForm;
