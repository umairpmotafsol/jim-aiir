import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { PageHeader, Price, Rating } from "@/components/ui/misc";
import { ProductGallery } from "@/components/product/gallery";
import { ProductTabs } from "@/components/product/product-tabs";
import { CompareButton, QuantityAddToCart, WishlistButton } from "@/components/product/product-actions";
import { AskQuestionButton } from "@/components/product/ask-question";
import { ProductGrid } from "@/components/product/product-card";
import { commerce, site } from "@/lib/config";
import { images } from "@/lib/images";

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

  const categoryLinks = categories.filter((c): c is NonNullable<typeof c> => !!c);
  const categoryHref = (c: { slug: string; parent: string | null }) => `/product-category/${c.parent ? `${c.parent}/` : ""}${c.slug}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }} />
      <PageHeader
        crumbs={[
          ...(primaryCategory ? [{ label: primaryCategory.name, href: categoryHref(primaryCategory) }] : []),
          { label: product.name },
        ]}
      />
      <div className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{product.name}</h1>

            {vendor ? (
              <Link
                href={`/store/${vendor.slug}`}
                className="mt-5 inline-flex items-center gap-4 rounded-lg border border-line bg-white px-4 py-3 transition-shadow hover:shadow-card"
              >
                <span className="grid size-12 place-items-center rounded-lg bg-ink p-1.5">
                  <Image src={images.logo} alt="" width={286} height={180} className="h-auto w-full" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">store</span>
                  <span className="block font-bold text-ink">{vendor.name}</span>
                  <Rating value={vendor.rating} className="mt-0.5" />
                </span>
              </Link>
            ) : null}

            {categoryLinks.length ? (
              <p className="mt-5 text-sm">
                <span className="text-muted">Categories: </span>
                {categoryLinks.map((c, i) => (
                  <span key={c.slug}>
                    {i > 0 ? ", " : null}
                    <Link href={categoryHref(c)} className="font-medium text-brand-700 hover:underline">
                      {c.name}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}

            {product.purchasable ? (
              <Price price={product.price} regularPrice={product.regularPrice} onSale={product.onSale} size="lg" className="mt-5" />
            ) : null}

            {product.shortDescription[0] ? <p className="mt-4 leading-7 text-slate-600">{product.shortDescription[0]}</p> : null}

            {product.purchasable && product.stock !== null ? (
              <p className={product.inStock ? "mt-4 text-sm font-medium text-emerald-700" : "mt-4 text-sm font-medium text-red-700"}>
                {product.inStock ? `${product.stock} in stock` : "Out of stock"}
              </p>
            ) : null}

            <div className="mt-6">
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
                ) : null
              ) : product.purchasable ? (
                <QuantityAddToCart product={product} />
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <AskQuestionButton product={product} vendor={vendor} />
              <CompareButton productId={product.id} name={product.name} withLabel />
              <WishlistButton productId={product.id} name={product.name} withLabel />
            </div>

            {product.tags.length ? (
              <p className="mt-6 text-sm">
                <span className="text-muted">Tag: </span>
                {product.tags.join(", ")}
              </p>
            ) : null}
          </div>
        </div>

        <ProductTabs product={product} reviews={reviews} vendor={vendor} />

        {related.length ? (
          <section className="mt-16">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">Related products</h2>
            <ProductGrid products={related} vendors={vendors} />
          </section>
        ) : null}
      </div>
    </>
  );
}
