"use client";

import { Media } from "@/components/ui/placeholder";
import Link from "next/link";
import { useEffect } from "react";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useCart, computeTotals } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/hydration";
import { LinkButton } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";

export function MiniCart() {
  const hydrated = useHydrated();
  const open = useCart((s) => s.drawerOpen);
  const setOpen = useCart((s) => s.setDrawerOpen);
  const lines = useCart((s) => s.lines);
  const remove = useCart((s) => s.remove);
  const coupon = useCart((s) => s.couponCode);
  const method = useCart((s) => s.shippingMethod);
  const totals = computeTotals(lines, coupon, method);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!hydrated || !open) return null;
  const close = () => setOpen(false);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-slate-900/50" onClick={close} aria-hidden />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">Shopping cart ({totals.itemCount})</h2>
          <button type="button" onClick={close} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close cart">
            <X className="size-5" />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingCart className="size-10 text-slate-300" aria-hidden />
            <p className="text-muted">Your cart is currently empty.</p>
            <LinkButton href="/shop" onClick={close}>
              Browse the shop
            </LinkButton>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.productId} className="flex gap-4 py-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <Media src={l.image} alt="" sizes="4rem" seed={l.name} size="sm" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${l.slug}`} onClick={close} className="text-sm font-semibold hover:text-brand-700">
                      {l.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {l.quantity} × {formatMoney(l.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(l.productId)}
                    className="self-start rounded p-1 text-slate-400 hover:text-red-600"
                    aria-label={`Remove ${l.name} from cart`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-line p-5">
              <div className="flex justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span>{formatMoney(totals.subtotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <LinkButton href="/cart" variant="outline" onClick={close}>
                  View cart
                </LinkButton>
                <LinkButton href="/checkout" onClick={close}>
                  Checkout
                </LinkButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
