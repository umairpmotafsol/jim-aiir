import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAllCategoryPaths, getCategoryPath } from "@/lib/api/catalog";
import { Catalog, CatalogSkeleton } from "@/components/shop/catalog";
import { PageHeader } from "@/components/ui/misc";
import { categoryImage } from "@/lib/images";

export async function generateStaticParams() {
  const paths = await getAllCategoryPaths();
  return paths.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/product-category/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const path = await getCategoryPath(slug);
  const cat = path?.at(-1);
  return cat ? { title: cat.name, description: `Shop ${cat.name} on AIIR.` } : { title: "Category not found" };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/product-category/[...slug]">) {
  const { slug } = await params;
  const path = await getCategoryPath(slug);
  if (!path) notFound();
  const category = path[path.length - 1];

  return (
    <>
      <PageHeader
        title={category.name}
        eyebrow="Category"
        image={categoryImage(category.slug)}
        crumbs={[
          { label: "Shop", href: "/shop" },
          ...path.map((c, i) => ({ label: c.name, href: `/product-category/${slug.slice(0, i + 1).join("/")}` })),
        ]}
      >
        Explore {category.name.toLowerCase()} from independent AIIR vendors.
      </PageHeader>
      <Suspense fallback={<CatalogSkeleton />}>
        {searchParams.then((sp) => (
          <Catalog
            basePath={`/product-category/${slug.join("/")}`}
            searchParams={sp}
            category={category.slug}
            categoryPath={slug}
          />
        ))}
      </Suspense>
    </>
  );
}
