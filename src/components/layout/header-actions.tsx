"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useAuth, useCurrentUser } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";

/** Login button, or Dashboard + Logout once signed in. */
export function AccountLinks() {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const logout = useAuth((s) => s.logout);
  const router = useRouter();

  if (!hydrated) return <span className="h-10 w-20" aria-hidden />;

  if (!user) {
    return (
      <Link href="/my-account" className="inline-flex h-10 items-center rounded-md bg-ink px-5 text-sm font-semibold text-white hover:bg-slate-800">
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={user.role === "vendor" ? "/store-manager" : "/my-account"}
        className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-surface"
      >
        <UserRound className="size-4" aria-hidden />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      <button
        type="button"
        aria-label="Logout"
        title="Logout"
        className="grid size-10 place-items-center rounded-md text-slate-500 hover:bg-surface hover:text-ink"
        onClick={() => {
          logout();
          router.push("/my-account");
        }}
      >
        <LogOut className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function CartButton() {
  const hydrated = useHydrated();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const setDrawerOpen = useCart((s) => s.setDrawerOpen);
  const shown = hydrated ? count : 0;

  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      className="relative grid size-10 place-items-center rounded-md text-slate-700 hover:bg-surface"
      aria-label={`Open cart (${shown} items)`}
    >
      <ShoppingBag className="size-5" />
      {shown ? (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-bold leading-5 text-ink">
          {shown > 99 ? "99+" : shown}
        </span>
      ) : null}
    </button>
  );
}
