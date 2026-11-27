import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { CheckoutForm } from "@/components/cart/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} title="Checkout" />
      <div className="container-page py-10">
        <CheckoutForm />
      </div>
    </>
  );
}
