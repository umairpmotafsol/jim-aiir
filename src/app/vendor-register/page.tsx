import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/misc";
import { VendorRegisterForm } from "./vendor-register-form";

export const metadata: Metadata = { title: "Vendor Registration" };

export default function VendorRegisterPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Vendor Registration" }]} />
      <section className="container-page max-w-3xl py-16">
        <p className="eyebrow">Sell on AIIR</p>
        <h1 className="mb-8 mt-3 text-4xl font-bold tracking-tight">Vendor Registration</h1>
        <div className="rounded-lg border border-line bg-white p-6 shadow-card sm:p-10">
          <VendorRegisterForm />
        </div>
      </section>
    </>
  );
}
