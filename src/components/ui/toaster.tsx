"use client";

import Link from "next/link";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { useToasts } from "@/lib/store/toast";
import { cn } from "@/lib/format";

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
    >
      {toasts.map((t) => {
        const Icon = t.tone === "success" ? CircleCheck : t.tone === "error" ? CircleAlert : Info;
        return (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border border-line bg-white p-4 shadow-lg"
          >
            <Icon
              className={cn(
                "mt-0.5 size-5 shrink-0",
                t.tone === "success" ? "text-emerald-600" : t.tone === "error" ? "text-red-600" : "text-brand-600",
              )}
              aria-hidden
            />
            <div className="flex-1 text-sm text-slate-700">
              <p>{t.message}</p>
              {t.action ? (
                <Link
                  href={t.action.href}
                  onClick={() => dismiss(t.id)}
                  className="mt-1 inline-block font-semibold text-brand-700 hover:underline"
                >
                  {t.action.label}
                </Link>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="rounded p-0.5 text-slate-400 hover:text-slate-700"
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
