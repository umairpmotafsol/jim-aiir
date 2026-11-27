import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/misc";
import { ViewOrder } from "./view-order";

export const metadata: Metadata = { title: "Order details" };

export default function ViewOrderPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <ViewOrder />
    </Suspense>
  );
}
