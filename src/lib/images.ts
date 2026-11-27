/**
 * Site imagery, self-hosted under /public/images.
 *
 * The staging WordPress media bucket (aiir-wp-website on S3) no longer exists,
 * so every photo was re-sourced from Pexels (free licence, attribution
 * appreciated) and converted to WebP. Sources are listed in
 * src/data/image-credits.json. When the backend serves media, swap these for
 * CMS-managed URLs.
 */
export const images = {
  hero: "/images/site/hero.webp",
  heroRobot: "/images/site/hero-robot.webp",
  sell: "/images/site/sell.webp",
  team: "/images/site/team.webp",
  team2: "/images/site/team-2.webp",
  dashboard: "/images/site/dashboard.webp",
  datacenter: "/images/site/datacenter.webp",
  servers: "/images/site/servers.webp",
  office: "/images/site/office.webp",
  glass: "/images/site/glass.webp",
  circuit: "/images/site/circuit.webp",
  robotHand: "/images/site/robot-hand.webp",
  robotDark: "/images/site/robot-dark.webp",
  chess: "/images/site/chess.webp",
} as const;

const categorySlugs = new Set([
  "applications",
  "capabilities",
  "ai",
  "aitech",
  "computer-accessories",
  "apis",
  "digital",
  "robotics",
  "uncategorized",
]);

export function categoryImage(slug: string) {
  return categorySlugs.has(slug) ? `/images/site/cat-${slug}.webp` : images.circuit;
}

const vendorSlugs = new Set(["aiir", "rana-sami", "alexa-2_0", "vielka-norman", "vendor_123"]);

export function vendorBanner(slug: string) {
  return vendorSlugs.has(slug) ? `/images/site/vendor-${slug}.webp` : images.servers;
}
