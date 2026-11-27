import type { Metadata } from "next";
import { Addresses } from "@/components/account/account-pages";

export const metadata: Metadata = { title: "Addresses" };

export default function AddressesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Addresses</h2>
      <Addresses />
    </div>
  );
}
