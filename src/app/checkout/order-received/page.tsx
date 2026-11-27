import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, Skeleton } from "@/components/ui/misc";
import { OrderReceived } from "./order-received";

export const metadata: Metadata = { title: "Order received", robots: { index: false } };

export default function OrderReceivedPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Checkout", href: "/checkout" }, { label: "Order received" }]} title="Order received" />
      <div className="container-page max-w-4xl py-10">
        <Suspense fallback={<Skeleton className="h-96" />}>
          <OrderReceived />
        </Suspense>
      </div>
    </>
  );
}
