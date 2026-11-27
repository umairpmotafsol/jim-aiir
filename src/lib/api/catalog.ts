import { cacheLife, cacheTag } from "next/cache";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import vendorsData from "@/data/vendors.json";
import reviewsData from "@/data/reviews.json";
import { commerce } from "@/lib/config";
import type {
  Category,
  CategoryNode,
  Paged,
  Product,
  ProductQuery,
  Review,
  Vendor,
} from "@/lib/types";

/*
 * Catalogue data access.
 *
 * Today this reads the seed JSON exported from the WordPress staging site.
 * When jim-aiir-backend exposes its API, replace the bodies of these
 * functions with fetch calls. The signatures are the contract the UI relies on.
 */

const products = productsData as Product[];
const categories = categoriesData as Category[];
const vendors = vendorsData as Vendor[];
const reviews = reviewsData as Review[];

function descendantSlugs(slug: string): string[] {
  const children = categories.filter((c) => c.parent === slug);
  return [slug, ...children.flatMap((c) => descendantSlugs(c.slug))];
}

function sortProducts(list: Product[], sort: ProductQuery["sort"]) {
  const copy = [...list];
  switch (sort) {
    case "price":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "date":
      return copy.sort((a, b) => a.createdRank - b.createdRank);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "popularity":
      return copy.sort((a, b) => b.reviewCount - a.reviewCount || a.createdRank - b.createdRank);
    default:
      return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export async function getProducts(query: ProductQuery = {}): Promise<Paged<Product>> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const perPage = query.perPage ?? commerce.perPage;
  let list = products;

  if (query.category) {
    const slugs = new Set(descendantSlugs(query.category));
    list = list.filter((p) => p.categories.some((c) => slugs.has(c)));
  }
  if (query.vendor) list = list.filter((p) => p.vendor === query.vendor);
  if (query.onSale) list = list.filter((p) => p.onSale);
  if (query.search) {
    const q = query.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.join(" ").toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (query.minPrice !== undefined) list = list.filter((p) => p.price >= query.minPrice!);
  if (query.maxPrice !== undefined) list = list.filter((p) => p.price <= query.maxPrice!);

  const sorted = sortProducts(list, query.sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages);
  return {
    items: sorted.slice((page - 1) * perPage, page * perPage),
    total: sorted.length,
    page,
    totalPages,
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${slug}`);
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  return ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  return products
    .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
    .slice(0, limit);
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  const build = (parent: string | null): CategoryNode[] =>
    categories
      .filter((c) => c.parent === parent)
      .map((c) => {
        const slugs = new Set(descendantSlugs(c.slug));
        return {
          ...c,
          count: products.filter((p) => p.categories.some((s) => slugs.has(s))).length,
          children: build(c.slug),
        };
      })
      .filter((c) => c.count > 0)
      .sort((a, b) => (a.slug === "uncategorized" ? 1 : b.slug === "uncategorized" ? -1 : a.name.localeCompare(b.name)));
  return build(null);
}

export async function getCategoryPath(slugPath: string[]): Promise<Category[] | null> {
  "use cache";
  cacheLife("hours");
  const path: Category[] = [];
  let parent: string | null = null;
  for (const slug of slugPath) {
    const cat = categories.find((c) => c.slug === slug && c.parent === parent);
    if (!cat) return null;
    path.push(cat);
    parent = cat.slug;
  }
  return path;
}

export async function getCategory(slug: string): Promise<Category | null> {
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getAllCategoryPaths(): Promise<string[][]> {
  const pathOf = (c: Category): string[] => {
    const parent = categories.find((p) => p.slug === c.parent);
    return parent ? [...pathOf(parent), c.slug] : [c.slug];
  };
  return categories.map(pathOf);
}

export async function getVendors(): Promise<Vendor[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("vendors");
  return vendors;
}

export async function getVendor(slug: string): Promise<Vendor | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("vendors", `vendor:${slug}`);
  return vendors.find((v) => v.slug === slug) ?? null;
}

export async function getReviews(productId: number): Promise<Review[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`reviews:${productId}`);
  return reviews.filter((r) => r.productId === productId);
}
