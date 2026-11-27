import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/misc";
import { NewsletterBand } from "@/components/content/newsletter-band";

export const metadata: Metadata = { title: "FAQ" };

const answer =
  "marketpress is the leading Business to Consumer e-commerce site. It is an online retail that enables anyone from anywhere in Bangladesh and from around the world to purchase different items/products through online.";

const questions = [
  "What is marketpress.com?",
  "Why my card payment is failing?",
  "I need to sign up before buying any Offer/Product?",
  "How do I create an marketpress.com account?",
  "What type of products do you sell online?",
  "Am I billed as soon as I join marketpress.com?",
  "Is my info safe?",
  "Why should I subscribe newsletter?",
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: answer } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader crumbs={[{ label: "FAQ" }]} />
      <section className="container-page max-w-3xl py-16">
        <p className="eyebrow">FAQ</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Frequently asked questions</h1>
        <div className="mt-10 space-y-3">
          {questions.map((q, i) => (
            <details key={q} className="group rounded-lg border border-line bg-white px-6 open:shadow-card" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-surface text-slate-500 transition-transform group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">
                  <Plus className="size-4" aria-hidden />
                </span>
              </summary>
              <p className="pb-6 text-sm leading-6 text-muted">{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <NewsletterBand />
    </>
  );
}
