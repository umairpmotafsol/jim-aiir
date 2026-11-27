import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog, CatalogSkeleton } from "@/components/shop/catalog";
import { PageHeader } from "@/components/ui/misc";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse AI tools, APIs, robotics and projects from AIIR vendors.",
};

export default function ShopPage({ searchParams }: PageProps<"/shop">) {
  return (
    <>
      <PageHeader title="Shop all products" eyebrow="Marketplace" image={images.servers} crumbs={[{ label: "Shop" }]}>
        AI applications, development APIs, robotics and more from independent vendors.
      </PageHeader>
      <Suspense fallback={<CatalogSkeleton />}>
        {searchParams.then((sp) => (
          <Catalog basePath="/shop" searchParams={sp} />
        ))}
      </Suspense>
    </>
  );
}
