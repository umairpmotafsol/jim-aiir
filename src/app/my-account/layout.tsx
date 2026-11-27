import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { AccountShell } from "@/components/account/account-shell";
import { images } from "@/lib/images";

export const metadata: Metadata = { title: { default: "My account", template: "%s | My account | AIIR" }, robots: { index: false } };

export default function AccountLayout({ children }: LayoutProps<"/my-account">) {
  return (
    <>
      <PageHeader title="My account" eyebrow="Welcome" image={images.office} crumbs={[{ label: "My account" }]}>
        Track orders, manage addresses and keep your details up to date.
      </PageHeader>
      <div className="container-page py-10">
        <AccountShell>{children}</AccountShell>
      </div>
    </>
  );
}
