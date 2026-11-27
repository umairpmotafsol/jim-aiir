"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ClipboardList, Heart, MapPin, User } from "lucide-react";
import { useAuth, useCurrentUser, type Address } from "@/lib/store/auth";
import { orderStatusLabel, useOrders } from "@/lib/store/orders";
import { useWishlist } from "@/lib/store/lists";
import { addressSchema, email as emailSchema, fieldErrors, password as passwordSchema } from "@/lib/validation";
import { commerce, countries } from "@/lib/config";
import { Input, Select } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState, Notice } from "@/components/ui/misc";
import { formatDate, formatMoney } from "@/lib/format";

function useMyOrders() {
  const user = useCurrentUser();
  const orders = useOrders((s) => s.orders);
  return orders.filter((o) => o.customerId === user?.id || (user && o.email === user.email));
}

export function AccountDashboard() {
  const user = useCurrentUser();
  const orders = useMyOrders();
  const wishlist = useWishlist((s) => s.ids.length);
  if (!user) return null;
  const cards = [
    { href: "/my-account/orders", label: "Orders", value: orders.length, icon: ClipboardList },
    { href: "/wishlist", label: "Wishlist items", value: wishlist, icon: Heart },
    { href: "/my-account/addresses", label: "Saved addresses", value: [user.billing, user.shipping].filter(Boolean).length, icon: MapPin },
    { href: "/my-account/edit-account", label: "Account details", value: "Edit", icon: User },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Hello, {user.displayName}</h2>
        <p className="mt-1 text-muted">
          From your account dashboard you can view recent orders, manage your addresses and edit your password and account details.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ href, label, value, icon: Icon }) => (
          <Link key={href} href={href} className="rounded-2xl border border-line p-5 hover:border-brand-300 hover:shadow-sm">
            <Icon className="size-6 text-brand-600" aria-hidden />
            <p className="mt-3 font-display text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
      {orders.length ? <OrdersTable limit={3} /> : null}
    </div>
  );
}

