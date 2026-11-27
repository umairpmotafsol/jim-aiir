import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Media is self-hosted in /public/images for now (the WordPress S3 bucket
    // is gone). Add the backend's media host here when it serves uploads.
    formats: ["image/avif", "image/webp"],
  },
  // Keep the old WordPress URLs working after the switch.
  async redirects() {
    const legacyPosts = [
      "ai-in-healthcare-revolutionizing-patient-care",
      "the-everyday-impact-of-artificial-intelligence",
      "the-role-of-ai-in-digital-marketing",
      "the-future-of-ai-opportunities-and-challenges",
    ];
    return [
      { source: "/refund_returns", destination: "/refund-returns", permanent: true },
      { source: "/vendor-registration", destination: "/vendor-register", permanent: true },
      { source: "/dashboard", destination: "/store-manager", permanent: true },
      { source: "/my-orders", destination: "/my-account/orders", permanent: true },
      { source: "/yith-compare", destination: "/compare", permanent: true },
      { source: "/product-category", destination: "/shop", permanent: false },
      ...legacyPosts.map((slug) => ({
        source: `/${slug}`,
        destination: `/blog/${slug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
