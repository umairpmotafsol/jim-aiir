import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Mail, MapPin, Phone, Search } from "lucide-react";
import { getCategoryTree, getProducts, getReviews, getVendor, getVendors } from "@/lib/api/catalog";
import { Notice, Rating, Skeleton } from "@/components/ui/misc";
import { Tabs } from "@/components/ui/tabs";
import { ProductGrid } from "@/components/product/product-card";
import { AskQuestionButton } from "@/components/product/ask-question";
import { SortSelect } from "@/components/shop/catalog-toolbar";
import { parseCatalogParams } from "@/components/shop/catalog";
import { images } from "@/lib/images";

export async function generateStaticParams() {
  const vendors = await getVendors();
  return vendors.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/store/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendor(slug);
  if (!vendor) return { title: "Store not found" };
  return { title: vendor.name, description: `Shop products from ${vendor.name} on AIIR.` };
}

/** Vendor storefront, laid out like the WCFM store page. */
export default async function StorePage({ params, searchParams }: PageProps<"/store/[slug]">) {
  const { slug } = await params;
  const vendor = await getVendor(slug);
  if (!vendor) notFound();

  const [{ items: all }, tree] = await Promise.all([getProducts({ vendor: slug, perPage: 500 }), getCategoryTree()]);
  const reviews = (await Promise.all(all.map((p) => getReviews(p.id)))).flat();
  const storeCategories = tree
    .flatMap((c) => [c, ...c.children])
    .filter((c) => all.some((p) => p.categories.includes(c.slug)));

  return (
    <>
      {/* Banner */}
      <section className="container-page pt-6">
        <div className="rounded-lg bg-ink p-6 text-white sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="grid size-20 shrink-0 place-items-center rounded-lg bg-ink p-3 ring-1 ring-white/15">
                <Image src={images.logo} alt={`${vendor.name} logo`} width={286} height={180} className="h-auto w-full" />
              </div>
              <div className="space-y-1.5 text-sm text-white/85">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{vendor.name}</h1>
                {vendor.address ? (
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 shrink-0" aria-hidden /> {vendor.address}
                  </p>
                ) : null}
                {vendor.phone ? (
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0" aria-hidden /> {vendor.phone}
                  </p>
                ) : null}
                <p className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0" aria-hidden />
                  <a href={`mailto:${vendor.email}`} className="hover:text-white">
                    {vendor.email}
                  </a>
                </p>
                <Rating value={vendor.rating} tone="dark" />
              </div>
            </div>
            <AskQuestionButton vendor={vendor} label="Inquiry" />
          </div>
        </div>
      </section>

      <div>
        <div className="container-page grid gap-8 py-10 lg:grid-cols-[15rem_1fr]">
          <aside className="space-y-8">
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Search</h2>
              <Form action={`/store/${vendor.slug}`} role="search" className="flex overflow-hidden rounded-md border border-line bg-white">
                <label htmlFor="store-search" className="sr-only">
                  Search products
                </label>
                <input id="store-search" name="q" type="search" placeholder="Search products..." className="min-w-0 flex-1 px-4 py-2.5 text-sm focus:outline-none" />
                <button type="submit" className="grid w-10 place-items-center text-slate-500 hover:text-brand-700" aria-label="Search">
                  <Search className="size-4" />
                </button>
              </Form>
            </section>
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Categories</h2>
              <ul className="space-y-2 text-sm">
                {storeCategories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/store/${vendor.slug}?category=${c.slug}`} className="text-slate-600 hover:text-brand-700">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          <Tabs
            label={`${vendor.name} store`}
            className="min-w-0"
            items={[
              {
                id: "products",
                label: "Products",
                content: (
                  <Suspense fallback={<Skeleton className="mt-6 h-80" />}>
                    {searchParams.then((sp) => (
                      <StoreProducts vendorSlug={vendor.slug} searchParams={sp} />
                    ))}
                  </Suspense>
                ),
              },
              { id: "about", label: "About", content: null },
              { id: "policies", label: "Policies", content: null },
              {
                id: "reviews",
                label: `Reviews ( ${reviews.length} )`,
                content: reviews.length ? (
                  <ul className="mt-6 space-y-4">
                    {reviews.map((r, i) => (
                      <li key={i} className="rounded-md border border-line p-4">
                        <p className="font-semibold">{r.author}</p>
                        <Rating value={r.rating} className="mt-1" />
                        <p className="mt-2 text-sm text-slate-600">{r.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : null,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

async function StoreProducts({ vendorSlug, searchParams }: { vendorSlug: string; searchParams: Record<string, string | string[] | undefined> }) {
  const { query } = parseCatalogParams(searchParams);
  const [{ items }, vendors] = await Promise.all([getProducts({ ...query, vendor: vendorSlug, perPage: 500, page: 1 }), getVendors()]);
  const flat = Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, (Array.isArray(v) ? v[0] : v) ?? ""]));

  return (
    <div className="mt-6">
      <div className="mb-6 flex justify-end">
        <SortSelect basePath={`/store/${vendorSlug}`} searchParams={flat} sort={query.sort ?? "default"} />
      </div>
      {items.length ? <ProductGrid products={items} vendors={vendors} columns={3} /> : <Notice>No products were found matching your selection.</Notice>}
    </div>
  );
}
