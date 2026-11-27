import { NewsletterForm } from "@/components/forms/newsletter-form";

/** "Newsletter & Get Updates" band shown above the footer on content pages. */
export function NewsletterBand() {
  return (
    <section className="container-page pb-20">
      <div className="flex flex-col gap-6 rounded-lg border border-line bg-surface p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Newsletter &amp; Get Updates</h2>
          <p className="mt-2 text-sm text-muted">Sign up for our newsletter to get up-to-date from us</p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
