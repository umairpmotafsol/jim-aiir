"use client";

import { Media } from "@/components/ui/placeholder";
import Link from "next/link";
import { ArrowRightLeft, X } from "lucide-react";
import { useCompare, useWishlist } from "@/lib/store/lists";
import { useHydrated } from "@/lib/store/hydration";
import { EmptyState, Price, Rating, Skeleton } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";
import { AddToCartButton } from "./product-actions";
import type { Category, Product, Vendor } from "@/lib/types";

export function WishlistView({ products, vendors }: { products: Product[]; vendors: Vendor[] }) {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  if (!hydrated) return <Skeleton className="h-64" />;
  const items = ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p);

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Product name</th>
            <th scope="col" className="px-5 py-3 font-semibold">Unit price</th>
            <th scope="col" className="px-5 py-3 font-semibold">Stock status</th>
            <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.length ? null : (
            <tr>
              <td colSpan={4} className="px-5 py-8 text-center text-muted">
                No products added to the wishlist
              </td>
            </tr>
          )}
          {items.map((p) => {
            const vendor = vendors.find((v) => v.slug === p.vendor);
            return (
              <tr key={p.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                      <Media src={p.images[0].thumb} alt="" sizes="4rem" seed={p.name} size="sm" />
                    </div>
                    <div>
                      <Link href={`/product/${p.slug}`} className="font-semibold hover:text-brand-700">
                        {p.name}
                      </Link>
                      {vendor ? <p className="text-xs text-muted">Store: {vendor.name}</p> : null}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {p.purchasable ? <Price price={p.price} regularPrice={p.regularPrice} onSale={p.onSale} /> : <span className="text-muted">—</span>}
                </td>
                <td className="px-5 py-4">
                  {p.inStock ? <span className="font-medium text-emerald-700">In stock</span> : <span className="font-medium text-red-600">Out of stock</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-3">
                    {p.purchasable ? <AddToCartButton product={p} /> : <LinkButton href={`/product/${p.slug}`} variant="outline" size="sm">View</LinkButton>}
                    <button type="button" onClick={() => remove(p.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${p.name} from wishlist`}>
                      <X className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CompareView({ products, vendors, categories }: { products: Product[]; vendors: Vendor[]; categories: Category[] }) {
  const hydrated = useHydrated();
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  if (!hydrated) return <Skeleton className="h-64" />;
  const items = ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p);

  if (!items.length) {
    return (
      <EmptyState icon={<ArrowRightLeft className="size-7" />} title="No products to compare" action={<LinkButton href="/shop">Browse products</LinkButton>}>
        Use the compare button on up to four products to see them side by side.
      </EmptyState>
    );
  }

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: "Price", render: (p) => (p.purchasable ? <Price price={p.price} regularPrice={p.regularPrice} onSale={p.onSale} /> : "—") },
    { label: "Rating", render: (p) => (p.reviewCount ? <Rating value={p.rating} count={p.reviewCount} /> : "No reviews") },
    { label: "Availability", render: (p) => (p.inStock ? (p.stock !== null ? `${p.stock} in stock` : "In stock") : "Out of stock") },
    { label: "Vendor", render: (p) => vendors.find((v) => v.slug === p.vendor)?.name ?? "AIIR" },
    { label: "Categories", render: (p) => p.categories.map((c) => categories.find((x) => x.slug === c)?.name ?? c).join(", ") },
    { label: "Description", render: (p) => <span className="line-clamp-4">{p.description[0] ?? "—"}</span> },
    { label: "", render: (p) => (p.purchasable ? <AddToCartButton product={p} /> : null) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={clear} className="text-sm font-semibold text-red-600 hover:underline">
          Clear all
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[40rem] table-fixed text-sm">
          <thead>
            <tr>
              <th scope="col" className="w-36 bg-surface px-4 py-3 text-left text-xs uppercase tracking-wider text-muted">Product</th>
              {items.map((p) => (
                <th key={p.id} scope="col" className="px-4 py-4 text-left align-top font-normal">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-surface">
                    <Media src={p.images[0].src} alt="" sizes="15rem" seed={p.name} />
                    <button type="button" onClick={() => remove(p.id)} className="absolute right-2 top-2 rounded-md bg-white p-1.5 shadow" aria-label={`Remove ${p.name} from compare`}>
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <Link href={`/product/${p.slug}`} className="font-semibold hover:text-brand-700">
                    {p.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.label || "actions"}>
                <th scope="row" className="bg-surface px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  {row.label}
                </th>
                {items.map((p) => (
                  <td key={p.id} className="px-4 py-3 align-top text-slate-700">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
