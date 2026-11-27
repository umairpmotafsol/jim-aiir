import Link from "next/link";
import Form from "next/form";
import { Search } from "lucide-react";
import { getCategoryTree } from "@/lib/api/catalog";
import { mainNav, site } from "@/lib/config";
import { LogoMark, FacebookIcon, InstagramIcon, XIcon } from "@/components/ui/icons";
import { AccountLinks, HeaderActions } from "./header-actions";
import { CategoryMenu } from "./category-menu";
import { MobileMenu } from "./mobile-menu";
import { NavDropdown } from "./nav-dropdown";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${site.name} home`}>
      <LogoMark className="size-9" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold tracking-tight text-ink">{site.name}</span>
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-muted sm:block">AI Institute of Ireland</span>
      </span>
    </Link>
  );
}

export async function Header() {
  const categories = await getCategoryTree();
  const flat = categories.flatMap((c) => [c, ...c.children.map((ch) => ({ ...ch, name: `— ${ch.name}` }))]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 shadow-[0_1px_0_0_var(--color-line)] backdrop-blur">
      {/* Top bar */}
      <div className="hidden bg-brand-950 text-xs text-brand-100 md:block">
        <div className="container-page flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/refund-returns" className="hover:text-white">
              Returns policy
            </Link>
            <Link href="/contact" className="hover:text-white">
              Help &amp; contact
            </Link>
            <span className="flex items-center gap-3">
              <span className="text-brand-300">Follow us</span>
              <a href={site.social.facebook} target="_blank" rel="noreferrer" aria-label="AIIR on Facebook" className="hover:text-white">
                <FacebookIcon className="size-3.5" />
              </a>
              <a href={site.social.x} target="_blank" rel="noreferrer" aria-label="AIIR on X" className="hover:text-white">
                <XIcon className="size-3.5" />
              </a>
              <a href={site.social.instagram} target="_blank" rel="noreferrer" aria-label="AIIR on Instagram" className="hover:text-white">
                <InstagramIcon className="size-3.5" />
              </a>
            </span>
          </div>
          <AccountLinks />
        </div>
      </div>

      {/* Main bar */}
      <div className="container-page flex h-18 items-center gap-4 py-3 lg:gap-8">
        <MobileMenu categories={categories} />
        <Logo />
        <Form action="/shop" className="hidden flex-1 md:flex" role="search">
          <label htmlFor="header-search" className="sr-only">
            Search products
          </label>
          <div className="flex h-12 w-full overflow-hidden rounded-xl border border-line bg-surface transition-colors focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Search AI tools, projects and robotics"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm focus:outline-none"
            />
            <label htmlFor="header-search-category" className="sr-only">
              Category
            </label>
            <select
              id="header-search-category"
              name="category"
              defaultValue=""
              className="hidden max-w-44 border-l border-line bg-transparent px-3 text-sm text-slate-600 focus:outline-none lg:block"
            >
              <option value="">All categories</option>
              {flat.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <button type="submit" className="m-1 grid w-11 place-items-center rounded-lg bg-brand-600 text-white hover:bg-brand-700" aria-label="Search">
              <Search className="size-5" />
            </button>
          </div>
        </Form>
        <HeaderActions />
      </div>

      {/* Navigation */}
      <div className="hidden border-t border-line lg:block">
        <div className="container-page flex h-12 items-center gap-8">
          <CategoryMenu categories={categories} />
          <nav aria-label="Main" className="flex items-center gap-8 text-sm font-semibold text-slate-700">
            {mainNav.map((item) =>
              item.children ? (
                <NavDropdown key={item.label} label={item.label} items={item.children} />
              ) : (
                <Link key={item.href} href={item.href} className="hover:text-brand-700">
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>

      {/* Mobile search */}
      <Form action="/shop" className="container-page pb-3 md:hidden" role="search">
        <label htmlFor="mobile-search" className="sr-only">
          Search products
        </label>
        <div className="flex h-11 overflow-hidden rounded-xl border border-line bg-surface">
          <input id="mobile-search" name="q" type="search" placeholder="Search products" className="min-w-0 flex-1 bg-transparent px-3 text-sm focus:outline-none" />
          <button type="submit" className="grid w-11 place-items-center bg-brand-600 text-white" aria-label="Search">
            <Search className="size-4" />
          </button>
        </div>
      </Form>
    </header>
  );
}
