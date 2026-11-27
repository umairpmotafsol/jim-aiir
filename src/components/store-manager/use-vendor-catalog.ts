"use client";

import { useMemo } from "react";
import { useVendorProducts, type VendorProductDraft } from "@/lib/store/vendor-products";
import { useOrders } from "@/lib/store/orders";
import type { Product } from "@/lib/types";

export function toDraft(p: Product): VendorProductDraft {
  return {
    id: p.id,
    vendor: p.vendor ?? "",
    name: p.name,
    regularPrice: p.regularPrice,
    salePrice: p.onSale ? p.price : null,
    stock: p.stock,
    categories: p.categories,
    description: p.description.join("\n\n"),
    image: p.images[0]?.src ?? null,
    status: "published",
  };
}

/**
 * The vendor's catalogue: seed products for the vendor merged with local edits
 * (MOCK, see lib/store/vendor-products). TODO(backend): fetch from the vendor products API.
 */
export function useVendorCatalog(seed: Product[], vendorSlug: string | undefined) {
  const drafts = useVendorProducts((s) => s.drafts);
  return useMemo(() => {
    if (!vendorSlug) return [];
    const base = seed.filter((p) => p.vendor === vendorSlug).map(toDraft);
    const merged = new Map(base.map((d) => [d.id, d]));
    for (const d of Object.values(drafts)) {
      if (d.vendor === vendorSlug) merged.set(d.id, d);
    }
    return [...merged.values()].filter((d) => !d.deleted).sort((a, b) => b.id - a.id);
  }, [seed, drafts, vendorSlug]);
}

/** Orders containing at least one of the vendor's products, with vendor-only totals. */
export function useVendorOrders(vendorSlug: string | undefined) {
  const orders = useOrders((s) => s.orders);
  return useMemo(() => {
    if (!vendorSlug) return [];
    return orders
      .map((o) => {
        const lines = o.lines.filter((l) => l.vendor === vendorSlug);
        return { ...o, vendorLines: lines, vendorTotal: lines.reduce((n, l) => n + l.price * l.quantity, 0) };
      })
      .filter((o) => o.vendorLines.length > 0);
  }, [orders, vendorSlug]);
}
