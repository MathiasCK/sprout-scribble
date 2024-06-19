"use server";

import { createSafeActionClient } from "next-safe-action";
import { variantSchema } from "~/types";
import db from "~/server";
import {
  productVariants,
  variantTags as tags,
  variantImages as images,
  products,
} from "~/server/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import algoliaSearch from "algoliasearch";

const action = createSafeActionClient();

const algoliaClient = algoliaSearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIOA_ADMIN_KEY as string,
);

const algoliaIndex = algoliaClient.initIndex("products");

export const handleVariant = action(
  variantSchema,
  async ({
    color,
    editMode,
    id,
    productId,
    productType,
    variantImages,
    variantTags,
  }) => {
    try {
      if (editMode && id) {
        const editVariant = await db
          .update(productVariants)
          .set({
            color,
            productType,
            updated: new Date(),
          })
          .where(eq(productVariants.id, id))
          .returning();

        await db.delete(tags).where(eq(tags.variantId, editVariant[0].id));
        await db.insert(tags).values(
          variantTags.map(tag => ({
            tag,
            variantId: editVariant[0].id,
          })),
        );

        await db.delete(images).where(eq(images.variantId, editVariant[0].id));
        await db.insert(images).values(
          variantImages.map((img, idx) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantId: editVariant[0].id,
            order: idx,
          })),
        );

        algoliaIndex.partialUpdateObject({
          objectID: editVariant[0].id.toString(),
          productId: editVariant[0].productId,
          productType: editVariant[0].productType,
          variantImages: variantImages[0].url,
        });

        revalidatePath("/dashboard/products");
        return { success: `Edited ${productType} variant` };
      }

      const newVariant = await db
        .insert(productVariants)
        .values({
          color,
          productType,
          productId,
        })
        .returning();

      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
      });

      await db.insert(tags).values(
        variantTags.map(tag => ({
          tag,
          variantId: newVariant[0].id,
        })),
      );

      await db.insert(images).values(
        variantImages.map((img, idx) => ({
          name: img.name,
          size: img.size,
          url: img.url,
          variantId: newVariant[0].id,
          order: idx,
        })),
      );

      if (product) {
        algoliaIndex.saveObject({
          objectID: newVariant[0].id.toString(),
          productId: newVariant[0].productId,
          title: product.title,
          price: product.price,
          productType: newVariant[0].productType,
          variantImages: variantImages[0].url,
        });
      }

      revalidatePath("/dashboard/products");
      return { success: `Created ${productType} variant` };
    } catch (error) {
      return {
        error: "An error occurred when creating variant",
      };
    }
  },
);

export const deleteVariant = action(
  z.object({
    id: z.number(),
  }),
  async ({ id }) => {
    try {
      if (!id) return { error: "Variant is missing id" };

      const currentVariant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, id),
      });

      if (!currentVariant) {
        return {
          error: "Variant not found",
        };
      }

      await db.delete(productVariants).where(eq(productVariants.id, id));

      algoliaIndex.deleteObject(currentVariant.id.toString());

      revalidatePath("/dashboard/products");

      return {
        success: `Variant "${currentVariant.productType}" has been deleted`,
      };
    } catch (error) {
      return {
        error: "An error occurred when deleting variant",
      };
    }
  },
);
