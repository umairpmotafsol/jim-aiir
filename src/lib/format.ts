import { commerce } from "./config";

// "narrowSymbol" prints $70 rather than US$70, as the WordPress shop does.
const money = new Intl.NumberFormat(commerce.locale, {
  style: "currency",
  currency: commerce.currency,
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatMoney(value: number) {
  return money.format(value);
}

const dates = new Intl.DateTimeFormat(commerce.locale, { dateStyle: "medium" });

export function formatDate(iso: string) {
  return dates.format(new Date(iso));
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function discountPercent(regular: number, price: number) {
  if (!regular || price >= regular) return 0;
  return Math.round(((regular - price) / regular) * 100);
}

/** Rough reading time in minutes for an array of paragraphs. */
export function readingTime(paragraphs: string[]) {
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** URL-safe slug, e.g. for vendor store addresses. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
