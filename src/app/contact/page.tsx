import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/misc";
import { ContactForm } from "@/components/forms/contact-form";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Contact" }]} />
      <section className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Get in touch</h1>
          <p className="mt-5 leading-7 text-muted">
            Fundpress site thoughtfully designed for real humans which means the best user experience for your entire community of donors,
            fundraisers, customers, and staff.
          </p>
          <p className="mt-8 flex items-center gap-3 text-sm font-medium">
            <span className="grid size-10 place-items-center rounded-md bg-brand-50 text-brand-700">
              <MapPin className="size-4" aria-hidden />
            </span>
            {site.address}
          </p>
          <iframe
            title="Map: London Eye, London, United Kingdom"
            src="https://maps.google.com/maps?q=London%20Eye%2C%20London%2C%20United%20Kingdom&t=m&z=10&output=embed&iwloc=near"
            className="mt-8 block h-64 w-full rounded-lg border border-line"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="rounded-lg border border-line bg-white p-6 shadow-card sm:p-10">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
