"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/format";

export type TabItem = { id: string; label: ReactNode; content: ReactNode };

/** Accessible tabs; panels can be server-rendered and passed in as content. */
export function Tabs({ items, label, className }: { items: TabItem[]; label: string; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const base = useId();
  const current = items.find((t) => t.id === active) ?? items[0];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = items.findIndex((t) => t.id === current.id);
    const next = items[(i + (e.key === "ArrowRight" ? 1 : items.length - 1)) % items.length];
    setActive(next.id);
    document.getElementById(`${base}-tab-${next.id}`)?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex gap-1 overflow-x-auto border-b border-line">
        {items.map((t) => {
          const selected = t.id === current.id;
          return (
            <button
              key={t.id}
              id={`${base}-tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${base}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={cn(
                "-mb-px flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-semibold transition-colors",
                selected ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-ink",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`${base}-panel-${current.id}`} aria-labelledby={`${base}-tab-${current.id}`} className="pt-8">
        {current.content}
      </div>
    </div>
  );
}
