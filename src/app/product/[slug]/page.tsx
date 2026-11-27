import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleAlert, CircleCheck, RotateCcw, ShieldCheck, Store, Truck } from "lucide-react";
import {
  getAllProductSlugs,
  getCategory,
  getProduct,
  getProductsByIds,
  getRelatedProducts,
  getReviews,
  getVendor,
  getVendors,
} from "@/lib/api/catalog";
import { Breadcrumbs, Price, Rating, SectionHeading } from "@/components/ui/misc";
import { ProductGallery } from "@/components/product/gallery";
import { ProductTabs } from "@/components/product/product-tabs";
import { CompareButton, QuantityAddToCart, WishlistButton } from "@/components/product/product-actions";
import { ProductGrid } from "@/components/product/product-card";
import { commerce, site } from "@/lib/config";
import { formatMoney } from "@/lib/format";
import { images, vendorBanner } from "@/lib/images";

const freeShippingFrom = commerce.shippingMethods.find((m) => m.id === "free_shipping")?.minSubtotal ?? 0;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  const image = product.images[0]?.src;
  return {
    title: product.name,
    description: product.description[0]?.slice(0, 160) ?? `${product.name} on AIIR.`,
    openGraph: { title: product.name, images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [vendor, reviews, related, vendors, categories, grouped] = await Promise.all([
    product.vendor ? getVendor(product.vendor) : Promise.resolve(null),
    getReviews(product.id),
    getRelatedProducts(product),
    getVendors(),
    Promise.all(product.categories.map((c) => getCategory(c))),
    product.type === "grouped" ? getProductsByIds(product.groupedProducts) : Promise.resolve([]),
  ]);
  const primaryCategory = categories.find(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.src),
    description: product.description.join(" "),
    brand: vendor ? { "@type": "Brand", name: vendor.name } : { "@type": "Brand", name: site.name },
    ...(product.purchasable
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: commerce.currency,
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }
      : {}),
    ...(reviews.length
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: reviews.length } }
      : {}),
  };

  return (
    <div className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          ...(primaryCategory ? [{ label: primaryCategory.name, href: `/product-category/${primaryCategory.parent ? `${primaryCategory.parent}/` : ""}${primaryCategory.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {vendor ? (
            <Link href={`/store/${vendor.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
              <Store className="size-4" aria-hidden /> {vendor.name}
            </Link>
          ) : (
            <p className="text-sm font-semibold text-slate-400">Sold by AIIR</p>
          )}
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{product.name}</h1>
          {product.reviewCount ? (
            <a href="#product-tabs" className="mt-3 inline-block">
              <Rating value={product.rating} count={product.reviewCount} />
            </a>
          ) : null}

          {product.purchasable ? (
            <Price price={product.price} regularPrice={product.regularPrice} onSale={product.onSale} size="lg" className="mt-5" />
          ) : null}

          {product.description[0] ? <p className="mt-5 leading-7 text-slate-600">{product.description[0]}</p> : null}

          {product.purchasable ? (
            <p className="mt-5 flex items-center gap-2 text-sm font-medium">
              {product.inStock ? (
                <>
                  <CircleCheck className="size-4 text-emerald-600" aria-hidden />
                  <span className="text-emerald-700">{product.stock !== null ? `${product.stock} in stock` : "In stock"}</span>
                </>
              ) : (
                <>
                  <CircleAlert className="size-4 text-red-600" aria-hidden />
                  <span className="text-red-700">Out of stock</span>
                </>
              )}
            </p>
          ) : null}

          <div className="mt-6 border-t border-line pt-6">
            {product.type === "grouped" ? (
              grouped.length ? (
                <ul className="space-y-3">
                  {grouped.map((g) => (
                    <li key={g.id}>
                      <Link href={`/product/${g.slug}`} className="font-semibold hover:text-brand-700">
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg bg-surface p-4 text-sm text-muted">
                  This bundle doesn&apos;t contain any products yet. Ask the vendor below when it will be available.
                </p>
              )
            ) : product.purchasable ? (
              <QuantityAddToCart product={product} />
            ) : (
              <p className="rounded-lg bg-surface p-4 text-sm text-muted">This product isn&apos;t available to buy right now.</p>
            )}
            <div className="mt-5 flex flex-wrap gap-6">
              <WishlistButton productId={product.id} name={product.name} withLabel />
              <CompareButton productId={product.id} name={product.name} withLabel />
            </div>
          </div>

          <dl className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
            {categories.filter(Boolean).length ? (
              <div className="flex gap-2">
                <dt className="font-semibold">Categories:</dt>
                <dd className="flex flex-wrap gap-x-2 text-slate-600">
                  {categories.filter(Boolean).map((c) => (
                    <Link key={c!.slug} href={`/product-category/${c!.parent ? `${c!.parent}/` : ""}${c!.slug}`} className="hover:text-brand-700">
                      {c!.name}
                    </Link>
                  ))}
                </dd>
              </div>
            ) : null}
            {product.tags.length ? (
              <div className="flex gap-2">
                <dt className="font-semibold">Tags:</dt>
                <dd className="text-slate-600">{product.tags.join(", ")}</dd>
              </div>
            ) : null}
          </dl>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, title: `Free shipping over ${formatMoney(freeShippingFrom)}` },
              { icon: RotateCcw, title: "Clear refund policy" },
              { icon: ShieldCheck, title: "Secure checkout" },
            ].map(({ icon: Icon, title }) => (
              <li key={title} className="flex items-center gap-3 rounded-2xl bg-surface p-4 text-xs font-semibold leading-snug">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
                  <Icon className="size-4" aria-hidden />
                </span>
                {title}
              </li>
            ))}
          </ul>

          <Link
            href={vendor ? `/store/${vendor.slug}` : "/about-us"}
            className="group relative isolate mt-6 flex items-center gap-4 overflow-hidden rounded-2xl p-5 text-white"
          >
            <Image src={vendor ? vendorBanner(vendor.slug) : images.team} alt="" fill sizes="(min-width: 1024px) 36rem, 100vw" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/85 to-brand-900/40" aria-hidden />
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-lg font-extrabold">
              {(vendor?.name ?? site.name).charAt(0)}
            </span>
            <span className="flex-1">
              <span className="block text-xs font-semibold uppercase tracking-wider text-accent-300">Sold by</span>
              <span className="block text-lg font-bold">{vendor?.name ?? site.legalName}</span>
              {vendor ? <span className="block text-xs text-brand-200">{[vendor.city, vendor.country].filter(Boolean).join(", ")}</span> : null}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold">
              {vendor ? "Visit store" : "About us"} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        </div>
      </div>

      <ProductTabs product={product} reviews={reviews} vendor={vendor} />

      {related.length ? (
        <section className="mt-6 border-t border-line pt-12">
          <SectionHeading title="Related products" />
          <ProductGrid products={related} vendors={vendors} />
        </section>
      ) : null}
    </div>
  );
}
