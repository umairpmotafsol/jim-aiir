"use client";

import { Media } from "@/components/ui/placeholder";
import { useState } from "react";
import { ChevronDown, ClipboardList } from "lucide-react";
import { useCurrentUser } from "@/lib/store/auth";
import { orderStatusLabel, useOrders, type OrderStatus } from "@/lib/store/orders";
import { toast } from "@/lib/store/toast";
import { EmptyState } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";
import { cn, formatDate, formatMoney } from "@/lib/format";
import { countries } from "@/lib/config";
import { useVendorOrders } from "./use-vendor-catalog";

const statusTone: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-brand-50 text-brand-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-600",
};

export function VendorOrders() {
  const user = useCurrentUser();
  const orders = useVendorOrders(user?.vendorSlug);
  const setStatus = useOrders((s) => s.setStatus);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold">Orders</h2>
        <p className="text-sm text-muted">Orders that include products from your store.</p>
      </div>

      {orders.length ? (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {(["all", "processing", "completed", "cancelled"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={filter === s}
                onClick={() => setFilter(s)}
                className={cn(
                  "rounded-md border px-4 py-1.5 text-sm font-semibold",
                  filter === s ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-slate-600 hover:border-brand-300",
                )}
              >
                {s === "all" ? "All" : orderStatusLabel[s]} ({s === "all" ? orders.length : orders.filter((o) => o.status === s).length})
              </button>
            ))}
          </div>

          <ul className="space-y-4">
            {shown.map((o) => {
              const open = openId === o.id;
              return (
                <li key={o.id} className="card overflow-hidden">
                  <div className="flex flex-wrap items-center gap-4 p-5">
                    <div className="min-w-32">
                      <p className="font-bold">Order #{o.number}</p>
                      <p className="text-xs text-muted">{formatDate(o.createdAt)}</p>
                    </div>
                    <div className="min-w-40 flex-1 text-sm">
                      <p className="font-medium">
                        {o.billing.firstName} {o.billing.lastName}
                      </p>
                      <p className="text-xs text-muted">{o.email}</p>
                    </div>
                    <p className="text-sm font-bold">{formatMoney(o.vendorTotal)}</p>
                    <label className="sr-only" htmlFor={`status-${o.id}`}>
                      Status for order {o.number}
                    </label>
                    <select
                      id={`status-${o.id}`}
                      value={o.status}
                      onChange={(e) => {
                        const next = e.target.value as OrderStatus;
                        setStatus(o.id, next);
                        toast.success(`Order #${o.number} marked as ${orderStatusLabel[next].toLowerCase()}.`);
                      }}
                      className={cn("h-9 rounded-md border-0 px-3 text-xs font-semibold focus:ring-4 focus:ring-brand-100", statusTone[o.status])}
                    >
                      {(Object.keys(orderStatusLabel) as OrderStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {orderStatusLabel[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : o.id)}
                      aria-expanded={open}
                      aria-controls={`order-${o.id}`}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      Details <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
                    </button>
                  </div>
                  {open ? (
                    <div id={`order-${o.id}`} className="grid gap-6 border-t border-line bg-surface p-5 md:grid-cols-[1fr_16rem]">
                      <ul className="space-y-3">
                        {o.vendorLines.map((l) => (
                          <li key={l.productId} className="flex items-center gap-4 rounded-md bg-white p-3">
                            <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                              <Media src={l.image} alt="" sizes="3rem" seed={l.name} size="sm" />
                            </span>
                            <span className="flex-1 text-sm font-semibold">
                              {l.name} <span className="font-normal text-muted">× {l.quantity}</span>
                            </span>
                            <span className="text-sm font-semibold">{formatMoney(l.price * l.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-sm">
                        <p className="font-semibold">Ship to</p>
                        <address className="mt-1 not-italic leading-6 text-slate-600">
                          {o.shipping.firstName} {o.shipping.lastName}
                          <br />
                          {o.shipping.address1}
                          <br />
                          {o.shipping.city} {o.shipping.postcode}
                          <br />
                          {countries.find((c) => c.code === o.shipping.country)?.name ?? o.shipping.country}
                        </address>
                        <p className="mt-3 text-xs text-muted">
                          {o.shippingMethod} · {o.paymentMethod}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <EmptyState icon={<ClipboardList className="size-7" />} title="No orders yet" action={<LinkButton href={user?.vendorSlug ? `/store/${user.vendorSlug}` : "/shop"}>View your storefront</LinkButton>}>
          When customers buy your products, their orders will appear here so you can fulfil them.
        </EmptyState>
      )}
    </div>
  );
}
