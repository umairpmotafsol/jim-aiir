import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/ui/misc";
import { Media } from "@/components/ui/placeholder";
import { NewsletterBand } from "@/components/content/newsletter-band";
import { images, team } from "@/lib/images";

export const metadata: Metadata = { title: "About Us" };

const stats = [
  { value: "12", label: "Years Experience" },
  { value: "20K", label: "Happy Customers" },
  { value: "100%", label: "Clients Satisfaction" },
];

const vision = [
  "Credibly innovate granular internal",
  "Grantedly underconstructions reloaded",
  "Interactively procrastinate high-payoff",
  "Completely synergize resource taxing relationships",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "About Us" }]} title="About Us" />

      {/* History */}
      <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow">History</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Creative and renovate fashion trends</h2>
          <p className="mt-5 max-w-xl leading-7 text-muted">
            Collaboratively administrate empowered markets via plug-and-play maintain networks. Dynamically usable procrastinate B2B users
            after installed base benefits. Dramatically visualize customer directed convergence without revolutionary ROI.
          </p>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-lg bg-surface p-4">
                <dt className="mt-1 text-xs text-muted">{s.label}</dt>
                <dd className="font-display text-3xl font-bold text-brand-700">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Media src={images.history} alt="A robotic hand holding a small part" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </section>

      {/* Vision */}
      <section className="bg-surface py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:order-none">
            <Media src={images.vision} alt="A robotic hand reaching towards a human hand" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div>
            <p className="eyebrow">Vision</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">We are marketpress</h2>
            <p className="mt-5 leading-7 text-muted">
              Dynamically procrastinate B2C users after installed base benefits. Dramatically visualize customer directed convergence without
              revolutionary ROI.
            </p>
            <ul className="mt-6 space-y-3">
              {vision.map((v) => (
                <li key={v} className="flex items-center gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-brand-100 text-brand-700">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-page py-20">
        <p className="eyebrow">ANGELS</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">Meet with our Team</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <li key={m.name} className="rounded-lg border border-line bg-white p-6 text-center transition-colors hover:border-slate-300">
              <span className="mx-auto grid size-20 place-items-center rounded-full bg-brand-50 text-xl font-semibold text-brand-700">
                {m.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
              <h3 className="mt-4 font-semibold">{m.name}</h3>
              <p className="mt-1 text-xs font-semibold tracking-wider text-muted">{m.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <NewsletterBand />
    </>
  );
}
