import type { Metadata } from "next";
import Image from "next/image";
import { ChevronDown, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";
import { commerce } from "@/lib/config";
import { formatMoney } from "@/lib/format";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about buying and selling on AIIR.",
};

const freeShippingFrom = commerce.shippingMethods.find((m) => m.id === "free_shipping")?.minSubtotal ?? 0;

const groups = [
  {
    title: "Buying on AIIR",
    items: [
      {
        q: "What can I buy on AIIR?",
        a: "AI applications, developer APIs, robotics kits, computer accessories, digital products and consulting from independent vendors. Each product page shows who sells it and their policies.",
      },
      {
        q: "Do I need an account to order?",
        a: "No. You can check out as a guest, or tick “Create an account” at checkout to track your orders and save your addresses for next time.",
      },
      {
        q: "Which payment methods do you accept?",
        a: "Cash on delivery is available today. Card payments are coming soon and will appear at checkout as soon as they are live.",
      },
      {
        q: "Can I use a coupon?",
        a: "Yes. Enter your code in the coupon box on the cart page. The discount is shown in your order summary before you pay.",
      },
    ],
  },
  {
    title: "Shipping & returns",
    items: [
      {
        q: "How much does shipping cost?",
        a: `Orders over ${formatMoney(freeShippingFrom)} ship free. Smaller orders use a low flat rate, shown at checkout before you confirm.`,
      },
      {
        q: "How do I return a product?",
        a: "Each vendor sets their own refund and return policy, shown on the product page and the vendor's store. Contact the vendor from your order, or get in touch with us if you need help.",
      },
      {
        q: "Where can I see my orders?",
        a: "Log in and open My account → Orders. Each order shows its status, items, totals and addresses.",
      },
    ],
  },
  {
    title: "Selling on AIIR",
    items: [
      {
        q: "How do I become a vendor?",
        a: "Fill in the vendor registration form with your store details. Once the AIIR team approves your application, your store goes live and you can manage it from the Store Manager.",
      },
      {
        q: "What does it cost to sell?",
        a: "Opening a store is free. Contact us for the current commission terms for your product category.",
      },
      {
        q: "What can I manage from the Store Manager?",
        a: "Your products (add, edit, delete), the orders that contain your products and their status, and your store profile and policies.",
      },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader title="Frequently asked questions" eyebrow="Help centre" image={images.dashboard} crumbs={[{ label: "FAQ" }]}>
        Everything you need to know about buying and selling on AIIR.
      </PageHeader>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-12">
          {groups.map((g) => (
            <section key={g.title} aria-labelledby={`faq-${g.title}`}>
              <h2 id={`faq-${g.title}`} className="mb-5 text-2xl font-extrabold">
                {g.title}
              </h2>
              <div className="space-y-3">
                {g.items.map((item) => (
                  <details key={item.q} className="card group p-0 open:border-brand-200 open:shadow-lift">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface transition-transform group-open:rotate-180 group-open:bg-brand-600 group-open:text-white">
                        <ChevronDown className="size-4" aria-hidden />
                      </span>
                    </summary>
                    <p className="px-6 pb-6 leading-7 text-slate-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-40 lg:h-fit">
          <div className="relative isolate overflow-hidden rounded-3xl p-8 text-white">
            <Image src={images.robotHand} alt="" fill sizes="22rem" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-brand-950/75 to-brand-900/30" aria-hidden />
            <MessageCircle className="size-10 text-accent-300" aria-hidden />
            <h2 className="mt-24 text-2xl font-extrabold text-white">Still have questions?</h2>
            <p className="mt-2 text-sm leading-6 text-brand-100">Can&apos;t find the answer you&apos;re looking for? Our team is happy to help.</p>
            <LinkButton href="/contact" variant="light" className="mt-6">
              Contact us
            </LinkButton>
          </div>
        </aside>
      </div>
    </>
  );
}
