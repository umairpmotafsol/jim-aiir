"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

/** A top-level menu link with a hover / keyboard dropdown of sub-pages. */
export function NavDropdown({ label, href, items }: { label: string; href: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <Link href={href} className="rounded-md py-2 pl-3.5 pr-1 text-slate-600 hover:text-ink">
        {label}
      </Link>
      <button
        type="button"
        className="mr-1 rounded-md p-1 text-slate-400 hover:text-ink"
        aria-expanded={open}
        aria-label={`${label} submenu`}
        onClick={() => setOpen((o) => !o)}
      >
        <ChevronDown className="size-3.5" aria-hidden />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 pt-2">
          <ul className="w-56 rounded-lg border border-line bg-white p-2 shadow-lift">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
