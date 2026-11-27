"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart, computeTotals } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/hydration";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";
import { CouponForm, ShippingOptions, TotalsRows } from "./order-summary";
import { formatMoney } from "@/lib/format";

export function CartView() {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.couponCode);
  const method = useCart((s) => s.shippingMethod);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const totals = computeTotals(lines, coupon, method);

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!lines.length) {
    return (
      <EmptyState icon={<ShoppingCart className="size-7" />} title="Your cart is currently empty" action={<LinkButton href="/shop">Return to shop</LinkButton>}>
        Browse AI tools, APIs and robotics from AIIR vendors.
      </EmptyState>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="hidden bg-surface text-left text-xs uppercase tracking-wider text-muted sm:table-header-group">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">Product</th>
              <th scope="col" className="px-5 py-3 font-semibold">Price</th>
              <th scope="col" className="px-5 py-3 font-semibold">Quantity</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Subtotal</th>
              <th scope="col" className="px-2 py-3"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lines.map((l) => (
              <tr key={l.productId} className="grid grid-cols-[4rem_1fr_auto] gap-x-4 gap-y-2 p-4 sm:table-row sm:p-0">
                <td className="row-span-2 sm:px-5 sm:py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                      {l.image ? <Image src={l.image} alt="" fill sizes="4rem" className="object-cover" /> : null}
                    </div>
                    <Link href={`/product/${l.slug}`} className="hidden font-semibold hover:text-brand-700 sm:block">
                      {l.name}
                    </Link>
                  </div>
                </td>
                <td className="sm:px-5 sm:py-4">
                  <Link href={`/product/${l.slug}`} className="font-semibold hover:text-brand-700 sm:hidden">
                    {l.name}
                  </Link>
                  <span className="block text-muted sm:text-ink">{formatMoney(l.price)}</span>
                </td>
                <td className="col-start-2 sm:px-5 sm:py-4">
                  <div className="inline-flex h-9 items-center rounded-lg border border-line">
                    <button
                      type="button"
                      onClick={() => setQuantity(l.productId, l.quantity - 1)}
                      className="grid h-full w-9 place-items-center text-slate-500 hover:text-brand-700"
                      aria-label={`Decrease quantity of ${l.name}`}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-10 text-center font-semibold" aria-live="polite">
                      {l.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(l.productId, l.quantity + 1)}
                      disabled={l.maxQuantity !== null && l.quantity >= l.maxQuantity}
                      className="grid h-full w-9 place-items-center text-slate-500 hover:text-brand-700 disabled:text-slate-300"
                      aria-label={`Increase quantity of ${l.name}`}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  {l.maxQuantity !== null && l.quantity >= l.maxQuantity ? (
                    <p className="mt-1 text-xs text-amber-700">Maximum available</p>
                  ) : null}
                </td>
                <td className="hidden px-5 py-4 text-right font-semibold sm:table-cell">{formatMoney(l.price * l.quantity)}</td>
                <td className="col-start-3 row-start-1 sm:px-2 sm:py-4">
                  <button
                    type="button"
                    onClick={() => remove(l.productId)}
                    className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${l.name} from cart`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="space-y-6 rounded-2xl border border-line p-6" aria-label="Cart totals">
        <h2 className="text-lg font-bold">Cart totals</h2>
        <CouponForm />
        <ShippingOptions totals={totals} />
        <TotalsRows totals={totals} />
        <LinkButton href="/checkout" size="lg" className="w-full">
          Proceed to checkout
        </LinkButton>
        <Link href="/shop" className="block text-center text-sm font-semibold text-brand-700 hover:underline">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
