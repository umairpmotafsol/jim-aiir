import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { StoreManagerShell } from "@/components/store-manager/shell";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: { default: "Store Manager", template: "%s | Store Manager | AIIR" },
  robots: { index: false },
};

export default function StoreManagerLayout({ children }: LayoutProps<"/store-manager">) {
  return (
    <>
      <PageHeader title="Store Manager" eyebrow="Vendor dashboard" image={images.servers} crumbs={[{ label: "Store Manager" }]}>
        Manage your products, orders and storefront in one place.
      </PageHeader>
      <div className="container-page py-10">
        <StoreManagerShell>{children}</StoreManagerShell>
      </div>
    </>
  );
}
