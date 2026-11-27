import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, MapPin, MessageSquare, Package, RotateCcw, Star, Truck, XCircle } from "lucide-react";
import { getProducts, getReviews, getVendor, getVendors } from "@/lib/api/catalog";
import { Breadcrumbs, EmptyState, Rating } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/tabs";
import { ProductGrid } from "@/components/product/product-card";
import { InquiryForm } from "@/components/product/product-tabs";
import { formatDate } from "@/lib/format";
import { images, vendorBanner } from "@/lib/images";

export async function generateStaticParams() {
  const vendors = await getVendors();
  return vendors.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/store/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendor(slug);
  if (!vendor) return { title: "Store not found" };
  return {
    title: `${vendor.name} store`,
    description: vendor.about?.slice(0, 160) || `Shop products from ${vendor.name} on AIIR.`,
    openGraph: { images: [vendorBanner(vendor.slug)] },
  };
}

export default async function StorePage({ params }: PageProps<"/store/[slug]">) {
  const { slug } = await params;
  const vendor = await getVendor(slug);
  if (!vendor) notFound();

  const [{ items: products }, vendors] = await Promise.all([getProducts({ vendor: slug, perPage: 500 }), getVendors()]);
  const reviews = (await Promise.all(products.map((p) => getReviews(p.id)))).flat();
  const location = [vendor.city, vendor.country].filter(Boolean).join(", ") || "Online store";
  const policies = [
    { icon: Truck, title: "Shipping", text: vendor.policies.shipping },
    { icon: RotateCcw, title: "Refunds", text: vendor.policies.refund },
    { icon: XCircle, title: "Cancellations", text: vendor.policies.cancellation },
  ];

  return (
    <>
      {/* Banner */}
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <Image src={vendorBanner(vendor.slug)} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/20" aria-hidden />
        <div className="container-page pb-10 pt-10 sm:pt-14">
          <Breadcrumbs tone="dark" items={[{ label: "Vendors", href: "/shop" }, { label: vendor.name }]} />
          <div className="mt-24 flex flex-col gap-6 sm:mt-32 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-5">
              <div className="grid size-24 shrink-0 place-items-center rounded-3xl border-4 border-white/90 bg-gradient-to-br from-brand-600 to-accent-500 text-4xl font-extrabold shadow-lift">
                {vendor.name.charAt(0)}
              </div>
              <div>
                <p className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/20 px-2.5 py-1 text-xs font-semibold text-accent-300 ring-1 ring-accent-400/30">
                  <BadgeCheck className="size-3.5" aria-hidden /> Verified vendor
                </p>
                <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">{vendor.name}</h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-brand-100">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" aria-hidden /> {location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" aria-hidden /> Joined {formatDate(vendor.joined)}
                  </span>
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
              <div className="px-5 py-3 text-center">
                <dt className="text-xs text-brand-200">Products</dt>
                <dd className="text-xl font-bold">{products.length}</dd>
              </div>
              <div className="px-5 py-3 text-center">
                <dt className="text-xs text-brand-200">Rating</dt>
                <dd className="flex items-center justify-center gap-1 text-xl font-bold">
                  {vendor.rating ? vendor.rating.toFixed(1) : "New"}
                  {vendor.rating ? <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden /> : null}
                </dd>
              </div>
              <div className="px-5 py-3 text-center">
                <dt className="text-xs text-brand-200">Reviews</dt>
                <dd className="text-xl font-bold">{reviews.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_20rem]">
        <Tabs
          label={`${vendor.name} store`}
          items={[
            {
              id: "products",
              label: (
                <>
                  <Package className="size-4" aria-hidden /> Products ({products.length})
                </>
              ),
              content: products.length ? (
                <ProductGrid products={products} vendors={vendors} columns={3} />
              ) : (
                <EmptyState icon={<Package className="size-7" />} title="No products yet">
                  {vendor.name} hasn&apos;t listed any products. Check back soon.
                </EmptyState>
              ),
            },
            {
              id: "about",
              label: "About",
              content: (
                <div className="grid gap-8 md:grid-cols-[1fr_16rem]">
                  <div className="prose-aiir">
                    <h2 className="!mt-0">About {vendor.name}</h2>
                    <p>{vendor.about || `${vendor.name} sells AI tools and projects on the AIIR marketplace.`}</p>
                  </div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <Image src={images.team2} alt="" fill sizes="16rem" className="object-cover" />
                  </div>
                </div>
              ),
            },
            {
              id: "policies",
              label: "Policies",
              content: (
                <div className="grid gap-5 md:grid-cols-3">
                  {policies.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="card p-6">
                      <div className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <h3 className="mt-4 font-bold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{text || "Contact the vendor for details."}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: "reviews",
              label: `Reviews (${reviews.length})`,
              content: reviews.length ? (
                <ul className="space-y-4">
                  {reviews.map((r, i) => (
                    <li key={i} className="card p-6">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{r.author}</p>
                        <time dateTime={r.date} className="text-xs text-muted">
                          {formatDate(r.date)}
                        </time>
                      </div>
                      <Rating value={r.rating} className="mt-1" />
                      <p className="mt-3 text-sm leading-6 text-slate-600">{r.text}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon={<Star className="size-7" />} title="No reviews yet">
                  Bought from {vendor.name}? Leave a review on the product page.
                </EmptyState>
              ),
            },
          ]}
        />

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <MessageSquare className="size-5 text-brand-600" aria-hidden /> Contact vendor
            </h2>
            <div className="mt-4 [&_.grid]:grid-cols-1">
              <InquiryForm vendor={vendor} />
            </div>
          </div>
          <div className="relative isolate overflow-hidden rounded-2xl p-6 text-white">
            <Image src={images.sell} alt="" fill sizes="20rem" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-brand-950/80 to-brand-900/40" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">Sell on AIIR</p>
            <p className="mt-2 text-lg font-bold">Have something to sell?</p>
            <p className="mt-1 text-sm text-brand-100">Open your own store in minutes.</p>
            <Link href="/vendor-register" className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50">
              Become a vendor
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
