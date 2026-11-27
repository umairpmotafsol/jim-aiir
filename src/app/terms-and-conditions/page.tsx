import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/content/legal-page";
import { site } from "@/lib/config";
import { images } from "@/lib/images";

export const metadata: Metadata = { title: "Terms and conditions", description: `The terms for using the ${site.name} marketplace.` };

// DRAFT COPY: needs legal review and client sign-off before launch.
const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: [
      `These terms apply to your use of the ${site.name} marketplace, operated by ${site.legalName}. By browsing the site, creating an account or placing an order you agree to them.`,
    ],
  },
  {
    id: "marketplace",
    title: "How the marketplace works",
    body: [
      `${site.name} is a marketplace. Most products are sold by independent vendors, who are responsible for their product descriptions, pricing, fulfilment and after-sales support. The seller is shown on every product page.`,
      `Where a product is sold by ${site.name} directly, it is labelled “Sold by AIIR”.`,
    ],
  },
  {
    id: "accounts",
    title: "Your account",
    body: [
      "You are responsible for keeping your login details secure and for activity on your account. Please tell us straight away if you think your account has been used without permission.",
      "We may suspend accounts that break these terms or are used for fraud.",
    ],
  },
  {
    id: "orders",
    title: "Orders and payment",
    body: [
      "Placing an order is an offer to buy. A contract is formed when the vendor accepts and processes your order. Prices include any taxes shown at checkout; shipping is calculated before you confirm.",
      "If a product is listed at an obviously incorrect price, the vendor may cancel the order and refund any payment made.",
    ],
  },
  {
    id: "vendors",
    title: "Selling on AIIR",
    body: [
      "Vendors must provide accurate store and product information, honour the policies they publish, and comply with applicable law, including consumer protection and data protection rules.",
      `${site.name} may review, edit or remove listings that are misleading, unsafe or unlawful.`,
    ],
  },
  {
    id: "liability",
    title: "Liability",
    body: [
      "Nothing in these terms limits your statutory rights as a consumer. To the extent permitted by law, we are not liable for losses that were not foreseeable or that arise from a vendor's products or services.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: ["We may update these terms from time to time. The version shown on this page applies to your use of the site from the date it is published."],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and conditions"
      eyebrow="Legal"
      crumb="Terms and conditions"
      intro="The rules for buying and selling on the AIIR marketplace, in plain language."
      image={images.circuit}
      updated="26 November 2026"
      sections={sections}
    />
  );
}
