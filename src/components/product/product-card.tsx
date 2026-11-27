import Image from "next/image";
import Link from "next/link";
import { Price, Rating } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";
import { AddToCartButton, CompareButton, WishlistButton } from "./product-actions";
import { discountPercent } from "@/lib/format";
import type { Product, Vendor } from "@/lib/types";

type Props = { product: Product; vendor?: Vendor | null; layout?: "grid" | "list"; priority?: boolean };

export function ProductCard({ product, vendor, layout = "grid", priority }: Props) {
  const image = product.images[0];
  const href = `/product/${product.slug}`;
  const off = product.onSale ? discountPercent(product.regularPrice, product.price) : 0;
  const isList = layout === "list";

  const cta = product.purchasable ? (
    <AddToCartButton product={product} />
  ) : (
    <LinkButton href={href} variant="outline" size="sm">
      {product.type === "grouped" ? "View products" : "View details"}
    </LinkButton>
  );

  return (
    <article
      className={
        isList
          ? "group grid grid-cols-[8rem_1fr] gap-4 rounded-2xl border border-line bg-white p-3 shadow-card transition-all duration-300 hover:border-brand-200 hover:shadow-lift sm:grid-cols-[13rem_1fr] sm:gap-6"
          : "group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
      }
    >
      <div className={isList ? "relative aspect-square overflow-hidden rounded-xl bg-surface" : "relative m-2 mb-0 aspect-[5/4] overflow-hidden rounded-xl bg-surface"}>
        <Link href={href} tabIndex={-1} aria-hidden>
          {image ? (
            <Image
              src={image.src}
              alt=""
              fill
              priority={priority}
              sizes={isList ? "(min-width: 640px) 12rem, 8rem" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          ) : null}
        </Link>
        {off > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">-{off}%</span>
        ) : null}
        {!isList ? (
          <div className="absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 sm:translate-x-2 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-x-0 sm:group-focus-within:opacity-100">
            <WishlistButton productId={product.id} name={product.name} className="rounded-full bg-white/95 p-2 shadow-md backdrop-blur" />
            <CompareButton productId={product.id} name={product.name} className="rounded-full bg-white/95 p-2 shadow-md backdrop-blur" />
          </div>
        ) : null}
      </div>

      <div className={isList ? "flex flex-col py-1 pr-2" : "flex flex-1 flex-col p-4"}>
        {vendor ? (
          <Link href={`/store/${vendor.slug}`} className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 hover:underline">
            {vendor.name}
          </Link>
        ) : (
          <span className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Sold by AIIR</span>
        )}
        <h3 className="text-[15px] font-bold leading-snug">
          <Link href={href} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        {product.reviewCount > 0 ? <Rating value={product.rating} count={product.reviewCount} className="mt-1.5" /> : null}
        {isList && product.description[0] ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted">{product.description[0]}</p>
        ) : null}
        <div className="min-h-4 flex-1" aria-hidden />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-3.5">
          <Price price={product.price} regularPrice={product.regularPrice} onSale={product.onSale} />
          <div className="flex items-center gap-3">
            {isList ? (
              <>
                <WishlistButton productId={product.id} name={product.name} />
                <CompareButton productId={product.id} name={product.name} />
              </>
            ) : null}
            {cta}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  vendors,
  layout = "grid",
  columns = 4,
}: {
  products: Product[];
  vendors: Vendor[];
  layout?: "grid" | "list";
  columns?: 3 | 4;
}) {
  const bySlug = new Map(vendors.map((v) => [v.slug, v]));
  if (layout === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} vendor={p.vendor ? bySlug.get(p.vendor) : null} layout="list" />
        ))}
      </div>
    );
  }
  return (
    <div
      className={
        columns === 3
          ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} vendor={p.vendor ? bySlug.get(p.vendor) : null} priority={i < 4} />
      ))}
    </div>
  );
}
