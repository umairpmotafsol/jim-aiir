"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { useAuth, useCurrentUser } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";
import { fieldErrors, vendorRegisterSchema } from "@/lib/validation";
import { commerce, countries } from "@/lib/config";
import { slugify } from "@/lib/format";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { Notice, Skeleton } from "@/components/ui/misc";

const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));

function Section({ step, title, description, children }: { step: number; title: string; description: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-6 border-t border-line pt-8 first:border-t-0 first:pt-0 md:grid-cols-[13rem_1fr]">
      <legend className="sr-only">{title}</legend>
      <div>
        <span className="grid size-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{step}</span>
        <p className="mt-3 font-bold">{title}</p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <div className="grid content-start gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function VendorRegisterForm() {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const register = useAuth((s) => s.register);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");

  if (!hydrated) return <Skeleton className="h-[40rem]" />;

  if (user?.role === "vendor") {
    return (
      <div className="card flex flex-col items-center p-10 text-center">
        <CircleCheck className="size-12 text-emerald-500" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold">You already have a store</h2>
        <p className="mt-2 text-muted">Manage {user.storeName ?? "your store"} from the Store Manager.</p>
        <LinkButton href="/store-manager" className="mt-6">
          Go to Store Manager
        </LinkButton>
      </div>
    );
  }

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = vendorRegisterSchema.safeParse({ ...raw, terms: fd.get("terms") === "on" });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setFormError("Please fix the highlighted fields.");
      return;
    }
    const d = parsed.data;
    setErrors({});
    // TODO(backend): POST the application; the backend creates the vendor as "pending" for admin review.
    const r = register({
      email: d.email,
      password: d.password,
      firstName: d.firstName ?? "",
      lastName: d.lastName ?? "",
      displayName: d.username,
      role: "vendor",
      vendorSlug: slugify(d.storeName),
      storeName: d.storeName,
      storePhone: d.phone,
      storeAbout: d.expertise,
      status: "pending",
      billing: {
        firstName: d.firstName ?? "",
        lastName: d.lastName ?? "",
        country: d.country,
        address1: d.address1,
        address2: d.address2,
        city: d.city ?? "",
        county: d.county,
        postcode: d.postcode,
        phone: d.phone,
      },
    });
    if (!r.ok) {
      setFormError(r.error);
      return;
    }
    router.push("/store-manager?welcome=1");
  };

  const e = errors;
  const slug = slugify(storeName);

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-8 p-6 sm:p-10">
      {formError ? <Notice tone="error">{formError}</Notice> : null}
      {user ? <Notice>You&apos;re logged in as {user.email}. Registering a store creates a separate vendor account.</Notice> : null}

      <Section step={1} title="Account" description="How you'll log in to the Store Manager.">
        <Input label="Username" name="username" required autoComplete="username" error={e.username} />
        <Input label="Email address" name="email" type="email" required autoComplete="email" error={e.email} />
        <Input label="First name" name="firstName" autoComplete="given-name" error={e.firstName} />
        <Input label="Last name" name="lastName" autoComplete="family-name" error={e.lastName} />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          hint="At least 8 characters with a letter and a number."
          error={e.password}
        />
        <Input label="Confirm password" name="confirmPassword" type="password" required autoComplete="new-password" error={e.confirmPassword} />
      </Section>

      <Section step={2} title="Store" description="What buyers see on your storefront.">
        <Input
          label="Store name"
          name="storeName"
          required
          value={storeName}
          onChange={(ev) => setStoreName(ev.target.value)}
          error={e.storeName}
          hint={slug ? `Your store address will be /store/${slug}` : undefined}
          wrapperClassName="sm:col-span-2"
        />
        <Input label="Store phone" name="phone" type="tel" required autoComplete="tel" error={e.phone} />
        <Textarea label="What do you build or sell?" name="expertise" required error={e.expertise} wrapperClassName="sm:col-span-2" rows={3} />
      </Section>

      <Section step={3} title="Business address" description="Used for invoices and shipping. Not shown publicly.">
        <Input label="Street address" name="address1" required autoComplete="address-line1" error={e.address1} wrapperClassName="sm:col-span-2" />
        <Input label="Apartment, suite, unit" name="address2" autoComplete="address-line2" wrapperClassName="sm:col-span-2" />
        <Select label="Country" name="country" required options={countryOptions} defaultValue={commerce.defaultCountry} error={e.country} />
        <Input label="Town / city" name="city" autoComplete="address-level2" error={e.city} />
        <Input label="County / state" name="county" autoComplete="address-level1" />
        <Input label="Postcode / Eircode" name="postcode" required autoComplete="postal-code" error={e.postcode} />
      </Section>

      <div className="flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Checkbox
          name="terms"
          error={e.terms}
          label={
            <>
              I agree to the{" "}
              <Link href="/terms-and-conditions" className="font-semibold text-brand-700 underline">
                vendor terms and conditions
              </Link>
            </>
          }
        />
        <Button type="submit" size="lg">
          Submit application
        </Button>
      </div>
    </form>
  );
}
