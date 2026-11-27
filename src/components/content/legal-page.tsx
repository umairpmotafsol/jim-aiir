import Link from "next/link";
import { FileText, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui/misc";
import { site } from "@/lib/config";

export type LegalSection = { id: string; title: string; body: string[] };

/** Shared layout for policy pages: hero, sticky table of contents and readable body. */
export function LegalPage({
  title,
  eyebrow,
  intro,
  image,
  updated,
  sections,
  crumb,
}: {
  title: string;
  eyebrow: string;
  intro: string;
  image: string;
  updated: string;
  sections: LegalSection[];
  crumb: string;
}) {
  return (
    <>
      <PageHeader title={title} eyebrow={eyebrow} image={image} crumbs={[{ label: crumb }]}>
        {intro}
      </PageHeader>
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-40 lg:h-fit">
          <nav aria-label="On this page" className="card p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <FileText className="size-4" aria-hidden /> On this page
            </p>
            <ol className="mt-4 space-y-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-2 text-slate-600 hover:text-brand-700">
                    <span className="text-slate-400">{i + 1}.</span> {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-6 rounded-2xl bg-brand-50 p-5 text-sm text-brand-900">
            <p className="font-semibold">Questions about this policy?</p>
            <a href={`mailto:${site.email}`} className="mt-2 flex items-center gap-2 font-semibold text-brand-700 hover:underline">
              <Mail className="size-4" aria-hidden /> {site.email}
            </a>
          </div>
        </aside>
        <article className="prose-aiir max-w-3xl">
          <p className="!text-sm !text-muted">Last updated: {updated}</p>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-40">
              <h2>
                {i + 1}. {s.title}
              </h2>
              {s.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}
          <p className="mt-10 rounded-2xl border border-line bg-surface p-5 !text-sm">
            See also our <Link href="/terms-and-conditions">terms and conditions</Link> and{" "}
            <Link href="/refund-returns">refund and returns policy</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
