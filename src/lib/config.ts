/**
 * Site-wide settings. Values that differ per environment come from env vars
 * (see .env.example) so staging and production can share one build.
 */
export const site = {
  name: "AIIR",
  legalName: "The Artificial Intelligence Institute of Ireland",
  tagline: "Intelligence Amplified, Future Simplified",
  description:
    "A marketplace for AI tools, projects and robotics from independent builders, run by the Artificial Intelligence Institute of Ireland.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Only production should be indexed by search engines. */
  indexable: process.env.NEXT_PUBLIC_SITE_ENV === "production",
  email: "hello@aiir.ie",
  social: {
    facebook: "https://www.facebook.com/aiawardsirl/",
    x: "https://x.com/AIAwardsIrl",
    instagram: "https://www.instagram.com/aiawardsirl/",
  },
};

export const commerce = {
  /** Catalogue prices are stored in this currency. Change together with the backend. */
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "USD",
  locale: "en-IE",
  perPage: 12,
  defaultCountry: "IE",
  shippingMethods: [
    { id: "free_shipping", label: "Free shipping", cost: 0, minSubtotal: 100 },
    { id: "flat_rate", label: "Flat rate", cost: 10, minSubtotal: 0 },
  ],
  paymentMethods: [
    { id: "cod", label: "Cash on delivery", description: "Pay with cash when your order is delivered.", enabled: true },
    { id: "card", label: "Credit / debit card", description: "Card payments are coming soon.", enabled: false },
  ],
  coupons: {
    // Demo coupons until the backend owns promotions.
    WELCOME10: { type: "percent", amount: 10 },
    AIIR20: { type: "fixed", amount: 20 },
  } as Record<string, { type: "percent" | "fixed"; amount: number }>,
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  {
    label: "About",
    href: "/about-us",
    children: [
      { label: "About us", href: "/about-us" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Terms and conditions", href: "/terms-and-conditions" },
    ],
  },
  { label: "Sell on AIIR", href: "/vendor-register" },
];

export const countries = [
  { code: "IE", name: "Ireland" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "GR", name: "Greece" },
  { code: "PK", name: "Pakistan" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];
