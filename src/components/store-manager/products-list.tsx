"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageOff, Package, Pencil, PlusCircle, Search, Trash2 } from "lucide-react";
import { useCurrentUser } from "@/lib/store/auth";
import { useVendorProducts, type VendorProductDraft } from "@/lib/store/vendor-products";
import { toast } from "@/lib/store/toast";
import { LinkButton } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/misc";
import { cn, formatMoney } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { useVendorCatalog } from "./use-vendor-catalog";

const statusStyle: Record<VendorProductDraft["status"], string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-slate-100 text-slate-600",
  pending: "bg-amber-50 text-amber-700",
};

export function ProductsList({ seed, categories }: { seed: Product[]; categories: Category[] }) {
  const user = useCurrentUser();
  const products = useVendorCatalog(seed, user?.vendorSlug);
  const remove = useVendorProducts((s) => s.remove);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | VendorProductDraft["status"]>("all");
  const [pendingDelete, setPendingDelete] = useState<VendorProductDraft | null>(null);

  const shown = products.filter(
    (p) => (status === "all" || p.status === status) && p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">Products</h2>
          <p className="text-sm text-muted">{products.length} product{products.length === 1 ? "" : "s"} in your store</p>
        </div>
        <LinkButton href="/store-manager/products/new">
          <PlusCircle className="size-4" aria-hidden /> Add product
        </LinkButton>
      </div>

      {products.length ? (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
            <label className="relative min-w-56 flex-1">
              <span className="sr-only">Search products</span>
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your products"
                className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
              />
            </label>
            <div className="flex gap-1 rounded-xl bg-surface p-1" role="group" aria-label="Filter by status">
              {(["all", "published", "draft"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={status === s}
                  onClick={() => setStatus(s)}
                  className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold capitalize", status === s ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-ink")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Product</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Price</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Stock</th>
                  <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-4">
                        <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface text-slate-300">
                          {p.image ? <Image src={p.image} alt="" fill sizes="3.5rem" className="object-cover" /> : <ImageOff className="size-5" aria-hidden />}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold">{p.name}</p>
                          <p className="truncate text-xs text-muted">{p.categories.map(catName).join(", ") || "Uncategorised"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", statusStyle[p.status])}>{p.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      {p.salePrice !== null ? (
                        <>
                          <span className="font-semibold">{formatMoney(p.salePrice)}</span>{" "}
                          <span className="text-xs text-slate-400 line-through">{formatMoney(p.regularPrice)}</span>
                        </>
                      ) : (
                        <span className="font-semibold">{formatMoney(p.regularPrice)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">{p.stock === null ? <span className="text-muted">Not tracked</span> : p.stock}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/store-manager/products/edit?id=${p.id}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-700"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(p)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!shown.length ? <p className="px-5 py-10 text-center text-sm text-muted">No products match your filters.</p> : null}
          </div>
        </div>
      ) : (
        <EmptyState icon={<Package className="size-7" />} title="Add your first product" action={<LinkButton href="/store-manager/products/new">Add product</LinkButton>}>
          Products you add appear on your storefront and in the AIIR shop.
        </EmptyState>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete “${pendingDelete?.name ?? ""}”?`}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove(pendingDelete);
            toast.success(`${pendingDelete.name} was deleted.`);
          }
          setPendingDelete(null);
        }}
      >
        The product will be removed from your store and the shop. This can&apos;t be undone.
      </ConfirmDialog>
    </div>
  );
}
