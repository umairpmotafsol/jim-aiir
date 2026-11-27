"use client";

import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { Star } from "lucide-react";
import { submitInquiry, submitReview, type FormState } from "@/app/actions";
import { Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Notice, Rating } from "@/components/ui/misc";
import { cn, formatDate } from "@/lib/format";
import type { Product, Review, Vendor } from "@/lib/types";

type Props = { product: Product; reviews: Review[]; vendor: Vendor | null };

export function ProductTabs({ product, reviews, vendor }: Props) {
  const tabs: { id: string; label: string; content: ReactNode }[] = [
    {
      id: "description",
      label: "Description",
      content: product.description.length ? (
        <div className="prose-aiir max-w-3xl">
          {product.description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <p className="text-muted">The vendor hasn&apos;t added a description yet.</p>
      ),
    },
    { id: "reviews", label: `Reviews (${reviews.length})`, content: <Reviews product={product} reviews={reviews} /> },
    { id: "vendor", label: "Vendor & policies", content: <VendorInfo vendor={vendor} /> },
    { id: "questions", label: "Ask a question", content: <InquiryForm product={product} vendor={vendor} /> },
  ];
  const [active, setActive] = useState(tabs[0].id);

  return (
    <section id="product-tabs" className="mt-14 scroll-mt-32">
      <div role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`ptab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`ppanel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold",
              active === t.id ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`ppanel-${t.id}`} aria-labelledby={`ptab-${t.id}`} hidden={active !== t.id} className="py-8">
          {t.content}
        </div>
      ))}
    </section>
  );
}

const initial: FormState = { status: "idle" };

function Reviews({ product, reviews }: { product: Product; reviews: Review[] }) {
  const [state, action, pending] = useActionState(submitReview, initial);
  const [rating, setRating] = useState(0);
  const e = state.errors ?? {};
  const average = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 flex items-center gap-4">
          <p className="font-display text-4xl font-bold">{average.toFixed(1)}</p>
          <div>
            <Rating value={average} />
            <p className="mt-1 text-sm text-muted">
              Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {reviews.length ? (
          <ul className="space-y-5">
            {reviews.map((r, i) => (
              <li key={i} className="rounded-xl border border-line p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{r.author}</p>
                  <time className="text-xs text-muted" dateTime={r.date}>
                    {formatDate(r.date)}
                  </time>
                </div>
                <Rating value={r.rating} className="mt-1" />
                <p className="mt-2 text-sm text-slate-600">{r.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">There are no reviews yet. Be the first to review &ldquo;{product.name}&rdquo;.</p>
        )}
      </div>
      <div className="rounded-2xl bg-surface p-6">
        <h3 className="text-lg font-semibold">Write a review</h3>
        {state.status === "success" ? (
          <div className="mt-4">
            <Notice tone="success">{state.message}</Notice>
          </div>
        ) : (
          <form action={action} noValidate className="mt-4 space-y-4">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="rating" value={rating} />
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-slate-700">
                Your rating <span className="text-red-500">*</span>
              </legend>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    aria-pressed={rating === n}
                    className="rounded p-0.5"
                  >
                    <Star className={cn("size-7", n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
                  </button>
                ))}
              </div>
              {e.rating ? <p className="mt-1.5 text-xs font-medium text-red-600">{e.rating}</p> : null}
            </fieldset>
            <Textarea label="Your review" name="review" required defaultValue={state.values?.review} error={e.review} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" name="name" required autoComplete="name" defaultValue={state.values?.name} error={e.name} />
              <Input label="Email" name="email" type="email" required autoComplete="email" defaultValue={state.values?.email} error={e.email} hint="Never published." />
            </div>
            <Button type="submit" loading={pending}>
              Submit review
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function VendorInfo({ vendor }: { vendor: Vendor | null }) {
  if (!vendor) {
    return <p className="text-muted">This product is sold and shipped by AIIR. See our <Link href="/refund-returns" className="font-semibold text-brand-700 hover:underline">refund and returns policy</Link>.</p>;
  }
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h3 className="text-lg font-semibold">{vendor.name}</h3>
        <p className="mt-1 text-sm text-muted">
          {vendor.city}, {vendor.country}
        </p>
        <p className="mt-3 text-sm text-slate-600">{vendor.about}</p>
        <Link href={`/store/${vendor.slug}`} className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline">
          Visit store
        </Link>
      </div>
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="font-semibold">Shipping</dt>
          <dd className="text-slate-600">{vendor.policies.shipping}</dd>
        </div>
        <div>
          <dt className="font-semibold">Refunds</dt>
          <dd className="text-slate-600">{vendor.policies.refund}</dd>
        </div>
        <div>
          <dt className="font-semibold">Cancellations</dt>
          <dd className="text-slate-600">{vendor.policies.cancellation}</dd>
        </div>
      </dl>
    </div>
  );
}

export function InquiryForm({ product, vendor }: { product?: Product; vendor: Vendor | null }) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const e = state.errors ?? {};
  if (state.status === "success") return <Notice tone="success">{state.message}</Notice>;
  return (
    <form action={action} noValidate className="max-w-xl space-y-4">
      <p className="text-sm text-muted">
        Questions go straight to {vendor ? vendor.name : "the AIIR team"}. Replies are sent to your email.
      </p>
      {product ? <input type="hidden" name="productId" value={product.id} /> : null}
      <input type="hidden" name="vendor" value={vendor?.slug ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" name="name" required autoComplete="name" defaultValue={state.values?.name} error={e.name} />
        <Input label="Email" name="email" type="email" required autoComplete="email" defaultValue={state.values?.email} error={e.email} />
      </div>
      <Textarea label="Your question" name="message" required defaultValue={state.values?.message} error={e.message} />
      <Button type="submit" loading={pending}>
        Send question
      </Button>
    </form>
  );
}

