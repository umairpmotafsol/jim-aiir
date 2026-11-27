import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MapPin } from "lucide-react";
import { getCategoryTree } from "@/lib/api/catalog";
import { site } from "@/lib/config";
import { FacebookIcon, InstagramIcon, LogoMark, XIcon } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { images } from "@/lib/images";

export async function Footer() {
  const categories = await getCategoryTree();
  const linkClass = "text-sm text-brand-200 hover:text-white";

  return (
    <footer className="mt-auto bg-brand-950 text-brand-100">
      <div className="container-page pt-14">
        <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <Image src={images.circuit} alt="" fill sizes="(min-width: 1280px) 80rem, 100vw" className="-z-20 object-cover opacity-50" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900 via-brand-900/90 to-brand-800/60" aria-hidden />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">Newsletter</p>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Stay ahead of what&apos;s next in AI</h2>
            <p className="mt-2 text-sm text-brand-200">New tools, vendor launches and AIIR news, once a month. No spam.</p>
          </div>
          <NewsletterForm tone="dark" />
        </div>
      </div>
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
            <LogoMark className="size-9" />
            <span className="font-display text-xl font-bold text-white">{site.name}</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-brand-200">{site.description}</p>
          <ul className="mt-5 space-y-2 text-sm text-brand-200">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden /> Dublin, Ireland
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" aria-hidden />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Categories</h2>
          <ul className="space-y-2.5">
            {categories
              .filter((c) => c.slug !== "uncategorized")
              .slice(0, 6)
              .map((c) => (
                <li key={c.slug}>
                  <Link href={`/product-category/${c.slug}`} className={linkClass}>
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Marketplace</h2>
          <ul className="space-y-2.5">
            <li><Link href="/shop" className={linkClass}>All products</Link></li>
            <li><Link href="/shop?sale=1" className={linkClass}>On sale</Link></li>
            <li><Link href="/vendor-register" className={linkClass}>Become a vendor</Link></li>
            <li><Link href="/store-manager" className={linkClass}>Vendor store manager</Link></li>
            <li><Link href="/my-account" className={linkClass}>My account</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Help</h2>
          <ul className="space-y-2.5">
            <li><Link href="/about-us" className={linkClass}>About us</Link></li>
            <li><Link href="/contact" className={linkClass}>Contact</Link></li>
            <li><Link href="/faq" className={linkClass}>FAQ</Link></li>
            <li><Link href="/terms-and-conditions" className={linkClass}>Terms and conditions</Link></li>
            <li><Link href="/refund-returns" className={linkClass}>Refund and returns policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-brand-300 sm:flex-row">
          <p>
            © <CopyrightYear /> {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href={site.social.facebook} target="_blank" rel="noreferrer" aria-label="AIIR on Facebook" className="hover:text-white">
              <FacebookIcon className="size-4" />
            </a>
            <a href={site.social.x} target="_blank" rel="noreferrer" aria-label="AIIR on X" className="hover:text-white">
              <XIcon className="size-4" />
            </a>
            <a href={site.social.instagram} target="_blank" rel="noreferrer" aria-label="AIIR on Instagram" className="hover:text-white">
              <InstagramIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
