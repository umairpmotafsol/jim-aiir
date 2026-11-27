import Link from "next/link";
import Form from "next/form";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import { getCategoryTree, getProducts, getVendors } from "@/lib/api/catalog";
import { ProductGrid } from "@/components/product/product-card";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";
import { CatalogToolbar } from "./catalog-toolbar";
import { cn } from "@/lib/format";
import { commerce } from "@/lib/config";
import type { CategoryNode, ProductQuery, SortKey } from "@/lib/types";

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
  categoryPath?: string[];
};

export async function Catalog({ basePath, searchParams, category, categoryPath }: Props) {
  const { query, view } = parseCatalogParams(searchParams);
  if (category) query.category = category;

  const [result, vendors, tree] = await Promise.all([getProducts(query), getVendors(), getCategoryTree()]);
  const hasFilters = !!(query.search || query.minPrice !== undefined || query.maxPrice !== undefined || query.onSale || (!category && query.category));

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[16rem_1fr]">
      <aside className="space-y-8" aria-label="Filters">
        <CategoryFilter tree={tree} basePath={basePath} active={category ?? query.category} categoryPath={categoryPath} searchParams={searchParams} />
        <PriceFilter basePath={basePath} searchParams={searchParams} min={query.minPrice} max={query.maxPrice} />
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Deals</h2>
          <Link
            href={buildHref(basePath, searchParams, { sale: query.onSale ? undefined : "1", page: undefined })}
            className={cn(
              "flex items-center gap-2 text-sm",
              query.onSale ? "font-semibold text-brand-700" : "text-slate-600 hover:text-brand-700",
            )}
          >
            <span className={cn("grid size-4 place-items-center rounded border", query.onSale ? "border-brand-600 bg-brand-600" : "border-slate-300")}>
              {query.onSale ? <span className="size-1.5 rounded-full bg-white" /> : null}
            </span>
            On sale only
          </Link>
        </div>
      </aside>

      <div>
        <CatalogToolbar
          basePath={basePath}
          searchParams={Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, one(v) ?? ""]))}
          sort={query.sort ?? "default"}
          view={view}
          total={result.total}
          from={result.total ? (result.page - 1) * commerce.perPage + 1 : 0}
          to={(result.page - 1) * commerce.perPage + result.items.length}
        />
        {query.search ? (
          <p className="mb-4 text-sm text-muted">
            Search results for <span className="font-semibold text-ink">&ldquo;{query.search}&rdquo;</span>
          </p>
        ) : null}

        {result.items.length ? (
          <ProductGrid products={result.items} vendors={vendors} layout={view} columns={3} />
        ) : (
          <EmptyState
            icon={<PackageSearch className="size-7" />}
            title="No products match your selection"
            action={
              hasFilters ? (
                <LinkButton href={basePath} variant="outline">
                  Clear filters
                </LinkButton>
              ) : (
                <LinkButton href="/shop">Browse all products</LinkButton>
              )
            }
          >
            Try a different search term, widen the price range or browse another category.
          </EmptyState>
        )}

        {result.totalPages > 1 ? (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
            {result.page > 1 ? (
              <Link
                href={buildHref(basePath, searchParams, { page: String(result.page - 1) })}
                className="grid size-10 place-items-center rounded-lg border border-line hover:border-brand-400"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </Link>
            ) : null}
            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={buildHref(basePath, searchParams, { page: n === 1 ? undefined : String(n) })}
                aria-current={n === result.page ? "page" : undefined}
                className={cn(
                  "grid size-10 place-items-center rounded-lg border text-sm font-semibold",
                  n === result.page ? "border-brand-600 bg-brand-600 text-white" : "border-line hover:border-brand-400",
                )}
              >
                {n}
              </Link>
            ))}
            {result.page < result.totalPages ? (
              <Link
                href={buildHref(basePath, searchParams, { page: String(result.page + 1) })}
                className="grid size-10 place-items-center rounded-lg border border-line hover:border-brand-400"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function CategoryFilter({
  tree,
  basePath,
  active,
  categoryPath,
  searchParams,
}: {
  tree: CategoryNode[];
  basePath: string;
  active?: string;
  categoryPath?: string[];
  searchParams: RawParams;
}) {
  // On the shop page categories are a filter (?category=); elsewhere they link to archives.
  const isShop = basePath === "/shop";
  const hrefFor = (path: string[]) =>
    isShop ? buildHref("/shop", searchParams, { category: path[path.length - 1], page: undefined }) : `/product-category/${path.join("/")}`;

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Categories</h2>
      <ul className="space-y-1 text-sm">
        {isShop ? (
          <li>
            <Link
              href={buildHref("/shop", searchParams, { category: undefined, page: undefined })}
              className={cn("block rounded-md px-2 py-1.5", !active ? "bg-brand-50 font-semibold text-brand-700" : "text-slate-600 hover:text-brand-700")}
            >
              All products
            </Link>
          </li>
        ) : null}
        {tree.map((c) => (
          <li key={c.slug}>
            <Link
              href={hrefFor([c.slug])}
              className={cn(
                "flex justify-between rounded-md px-2 py-1.5",
                active === c.slug ? "bg-brand-50 font-semibold text-brand-700" : "text-slate-600 hover:text-brand-700",
              )}
            >
              <span>{c.name}</span>
              <span className="text-xs text-slate-400">{c.count}</span>
            </Link>
            {c.children.length && (active === c.slug || categoryPath?.includes(c.slug) || c.children.some((ch) => ch.slug === active)) ? (
              <ul className="ml-3 border-l border-line pl-2">
                {c.children.map((ch) => (
                  <li key={ch.slug}>
                    <Link
                      href={hrefFor([c.slug, ch.slug])}
                      className={cn(
                        "flex justify-between rounded-md px-2 py-1.5",
                        active === ch.slug ? "font-semibold text-brand-700" : "text-slate-500 hover:text-brand-700",
                      )}
                    >
                      <span>{ch.name}</span>
                      <span className="text-xs text-slate-400">{ch.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriceFilter({ basePath, searchParams, min, max }: { basePath: string; searchParams: RawParams; min?: number; max?: number }) {
  const keep = Object.entries(searchParams).filter(([k]) => !["min_price", "max_price", "page"].includes(k));
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Price</h2>
      <Form action={basePath} className="space-y-3">
        {keep.map(([k, v]) => (one(v) ? <input key={k} type="hidden" name={k} value={one(v)} /> : null))}
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="min_price">
            Minimum price
          </label>
          <input
            id="min_price"
            name="min_price"
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={min}
            className="h-10 w-full rounded-lg border border-line px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
          <span className="text-slate-400">–</span>
          <label className="sr-only" htmlFor="max_price">
            Maximum price
          </label>
          <input
            id="max_price"
            name="max_price"
            type="number"
            min={0}
            placeholder="Max"
            defaultValue={max}
            className="h-10 w-full rounded-lg border border-line px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="h-9 flex-1 rounded-lg bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
            Filter
          </button>
          {min !== undefined || max !== undefined ? (
            <Link
              href={buildHref(basePath, searchParams, { min_price: undefined, max_price: undefined, page: undefined })}
              className="grid h-9 place-items-center rounded-lg border border-line px-3 text-sm hover:border-brand-400"
            >
              Reset
            </Link>
          ) : null}
        </div>
      </Form>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[16rem_1fr]">
      <div className="space-y-3">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-6" />
        ))}
      </div>
      <div>
        <Skeleton className="mb-6 h-12" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    </div>
  );
}
