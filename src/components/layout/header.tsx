import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { Search } from "lucide-react";
import { mainNav, site } from "@/lib/config";
import { images } from "@/lib/images";
import { cn } from "@/lib/format";
import { AccountLinks, CartButton } from "./header-actions";
import { CategoryMenu } from "./category-menu";
import { MobileMenu } from "./mobile-menu";
import { NavDropdown } from "./nav-dropdown";

/** The AIII logo (white artwork) on a dark rounded tile, so it reads on any background. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex shrink-0 items-center gap-3", className)} aria-label={`${site.name} home`}>
      <span className="grid size-11 place-items-center rounded-md bg-ink p-1.5">
        <Image src={images.logo} alt="" width={286} height={180} priority className="h-auto w-full" />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">{site.name}</span>
    </Link>
  );
}

function SearchForm({ id, className }: { id: string; className?: string }) {
  return (
    <Form action="/shop" role="search" className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Find your projects
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Find your projects"
        className="h-11 w-full rounded-md border border-line bg-surface pl-11 pr-4 text-sm transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
    </Form>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-lg">
      <div className="container-page flex h-18 items-center gap-6">
        <MobileMenu />
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 text-sm font-medium lg:flex">
          <CategoryMenu />
          {mainNav.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} label={item.label} href={item.href} items={item.children} />
            ) : (
              <Link key={item.href} href={item.href} className="rounded-md px-3.5 py-2 text-slate-600 hover:bg-surface hover:text-ink">
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchForm id="header-search" className="mr-2 hidden w-72 md:block lg:hidden xl:block" />
          <CartButton />
          <AccountLinks />
        </div>
      </div>
      <div className="container-page pb-3 md:hidden">
        <SearchForm id="mobile-search" />
      </div>
    </header>
  );
}