export function OrdersTable({ limit }: { limit?: number }) {
  const orders = useMyOrders();
  const shown = limit ? orders.slice(0, limit) : orders;

  if (!orders.length) {
    return (
      <EmptyState icon={<ClipboardList className="size-7" />} title="No orders yet" action={<LinkButton href="/shop">Browse products</LinkButton>}>
        When you place an order it will appear here.
      </EmptyState>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[36rem] text-sm">
        <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Order</th>
            <th scope="col" className="px-5 py-3 font-semibold">Date</th>
            <th scope="col" className="px-5 py-3 font-semibold">Status</th>
            <th scope="col" className="px-5 py-3 font-semibold">Total</th>
            <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {shown.map((o) => (
            <tr key={o.id}>
              <td className="px-5 py-3 font-semibold">#{o.number}</td>
              <td className="px-5 py-3">{formatDate(o.createdAt)}</td>
              <td className="px-5 py-3">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{orderStatusLabel[o.status]}</span>
              </td>
              <td className="px-5 py-3">
                {formatMoney(o.total)} for {o.lines.reduce((n, l) => n + l.quantity, 0)} item(s)
              </td>
              <td className="px-5 py-3 text-right">
                <Link href={`/my-account/orders/view?id=${o.id}`} className="font-semibold text-brand-700 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));

function AddressForm({ kind, initial, onDone }: { kind: "billing" | "shipping"; initial?: Address; onDone: () => void }) {
  const updateProfile = useAuth((s) => s.updateProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = addressSchema.safeParse(raw);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    const address: Address = { ...parsed.data, phone: kind === "billing" ? raw.phone : undefined };
    updateProfile({ [kind]: address });
    onDone();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Input label="First name" name="firstName" required defaultValue={initial?.firstName} error={errors.firstName} />
      <Input label="Last name" name="lastName" required defaultValue={initial?.lastName} error={errors.lastName} />
      <Input label="Company" name="company" defaultValue={initial?.company} wrapperClassName="sm:col-span-2" />
      <Select label="Country / region" name="country" required options={countryOptions} defaultValue={initial?.country ?? commerce.defaultCountry} error={errors.country} wrapperClassName="sm:col-span-2" />
      <Input label="Street address" name="address1" required defaultValue={initial?.address1} error={errors.address1} wrapperClassName="sm:col-span-2" />
      <Input label="Apartment, suite, unit" name="address2" defaultValue={initial?.address2} wrapperClassName="sm:col-span-2" />
      <Input label="Town / city" name="city" required defaultValue={initial?.city} error={errors.city} />
      <Input label="County / state" name="county" defaultValue={initial?.county} />
      <Input label="Postcode / Eircode" name="postcode" required defaultValue={initial?.postcode} error={errors.postcode} />
      {kind === "billing" ? <Input label="Phone" name="phone" type="tel" defaultValue={initial?.phone} /> : null}
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit">Save address</Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function Addresses() {
  const user = useCurrentUser();
  const [editing, setEditing] = useState<"billing" | "shipping" | null>(null);
  const [saved, setSaved] = useState(false);
  if (!user) return null;

  return (
    <div className="space-y-6">
      <p className="text-muted">These addresses are used by default at checkout.</p>
      {saved ? <Notice tone="success">Address saved.</Notice> : null}
      <div className="grid gap-6 md:grid-cols-2">
        {(["billing", "shipping"] as const).map((kind) => {
          const a = user[kind];
          return (
            <section key={kind} className="rounded-2xl border border-line p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold capitalize">{kind} address</h2>
                {editing !== kind ? (
                  <button type="button" onClick={() => { setEditing(kind); setSaved(false); }} className="text-sm font-semibold text-brand-700 hover:underline">
                    {a ? "Edit" : "Add"}
                  </button>
                ) : null}
              </div>
              {editing === kind ? (
                <AddressForm kind={kind} initial={a} onDone={() => { setEditing(null); setSaved(true); }} />
              ) : a ? (
                <address className="text-sm not-italic leading-6 text-slate-700">
                  {a.firstName} {a.lastName}
                  <br />
                  {a.address1}
                  {a.address2 ? `, ${a.address2}` : ""}
                  <br />
                  {a.city} {a.postcode}
                  <br />
                  {countries.find((c) => c.code === a.country)?.name ?? a.country}
                </address>
              ) : (
                <p className="text-sm text-muted">You haven&apos;t set up this address yet.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function EditAccount() {
  const user = useCurrentUser();
  const updateProfile = useAuth((s) => s.updateProfile);
  const changePassword = useAuth((s) => s.changePassword);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  if (!user) return null;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const next: Record<string, string> = {};
    if (!get("firstName")) next.firstName = "First name is required.";
    if (!get("lastName")) next.lastName = "Last name is required.";
    if (!get("displayName")) next.displayName = "Display name is required.";
    const em = emailSchema.safeParse(get("email"));
    if (!em.success) next.email = em.error.issues[0].message;
    const current = String(fd.get("currentPassword") ?? "");
    const pw = String(fd.get("newPassword") ?? "");
    const confirm = String(fd.get("confirmPassword") ?? "");
    if (pw || confirm) {
      const p = passwordSchema.safeParse(pw);
      if (!p.success) next.newPassword = p.error.issues[0].message;
      if (pw !== confirm) next.confirmPassword = "Passwords do not match.";
      if (!current) next.currentPassword = "Enter your current password to change it.";
    }
    setErrors(next);
    if (Object.keys(next).length) return setStatus({ tone: "error", text: "Please fix the highlighted fields." });

    const r = updateProfile({ firstName: get("firstName"), lastName: get("lastName"), displayName: get("displayName"), email: get("email") });
    if (!r.ok) return setStatus({ tone: "error", text: r.error });
    if (pw) {
      const c = changePassword(current, pw);
      if (!c.ok) {
        setErrors({ currentPassword: c.error });
        return setStatus({ tone: "error", text: c.error });
      }
    }
    e.currentTarget.reset();
    setStatus({ tone: "success", text: "Account details changed successfully." });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-6" key={user.email}>
      {status ? <Notice tone={status.tone}>{status.text}</Notice> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" name="firstName" required defaultValue={user.firstName} error={errors.firstName} autoComplete="given-name" />
        <Input label="Last name" name="lastName" required defaultValue={user.lastName} error={errors.lastName} autoComplete="family-name" />
      </div>
      <Input label="Display name" name="displayName" required defaultValue={user.displayName} error={errors.displayName} hint="How your name appears in reviews and the account area." />
      <Input label="Email address" name="email" type="email" required defaultValue={user.email} error={errors.email} autoComplete="email" />
      <fieldset className="space-y-4 rounded-2xl border border-line p-5">
        <legend className="px-1 text-sm font-semibold">Password change</legend>
        <Input label="Current password" name="currentPassword" type="password" autoComplete="current-password" error={errors.currentPassword} hint="Leave blank to keep your password." />
        <Input label="New password" name="newPassword" type="password" autoComplete="new-password" error={errors.newPassword} />
        <Input label="Confirm new password" name="confirmPassword" type="password" autoComplete="new-password" error={errors.confirmPassword} />
      </fieldset>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
