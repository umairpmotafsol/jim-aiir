"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // TODO: report to the error tracker once one is configured.
    console.error(error);
  }, [error]);

  return (
    <section className="container-page flex flex-col items-center py-24 text-center">
      <div className="grid size-16 place-items-center rounded-lg bg-red-50 text-red-600">
        <TriangleAlert className="size-8" aria-hidden />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">
        We couldn&apos;t load this page. Please try again; if it keeps happening, let us know.
      </p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-slate-400">Reference: {error.digest}</p> : null}
      <div className="mt-8 flex gap-3">
        <Button onClick={retry}>
          <RotateCcw className="size-4" aria-hidden /> Try again
        </Button>
        <Link href="/" className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm font-semibold hover:border-brand-400">
          Go home
        </Link>
      </div>
    </section>
  );
}
