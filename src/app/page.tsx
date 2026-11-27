import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Code2, Flame, Sparkles } from "lucide-react";
import { getCategoryTree, getProducts, getProductsByIds, getVendors } from "@/lib/api/catalog";
import { SectionTabs } from "@/components/home/product-tabs";
import { MiniProductCard, ProductGrid } from "@/components/product/product-card";
import { Media } from "@/components/ui/placeholder";
import { images } from "@/lib/images";
import { LinkButton } from "@/components/ui/button";
import type { Product } from "@/lib/types";

/*
 * Homepage: a simplified take on the WordPress "Home 02" page. Same headings
 * and offers, fewer and lighter sections.
 */

const categoryTabs = [
  { slug: "apis", label: "Development/APIs" },
  { slug: "aitech", label: "AI Tech" },
  { slug: "ai", label: "AI Functions" },
  { slug: "capabilities", label: "AI Capabilities" },
  { slug: "applications", label: "AI Applications" },
];

/* Products picked by hand on the WordPress homepage (by product ID). */
const hotSaleIds = [2724, 2754, 2207, 2200];
const featuredIds = [2756, 2753, 2728, 2200];

const byIds = (list: Product[], ids: number[]) => ids.map((id) => list.find((p) => p.id === id)).filter((p): p is Product => !!p);

export default async function HomePage() {
  const [all, sale, tree, vendors, ...perCategory] = await Promise.all([
    getProducts({ perPage: 500, sort: "date" }),
    getProducts({ onSale: true, sort: "date", perPage: 4 }),
    getCategoryTree(),
    getVendors(),
    ...categoryTabs.map((c) => getProducts({ category: c.slug, sort: "date", perPage: 8 })),
  ]);
  const hotSale = await getProductsByIds(hotSaleIds);
  const featured = byIds(all.items, featuredIds);
  const counts = new Map(tree.map((c) => [c.slug, c.count]));

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-md bg-accent-50 px-4 py-1.5 text-sm font-semibold text-accent-700 ring-1 ring-accent-100">
              <Sparkles className="size-4" aria-hidden /> Get 50% Off
            </p>
            <h1 className="mt-6 text-6xl font-extrabold tracking-tight sm:text-7xl">
              what&apos;s <span className="text-brand-600">new</span>
            </h1>
            <div className="mt-10 flex flex-wrap gap-3">
              <LinkButton href="/shop" size="lg">
                VIEW COLLECTION <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
              <LinkButton href="#categories" size="lg" variant="light">
                CATEGORIES
              </LinkButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-lg border border-line">
              <Media src={images.hero} alt="A professional reviewing data dashboards" priority sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <HeroTile icon={<Sparkles className="size-5" aria-hidden />} title="What's Special?" tone="bg-brand-600" />
            <HeroTile icon={<Code2 className="size-5" aria-hidden />} title="Are You a Developer?" tone="bg-ink" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container-page scroll-mt-24 py-16">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categoryTabs.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/product-category/${c.slug}`}
                className="group flex h-full flex-col justify-between gap-6 rounded-lg border border-line bg-white p-5 transition-colors hover:border-brand-300"
              >
                <span className="relative block aspect-[16/10] overflow-hidden rounded-md">
                  <Media src={images.categories[c.slug]} alt="" sizes="(min-width: 1024px) 15vw, 45vw" seed={c.slug} />
                </span>
                <span>
                  <span className="block font-semibold">{c.label}</span>
                  <span className="mt-1 flex items-center justify-between text-sm text-muted">
                    {counts.get(c.slug) ?? 0} products
                    <ArrowUpRight className="size-4 text-slate-400 transition-colors group-hover:text-brand-600" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Top Categories This Week */}
      <section className="container-page pb-20">
        <SectionTabs
          title="Top Categories This Week"
          tabs={categoryTabs.map((c, i) => ({
            id: c.slug,
            label: c.label,
            content: <ProductGrid products={perCategory[i].items} vendors={vendors} />,
          }))}
        />
      </section>

      {/* Hot Sale + promo */}
      <section className="bg-surface py-20">
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col justify-between rounded-lg bg-brand-800 p-8 text-white">
            <div>
              <p className="text-sm font-semibold text-accent-300">Basic Gift Idea</p>
              <h2 className="mt-3 text-4xl font-extrabold text-white">Ai Projects</h2>
              <p className="mt-3 text-white/85">Mini Two Wheel Self Balancing Scooter</p>
            </div>
            <LinkButton href="/shop" variant="accent" className="mt-8 self-start">
              Get 50% Off <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          </div>
          <div className="rounded-lg bg-white p-6 ring-1 ring-line sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-accent-50 text-accent-600">
                <Flame className="size-5" aria-hidden />
              </span>
              <h2 className="text-2xl font-bold">Hot Sale</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {hotSale.map((p) => (
                <MiniProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="container-page py-20">
        <SectionTabs
          title="Featured Product"
          tabs={[
            { id: "featured", label: "Featured Projects", products: featured },
            { id: "sale", label: "Hot Sale", products: sale.items },
          ].map((t) => ({ id: t.id, label: t.label, content: <ProductGrid products={t.products} vendors={vendors} /> }))}
        />
      </section>

      {/* Calls to action */}
      <section className="container-page grid gap-6 pb-20 md:grid-cols-2">
        <CtaCard kicker="AI, Robotics" title="Get Holiday Deals" cta="View Project" image={images.holiday} />
        <CtaCard kicker="Shop" title="Gadget Makes Your Life Easy" cta="View Collections" image={images.gadget} dark />
      </section>
    </>
  );
}

function HeroTile({ icon, title, tone }: { icon: ReactNode; title: string; tone: string }) {
  return (
    <div className={`flex flex-col justify-between gap-8 rounded-lg p-5 text-white ${tone}`}>
      <span className="grid size-10 place-items-center rounded-md bg-white/15 ring-1 ring-white/20">{icon}</span>
      <p className="text-lg font-bold leading-tight">{title}</p>
    </div>
  );
}

function CtaCard({ kicker, title, cta, image, dark }: { kicker: string; title: string; cta: string; image: string; dark?: boolean }) {
  return (
    <div className={`grid items-center gap-6 overflow-hidden rounded-lg p-6 sm:grid-cols-[1fr_10rem] ${dark ?"bg-ink text-white" : "bg-brand-50"}`}>
      <div>
        <p className={`text-sm font-semibold ${dark ? "text-accent-300" : "text-brand-700"}`}>{kicker}</p>
        <h2 className={`mt-2 text-2xl font-bold ${dark ? "text-white" : ""}`}>{title}</h2>
        <LinkButton href="/shop" variant={dark ? "light" : "primary"} size="sm" className="mt-5">
          {cta} <ArrowRight className="size-4" aria-hidden />
        </LinkButton>
      </div>
      <div className="relative hidden aspect-square overflow-hidden rounded-lg sm:block">
        <Media src={image} alt="" sizes="10rem" />
      </div>
    </div>
  );
}
