"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCart, type CartTotals } from "@/lib/store/cart";
import { formatMoney, cn } from "@/lib/format";

export function ShippingOptions({ totals }: { totals: CartTotals }) {
  const setShippingMethod = useCart((s) => s.setShippingMethod);
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">Shipping</legend>
      <div className="space-y-2">
        {totals.availableShipping.map((m) => (
          <label key={m.id} className="flex cursor-pointer items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="shipping-method"
                value={m.id}
                checked={totals.shippingMethod?.id === m.id}
                onChange={() => setShippingMethod(m.id)}
                className="accent-brand-600"
              />
              {m.label}
            </span>
            <span className="font-medium">{m.cost ? formatMoney(m.cost) : "Free"}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CouponForm() {
  const couponCode = useCart((s) => s.couponCode);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const removeCoupon = useCart((s) => s.removeCoupon);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  if (couponCode) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        <span>
          Coupon <strong>{couponCode}</strong> applied
        </span>
        <button type="button" onClick={removeCoupon} className="rounded p-1 hover:bg-emerald-100" aria-label={`Remove coupon ${couponCode}`}>
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const r = applyCoupon(code);
        setMessage({ ok: r.ok, text: r.message });
        if (r.ok) setCode("");
      }}
    >
      <label htmlFor="coupon" className="mb-1.5 block text-sm font-semibold">
        Coupon code
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          className="h-10 min-w-0 flex-1 rounded-lg border border-line px-3 text-sm uppercase focus:border-brand-500 focus:outline-none"
        />
        <button type="submit" className="h-10 rounded-lg border border-line px-4 text-sm font-semibold hover:border-brand-400 hover:text-brand-700">
          Apply
        </button>
      </div>
      {message ? (
        <p role={message.ok ? "status" : "alert"} className={cn("mt-1.5 text-xs font-medium", message.ok ? "text-emerald-700" : "text-red-600")}>
          {message.text}
        </p>
      ) : null}
    </form>
  );
}

export function TotalsRows({ totals }: { totals: CartTotals }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="font-medium">{formatMoney(totals.subtotal)}</dd>
      </div>
      {totals.discount ? (
        <div className="flex justify-between text-emerald-700">
          <dt>Discount</dt>
          <dd className="font-medium">−{formatMoney(totals.discount)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between">
        <dt className="text-muted">Shipping</dt>
        <dd className="font-medium">{totals.shipping ? formatMoney(totals.shipping) : "Free"}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
        <dt>Total</dt>
        <dd>{formatMoney(totals.total)}</dd>
      </div>
    </dl>
  );
}
