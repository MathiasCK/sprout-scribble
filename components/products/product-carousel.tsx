"use client";

import { VariantsWithImagesTags } from "~/lib/infer-type";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { cn } from "~/lib/utils";

const ProductCarousel = ({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || variants[0].productType;

  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("slidesInView", e => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          variant =>
            variant.productType === selectedType &&
            variant.variantImages.map(img => {
              return (
                <CarouselItem key={img.url}>
                  {img.url ? (
                    <Image
                      priority
                      className="rounded-md"
                      width={1280}
                      height={720}
                      src={img.url}
                      alt={img.name}
                    />
                  ) : null}
                </CarouselItem>
              );
            })
        )}
      </CarouselContent>
      <div className="flex gap-4 overflow-clip py-2">
        {variants.map(
          variant =>
            variant.productType === selectedType &&
            variant.variantImages.map((img, index) => {
              return (
                <div key={img.url}>
                  {img.url ? (
                    <Image
                      onClick={() => updatePreview(index)}
                      priority
                      className={cn(
                        index === activeThumbnail[0]
                          ? "opacity-100"
                          : "opacity-75",
                        "cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:opacity-75"
                      )}
                      width={72}
                      height={48}
                      src={img.url}
                      alt={img.name}
                    />
                  ) : null}
                </div>
              );
            })
        )}
      </div>
    </Carousel>
  );
};

export default ProductCarousel;
