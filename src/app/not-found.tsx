import Form from "next/form";
import { Search } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="border-b border-line py-28 text-center">
      <div className="container-page relative max-w-xl">
        <p className="font-display text-8xl font-bold text-brand-600 sm:text-9xl">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Oops! That page can&apos;t be found.</h1>
        <p className="mt-4 text-muted">It looks like nothing was found at this location. Maybe try a search?</p>
        <Form action="/shop" role="search" className="relative mx-auto mt-8 max-w-md">
          <label htmlFor="nf-search" className="sr-only">
            Find your projects
          </label>
          <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            id="nf-search"
            name="q"
            type="search"
            placeholder="Find your projects"
            className="h-12 w-full rounded-md border border-line bg-white pl-12 pr-4 text-sm shadow-card focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
        </Form>
        <LinkButton href="/" className="mt-8">
          Back to home
        </LinkButton>
      </div>
    </section>
  );
}
