import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { images } from "@/lib/images";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <>
      <PageHeader title="Shopping cart" eyebrow="Your basket" image={images.glass} crumbs={[{ label: "Cart" }]}>
        Review your items, apply a coupon and choose shipping before checkout.
      </PageHeader>
      <div className="container-page py-10">
        <CartView />
      </div>
    </>
  );
}
