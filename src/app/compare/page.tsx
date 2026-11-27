import type { Metadata } from "next";
import categories from "@/data/categories.json";
import { getProducts, getVendors } from "@/lib/api/catalog";
import { PageHeader } from "@/components/ui/misc";
import { CompareView } from "@/components/product/saved-lists";
import { images } from "@/lib/images";

export const metadata: Metadata = { title: "Compare products", robots: { index: false } };

export default async function ComparePage() {
  const [{ items }, vendors] = await Promise.all([getProducts({ perPage: 500 }), getVendors()]);
  return (
    <>
      <PageHeader title="Compare products" eyebrow="Side by side" image={images.chess} crumbs={[{ label: "Compare" }]}>
        Compare price, rating, availability and vendor for up to four products.
      </PageHeader>
      <div className="container-page py-10">
        <CompareView products={items} vendors={vendors} categories={categories} />
      </div>
    </>
  );
}
