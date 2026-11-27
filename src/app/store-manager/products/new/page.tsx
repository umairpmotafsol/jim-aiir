import type { Metadata } from "next";
import { Suspense } from "react";
import categories from "@/data/categories.json";
import { getProducts } from "@/lib/api/catalog";
import { Skeleton } from "@/components/ui/misc";
import { ProductForm } from "@/components/store-manager/product-form";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  const { items } = await getProducts({ perPage: 500 });
  const library = [...new Set(items.flatMap((p) => p.images.map((i) => i.src)))];
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <ProductForm mode="new" seed={items} categories={categories} library={library} />
    </Suspense>
  );
}
