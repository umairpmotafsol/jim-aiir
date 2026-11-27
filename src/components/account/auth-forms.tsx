"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/store/auth";
import { fieldErrors, loginSchema, registerSchema } from "@/lib/validation";
import { Checkbox, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/misc";

type Mode = "login" | "register";

function safeRedirect(value: string | null) {
  // Only allow same-site relative paths.
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

/**
 * Login by default; "Register" swaps in the registration form. Fields and wording
 * follow the WordPress My account page. The mode lives in the URL
 * (?action=register) so it can be linked to, and ?redirect= is kept when switching.
 */
export function AuthForms() {
  const searchParams = useSearchParams();
  const mode: Mode = searchParams.get("action") === "register" ? "register" : "login";
  const redirect = safeRedirect(searchParams.get("redirect"));

  const hrefFor = (next: Mode) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "register") params.set("action", "register");
    else params.delete("action");
    const qs = params.toString();
    return qs ? `/my-account?${qs}` : "/my-account";
  };

  // Move focus to the new heading when the visitor switches forms (not on first load).
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [mode]);

  return (
    <section className="mx-auto max-w-lg rounded-lg border border-line bg-white p-6 shadow-card sm:p-10" aria-labelledby="auth-heading">
      <h1 id="auth-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold focus:outline-none">
        {mode === "login" ? "Login" : "Register"}
      </h1>

      <div key={mode} className="animate-fade-up">
        {mode === "login" ? <LoginForm redirect={redirect} /> : <RegisterForm redirect={redirect} />}
      </div>

      <p className="mt-8 border-t border-line pt-6 text-center text-sm text-muted">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <Link href={hrefFor(mode === "login" ? "register" : "login")} replace scroll={false} className="font-semibold text-brand-700 hover:underline">
          {mode === "login" ? "Register" : "Log in"}
        </Link>
      </p>
    </section>
  );
}

function useAfterAuth(redirect: string | null) {
  const router = useRouter();
  return () => {
    const { accounts, sessionId } = useAuth.getState();
    const role = accounts.find((a) => a.id === sessionId)?.role;
    router.push(redirect ?? (role === "vendor" ? "/store-manager" : "/my-account"));
  };
}

function PasswordInput(props: Omit<Parameters<typeof Input>[0], "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-12" />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1.5 top-8 grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-surface hover:text-ink"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}

function LoginForm({ redirect }: { redirect: string | null }) {
  const login = useAuth((s) => s.login);
  const afterAuth = useAfterAuth(redirect);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({ identifier: fd.get("identifier"), password: fd.get("password") });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setFormError(null);
      return;
    }
    setErrors({});
    const r = login(parsed.data.identifier, parsed.data.password);
    if (!r.ok) {
      setFormError(r.error);
      return;
    }
    afterAuth();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
      {formError ? <Notice tone="error">{formError}</Notice> : null}
      <Input label="Username or email address" name="identifier" autoComplete="username" required error={errors.identifier} />
      <PasswordInput label="Password" name="password" autoComplete="current-password" required error={errors.password} />
      <Checkbox name="remember" label="Remember me" />
      <Button type="submit" size="lg" className="w-full">
        Log in
      </Button>
      <Link href="/my-account/lost-password" className="inline-block text-sm font-semibold text-brand-700 hover:underline">
        Lost your password?
      </Link>
      <p className="rounded-md bg-surface p-3 text-xs text-muted">
        Demo accounts (frontend mock): <strong>customer@aiir.test</strong> or <strong>vendor@aiir.test</strong>, password{" "}
        <strong>Password123!</strong>
      </p>
    </form>
  );
}

function RegisterForm({ redirect }: { redirect: string | null }) {
  const register = useAuth((s) => s.register);
  const afterAuth = useAfterAuth(redirect);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = registerSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setFormError(null);
      return;
    }
    setErrors({});
    const r = register({ email: parsed.data.email, password: parsed.data.password, firstName: "", lastName: "", role: "customer" });
    if (!r.ok) {
      setFormError(r.error);
      return;
    }
    afterAuth();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
      {formError ? <Notice tone="error">{formError}</Notice> : null}
      <Input label="Email address" name="email" type="email" autoComplete="email" required error={errors.email} />
      <PasswordInput
        label="Password"
        name="password"
        autoComplete="new-password"
        required
        hint="At least 8 characters with a letter and a number."
        error={errors.password}
      />
      <Button type="submit" size="lg" className="w-full">
        Register
      </Button>
      <Link href="/vendor-register" className="inline-block text-sm font-semibold text-brand-700 hover:underline">
        Become a Vendor
      </Link>
    </form>
  );
}
