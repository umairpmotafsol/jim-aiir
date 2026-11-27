import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, GraduationCap, Handshake, Lightbulb, ShieldCheck, Target, Users } from "lucide-react";
import { getCategoryTree, getProducts, getVendors } from "@/lib/api/catalog";
import { PageHeader, SectionHeading } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";
import { site } from "@/lib/config";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.legalName}: who we are and why we built the AIIR marketplace.`,
};

const values = [
  { icon: Lightbulb, title: "Practical innovation", text: "We champion AI that solves real problems for real people and businesses." },
  { icon: ShieldCheck, title: "Trust & responsibility", text: "Vendors are reviewed, policies are clear, and ethical AI comes first." },
  { icon: Handshake, title: "Community first", text: "We connect builders, researchers and buyers so good ideas find their audience." },
  { icon: GraduationCap, title: "Open learning", text: "We share knowledge freely through events, articles and partnerships." },
];

export default async function AboutPage() {
  const [{ total }, vendors, categories] = await Promise.all([getProducts({ perPage: 1 }), getVendors(), getCategoryTree()]);
  const stats = [
    { value: `${total}+`, label: "AI products listed" },
    { value: `${vendors.length}+`, label: "Independent vendors" },
    { value: `${categories.length}`, label: "Product categories" },
    { value: "Dublin", label: "Home of AIIR" },
  ];

  return (
    <>
      <PageHeader title="About AIIR" eyebrow="Who we are" image={images.team} crumbs={[{ label: "About us" }]}>
        {site.legalName}: connecting the people who build artificial intelligence with the people who need it.
      </PageHeader>

      {/* Intro */}
      <section className="container-page grid items-center gap-14 py-20 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/5] w-4/5 overflow-hidden rounded-3xl">
            <Image src={images.team2} alt="Team members reviewing work on screens" fill sizes="(min-width: 1024px) 40vw, 80vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 aspect-square w-1/2 overflow-hidden rounded-3xl border-8 border-white shadow-lift">
            <Image src={images.chess} alt="A robotic arm playing chess against a person" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          </div>
          <div className="absolute left-6 top-6 rounded-2xl bg-white/95 px-5 py-4 shadow-lift backdrop-blur">
            <p className="text-3xl font-extrabold text-brand-600">{vendors.length}+</p>
            <p className="text-xs font-semibold text-muted">vendor studios</p>
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Our story" title="Built to make AI accessible" />
          <div className="prose-aiir -mt-4">
            <p>
              The Artificial Intelligence Institute of Ireland brings together researchers, start-ups and established companies
              working on AI. We started by recognising and celebrating Irish AI talent, and AIIR is the next step: a marketplace
              where that talent can reach customers directly.
            </p>
            <p>
              On AIIR, independent vendors sell AI applications, developer APIs, robotics, computer accessories and
              consulting. Buyers get a single, trusted place to discover and compare tools, and vendors get their own storefront
              with everything they need to run it.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="card flex gap-4 p-5">
              <Target className="size-6 shrink-0 text-brand-600" aria-hidden />
              <div>
                <h3 className="font-bold">Our mission</h3>
                <p className="mt-1 text-sm leading-6 text-muted">Help every organisation adopt AI with confidence.</p>
              </div>
            </div>
            <div className="card flex gap-4 p-5">
              <Users className="size-6 shrink-0 text-brand-600" aria-hidden />
              <div>
                <h3 className="font-bold">Our community</h3>
                <p className="mt-1 text-sm leading-6 text-muted">Builders, researchers and buyers, growing together.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative isolate overflow-hidden bg-brand-950 py-16 text-white">
        <Image src={images.datacenter} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/80 to-brand-950" aria-hidden />
        <dl className="container-page grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="text-5xl font-extrabold text-white">{s.value}</dd>
              <dt className="mt-2 text-sm font-medium text-brand-200">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Values */}
      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionHeading align="center" eyebrow="What we stand for" title="Our values" description="The principles behind every decision we make about the marketplace." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">
                  <Icon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split CTA */}
      <section className="container-page grid gap-6 py-20 lg:grid-cols-2">
        {[
          { image: images.heroRobot, eyebrow: "For buyers", title: "Find your next AI tool", href: "/shop", cta: "Browse the shop" },
          { image: images.sell, eyebrow: "For builders", title: "Sell your AI work", href: "/vendor-register", cta: "Become a vendor" },
        ].map((c) => (
          <div key={c.title} className="relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl p-8 text-white sm:p-10">
            <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/95 via-brand-950/50 to-transparent" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">{c.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">{c.title}</h2>
            <LinkButton href={c.href} variant="light" className="mt-6 w-fit">
              {c.cta} <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          </div>
        ))}
      </section>
    </>
  );
}
