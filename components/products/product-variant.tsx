"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { VariantsWithImagesTags } from "~/lib/infer-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantSchema } from "~/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ProductVariantTags } from "~/components/products";

const ProductVariant = ({
  editMode,
  productId,
  variant,
  children,
}: {
  editMode?: boolean;
  productId?: number;
  variant?: VariantsWithImagesTags;
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      variantTags: [],
      variantImages: [],
      color: "#000000",
      editMode,
      id: undefined,
      productId,
      productType: "",
    },
  });

  const onSubmit = (values: z.infer<typeof variantSchema>) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images, and
            more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a title for your variant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variantTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant tags</FormLabel>
                  <FormControl>
                    <ProductVariantTags
                      {...field}
                      onChange={e => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <VariantImages /> */}
            {editMode && variant && (
              <Button type="button" onClick={e => e.preventDefault()}>
                Delete variant
              </Button>
            )}
            <Button type="submit">
              {editMode ? "Update variant" : "Create variant"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductVariant;
