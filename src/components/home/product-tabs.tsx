"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/format";

type Tab = { id: string; label: string; content: ReactNode };

/** Section title with pill tabs; panels can be server-rendered. */
export function SectionTabs({ title, eyebrow, tabs }: { title: string; eyebrow?: string; tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const base = useId();
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === current.id);
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const tab = tabs[(next + tabs.length) % tabs.length];
    setActive(tab.id);
    document.getElementById(`${base}-tab-${tab.id}`)?.focus();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        </div>
        <div role="tablist" aria-label={title} className="flex flex-wrap gap-2" onKeyDown={onKeyDown}>
          {tabs.map((t) => {
            const selected = t.id === current.id;
            return (
              <button
                key={t.id}
                role="tab"
                id={`${base}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${base}-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(t.id)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  selected ? "bg-ink text-white" : "bg-surface text-slate-600 hover:bg-brand-50 hover:text-brand-700",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div role="tabpanel" id={`${base}-panel-${current.id}`} aria-labelledby={`${base}-tab-${current.id}`} key={current.id} className="animate-fade-up">
        {current.content}
      </div>
    </div>
  );
}
