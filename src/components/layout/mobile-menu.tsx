"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { mainNav } from "@/lib/config";
import { useCurrentUser } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";
import type { CategoryNode } from "@/lib/types";

export function MobileMenu({ categories }: { categories: CategoryNode[] }) {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const user = useCurrentUser();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  const link = "block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="size-6" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-slate-900/50" onClick={close} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <span className="font-display text-lg font-bold">Menu</span>
              <button type="button" onClick={close} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 space-y-6 p-4">
              <ul>
                {mainNav.flatMap((item) => item.children ?? [item]).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={close} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</p>
                <ul>
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/product-category/${c.slug}`} onClick={close} className={link}>
                        {c.name}
                      </Link>
                      {c.children.map((ch) => (
                        <Link key={ch.slug} href={`/product-category/${c.slug}/${ch.slug}`} onClick={close} className={`${link} pl-7 text-slate-500`}>
                          {ch.name}
                        </Link>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Account</p>
                <Link href="/my-account" onClick={close} className={link}>
                  {hydrated && user ? "My account" : "Log in / Register"}
                </Link>
                {hydrated && user?.role === "vendor" ? (
                  <Link href="/store-manager" onClick={close} className={link}>
                    Store manager
                  </Link>
                ) : null}
                <Link href="/wishlist" onClick={close} className={link}>
                  Wishlist
                </Link>
                <Link href="/compare" onClick={close} className={link}>
                  Compare
                </Link>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
