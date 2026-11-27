import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { StoreManagerShell } from "@/components/store-manager/shell";

export const metadata: Metadata = {
  title: { default: "Store Manager", template: "%s | Store Manager | AIIR" },
  robots: { index: false },
};

export default function StoreManagerLayout({ children }: LayoutProps<"/store-manager">) {
  return (
    <>
      <PageHeader crumbs={[{ label: "Store Manager" }]} title="Store Manager" />
      <div className="container-page py-10">
        <StoreManagerShell>{children}</StoreManagerShell>
      </div>
    </>
  );
}
