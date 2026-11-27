import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import type { ReactNode } from "react";
import { cn, formatMoney } from "@/lib/format";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", dark ? "text-brand-200" : "text-muted")}>
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className={dark ? "hover:text-white" : "hover:text-brand-700"}>
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" aria-hidden />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className={dark ? "hover:text-white" : "hover:text-brand-700"}>
                {item.label}
              </Link>
            ) : (
              <span className={dark ? "font-medium text-white" : "text-slate-700"} aria-current={i === items.length - 1 ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The breadcrumb strip that sits under the header on every inner page, as on
 * the WordPress site. Pass `title` only when the page has no visible heading of
 * its own; it is then rendered for screen readers only.
 */
export function PageHeader({ crumbs, title }: { crumbs: Crumb[]; title?: string }) {
  return (
    <div className="border-b border-line bg-surface">
      <div className="container-page py-5">
        <Breadcrumbs items={crumbs} />
        {title ? <h1 className="sr-only">{title}</h1> : null}
      </div>
    </div>
  );
}

/** A titled white panel, used for the content blocks on inner pages. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-line bg-white p-6 shadow-card sm:p-8", className)}>{children}</div>;
}

export function Price({
  price,
  regularPrice,
  onSale,
  className,
  size = "md",
}: {
  price: number;
  regularPrice: number;
  onSale: boolean;
  className?: string;
  size?: "md" | "lg";
}) {
  if (!price && !regularPrice) return null;
  const big = size === "lg";
  return (
    <p className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-bold", onSale && regularPrice > price ? "text-accent-700" : "text-ink", big ? "text-3xl" : "text-base")}>
        <span className="sr-only">{onSale ? "Sale price: " : "Price: "}</span>
        {formatMoney(price)}
      </span>
      {onSale && regularPrice > price ? (
        <>
          <span className={cn("text-slate-400 line-through", big ? "text-lg" : "text-sm")}>
            <span className="sr-only">Original price: </span>
            {formatMoney(regularPrice)}
          </span>
        </>
      ) : null}
    </p>
  );
}

export function Rating({
  value,
  count,
  className,
  tone = "light",
}: {
  value: number;
  count?: number;
  className?: string;
  /** Use "dark" on navy backgrounds so empty stars stay visibly empty. */
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn("size-4", i <= Math.round(value) ? "fill-amber-400 text-amber-400" : tone === "dark" ? "fill-transparent text-white/40" : "fill-slate-200 text-slate-200")}
            aria-hidden
          />
        ))}
      </div>
      {count !== undefined ? (
        <span className="text-xs text-muted">
          ({count} review{count === 1 ? "" : "s"})
        </span>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-line bg-surface px-6 py-16 text-center">
      {icon ? (
        <div className="mb-5 grid size-14 place-items-center rounded-lg bg-brand-50 text-brand-700">
          {icon}
        </div>
      ) : null}
      <h2 className="text-xl font-bold">{title}</h2>
      {children ? <div className="mt-2 max-w-md text-sm leading-6 text-muted">{children}</div> : null}
      {action ? <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "error"; children: ReactNode }) {
  const tones = {
    info: "border-brand-200 bg-brand-50 text-brand-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-800",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-lg border px-4 py-3 text-sm", tones[tone])}>
      {children}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-slate-100", className)} aria-hidden />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const centered = align === "center";
  const dark = tone === "dark";
  return (
    <div className={cn("mb-10 flex flex-wrap gap-4", centered ? "flex-col items-center text-center" : "items-end justify-between")}>
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? (
          <p className={cn("eyebrow mb-3", dark && "text-accent-300")}>
            <span className={cn("h-px w-6", dark ? "bg-accent-300" : "bg-brand-500")} aria-hidden />
            {eyebrow}
          </p>
        ) : null}
        <h2 className={cn("text-3xl font-extrabold sm:text-4xl", dark && "text-white")}>{title}</h2>
        {description ? <p className={cn("mt-3 text-base leading-7", dark ? "text-brand-100" : "text-muted")}>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
