"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/format";
import type { SortKey } from "@/lib/types";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "default", label: "Sorting" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Average rating" },
  { value: "date", label: "Newness" },
  { value: "price", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

type Props = {
  title: string;
  basePath: string;
  searchParams: Record<string, string>;
  sort: SortKey;
  view: "grid" | "list";
};

export function CatalogToolbar({ title, basePath, searchParams, sort, view }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const go = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false }));
  };

  return (
    <div className={cn("mb-8 flex flex-wrap items-center justify-between gap-4", pending && "opacity-60")}>
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <label htmlFor="orderby" className="text-sm text-muted">
          Sort by
        </label>
        <select
          id="orderby"
          value={sort}
          onChange={(e) => go({ orderby: e.target.value === "default" ? undefined : e.target.value, page: undefined })}
          className="h-10 rounded-md border border-line bg-white px-4 text-sm focus:border-brand-500 focus:outline-none"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="ml-2 text-sm font-semibold">View</span>
        <div className="flex rounded-md border border-line p-0.5" role="group" aria-label="Layout">
          {(["grid", "list"] as const).map((v) => {
            const Icon = v === "grid" ? LayoutGrid : List;
            return (
              <button
                key={v}
                type="button"
                onClick={() => go({ view: v === "grid" ? undefined : v })}
                aria-pressed={view === v}
                aria-label={`${v === "grid" ? "Grid" : "List"} view`}
                className={cn("grid size-9 place-items-center rounded-md", view === v ? "bg-brand-600 text-white" : "text-slate-500 hover:text-brand-700")}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Stand-alone "Sort by" select (store pages). */
export function SortSelect({ basePath, searchParams, sort }: { basePath: string; searchParams: Record<string, string>; sort: SortKey }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className={cn("flex items-center gap-3", pending && "opacity-60")}>
      <label htmlFor="store-orderby" className="text-sm text-muted">
        Sort by
      </label>
      <select
        id="store-orderby"
        value={sort}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          if (e.target.value === "default") params.delete("orderby");
          else params.set("orderby", e.target.value);
          const qs = params.toString();
          startTransition(() => router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false }));
        }}
        className="h-10 rounded-md border border-line bg-white px-4 text-sm focus:border-brand-500 focus:outline-none"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
