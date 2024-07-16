import { desc, eq } from "drizzle-orm";
import {
  ProductCarousel,
  ProductPick,
  ProductType,
} from "~/components/products";
import db from "~/server";
import { productVariants } from "~/server/schema";
import { Separator } from "~/components/ui/separator";
import { formatPrice, getReviewAverage } from "~/lib/utils";
import { Reviews, Stars } from "~/components/reviews";
import { CartAdder } from "~/components/cart";

export const revalidate = 60;

export const generateStaticParams = async () => {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: productVariants => [desc(productVariants.id)],
  });

  if (data) {
    const slugIds = data.map(variant => ({
      slug: variant.id.toString(),
    }));
    return slugIds;
  }

  return [];
};

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          reviews: true,
          variants: {
            with: {
              variantImages: true,
              variantTags: true,
              product: true,
            },
          },
        },
      },
    },
  });

  if (variant) {
    const reviewAvg = getReviewAverage(
      variant?.product.reviews.map(r => r.rating)
    );

    return (
      <main>
        <section className="flex flex-col gap-4 lg:flex-row lg:gap-12">
          <div className="flex-1">
            <ProductCarousel variants={variant.product.variants} />
          </div>
          <div className="flex flex-1 flex-col">
            <h2 className="text-2xl font-bold">{variant?.product.title}</h2>
            <div>
              <ProductType variants={variant.product.variants} />
              <Stars
                rating={reviewAvg}
                totalReviews={variant.product.reviews.length}
              />
            </div>
            <Separator className="my-2" />
            <p className="py-2 text-2xl font-medium">
              {formatPrice(variant.product.price)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>

            <p className="my-2 font-medium text-secondary-foreground">
              Available colors
            </p>
            <div className="flex gap-4">
              {variant.product.variants.map(v => (
                <ProductPick
                  key={v.id}
                  id={v.id}
                  color={v.color}
                  productType={v.productType}
                  title={v.product.title}
                  price={variant.product.price}
                  productId={variant.productId}
                  image={v.variantImages[0].url}
                />
              ))}
            </div>
            <CartAdder />
          </div>
        </section>
        <Reviews productId={variant.productId} />
      </main>
    );
  }
};

export default ProductPage;
