"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { commerce } from "@/lib/config";

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  /** Upper bound from stock, or null when unlimited. */
  maxQuantity: number | null;
  vendor: string | null;
};

export type AddResult = { ok: true; quantity: number } | { ok: false; reason: string };

type CartState = {
  lines: CartLine[];
  couponCode: string | null;
  shippingMethod: string;
  drawerOpen: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => AddResult;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  setShippingMethod: (id: string) => void;
  setDrawerOpen: (open: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      couponCode: null,
      shippingMethod: commerce.shippingMethods[0].id,
      drawerOpen: false,
      add: (line, quantity = 1) => {
        const existing = get().lines.find((l) => l.productId === line.productId);
        const current = existing?.quantity ?? 0;
        const wanted = current + quantity;
        if (line.maxQuantity !== null && wanted > line.maxQuantity) {
          const left = line.maxQuantity - current;
          return {
            ok: false,
            reason:
              left <= 0
                ? `You already have all ${line.maxQuantity} available "${line.name}" in your cart.`
                : `Only ${left} more "${line.name}" available.`,
          };
        }
        set({
          lines: existing
            ? get().lines.map((l) => (l.productId === line.productId ? { ...l, quantity: wanted } : l))
            : [...get().lines, { ...line, quantity }],
        });
        return { ok: true, quantity: wanted };
      },
      setQuantity: (productId, quantity) =>
        set({
          lines: get()
            .lines.map((l) => {
              if (l.productId !== productId) return l;
              const capped = l.maxQuantity === null ? quantity : Math.min(quantity, l.maxQuantity);
              return { ...l, quantity: capped };
            })
            .filter((l) => l.quantity > 0),
        }),
      remove: (productId) => set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      clear: () => set({ lines: [], couponCode: null }),
      applyCoupon: (raw) => {
        const code = raw.trim().toUpperCase();
        if (!code) return { ok: false, message: "Please enter a coupon code." };
        if (!commerce.coupons[code]) return { ok: false, message: `Coupon "${raw.trim()}" does not exist.` };
        set({ couponCode: code });
        return { ok: true, message: `Coupon "${code}" applied.` };
      },
      removeCoupon: () => set({ couponCode: null }),
      setShippingMethod: (id) => set({ shippingMethod: id }),
      setDrawerOpen: (open) => set({ drawerOpen: open }),
    }),
    {
      name: "aiir-cart",
      partialize: ({ lines, couponCode, shippingMethod }) => ({ lines, couponCode, shippingMethod }),
    },
  ),
);

type ShippingMethod = (typeof commerce.shippingMethods)[number];

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  availableShipping: ShippingMethod[];
  shippingMethod: ShippingMethod | undefined;
};

export function computeTotals(lines: CartLine[], couponCode: string | null, shippingMethodId: string): CartTotals {
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const coupon = couponCode ? commerce.coupons[couponCode] : undefined;
  const discount = coupon
    ? Math.min(subtotal, coupon.type === "percent" ? (subtotal * coupon.amount) / 100 : coupon.amount)
    : 0;
  const availableShipping = commerce.shippingMethods.filter((m) => subtotal - discount >= m.minSubtotal);
  const shippingMethod =
    availableShipping.find((m) => m.id === shippingMethodId) ?? availableShipping[availableShipping.length - 1];
  const shipping = lines.length ? (shippingMethod?.cost ?? 0) : 0;
  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    total: Math.max(0, subtotal - discount + shipping),
    availableShipping,
    shippingMethod,
  };
}
