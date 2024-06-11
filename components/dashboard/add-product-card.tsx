"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { productSchema } from "~/types";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { DollarSignIcon } from "lucide-react";
import { Tiptap } from "~/components/dashboard";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "~/server/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddProductCard = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onBlur",
  });

  const { execute, status } = useAction(createProduct, {
    onSuccess: data => {
      if (data?.success) {
        router.push("/dashboard/products");
        toast.success(data.success);
      }

      if (data?.error) {
        toast.error(data.error);
      }
    },
    onExecute: () => {
      toast.loading("Creating product...");
    },
    onError: error => {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    },
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => execute(values);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Product</CardTitle>
        <CardDescription>Add a new product to the store</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Saekdong Stripe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap content={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSignIcon
                        size={32}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="Your price in USD"
                        step="0.1"
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              disabled={status === "executing"}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default AddProductCard;
