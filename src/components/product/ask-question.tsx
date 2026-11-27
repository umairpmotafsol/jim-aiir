"use client";

import { useEffect, useRef, useState } from "react";
import { CircleHelp, X } from "lucide-react";
import { InquiryForm } from "./product-tabs";
import type { Product, Vendor } from "@/lib/types";

/** "Ask a Question" button that opens the vendor inquiry form in a modal. */
export function AskQuestionButton({ product, vendor, label = "Ask a Question" }: { product?: Product; vendor: Vendor | null; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink hover:border-brand-400 hover:text-brand-700"
      >
        <CircleHelp className="size-4" aria-hidden /> {label}
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        aria-labelledby="ask-question-title"
        className="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-lg p-0 shadow-lift backdrop:bg-slate-900/50"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="ask-question-title" className="text-lg font-bold">
            {label}
          </h2>
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">{open ? <InquiryForm product={product} vendor={vendor} /> : null}</div>
      </dialog>
    </>
  );
}
