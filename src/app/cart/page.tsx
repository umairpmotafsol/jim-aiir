import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Cart" }]} title="Cart" />
      <div className="container-page py-10">
        <CartView />
      </div>
    </>
  );
}
