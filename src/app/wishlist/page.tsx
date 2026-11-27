import type { Metadata } from "next";
import { getProducts, getVendors } from "@/lib/api/catalog";
import { PageHeader } from "@/components/ui/misc";
import { WishlistView } from "@/components/product/saved-lists";

export const metadata: Metadata = { title: "My wishlist", robots: { index: false } };

export default async function WishlistPage() {
  // TODO(backend): the wishlist lives in localStorage; sync it to the account once the API exists.
  const [{ items }, vendors] = await Promise.all([getProducts({ perPage: 500 }), getVendors()]);
  return (
    <>
      <PageHeader crumbs={[{ label: "Wishlist" }]} />
      <div className="container-page py-12">
        <h1 className="mb-6 text-2xl font-bold">My wishlist on MarketPress</h1>
        <WishlistView products={items} vendors={vendors} />
      </div>
    </>
  );
}
