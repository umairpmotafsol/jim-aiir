"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { categoryMenu, mainNav } from "@/lib/config";

/** Off-canvas menu for small screens: the main menu plus All Categories. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

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
  const menu = mainNav.flatMap((item) => [item, ...(item.children ?? [])]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-md text-ink hover:bg-surface"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="size-6" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-slate-900/50" onClick={close} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-white text-ink shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <span className="font-display text-lg font-bold">Menu</span>
              <button type="button" onClick={close} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 space-y-6 p-4">
              <ul>
                {menu.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={close} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">All Categories</p>
                <ul>
                  {categoryMenu.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} onClick={close} className={link}>
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
