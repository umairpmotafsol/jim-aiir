import Image from "next/image";
import Form from "next/form";
import { ArrowLeft, Search } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { images } from "@/lib/images";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      <Image src={images.robotDark} alt="" fill sizes="100vw" className="-z-20 object-cover object-right opacity-50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-950/30" aria-hidden />
      <div className="container-page py-24 sm:py-32">
        <p className="text-gradient text-8xl font-extrabold sm:text-9xl">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">This page went off-grid</h1>
        <p className="mt-4 max-w-lg text-lg text-brand-100">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Try searching the shop instead.
        </p>
        <Form action="/shop" role="search" className="mt-8 flex max-w-md rounded-2xl bg-white p-1.5">
          <label htmlFor="nf-search" className="sr-only">
            Search products
          </label>
          <Search className="ml-3 size-5 shrink-0 self-center text-slate-400" aria-hidden />
          <input id="nf-search" name="q" type="search" placeholder="Search products" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink focus:outline-none" />
          <button type="submit" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold hover:bg-brand-700">
            Search
          </button>
        </Form>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/" variant="light">
            <ArrowLeft className="size-4" aria-hidden /> Back to home
          </LinkButton>
          <LinkButton href="/contact" variant="glass">
            Contact support
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
