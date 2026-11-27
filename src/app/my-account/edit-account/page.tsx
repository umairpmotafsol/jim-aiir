import type { Metadata } from "next";
import { EditAccount } from "@/components/account/account-pages";

export const metadata: Metadata = { title: "Account details" };

export default function EditAccountPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account details</h2>
      <EditAccount />
    </div>
  );
}
