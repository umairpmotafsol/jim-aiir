"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useAuth, useCurrentUser } from "@/lib/store/auth";
import { toast } from "@/lib/store/toast";
import { phone as phoneSchema } from "@/lib/validation";
import { Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { vendorBanner } from "@/lib/images";

export function StoreSettings() {
  const user = useCurrentUser();
  const updateProfile = useAuth((s) => s.updateProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  if (!user) return null;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const storeName = String(fd.get("storeName") ?? "").trim();
    const storePhone = String(fd.get("storePhone") ?? "").trim();
    const storeAbout = String(fd.get("storeAbout") ?? "").trim();
    const next: Record<string, string> = {};
    if (storeName.length < 2) next.storeName = "Store name is required.";
    const ph = phoneSchema.safeParse(storePhone);
    if (storePhone && !ph.success) next.storePhone = ph.error.issues[0].message;
    setErrors(next);
    if (Object.keys(next).length) return;
    // TODO(backend): PATCH the vendor profile.
    const r = updateProfile({ storeName, storePhone, storeAbout });
    if (r.ok) toast.success("Store settings saved.");
    else toast.error(r.error);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" key={user.id}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">Store settings</h2>
          <p className="text-sm text-muted">How your store appears to buyers.</p>
        </div>
        <Button type="submit">Save settings</Button>
      </div>

      <section className="card overflow-hidden">
        <div className="relative h-40">
          <Image src={vendorBanner(user.vendorSlug ?? "")} alt="" fill sizes="(min-width: 1024px) 60rem, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent" aria-hidden />
          <p className="absolute bottom-4 left-28 text-lg font-bold text-white">{user.storeName ?? user.displayName}</p>
          <div className="absolute -bottom-8 left-6 grid size-16 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-brand-600 to-accent-500 text-2xl font-extrabold text-white">
            {(user.storeName ?? user.displayName).charAt(0)}
          </div>
        </div>
        <div className="grid gap-5 p-6 pt-14 sm:grid-cols-2">
          <Input label="Store name" name="storeName" required defaultValue={user.storeName} error={errors.storeName} />
          <Input label="Store phone" name="storePhone" type="tel" defaultValue={user.storePhone} error={errors.storePhone} />
          <Textarea label="About your store" name="storeAbout" rows={5} defaultValue={user.storeAbout} wrapperClassName="sm:col-span-2" />
          <p className="text-xs text-muted sm:col-span-2">
            Store address: <strong>/store/{user.vendorSlug}</strong>. Banner and logo uploads arrive with the backend.
          </p>
        </div>
      </section>
    </form>
  );
}
