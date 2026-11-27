import Link from "next/link";
import { Price, Rating } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";
import { Media } from "@/components/ui/placeholder";
import { AddToCartButton, CompareButton, WishlistButton } from "./product-actions";
import { cn } from "@/lib/format";
import type { Product, Vendor } from "@/lib/types";

type Props = {
  product: Product;
  vendor?: Vendor | null;
  layout?: "grid" | "list";
  priority?: boolean;
};

function Cta({ product, compact }: { product: Product; compact?: boolean }) {
  if (product.purchasable) return <AddToCartButton product={product} compact={compact} className={compact ? "size-10 shrink-0 px-0" : undefined} />;
  return (
    <LinkButton href={`/product/${product.slug}`} variant="outline" size="sm">
      {product.type === "grouped" ? "View products" : "Read more"}
    </LinkButton>
  );
}

function SaleBadge() {
  return <span className="absolute left-3 top-3 rounded-md bg-accent-500 px-2.5 py-1 text-[11px] font-bold text-ink">Sale!</span>;
}

/** Clean product card: image, store, title, rating, price and one action. */
export function ProductCard({ product, vendor, layout = "grid", priority }: Props) {
  const image = product.images[0];
  const href = `/product/${product.slug}`;

  if (layout === "list") {
    return (
      <article className="grid grid-cols-[7rem_1fr] gap-5 rounded-lg border border-line bg-white p-3 transition-colors hover:border-slate-300 sm:grid-cols-[11rem_1fr]">
        <Link href={href} tabIndex={-1} aria-hidden className="relative aspect-square overflow-hidden rounded-lg">
          <Media src={image?.thumb} alt="" sizes="11rem" seed={product.name} />
          {product.onSale ? <SaleBadge /> : null}
        </Link>
        <div className="flex flex-col gap-2 py-1 pr-2">
          {vendor ? <StoreLine vendor={vendor} /> : null}
          <h3 className="text-base font-semibold">
            <Link href={href} className="hover:text-brand-700">
              {product.name}
            </Link>
          </h3>
          {product.description[0] ? <p className="line-clamp-2 text-sm text-muted">{product.description[0]}</p> : null}
          <Price price={product.price} regularPrice={product.regularPrice} onSale={product.onSale} />
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
            <Cta product={product} />
            <WishlistButton productId={product.id} name={product.name} />
            <CompareButton productId={product.id} name={product.name} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-colors hover:border-slate-300">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line">
        <Link href={href} tabIndex={-1} aria-hidden>
          <Media src={image?.thumb} alt="" priority={priority} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" seed={product.name} />
        </Link>
        {product.onSale ? <SaleBadge /> : null}
        <div className="absolute right-3 top-3 flex flex-col gap-2 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <WishlistButton productId={product.id} name={product.name} className="rounded-md bg-white p-2 shadow-md" />
          <CompareButton productId={product.id} name={product.name} className="rounded-md bg-white p-2 shadow-md" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {vendor ? <StoreLine vendor={vendor} /> : null}
        <h3 className="font-semibold leading-snug">
          <Link href={href} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        {product.reviewCount ? <Rating value={product.rating} count={product.reviewCount} /> : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <Price price={product.price} regularPrice={product.regularPrice} onSale={product.onSale} />
          <Cta product={product} compact />
        </div>
      </div>
    </article>
  );
}

function StoreLine({ vendor }: { vendor: Vendor }) {
  return (
    <p className="text-xs text-muted">
      Store:{" "}
      <Link href={`/store/${vendor.slug}`} className="font-medium text-brand-700 hover:underline">
        {vendor.name}
      </Link>
    </p>
  );
}

/** Compact horizontal card (deals, small lists). */
export function MiniProductCard({ product, className }: { product: Product; className?: string }) {
  const href = `/product/${product.slug}`;
  return (
    <article className={cn("flex items-center gap-4 rounded-lg border border-line bg-white p-3 transition-shadow hover:shadow-card", className)}>
      <Link href={href} tabIndex={-1} aria-hidden className="relative size-16 shrink-0 overflow-hidden rounded-md">
        <Media src={product.images[0]?.thumb} alt="" sizes="4rem" seed={product.name} size="sm" />
      </Link>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold">
          <Link href={href} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} regularPrice={product.regularPrice} onSale={product.onSale} className="mt-0.5 text-sm" />
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
