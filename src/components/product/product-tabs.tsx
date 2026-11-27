"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Star } from "lucide-react";
import { submitInquiry, submitReview, type FormState } from "@/app/actions";
import { Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Notice, Rating } from "@/components/ui/misc";
import { cn, formatDate } from "@/lib/format";
import type { Product, Review, Vendor } from "@/lib/types";

type Props = { product: Product; reviews: Review[]; vendor: Vendor | null };

export function ProductTabs({ product, reviews }: Props) {
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
      ) : null,
    },
    { id: "reviews", label: `Reviews (${reviews.length})`, content: <Reviews product={product} reviews={reviews} /> },
    { id: "offers", label: "More Offers", content: <p className="text-slate-600">No more offers for this product!</p> },
    { id: "policies", label: "Store Policies", content: null },
    {
      id: "inquiries",
      label: "Inquiries",
      content: (
        <div>
          <h2 className="text-xl font-bold">General Inquiries</h2>
          <p className="mt-3 text-slate-600">There are no inquiries yet.</p>
        </div>
      ),
    },
  ];
  const [active, setActive] = useState(tabs[0].id);

  return (
    <section id="product-tabs" className="mt-16 scroll-mt-32 rounded-lg border border-line bg-white px-6 sm:px-8">
      <div role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto border-b border-line pt-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`ptab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`ppanel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-4 py-4 text-sm font-semibold transition-colors",
              active === t.id ? "border-brand-600 text-ink" : "border-transparent text-slate-500 hover:text-slate-800",
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
        <ul className="mb-4 space-y-2 text-sm">
          {[5, 4, 3, 2, 1].map((n) => {
            const count = reviews.filter((r) => r.rating === n).length;
            return (
              <li key={n} className="flex items-center gap-3">
                <span className="w-14 shrink-0">{n} Stars</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full rounded-md bg-amber-400" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mb-8 text-sm text-muted">
          Average Star Rating: {average.toFixed(1)} out of 5 ({reviews.length} vote{reviews.length === 1 ? "" : "s"})
        </p>
        <h2 className="mb-4 text-xl font-bold">Reviews</h2>
        {reviews.length ? (
          <ul className="space-y-5">
            {reviews.map((r, i) => (
              <li key={i} className="rounded-md border border-line p-4">
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
          <p className="text-muted">There are no reviews yet.</p>
        )}
      </div>
      <div className="rounded-lg bg-surface p-6">
        <h3 className="text-lg font-semibold">{reviews.length ? "Add a review" : <>Be the first to review &ldquo;{product.name}&rdquo;</>}</h3>
        <p className="mt-1 text-sm text-muted">Your email address will not be published. Required fields are marked *</p>
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

export function InquiryForm({ product, vendor }: { product?: Product; vendor: Vendor | null }) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const e = state.errors ?? {};
  if (state.status === "success") return <Notice tone="success">{state.message}</Notice>;
  return (
    <form action={action} noValidate className="space-y-4">
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

