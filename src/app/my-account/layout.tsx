import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { AccountShell } from "@/components/account/account-shell";

export const metadata: Metadata = { title: { default: "My account", template: "%s | My account | AIIR" }, robots: { index: false } };

export default function AccountLayout({ children }: LayoutProps<"/my-account">) {
  return (
    <>
      <PageHeader crumbs={[{ label: "My account" }]} />
      <div className="container-page py-10">
        <AccountShell>{children}</AccountShell>
      </div>
    </>
  );
}
