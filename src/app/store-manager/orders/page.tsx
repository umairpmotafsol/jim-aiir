import type { Metadata } from "next";
import { VendorOrders } from "@/components/store-manager/orders";

export const metadata: Metadata = { title: "Orders" };

export default function VendorOrdersPage() {
  return <VendorOrders />;
}
