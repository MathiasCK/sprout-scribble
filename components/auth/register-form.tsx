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
import { registerSchema } from "~/types";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { emailRegister } from "~/server/actions";

const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const { status, execute } = useAction(emailRegister, {
    onSuccess: data => {
      if (data.error) {
        setError(data.error);
      }
      setSuccess(data.success!);
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => execute(values);

  return (
    <AuthCard
      cardTitle="Create an account 🎉"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      type="name"
                      autoComplete="name"
                    />
                  </FormControl>{" "}
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      autoComplete="current-passwprd"
                    />
                  </FormControl>{" "}
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button
            type="submit"
            className={cn("w-full my-2", {
              "animate-pulse": status === "executing",
            })}
          >
            Register
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default RegisterForm;
