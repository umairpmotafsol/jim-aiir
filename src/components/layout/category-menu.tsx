"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { categoryMenu } from "@/lib/config";

/** "All Categories" dropdown in the main menu. */
export function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="category-menu"
        className="flex items-center gap-2 rounded-md bg-brand-50 px-4 py-2 font-semibold text-brand-700 hover:bg-brand-100"
      >
        <LayoutGrid className="size-4" aria-hidden />
        All Categories
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open ? (
        <ul id="category-menu" className="absolute left-0 top-full z-50 mt-2 w-60 rounded-lg border border-line bg-white p-2 shadow-lift">
          {categoryMenu.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
