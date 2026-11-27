import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProducts, getVendors } from "@/lib/api/catalog";
import { ProductGrid } from "@/components/product/product-card";
import { Notice, Skeleton } from "@/components/ui/misc";
import { CatalogToolbar } from "./catalog-toolbar";
import { cn } from "@/lib/format";
import type { ProductQuery, SortKey } from "@/lib/types";

export type RawParams = Record<string, string | string[] | undefined>;

const sortKeys: SortKey[] = ["default", "popularity", "rating", "date", "price", "price-desc"];

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function num(v: string | undefined) {
  if (v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseCatalogParams(sp: RawParams) {
  const orderby = one(sp.orderby) as SortKey | undefined;
  const query: ProductQuery = {
    search: one(sp.q)?.trim() || undefined,
    category: one(sp.category) || undefined,
    sort: orderby && sortKeys.includes(orderby) ? orderby : "default",
    page: Math.max(1, Math.floor(num(one(sp.page)) ?? 1)),
    minPrice: num(one(sp.min_price)),
    maxPrice: num(one(sp.max_price)),
    onSale: one(sp.sale) === "1",
  };
  const view: "grid" | "list" = one(sp.view) === "list" ? "list" : "grid";
  return { query, view };
}

/** Serialise the active filters back into a query string, applying overrides. */
export function buildHref(basePath: string, current: RawParams, overrides: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    const value = one(v);
    if (value) params.set(k, value);
  }
  for (const [k, v] of Object.entries(overrides)) {
    if (v === undefined || v === "") params.delete(k);
    else params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

type Props = {
  basePath: string;
  searchParams: RawParams;
  /** Fixed category for category archive pages. */
  category?: string;
  /** Heading shown in the toolbar ("Shop" or the category name). */
  title?: string;
};

export async function Catalog({ basePath, searchParams, category, title = "Shop" }: Props) {
  const { query, view } = parseCatalogParams(searchParams);
  if (category) query.category = category;

  const [result, vendors] = await Promise.all([getProducts(query), getVendors()]);

  return (
    <div className="container-page py-10">
      <CatalogToolbar
        title={title}
        basePath={basePath}
        searchParams={Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, one(v) ?? ""]))}
        sort={query.sort ?? "default"}
        view={view}
      />
      {query.search ? (
        <p className="mb-4 text-sm text-muted">
          Search results for <span className="font-semibold text-ink">&ldquo;{query.search}&rdquo;</span>
        </p>
      ) : null}

      {result.items.length ? (
        <ProductGrid products={result.items} vendors={vendors} layout={view} />
      ) : (
        <Notice>No products were found matching your selection.</Notice>
      )}

      {result.totalPages > 1 ? (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
          {result.page > 1 ? (
            <Link
              href={buildHref(basePath, searchParams, { page: String(result.page - 1) })}
              className="grid size-10 place-items-center rounded-lg border border-line bg-white hover:border-brand-400"
              aria-label="Previous page"
            >
              <ArrowLeft className="size-4" />
            </Link>
          ) : null}
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={buildHref(basePath, searchParams, { page: n === 1 ? undefined : String(n) })}
              aria-current={n === result.page ? "page" : undefined}
              className={cn(
                "grid size-10 place-items-center rounded-lg border text-sm font-semibold",
                n === result.page ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white hover:border-brand-400",
              )}
            >
              {n}
            </Link>
          ))}
          {result.page < result.totalPages ? (
            <Link
              href={buildHref(basePath, searchParams, { page: String(result.page + 1) })}
              className="grid size-10 place-items-center rounded-lg border border-line bg-white hover:border-brand-400"
              aria-label="Next page"
            >
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="container-page py-10">
      <Skeleton className="mb-6 h-16" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    </div>
  );
}
