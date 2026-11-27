import type { MetadataRoute } from "next";
import { getAllCategoryPaths, getProducts, getVendors } from "@/lib/api/catalog";
import { getPosts } from "@/lib/api/content";
import { site } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ items: products }, categoryPaths, vendors, posts] = await Promise.all([
    getProducts({ perPage: 1000 }),
    getAllCategoryPaths(),
    getVendors(),
    getPosts(),
  ]);
  const url = (path: string) => `${site.url}${path}`;
  const pages = ["/", "/shop", "/blog", "/about-us", "/contact", "/faq", "/vendor-register", "/terms-and-conditions", "/refund-returns"];

  return [
    ...pages.map((p) => ({ url: url(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.6 })),
    ...categoryPaths.map((slug) => ({ url: url(`/product-category/${slug.join("/")}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({ url: url(`/product/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...vendors.map((v) => ({ url: url(`/store/${v.slug}`), changeFrequency: "weekly" as const, priority: 0.5 })),
    ...posts.map((p) => ({ url: url(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
