"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import type { CategoryNode } from "@/lib/types";
import { categoryImage } from "@/lib/images";

export function CategoryMenu({ categories }: { categories: CategoryNode[] }) {
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
        className="flex h-12 items-center gap-2 bg-brand-950 px-5 text-sm font-semibold text-white hover:bg-brand-900"
      >
        <LayoutGrid className="size-4" aria-hidden />
        All categories
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open ? (
        <div id="category-menu" className="absolute left-0 top-full z-50 w-80 rounded-b-2xl border border-t-0 border-line bg-white py-2 shadow-lift">
          <ul>
            {categories.map((c) => (
              <li key={c.slug} className="group/cat relative">
                <Link
                  href={`/product-category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  <span className="flex items-center gap-3">
                    <span className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-surface">
                      <Image src={categoryImage(c.slug)} alt="" fill sizes="2.25rem" className="object-cover" />
                    </span>
                    {c.name}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    {c.count}
                    {c.children.length ? <ChevronRight className="size-3.5" aria-hidden /> : null}
                  </span>
                </Link>
                {c.children.length ? (
                  <ul className="pb-1 pl-12">
                    {c.children.map((ch) => (
                      <li key={ch.slug}>
                        <Link
                          href={`/product-category/${c.slug}/${ch.slug}`}
                          onClick={() => setOpen(false)}
                          className="block px-5 py-1.5 text-sm text-slate-500 hover:text-brand-700"
                        >
                          {ch.name} <span className="text-xs text-slate-400">({ch.count})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-1 border-t border-line px-4 pt-2.5">
            <Link href="/shop" onClick={() => setOpen(false)} className="text-sm font-semibold text-brand-700 hover:underline">
              Browse all products
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
