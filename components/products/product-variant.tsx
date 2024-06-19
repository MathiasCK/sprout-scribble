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
import { VariantTags, VariantImages } from "~/components/products";
import { deleteVariant, handleVariant } from "~/server/actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

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
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
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

  const setEdit = useCallback(() => {
    if (!editMode) {
      form.reset();
      return;
    }

    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("productId", variant.productId);
      form.setValue("productType", variant.productType);
      form.setValue(
        "variantTags",
        variant.variantTags.map(tag => tag.tag),
      );
      form.setValue("color", variant.color);
      form.setValue(
        "variantImages",
        variant.variantImages.map(img => ({
          name: img.name,
          size: img.size,
          url: img.url,
        })),
      );
    }
  }, [editMode, variant, form]);

  useEffect(() => {
    setEdit();
  }, [setEdit]);

  const { execute: handleExecute, status: handleStatus } = useAction(
    handleVariant,
    {
      onExecute: () => {
        toast.loading("Processing variant...", {
          duration: 2000,
        });
      },
      onSuccess: data => {
        if (data?.success) {
          toast.success(data.success);
          setDialogOpen(false);
        }
        if (data?.error) {
          toast.error(data.error);
        }
      },
    },
  );

  const { execute: handleDelete, status: deleteStatus } = useAction(
    deleteVariant,
    {
      onExecute: () => {
        toast.loading("Deleting variant...", {
          duration: 2000,
        });
      },
      onSuccess: data => {
        if (data?.success) {
          toast.success(data.success);
          setDialogOpen(false);
          form.reset();
        }
        if (data?.error) {
          toast.error(data.error);
        }
      },
    },
  );

  const onSubmit = (values: z.infer<typeof variantSchema>) =>
    handleExecute(values);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px] rounded-md">
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
                    <VariantTags {...field} onChange={e => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <div className="flex gap-4 items-center justify-center">
              {editMode && variant && (
                <Button
                  disabled={deleteStatus === "executing"}
                  variant="destructive"
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    handleDelete({ id: variant.id });
                  }}
                >
                  Delete variant
                </Button>
              )}
              <Button
                type="submit"
                disabled={
                  handleStatus === "executing" ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
              >
                {editMode ? "Update variant" : "Create variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductVariant;
