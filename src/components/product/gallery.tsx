"use client";

import { useState } from "react";
import { Media } from "@/components/ui/placeholder";
import { cn } from "@/lib/format";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-surface">
        <Media
          src={current?.src}
          alt={current?.alt || name}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          seed={`${name}-${index}`}
          label={name}
          size="lg"
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-3" role="group" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border-2 bg-surface transition-colors",
                i === index ? "border-brand-600" : "border-transparent hover:border-brand-300",
              )}
            >
              <Media src={img.thumb} alt="" sizes="6rem" seed={`${name}-${i}`} size="sm" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
