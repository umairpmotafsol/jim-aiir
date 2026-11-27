"use client";


import { Media } from "@/components/ui/placeholder";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ClipboardList, DollarSign, Package, PlusCircle, TrendingUp } from "lucide-react";
import { useCurrentUser } from "@/lib/store/auth";
import { orderStatusLabel } from "@/lib/store/orders";
import { LinkButton } from "@/components/ui/button";
import { Notice } from "@/components/ui/misc";
import { formatDate, formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useVendorCatalog, useVendorOrders } from "./use-vendor-catalog";

export function StoreOverview({ seed }: { seed: Product[] }) {
  const user = useCurrentUser();
  const welcome = useSearchParams().get("welcome") === "1";
  const products = useVendorCatalog(seed, user?.vendorSlug);
  const orders = useVendorOrders(user?.vendorSlug);
  if (!user) return null;

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.vendorTotal, 0);
  const open = orders.filter((o) => o.status === "processing" || o.status === "pending").length;
  const unitsSold = new Map<number, number>();
  for (const o of orders) for (const l of o.vendorLines) unitsSold.set(l.productId, (unitsSold.get(l.productId) ?? 0) + l.quantity);

  const kpis = [
    { label: "Revenue", value: formatMoney(revenue), icon: DollarSign },
    { label: "Orders", value: orders.length, icon: ClipboardList },
    { label: "Awaiting fulfilment", value: open, icon: TrendingUp },
    { label: "Products", value: products.length, icon: Package },
  ];

  return (
    <div className="space-y-6">
      {welcome ? <Notice tone="success">Welcome to AIIR! Your store has been created. Add your first product to get started.</Notice> : null}

      <section className="rounded-lg bg-ink p-8 text-white sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">Store overview</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">Hello, {user.firstName || user.displayName}</h2>
        <p className="mt-2 max-w-lg text-white/85">Here&apos;s how {user.storeName ?? "your store"} is doing. Keep your catalogue fresh to reach more buyers.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton href="/store-manager/products/new" variant="light">
            <PlusCircle className="size-4" aria-hidden /> Add product
          </LinkButton>
          <LinkButton href="/store-manager/orders" variant="glass">
            View orders
          </LinkButton>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className={`grid size-11 place-items-center rounded-md bg-brand-50 text-brand-700`}>
              <Icon className="size-5" aria-hidden />
            </div>
            <p className="mt-4 text-2xl font-extrabold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-bold">Recent orders</h2>
            <Link href="/store-manager/orders" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              All orders <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {orders.length ? (
            <ul className="divide-y divide-line">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-4 px-6 py-4 text-sm">
                  <div>
                    <p className="font-semibold">#{o.number}</p>
                    <p className="text-xs text-muted">
                      {formatDate(o.createdAt)} · {o.billing.firstName} {o.billing.lastName}
                    </p>
                  </div>
                  <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{orderStatusLabel[o.status]}</span>
                  <span className="font-semibold">{formatMoney(o.vendorTotal)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center text-sm text-muted">
              No orders yet. Orders that include your products will show up here.
            </div>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-bold">Your products</h2>
            <Link href="/store-manager/products" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              Manage <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {products.length ? (
            <ul className="divide-y divide-line">
              {products.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-6 py-3">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface">
                    <Media src={p.image} alt="" sizes="3rem" seed={p.name} size="sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted">{unitsSold.get(p.id) ?? 0} sold</p>
                  </div>
                  <span className="text-sm font-semibold">{formatMoney(p.salePrice ?? p.regularPrice)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center text-sm text-muted">You haven&apos;t added any products yet.</div>
          )}
        </section>
      </div>
    </div>
  );
}
