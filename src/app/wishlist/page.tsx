import type { Metadata } from "next";
import { getProducts, getVendors } from "@/lib/api/catalog";
import { PageHeader } from "@/components/ui/misc";
import { WishlistView } from "@/components/product/saved-lists";
import { images } from "@/lib/images";

export const metadata: Metadata = { title: "My wishlist", robots: { index: false } };

export default async function WishlistPage() {
  // TODO(backend): the wishlist lives in localStorage; sync it to the account once the API exists.
  const [{ items }, vendors] = await Promise.all([getProducts({ perPage: 500 }), getVendors()]);
  return (
    <>
      <PageHeader title="My wishlist" eyebrow="Saved for later" image={images.robotHand} crumbs={[{ label: "Wishlist" }]}>
        Products you&apos;ve saved. Add them to your cart whenever you&apos;re ready.
      </PageHeader>
      <div className="container-page py-12">
        <WishlistView products={items} vendors={vendors} />
      </div>
    </>
  );
}
