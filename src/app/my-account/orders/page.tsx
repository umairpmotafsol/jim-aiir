import type { Metadata } from "next";
import { OrdersTable } from "@/components/account/account-pages";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders</h2>
      <OrdersTable />
    </div>
  );
}
