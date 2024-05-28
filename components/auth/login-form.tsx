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
import AuthCard from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "~/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {};
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
            <Button size="sm" variant="link" asChild>
              <Link href="/auth/reset">Forgot your password?</Link>
            </Button>
          </div>
          <Button type="submit" className="w-full my-2">
            Login
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginForm;
