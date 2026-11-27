"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, Heart, ShoppingCart, User } from "lucide-react";
import { useCart, computeTotals } from "@/lib/store/cart";
import { useCompare, useWishlist } from "@/lib/store/lists";
import { useAuth, useCurrentUser } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";
import { formatMoney } from "@/lib/format";

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-bold leading-5 text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

/** Login / account links in the top bar. Shows only what applies to the visitor. */
export function AccountLinks() {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const logout = useAuth((s) => s.logout);
  const router = useRouter();

  if (!hydrated) return <span className="h-4 w-32" aria-hidden />;

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/my-account" className="hover:text-white">
          Log in
        </Link>
        <Link href="/my-account?action=register" className="hover:text-white">
          Register
        </Link>
        <Link href="/vendor-register" className="font-semibold text-accent-400 hover:text-white">
          Become a vendor
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-brand-300">Hi, {user.displayName}</span>
      {user.role === "vendor" ? (
        <Link href="/store-manager" className="font-semibold text-accent-400 hover:text-white">
          Store manager
        </Link>
      ) : null}
      <Link href="/my-account" className="hover:text-white">
        My account
      </Link>
      <button
        type="button"
        className="hover:text-white"
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        Log out
      </button>
    </div>
  );
}

export function HeaderActions() {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.couponCode);
  const method = useCart((s) => s.shippingMethod);
  const setDrawerOpen = useCart((s) => s.setDrawerOpen);
  const wishlist = useWishlist((s) => s.ids.length);
  const compare = useCompare((s) => s.ids.length);
  const user = useCurrentUser();
  const totals = computeTotals(lines, coupon, method);

  const iconLink = "relative grid size-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-brand-700";

  return (
    <div className="ml-auto flex items-center gap-1 sm:gap-2">
      <Link href="/compare" className={`${iconLink} hidden sm:grid`} aria-label={`Compare (${hydrated ? compare : 0} items)`}>
        <ArrowRightLeft className="size-5" />
        <CountBadge count={hydrated ? compare : 0} />
      </Link>
      <Link href="/wishlist" className={`${iconLink} hidden sm:grid`} aria-label={`Wishlist (${hydrated ? wishlist : 0} items)`}>
        <Heart className="size-5" />
        <CountBadge count={hydrated ? wishlist : 0} />
      </Link>
      <Link
        href={hydrated && user?.role === "vendor" ? "/store-manager" : "/my-account"}
        className={iconLink}
        aria-label={hydrated && user ? "My account" : "Log in or register"}
      >
        <User className="size-5" />
      </Link>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="relative flex h-10 items-center gap-2 rounded-lg px-2 text-slate-700 hover:bg-slate-100 hover:text-brand-700"
        aria-label={`Open cart (${hydrated ? totals.itemCount : 0} items)`}
      >
        <span className="relative">
          <ShoppingCart className="size-5" />
          <CountBadge count={hydrated ? totals.itemCount : 0} />
        </span>
        <span className="hidden text-sm font-semibold lg:inline">{formatMoney(hydrated ? totals.subtotal : 0)}</span>
      </button>
    </div>
  );
}
