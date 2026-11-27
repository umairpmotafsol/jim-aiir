import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/content/legal-page";
import { site } from "@/lib/config";
import { images } from "@/lib/images";

export const metadata: Metadata = { title: "Refund and returns policy", description: `How refunds and returns work on ${site.name}.` };

// DRAFT COPY: needs legal review and client sign-off before launch.
const sections: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    body: [
      `Each vendor on ${site.name} publishes its own refund, return and cancellation policy on its store page and product pages. This page explains the baseline that applies to every order.`,
    ],
  },
  {
    id: "physical",
    title: "Physical products",
    body: [
      "You can return most physical products within 30 days of delivery if they are unused and in their original packaging. Contact the vendor first so they can confirm the return address.",
      "Faulty or damaged items can be returned for a repair, replacement or refund, in line with your statutory rights.",
    ],
  },
  {
    id: "digital",
    title: "Digital products and services",
    body: [
      "Digital downloads, API access and services that have started cannot usually be returned once delivered or accessed, unless they are faulty or not as described.",
    ],
  },
  {
    id: "refunds",
    title: "How refunds are paid",
    body: [
      "Once the vendor receives and inspects your return, they will refund the purchase price to your original payment method, usually within 14 days. Original shipping costs are refunded when the item is faulty.",
    ],
  },
  {
    id: "cancellations",
    title: "Cancelling an order",
    body: ["You can cancel an order before it ships by contacting the vendor or our team. Orders that have already been dispatched follow the return process above."],
  },
  {
    id: "help",
    title: "Need help?",
    body: [`If you can't reach a resolution with a vendor, contact us at ${site.email} and we'll help.`],
  },
];

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund and returns policy"
      eyebrow="Customer care"
      crumb="Refund and returns"
      intro="Clear, fair rules for returns, refunds and cancellations on every order."
      image={images.glass}
      updated="26 November 2026"
      sections={sections}
    />
  );
}
