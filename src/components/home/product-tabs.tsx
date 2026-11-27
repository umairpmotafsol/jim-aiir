"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/product/product-card";
import { cn } from "@/lib/format";
import type { Product, Vendor } from "@/lib/types";

type Tab = { id: string; label: string; products: Product[] };

export function ProductTabs({ tabs, vendors }: { tabs: Tab[]; vendors: Vendor[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" aria-label="Featured products" className="mb-8 inline-flex flex-wrap gap-1 rounded-2xl border border-line bg-white p-1.5 shadow-card">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={t.id === current.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
              t.id === current.id ? "bg-brand-600 text-white shadow-md" : "text-slate-600 hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
        <ProductGrid products={current.products} vendors={vendors} />
      </div>
    </div>
  );
}
