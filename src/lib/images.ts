/*
 * Site imagery: real photographs (Pexels / Unsplash, free licences; sources in
 * src/data/image-credits.json). Product and post images come from the data layer.
 * Anything without a URL falls back to the placeholder in components/ui/placeholder.tsx.
 */
export const images = {
  logo: "/images/brand/aiii-logo.png",
  hero: "/images/site/hero.webp",
  categories: {
    apis: "/images/site/cat-apis.webp",
    aitech: "/images/site/cat-aitech.webp",
    ai: "/images/site/cat-ai.webp",
    capabilities: "/images/site/cat-capabilities.webp",
    applications: "/images/site/cat-applications.webp",
  } as Record<string, string>,
  holiday: "/images/site/cta-holiday.webp",
  gadget: "/images/site/cta-gadget.webp",
  history: "/images/site/about-history.webp",
  vision: "/images/site/about-vision.webp",
} as const;

export const team = [
  { name: "Tony Williamson", role: "FOUNDER" },
  { name: "William Hanah", role: "CEO" },
  { name: "JInglo Jelian", role: "ADVISOR" },
  { name: "Jony Smith", role: "DESIGNER" },
];
