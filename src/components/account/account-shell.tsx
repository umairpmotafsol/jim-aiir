"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { ClipboardList, LayoutDashboard, LogOut, MapPin, Store, User } from "lucide-react";
import { useAuth, useCurrentUser } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";
import { AuthForms } from "./auth-forms";
import { Skeleton } from "@/components/ui/misc";
import { cn } from "@/lib/format";

const nav = [
  { href: "/my-account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-account/orders", label: "Orders", icon: ClipboardList },
  { href: "/my-account/addresses", label: "Addresses", icon: MapPin },
  { href: "/my-account/edit-account", label: "Account details", icon: User },
];

const publicPaths = ["/my-account/lost-password"];

export function AccountShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const logout = useAuth((s) => s.logout);
  const pathname = usePathname();
  const router = useRouter();

  if (publicPaths.includes(pathname)) return <>{children}</>;
  if (!hydrated) return <Skeleton className="h-96" />;
  if (!user) {
    return (
      <Suspense fallback={<Skeleton className="h-96" />}>
        <AuthForms />
      </Suspense>
    );
  }

  const link = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
      active ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-brand-50 hover:text-brand-700",
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
      <nav aria-label="Account" className="h-fit rounded-2xl border border-line p-3">
        <ul className="space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/my-account" ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link href={href} className={link(active)} aria-current={active ? "page" : undefined}>
                  <Icon className="size-4" aria-hidden /> {label}
                </Link>
              </li>
            );
          })}
          {user.role === "vendor" ? (
            <li>
              <Link href="/store-manager" className={link(false)}>
                <Store className="size-4" aria-hidden /> Store manager
              </Link>
            </li>
          ) : null}
          <li>
            <button
              type="button"
              className={cn(link(false), "w-full")}
              onClick={() => {
                logout();
                router.push("/my-account");
              }}
            >
              <LogOut className="size-4" aria-hidden /> Log out
            </button>
          </li>
        </ul>
      </nav>
      <div>{children}</div>
    </div>
  );
}
