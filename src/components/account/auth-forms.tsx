"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff, Heart, PackageCheck, ShieldCheck, Store } from "lucide-react";
import { useAuth } from "@/lib/store/auth";
import { fieldErrors, loginSchema, registerSchema } from "@/lib/validation";
import { Checkbox, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/misc";
import { images } from "@/lib/images";

type Mode = "login" | "register";

function safeRedirect(value: string | null) {
  // Only allow same-site relative paths.
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

const benefits = [
  { icon: PackageCheck, text: "Track every order and download invoices" },
  { icon: Heart, text: "Save products to your wishlist on any device" },
  { icon: ShieldCheck, text: "Faster, secure checkout with saved addresses" },
];

/**
 * Login by default; "Create an account" swaps in the registration form.
 * The mode lives in the URL (?action=register) so it can be linked to and
 * survives a refresh, and the ?redirect= target is kept when switching.
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
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-line lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative isolate hidden flex-col justify-end overflow-hidden p-10 text-white lg:flex">
        <Image src={images.robotHand} alt="" fill sizes="28rem" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-brand-950/80 to-brand-900/30" aria-hidden />
        <p className="eyebrow !text-accent-300">{mode === "login" ? "Welcome back" : "Join AIIR"}</p>
        <p className="mt-3 text-3xl font-extrabold leading-tight">
          {mode === "login" ? "Pick up where you left off." : "The marketplace for AI tools, APIs and robotics."}
        </p>
        <ul className="mt-8 space-y-4">
          {benefits.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-brand-100">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-accent-300 ring-1 ring-white/15 backdrop-blur">
                <Icon className="size-4" aria-hidden />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>

      <section className="p-6 sm:p-10" aria-labelledby="auth-heading">
        <h2 id="auth-heading" ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold tracking-tight focus:outline-none">
          {mode === "login" ? "Log in to your account" : "Create your account"}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <Link href={hrefFor(mode === "login" ? "register" : "login")} replace scroll={false} className="font-semibold text-brand-700 hover:underline">
            {mode === "login" ? "Create one" : "Log in"}
          </Link>
        </p>

        <div key={mode} className="animate-fade-up">
          {mode === "login" ? <LoginForm redirect={redirect} /> : <RegisterForm redirect={redirect} />}
        </div>

        <div className="mt-8 border-t border-line pt-6">
          {mode === "login" ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface p-5 text-center sm:flex-row sm:text-left">
              <p className="flex-1 text-sm">
                <span className="block font-bold">New to AIIR?</span>
                <span className="text-muted">Create a free account in under a minute.</span>
              </p>
              <Link
                href={hrefFor("register")}
                replace
                scroll={false}
                className="inline-flex h-10 items-center rounded-xl border border-line bg-white px-4 text-sm font-semibold text-brand-700 hover:border-brand-300"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4">
              <Store className="size-6 shrink-0 text-brand-600" aria-hidden />
              <p className="text-sm text-brand-900">
                Want to sell on AIIR?{" "}
                <Link href="/vendor-register" className="font-semibold underline">
                  Become a vendor
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
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
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
      {formError ? <Notice tone="error">{formError}</Notice> : null}
      <Input label="Email or username" name="identifier" autoComplete="username" required error={errors.identifier} />
      <PasswordInput label="Password" name="password" autoComplete="current-password" required error={errors.password} />
      <div className="flex items-center justify-between">
        <Checkbox name="remember" label="Remember me" defaultChecked />
        <Link href="/my-account/lost-password" className="text-sm font-semibold text-brand-700 hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" size="lg" className="w-full">
        Log in
      </Button>
      <p className="rounded-xl bg-surface p-3 text-xs text-muted">
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
    const parsed = registerSchema.safeParse({
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      email: fd.get("email"),
      password: fd.get("password"),
      confirmPassword: fd.get("confirmPassword"),
      terms: fd.get("terms") === "on",
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setFormError(null);
      return;
    }
    setErrors({});
    const { firstName, lastName, email, password } = parsed.data;
    const r = register({ email, password, firstName, lastName, role: "customer" });
    if (!r.ok) {
      setFormError(r.error);
      return;
    }
    afterAuth();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
      {formError ? <Notice tone="error">{formError}</Notice> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" name="firstName" autoComplete="given-name" required error={errors.firstName} />
        <Input label="Last name" name="lastName" autoComplete="family-name" required error={errors.lastName} />
      </div>
      <Input label="Email address" name="email" type="email" autoComplete="email" required error={errors.email} />
      <PasswordInput
        label="Password"
        name="password"
        autoComplete="new-password"
        required
        hint="At least 8 characters with a letter and a number."
        error={errors.password}
      />
      <PasswordInput label="Confirm password" name="confirmPassword" autoComplete="new-password" required error={errors.confirmPassword} />
      <Checkbox
        name="terms"
        error={errors.terms}
        label={
          <>
            I agree to the{" "}
            <Link href="/terms-and-conditions" className="font-semibold text-brand-700 underline">
              terms and conditions
            </Link>{" "}
            and understand my data is used to manage my account and orders.
          </>
        }
      />
      <Button type="submit" size="lg" className="w-full">
        Create account
      </Button>
    </form>
  );
}
