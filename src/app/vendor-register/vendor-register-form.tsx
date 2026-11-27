"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";
import { useAuth, useCurrentUser } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";
import { fieldErrors, vendorRegisterSchema } from "@/lib/validation";
import { commerce, countries, site } from "@/lib/config";
import { slugify } from "@/lib/format";
import { Checkbox, Input, Select } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { Notice, Skeleton } from "@/components/ui/misc";

const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));

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
      storeAbout: d.aiir,
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
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <h2 className="text-lg font-bold">Registration</h2>
      {formError ? <Notice tone="error">{formError}</Notice> : null}
      {user ? <Notice>You&apos;re logged in as {user.email}. Registering a store creates a separate vendor account.</Notice> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Username" name="username" required autoComplete="username" error={e.username} />
        <Input label="Email" name="email" type="email" required autoComplete="email" error={e.email} />
        <Input label="First Name" name="firstName" autoComplete="given-name" error={e.firstName} />
        <Input label="Last Name" name="lastName" autoComplete="family-name" error={e.lastName} />
      </div>
      <Input
        label="Store Name"
        name="storeName"
        required
        value={storeName}
        onChange={(ev) => setStoreName(ev.target.value)}
        error={e.storeName}
        hint={`${site.url}/store/${slug || "[your_store]"}`}
      />
      <Input label="Address 1" name="address1" required autoComplete="address-line1" error={e.address1} />
      <Input label="Address 2" name="address2" autoComplete="address-line2" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Country" name="country" required options={countryOptions} defaultValue={commerce.defaultCountry} error={e.country} />
        <Input label="City/Town" name="city" autoComplete="address-level2" error={e.city} />
        <Input label="State/County" name="county" autoComplete="address-level1" />
        <Input label="Postcode/Zip" name="postcode" required autoComplete="postal-code" error={e.postcode} />
        <Input label="Store Phone" name="phone" type="tel" required autoComplete="tel" error={e.phone} />
        <Input
          label={
            <>
              AIIR{" "}
              <span className="cursor-help text-brand-600" title="The Artifical Intelligence Institute">
                (?)
              </span>
            </>
          }
          name="aiir"
          required
          error={e.aiir}
        />
        <Input label="Password" name="password" type="password" required autoComplete="new-password" error={e.password} />
        <Input label="Confirm Password" name="confirmPassword" type="password" required autoComplete="new-password" error={e.confirmPassword} />
      </div>
      <Checkbox
        name="terms"
        error={e.terms}
        label={
          <>
            Agree{" "}
            <Link href="/terms-and-conditions" className="font-semibold text-brand-700 underline">
              Terms &amp; Conditions
            </Link>
          </>
        }
      />
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          REGISTER
        </Button>
      </div>
    </form>
  );
}
