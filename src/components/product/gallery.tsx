"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/format";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  if (!current) {
    return <div className="aspect-square rounded-2xl bg-surface" aria-label="No image available" />;
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
        <Image
          src={current.src}
          alt={current.alt || name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-3" role="group" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 bg-surface",
                i === index ? "border-brand-600" : "border-transparent hover:border-brand-300",
              )}
            >
              <Image src={img.thumb} alt="" fill sizes="6rem" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
