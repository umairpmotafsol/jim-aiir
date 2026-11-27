"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useOrders } from "@/lib/store/orders";
import { useCurrentUser } from "@/lib/store/auth";
import { OrderDetails } from "@/components/account/order-details";
import { Notice } from "@/components/ui/misc";

export function ViewOrder() {
  const id = useSearchParams().get("id");
  const user = useCurrentUser();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));

  // Customers can only see their own orders.
  if (!order || !user || (order.customerId !== user.id && order.email !== user.email)) {
    return <Notice tone="error">Order not found. <Link href="/my-account/orders" className="font-semibold underline">Back to orders</Link></Notice>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order #{order.number}</h2>
        <Link href="/my-account/orders" className="text-sm font-semibold text-brand-700 hover:underline">
          Back to orders
        </Link>
      </div>
      <OrderDetails order={order} />
    </div>
  );
}
