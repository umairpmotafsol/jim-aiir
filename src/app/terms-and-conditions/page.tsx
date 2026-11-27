import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { NewsletterBand } from "@/components/content/newsletter-band";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Terms and Conditions" }]} />
      <section className="py-16">
        <div className="container-page max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Terms and Conditions</h1>
          <div className="mt-8 space-y-4">
            <details open className="rounded-lg border border-line bg-white p-6">
              <summary className="cursor-pointer font-bold marker:text-brand-600 text-ink">Types of Personal Information We Collect</summary>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
                <p>
                  Personal Information is information that can be used to identify, locate, or contact an individual.It also includes
                  other information that may be associated with Personal Information. We collect the following types of Personal
                  Information:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Contact information that allows us to communicate with you, such as your name, postal addresses, email addresses,
                    social media website user account names, telephone numbers, or other addresses at which you receive communications
                    from or on behalf of marketpress.
                  </li>
                  <li>Transaction Information about how you purchase and redeem</li>
                  <li>As needed to process payments for marketpress.com that you buy, such as your credit or debit card number, expiration date.</li>
                </ul>
              </div>
            </details>
            <details open className="rounded-lg border border-line bg-white p-6">
              <summary className="cursor-pointer font-bold marker:text-brand-600 text-ink">How marketpress.com Collects Personal Information</summary>
              <p className="mt-4 text-sm leading-6 text-muted">
                We ask you for Personal Information when you register, subscribe, create an account, order a deal, or otherwise interact
                with the Sites or contact.
              </p>
            </details>
            <details open className="rounded-lg border border-line bg-white p-6">
              <summary className="cursor-pointer font-bold marker:text-brand-600 text-ink">How marketpress.com Uses Personal Information</summary>
              <p className="mt-4 text-sm leading-6 text-muted">
                You may correct your information by signing in your account. Or you may also email to info@example.com. If you want to
                close your account or have other questions or requests, please contact us: +8 0 11 223 456
              </p>
            </details>
          </div>
        </div>
      </section>
      <NewsletterBand />
    </>
  );
}
