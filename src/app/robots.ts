import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  // Staging and previews must never be indexed.
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/my-account", "/store-manager", "/wishlist", "/compare"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
