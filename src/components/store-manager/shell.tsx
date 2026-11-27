"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ClipboardList, ExternalLink, LayoutDashboard, LogIn, LogOut, Package, PlusCircle, Settings, Store, UserRound } from "lucide-react";
import { useAuth, useCurrentUser } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";
import { LinkButton } from "@/components/ui/button";
import { EmptyState, Notice, Skeleton } from "@/components/ui/misc";
import { cn } from "@/lib/format";
import { images } from "@/lib/images";

const nav = [
  { href: "/store-manager", label: "Overview", icon: LayoutDashboard },
  { href: "/store-manager/products", label: "Products", icon: Package },
  { href: "/store-manager/products/new", label: "Add product", icon: PlusCircle },
  { href: "/store-manager/orders", label: "Orders", icon: ClipboardList },
  { href: "/store-manager/settings", label: "Store settings", icon: Settings },
];

export function StoreManagerShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const logout = useAuth((s) => s.logout);
  const pathname = usePathname();
  const router = useRouter();

  if (!hydrated) return <Skeleton className="h-[32rem]" />;

  if (!user) {
    return (
      <EmptyState
        icon={<LogIn className="size-7" />}
        title="Log in to your vendor account"
        action={
          <>
            <LinkButton href="/my-account?redirect=/store-manager">Log in</LinkButton>
            <LinkButton href="/vendor-register" variant="outline">
              Become a vendor
            </LinkButton>
          </>
        }
      >
        The Store Manager is where vendors manage products and orders. Try the demo vendor: vendor@aiir.test / Password123!
      </EmptyState>
    );
  }

  if (user.role !== "vendor") {
    return (
      <EmptyState
        icon={<Store className="size-7" />}
        title="This area is for vendors"
        action={
          <>
            <LinkButton href="/vendor-register">Open a store</LinkButton>
            <LinkButton href="/my-account" variant="outline">
              Go to my account
            </LinkButton>
          </>
        }
      >
        You&apos;re logged in as a customer. Register as a vendor to start selling on AIIR.
      </EmptyState>
    );
  }

  const isActive = (href: string) =>
    href === "/store-manager"
      ? pathname === href
      : href === "/store-manager/products"
        ? pathname === href || pathname.startsWith("/store-manager/products/edit")
        : pathname.startsWith(href);

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside className="h-fit overflow-hidden rounded-3xl bg-brand-950 text-brand-100 lg:sticky lg:top-40">
        <div className="relative isolate p-5">
          <Image src={images.circuit} alt="" fill sizes="17rem" className="-z-20 object-cover opacity-30" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-950/40 to-brand-950" aria-hidden />
          <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-2xl font-extrabold text-white shadow-lift">
            {(user.storeName ?? user.displayName).charAt(0)}
          </div>
          <p className="mt-3 text-lg font-bold text-white">{user.storeName ?? user.displayName}</p>
          <p className="flex items-center gap-1.5 text-xs text-brand-300">
            <UserRound className="size-3.5" aria-hidden /> {user.email}
          </p>
          {user.vendorSlug ? (
            <Link href={`/store/${user.vendorSlug}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-300 hover:underline">
              View storefront <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          ) : null}
        </div>
        <nav aria-label="Store manager" className="border-t border-white/10 p-3">
          <ul className="space-y-1">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active ? "bg-white text-brand-900" : "hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="size-4" aria-hidden /> {label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/my-account");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" aria-hidden /> Log out
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="min-w-0 space-y-6">
        {user.status === "pending" ? (
          <Notice>
            Your vendor application is being reviewed. You can set up products now; they&apos;ll go live once your store is approved.
          </Notice>
        ) : null}
        {children}
      </div>
    </div>
  );
}
