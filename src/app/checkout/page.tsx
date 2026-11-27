import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { images } from "@/lib/images";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader title="Secure checkout" eyebrow="Almost there" image={images.glass} crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}>
        Your details are only shared with the vendors fulfilling your order.
      </PageHeader>
      <div className="container-page py-10">
        <CheckoutForm />
      </div>
    </>
  );
}
