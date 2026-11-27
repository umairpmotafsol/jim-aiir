"use client";

import { useSearchParams } from "next/navigation";
import { CircleCheck, SearchX } from "lucide-react";
import { useOrders } from "@/lib/store/orders";
import { useHydrated } from "@/lib/store/hydration";
import { useCurrentUser } from "@/lib/store/auth";
import { OrderDetails } from "@/components/account/order-details";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { LinkButton } from "@/components/ui/button";

export function OrderReceived() {
  const id = useSearchParams().get("order");
  const hydrated = useHydrated();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));
  const user = useCurrentUser();

  if (!hydrated) return <Skeleton className="h-96" />;

  if (!order) {
    return (
      <EmptyState icon={<SearchX className="size-7" />} title="We couldn't find that order" action={<LinkButton href="/shop">Continue shopping</LinkButton>}>
        The link may be incomplete, or the order was placed on another device.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <CircleCheck className="size-8 shrink-0 text-emerald-600" aria-hidden />
        <div>
          <h2 className="text-xl font-bold text-emerald-900">Thank you. Your order has been received.</h2>
          <p className="mt-1 text-sm text-emerald-800">
            A confirmation will be sent to <strong>{order.email}</strong>. Pay with cash when your order is delivered.
          </p>
        </div>
      </div>
      <OrderDetails order={order} />
      <div className="flex flex-wrap gap-3">
        <LinkButton href="/shop">Continue shopping</LinkButton>
        {user ? (
          <LinkButton href="/my-account/orders" variant="outline">
            View my orders
          </LinkButton>
        ) : null}
      </div>
    </div>
  );
}
