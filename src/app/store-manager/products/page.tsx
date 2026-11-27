import type { Metadata } from "next";
import categories from "@/data/categories.json";
import { getProducts } from "@/lib/api/catalog";
import { ProductsList } from "@/components/store-manager/products-list";

export const metadata: Metadata = { title: "Products" };

export default async function VendorProductsPage() {
  const { items } = await getProducts({ perPage: 500 });
  return <ProductsList seed={items} categories={categories} />;
}
