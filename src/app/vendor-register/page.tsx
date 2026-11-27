import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Globe, LayoutDashboard, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/misc";
import { images } from "@/lib/images";
import { VendorRegisterForm } from "./vendor-register-form";

export const metadata: Metadata = {
  title: "Become a vendor",
  description: "Open your own store on the AIIR marketplace and sell AI tools, APIs, robotics and services.",
};

const perks = [
  { icon: Wallet, title: "Free to start", text: "No setup fee to open your store." },
  { icon: Globe, title: "Your own storefront", text: "A public store page with your products, story and policies." },
  { icon: LayoutDashboard, title: "Store Manager", text: "Add products and handle orders from one dashboard." },
  { icon: BadgeCheck, title: "Verified badge", text: "Approved vendors get the AIIR verified badge." },
];

export default function VendorRegisterPage() {
  return (
    <>
      <PageHeader title="Open your AIIR store" eyebrow="Sell on AIIR" image={images.sell} crumbs={[{ label: "Become a vendor" }]}>
        Reach buyers looking for AI tools, APIs, robotics and expertise. Registration takes about five minutes.
      </PageHeader>

      <div className="container-page grid gap-10 py-14 lg:grid-cols-[22rem_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-40 lg:h-fit">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src={images.team2} alt="A team working together in a bright office" fill sizes="22rem" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" aria-hidden />
            <p className="absolute bottom-5 left-5 right-5 text-lg font-bold text-white">Join the builders shaping AI in Ireland and beyond.</p>
          </div>
          <ul className="card divide-y divide-line">
            {perks.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 p-5">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <VendorRegisterForm />
      </div>
    </>
  );
}
