import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, HelpCircle, Mail, MapPin, Store } from "lucide-react";
import { PageHeader } from "@/components/ui/misc";
import { ContactForm } from "@/components/forms/contact-form";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/ui/icons";
import { site } from "@/lib/config";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the AIIR team about orders, selling on AIIR or partnerships.",
};

const channels = [
  { icon: Mail, title: "Email us", text: "We reply within one business day.", value: site.email, href: `mailto:${site.email}` },
  { icon: MapPin, title: "Visit", text: "AIIR headquarters", value: "Dublin, Ireland" },
  { icon: Clock, title: "Office hours", text: "Monday to Friday", value: "9:00 to 17:30 (IST)" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Get in touch" eyebrow="Contact" image={images.office} crumbs={[{ label: "Contact" }]}>
        Questions about an order, selling on AIIR or partnering with us? We&apos;d love to hear from you.
      </PageHeader>

      <section className="container-page relative z-10 -mt-10 grid gap-5 md:grid-cols-3">
        {channels.map(({ icon: Icon, title, text, value, href }) => (
          <div key={title} className="card flex gap-4 p-6 shadow-lift">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon className="size-6" aria-hidden />
            </div>
            <div>
              <h2 className="font-bold">{title}</h2>
              <p className="text-sm text-muted">{text}</p>
              {href ? (
                <a href={href} className="mt-1 block font-semibold text-brand-700 hover:underline">
                  {value}
                </a>
              ) : (
                <p className="mt-1 font-semibold">{value}</p>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="container-page grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6 sm:p-10">
          <p className="eyebrow">
            <span className="h-px w-6 bg-brand-500" aria-hidden /> Send a message
          </p>
          <h2 className="mt-3 text-3xl font-extrabold">How can we help?</h2>
          <p className="mt-2 text-muted">Fill in the form and the right person on our team will get back to you.</p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl p-8 text-white">
            <Image src={images.team} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-brand-950/60 to-transparent" aria-hidden />
            <h2 className="text-2xl font-extrabold text-white">Talk to a real person</h2>
            <p className="mt-2 text-sm leading-6 text-brand-100">Our Dublin team handles every message personally, from buyer questions to vendor onboarding.</p>
            <div className="mt-5 flex gap-3">
              {[
                { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
                { href: site.social.x, label: "X", Icon: XIcon },
                { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`AIIR on ${label}`} className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur hover:bg-white hover:text-brand-900">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <Link href="/faq" className="card group flex items-center gap-4 p-6 hover:border-brand-300">
            <HelpCircle className="size-8 shrink-0 text-brand-600" aria-hidden />
            <div>
              <h2 className="font-bold group-hover:text-brand-700">Browse the FAQ</h2>
              <p className="text-sm text-muted">Quick answers about orders, shipping and refunds.</p>
            </div>
          </Link>
          <Link href="/vendor-register" className="card group flex items-center gap-4 p-6 hover:border-brand-300">
            <Store className="size-8 shrink-0 text-brand-600" aria-hidden />
            <div>
              <h2 className="font-bold group-hover:text-brand-700">Want to sell on AIIR?</h2>
              <p className="text-sm text-muted">Register as a vendor and open your store.</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
