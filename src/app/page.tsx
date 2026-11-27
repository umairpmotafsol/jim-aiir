import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Truck,
  UserPlus,
} from "lucide-react";
import { getCategoryTree, getProducts, getVendors } from "@/lib/api/catalog";
import { getPosts } from "@/lib/api/content";
import { LinkButton } from "@/components/ui/button";
import { Price, SectionHeading } from "@/components/ui/misc";
import { ProductTabs } from "@/components/home/product-tabs";
import { ProductGrid } from "@/components/product/product-card";
import { formatDate, formatMoney } from "@/lib/format";
import { commerce, site } from "@/lib/config";
import { categoryImage, images, vendorBanner } from "@/lib/images";

const freeShippingFrom = commerce.shippingMethods.find((m) => m.id === "free_shipping")?.minSubtotal ?? 0;

export default async function HomePage() {
  const [all, newest, sale, topRated, categories, vendors, posts] = await Promise.all([
    getProducts({ perPage: 500 }),
    getProducts({ sort: "date", perPage: 8 }),
    getProducts({ onSale: true, perPage: 8 }),
    getProducts({ sort: "rating", perPage: 8 }),
    getCategoryTree(),
    getVendors(),
    getPosts(3),
  ]);

  const spotlight = all.items.find((p) => p.purchasable && p.onSale && p.images.length) ?? all.items[0];
  const spotlightVendor = vendors.find((v) => v.slug === spotlight?.vendor);
  const tiles = categories.filter((c) => c.slug !== "uncategorized").slice(0, 5);
  const productCount = (slug: string) => all.items.filter((p) => p.vendor === slug).length;
  const topVendors = [...vendors].sort((a, b) => productCount(b.slug) - productCount(a.slug)).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <Image src={images.hero} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-right opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-950/20" aria-hidden />
        <div className="bg-grid absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_left,black,transparent_70%)]" aria-hidden />
        <div className="container-page grid items-center gap-12 pb-32 pt-16 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:pb-40 lg:pt-28">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-brand-100 backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent-400" />
              </span>
              {site.legalName}
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Intelligence amplified.
              <br />
              <span className="text-gradient">Future simplified.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-brand-100">
              The marketplace for AI tools, APIs, robotics and ready-made projects, from independent builders across Ireland and
              beyond.
            </p>

            <Form action="/shop" role="search" className="mt-9 flex max-w-xl rounded-2xl bg-white p-1.5 shadow-lift">
              <label htmlFor="hero-search" className="sr-only">
                Search products
              </label>
              <Search className="ml-3 size-5 shrink-0 self-center text-slate-400" aria-hidden />
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Try “neural networks” or “robotics”"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-slate-400 focus:outline-none"
              />
              <button type="submit" className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
                Search
              </button>
            </Form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-brand-200">
              <span>Popular:</span>
              {categories
                .filter((c) => c.count > 0 && c.slug !== "uncategorized")
                .slice(0, 4)
                .map((c) => (
                  <Link key={c.slug} href={`/product-category/${c.slug}`} className="font-medium text-white underline-offset-4 hover:underline">
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>

          {spotlight ? (
            <div className="relative hidden lg:block" aria-label="Featured product">
              <div className="absolute -left-10 top-10 z-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                <div className="grid size-10 place-items-center rounded-xl bg-accent-500 text-brand-950">
                  <Store className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none">{vendors.length}+</p>
                  <p className="text-xs text-brand-200">verified vendors</p>
                </div>
              </div>
              <Link
                href={`/product/${spotlight.slug}`}
                className="group ml-auto block w-80 rotate-2 rounded-3xl bg-white p-3 text-ink shadow-2xl transition-transform duration-500 hover:rotate-0"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
                  <Image src={spotlight.images[0].src} alt="" fill sizes="20rem" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">
                    Featured
                  </span>
                </div>
                <div className="px-2 pb-2 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{spotlightVendor?.name ?? "AIIR"}</p>
                  <p className="mt-1 text-lg font-bold">{spotlight.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Price price={spotlight.price} regularPrice={spotlight.regularPrice} onSale={spotlight.onSale} />
                    <span className="grid size-9 place-items-center rounded-full bg-brand-600 text-white">
                      <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
              <div className="absolute -bottom-6 left-4 z-10 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-ink shadow-lift">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                  ))}
                </div>
                <p className="text-xs font-semibold">Trusted by AI builders</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Value strip */}
      <section className="container-page relative z-10 -mt-20">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-lift sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BadgeCheck, title: "Vetted vendors", text: "Every store is reviewed by the AIIR team." },
            { icon: ShieldCheck, title: "Secure checkout", text: "Your payment and personal data stay protected." },
            { icon: Truck, title: `Free shipping over ${formatMoney(freeShippingFrom)}`, text: "Low flat rate on smaller orders." },
            { icon: PackageCheck, title: "Easy returns", text: "Clear refund policies on every product." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 bg-white p-6">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon className="size-6" aria-hidden />
              </div>
              <div>
                <h2 className="text-sm font-bold">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-20">
        <SectionHeading
          eyebrow="Browse by category"
          title="Find the right tool for the job"
          description="From production-ready APIs to hands-on robotics kits, explore what independent AI builders are selling."
          action={
            <LinkButton href="/shop" variant="outline">
              All products <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          }
        />
        <div className="grid auto-rows-[13rem] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((c, i) => (
            <Link
              key={c.slug}
              href={`/product-category/${c.slug}`}
              className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-3xl p-6 text-white ${
                i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <Image
                src={categoryImage(c.slug)}
                alt=""
                fill
                sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="-z-20 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/90 via-brand-950/35 to-transparent" aria-hidden />
              <span className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-white group-hover:text-brand-700">
                <ArrowUpRight className="size-5" aria-hidden />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-300">
                {c.count} product{c.count === 1 ? "" : "s"}
              </p>
              <h3 className={`mt-1 font-bold text-white ${i === 0 ? "text-3xl" : "text-xl"}`}>{c.name}</h3>
              {i === 0 ? (
                <p className="mt-2 max-w-sm text-sm text-brand-100">
                  Chatbots, smart assistants and ready-to-deploy AI apps built by the community.
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured tabs */}
      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured"
            title="Projects worth a look"
            description="Fresh launches, current deals and the highest-rated work on AIIR."
          />
          <ProductTabs
            vendors={vendors}
            tabs={[
              { id: "new", label: "New arrivals", products: newest.items },
              { id: "sale", label: "On sale", products: sale.items },
              { id: "top", label: "Top rated", products: topRated.items },
            ]}
          />
        </div>
      </section>

      {/* Promo banners */}
      <section className="container-page grid gap-6 py-20 lg:grid-cols-2">
        {[
          {
            image: categoryImage("robotics"),
            eyebrow: "Hardware",
            title: "Robotics & automation",
            text: "Robot kits, arms and smart devices ready for your next build.",
            href: "/product-category/aitech/robotics",
            cta: "Shop robotics",
          },
          {
            image: categoryImage("apis"),
            eyebrow: "For developers",
            title: "APIs & developer tools",
            text: "Plug machine learning into your product in an afternoon.",
            href: "/product-category/apis",
            cta: "Browse APIs",
          },
        ].map((b) => (
          <Link key={b.title} href={b.href} className="group relative isolate flex min-h-72 flex-col justify-center overflow-hidden rounded-3xl p-8 text-white sm:p-10">
            <Image src={b.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950/95 via-brand-900/75 to-transparent" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">{b.eyebrow}</p>
            <h2 className="mt-2 max-w-xs text-3xl font-extrabold text-white">{b.title}</h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-brand-100">{b.text}</p>
            <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-900 transition-colors group-hover:bg-accent-400">
              {b.cta} <ArrowRight className="size-4" aria-hidden />
            </span>
          </Link>
        ))}
      </section>

      {/* Hot deals */}
      {sale.items.length ? (
        <section className="container-page pb-20">
          <SectionHeading
            eyebrow="Limited time"
            title="Hot deals this week"
            action={
              <LinkButton href="/shop?sale=1" variant="outline">
                See all deals <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
            }
          />
          <ProductGrid products={sale.items.slice(0, 4)} vendors={vendors} />
        </section>
      ) : null}

      {/* How it works */}
      <section className="relative overflow-hidden bg-brand-950 py-20 text-white">
        <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="container-page relative grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image src={images.team} alt="A product team collaborating in a modern office" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-8 right-4 w-56 overflow-hidden rounded-2xl border-4 border-brand-950 sm:right-8 sm:w-64">
              <div className="relative aspect-[4/3]">
                <Image src={images.dashboard} alt="" fill sizes="16rem" className="object-cover" />
              </div>
            </div>
            <div className="absolute -left-3 top-6 rounded-2xl bg-white px-5 py-4 text-ink shadow-lift sm:-left-6">
              <p className="text-3xl font-extrabold text-brand-600">{all.total}+</p>
              <p className="text-xs font-semibold text-muted">AI products listed</p>
            </div>
          </div>
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="How AIIR works"
              title="A marketplace built for builders"
              description="Whether you're shopping for an AI capability or selling one, AIIR keeps it simple."
            />
            <ol className="space-y-6">
              {[
                { icon: Search, title: "Discover", text: "Search by capability, category or vendor and compare products side by side." },
                { icon: ShieldCheck, title: "Buy with confidence", text: "Clear policies, verified vendors and a secure, simple checkout." },
                { icon: Sparkles, title: "Build something great", text: "Ask vendors questions, leave reviews and get support when you need it." },
              ].map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-5">
                  <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-accent-300 ring-1 ring-white/15">
                    <Icon className="size-5" aria-hidden />
                    <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-accent-500 text-[10px] font-bold text-brand-950">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-brand-200">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Vendors */}
      <section className="container-page py-20">
        <SectionHeading
          eyebrow="Meet the makers"
          title="Featured vendors"
          description="Independent studios and labs selling on AIIR."
          action={
            <LinkButton href="/vendor-register" variant="outline">
              Become a vendor <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topVendors.map((v) => (
            <Link key={v.slug} href={`/store/${v.slug}`} className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div className="relative h-32 overflow-hidden">
                <Image src={vendorBanner(v.slug)} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" aria-hidden />
              </div>
              <div className="relative px-5 pb-5">
                <div className="-mt-7 grid size-14 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-brand-600 to-accent-500 text-lg font-extrabold text-white shadow-md">
                  {v.name.charAt(0)}
                </div>
                <h3 className="mt-3 text-lg font-bold group-hover:text-brand-700">{v.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="size-3.5" aria-hidden />
                  {[v.city, v.country].filter(Boolean).join(", ") || "Online"}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
                  <span className="font-semibold">
                    {productCount(v.slug)} product{productCount(v.slug) === 1 ? "" : "s"}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-brand-700">
                    Visit store <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="container-page pb-20">
        <div className="relative isolate grid overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white lg:grid-cols-2">
          <div className="bg-grid absolute inset-0 -z-10 opacity-40" aria-hidden />
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="eyebrow text-accent-300">
              <span className="h-px w-6 bg-accent-300" aria-hidden /> Sell on AIIR
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">Turn your AI work into a storefront</h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-brand-100">
              List models, APIs, datasets, robotics kits or consulting packages. Manage products, orders and customer questions
              from your own Store Manager.
            </p>
            <ul className="mt-7 grid gap-3 text-sm text-brand-100 sm:grid-cols-2">
              {["Free to open a store", "Your own storefront page", "Order & product dashboard", "Reach the AIIR community"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <BadgeCheck className="size-5 shrink-0 text-accent-400" aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton href="/vendor-register" size="lg" variant="light">
                <UserPlus className="size-5" aria-hidden /> Open your store
              </LinkButton>
              <LinkButton href="/faq" size="lg" variant="glass">
                How it works
              </LinkButton>
            </div>
          </div>
          <div className="relative min-h-72 lg:min-h-full">
            <Image src={images.sell} alt="An engineer building electronics at a workbench" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-800 via-transparent to-transparent lg:from-brand-800/90" aria-hidden />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="From the blog"
            title="Insights on AI"
            description="Ideas, trends and practical guides from the AIIR community."
            action={
              <LinkButton href="/blog" variant="outline">
                All articles <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden className="relative block aspect-[16/10] overflow-hidden bg-brand-100">
                  {post.image ? (
                    <Image src={post.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted">
                    <CalendarDays className="size-3.5" aria-hidden />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </p>
                  <h3 className="mt-3 text-lg font-bold leading-snug">
                    <Link href={`/blog/${post.slug}`} className="group-hover:text-brand-700">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">{post.excerpt}</p>
                  <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-brand-700">
                    Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
