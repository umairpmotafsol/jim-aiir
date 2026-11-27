"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type FormState } from "@/app/actions";
import { cn } from "@/lib/format";

const initial: FormState = { status: "idle" };

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);
  const dark = tone === "dark";

  return (
    <form action={action} noValidate className="w-full max-w-md">
      <div className="flex gap-2">
        <label htmlFor={`newsletter-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-${tone}`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.status === "error" ? state.values?.email : ""}
          key={state.status === "success" ? "reset" : "keep"}
          aria-invalid={state.status === "error"}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-xl border px-4 text-sm focus:outline-none focus:ring-2",
            dark
              ? "border-white/20 bg-white/10 text-white placeholder:text-brand-300 focus:ring-accent-400"
              : "border-line bg-white focus:border-brand-500 focus:ring-brand-200",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-xl bg-accent-500 px-6 text-sm font-bold text-brand-950 hover:bg-accent-400 disabled:opacity-60"
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={cn(
            "mt-2 text-sm",
            state.status === "error" ? (dark ? "text-red-300" : "text-red-600") : dark ? "text-emerald-300" : "text-emerald-700",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
