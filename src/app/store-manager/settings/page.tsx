import type { Metadata } from "next";
import { StoreSettings } from "@/components/store-manager/settings";

export const metadata: Metadata = { title: "Store settings" };

export default function StoreSettingsPage() {
  return <StoreSettings />;
}
