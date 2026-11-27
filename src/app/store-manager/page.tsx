import { Suspense } from "react";
import { getProducts } from "@/lib/api/catalog";
import { Skeleton } from "@/components/ui/misc";
import { StoreOverview } from "@/components/store-manager/overview";

export default async function StoreManagerPage() {
  const { items } = await getProducts({ perPage: 500 });
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <StoreOverview seed={items} />
    </Suspense>
  );
}
