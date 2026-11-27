"use client";

import { useState } from "react";
import { ArrowRightLeft, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartLine } from "@/lib/store/cart";
import { useCompare, useWishlist } from "@/lib/store/lists";
import { useHydrated } from "@/lib/store/hydration";
import { toast } from "@/lib/store/toast";
import { cn } from "@/lib/format";
import type { Product } from "@/lib/types";

export function toCartLine(p: Product): Omit<CartLine, "quantity"> {
  return {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.images[0]?.thumb ?? null,
    maxQuantity: p.soldIndividually ? 1 : p.stock,
    vendor: p.vendor,
  };
}

export function useAddToCart() {
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.setDrawerOpen);
  return (product: Product, quantity = 1) => {
    const result = add(toCartLine(product), quantity);
    if (result.ok) {
      toast.success(`"${product.name}" has been added to your cart.`, { label: "View cart", href: "/cart" });
      openDrawer(true);
    } else {
      toast.error(result.reason);
    }
    return result.ok;
  };
}

export function AddToCartButton({ product, className, compact }: { product: Product; className?: string; compact?: boolean }) {
  const addToCart = useAddToCart();
  if (!product.inStock) {
    return (
      <Button variant="outline" size="sm" disabled className={className}>
        Out of stock
      </Button>
    );
  }
  return (
    <Button size="sm" className={className} onClick={() => addToCart(product)} aria-label={`Add "${product.name}" to cart`}>
      <ShoppingCart className="size-4" aria-hidden />
      {compact ? null : "Add to cart"}
    </Button>
  );
}

export function QuantityAddToCart({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addToCart = useAddToCart();
  const max = product.soldIndividually ? 1 : (product.stock ?? 99);

  if (!product.inStock) {
    return <p className="font-semibold text-red-600">Out of stock</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {max > 1 ? (
        <div className="flex h-12 items-center rounded-lg border border-line">
          <button
            type="button"
            className="grid h-full w-11 place-items-center text-slate-600 hover:text-brand-700 disabled:text-slate-300"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={max}
            value={qty}
            onChange={(e) => setQty(Math.min(max, Math.max(1, Number(e.target.value) || 1)))}
            className="h-full w-14 border-x border-line text-center text-sm font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label={`${product.name} quantity`}
          />
          <button
            type="button"
            className="grid h-full w-11 place-items-center text-slate-600 hover:text-brand-700 disabled:text-slate-300"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={qty >= max}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
      ) : null}
      <Button size="lg" onClick={() => addToCart(product, qty) && setQty(1)}>
        <ShoppingCart className="size-5" aria-hidden />
        Add to cart
      </Button>
    </div>
  );
}

export function WishlistButton({ productId, name, withLabel, className }: { productId: number; name: string; withLabel?: boolean; className?: string }) {
  const hydrated = useHydrated();
  const active = useWishlist((s) => s.ids.includes(productId)) && hydrated;
  const toggle = useWishlist((s) => s.toggle);
  return (
    <button
      type="button"
      onClick={() => {
        const added = toggle(productId);
        if (added) toast.success(`"${name}" added to your wishlist.`, { label: "View wishlist", href: "/wishlist" });
        else toast.info(`"${name}" removed from your wishlist.`);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove "${name}" from wishlist` : `Add "${name}" to wishlist`}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium transition-colors",
        active ? "text-red-500" : "text-slate-500 hover:text-red-500",
        className,
      )}
    >
      <Heart className={cn("size-5", active && "fill-current")} aria-hidden />
      {withLabel ? (active ? "In wishlist" : "Add to wishlist") : null}
    </button>
  );
}

export function CompareButton({ productId, name, withLabel, className }: { productId: number; name: string; withLabel?: boolean; className?: string }) {
  const hydrated = useHydrated();
  const active = useCompare((s) => s.ids.includes(productId)) && hydrated;
  const toggle = useCompare((s) => s.toggle);
  return (
    <button
      type="button"
      onClick={() => {
        const added = toggle(productId);
        if (added) toast.success(`"${name}" added to compare.`, { label: "Compare products", href: "/compare" });
        else toast.info(`"${name}" removed from compare.`);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove "${name}" from compare` : `Add "${name}" to compare`}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium transition-colors",
        active ? "text-brand-700" : "text-slate-500 hover:text-brand-700",
        className,
      )}
    >
      <ArrowRightLeft className="size-5" aria-hidden />
      {withLabel ? (active ? "In compare" : "Compare") : null}
    </button>
  );
}
