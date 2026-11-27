import Link from "next/link";
import { cacheLife } from "next/cache";
import { MapPin } from "lucide-react";
import { footerCategories, site } from "@/lib/config";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/ui/icons";
import { Logo } from "./header";

const quickLinks = [
  { label: "About us", href: "/about-us" },
  { label: "Term & Conditions", href: "/terms-and-conditions" },
  { label: "Contact us", href: "/contact" },
  { label: "FAQ's", href: "/faq" },
  { label: "Products", href: "/shop" },
  { label: "Returns Policy", href: "/refund-returns" },
];

const social = [
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.x, label: "X", Icon: XIcon },
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
];

export function Footer() {
  const linkClass = "text-sm text-slate-400 transition-colors hover:text-white";

  return (
    <footer className="mt-auto bg-ink text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="[&_span]:text-white">
          <Logo />
          <p className="mt-5 flex items-start gap-2 text-sm text-slate-400">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden /> {site.address}
          </p>
          <div className="mt-6 flex gap-2">
            {social.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${site.name} on ${label}`}
                className="grid size-10 place-items-center rounded-md bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-brand-600 hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Categories</h2>
          <ul className="space-y-2.5">
            {footerCategories.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className={linkClass}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Quick Links</h2>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-6 text-xs text-slate-500">
          © <CopyrightYear /> {site.legalName}. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
