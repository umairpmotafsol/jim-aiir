"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/misc";

export function LostPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("user_login") ?? "").trim();
    if (!value) return setError("Enter a username or email address.");
    setError(null);
    // TODO(backend): POST /auth/password-reset. Always show the same message so accounts can't be enumerated.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mt-6 space-y-4">
        <Notice tone="success">If an account matches those details, a password reset link has been sent to its email address.</Notice>
        <Link href="/my-account" className="text-sm font-semibold text-brand-700 hover:underline">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
      <Input label="Username or email" name="user_login" autoComplete="username" required error={error ?? undefined} />
      <Button type="submit" className="w-full">
        Reset password
      </Button>
      <Link href="/my-account" className="block text-center text-sm font-semibold text-brand-700 hover:underline">
        Back to log in
      </Link>
    </form>
  );
}
