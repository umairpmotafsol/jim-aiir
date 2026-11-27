"use client";

import { Media } from "@/components/ui/placeholder";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Lock, ShoppingCart } from "lucide-react";
import { useCart, computeTotals } from "@/lib/store/cart";
import { useAuth, useCurrentUser, type Address } from "@/lib/store/auth";
import { useOrders } from "@/lib/store/orders";
import { useHydrated } from "@/lib/store/hydration";
import { checkoutSchema, fieldErrors } from "@/lib/validation";
import { commerce, countries } from "@/lib/config";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState, Notice, Skeleton } from "@/components/ui/misc";
import { CouponForm, ShippingOptions, TotalsRows } from "./order-summary";
import { formatMoney, cn } from "@/lib/format";

const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));

function AddressFields({ prefix, defaults, errors }: { prefix: "billing" | "shipping"; defaults?: Partial<Address>; errors: Record<string, string> }) {
  const err = (k: string) => errors[`${prefix}.${k}`];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="First name" name={`${prefix}.firstName`} autoComplete={`${prefix} given-name`} required defaultValue={defaults?.firstName} error={err("firstName")} />
      <Input label="Last name" name={`${prefix}.lastName`} autoComplete={`${prefix} family-name`} required defaultValue={defaults?.lastName} error={err("lastName")} />
      <Input label="Company name" name={`${prefix}.company`} autoComplete={`${prefix} organization`} defaultValue={defaults?.company} wrapperClassName="sm:col-span-2" />
      <Select
        label="Country / region"
        name={`${prefix}.country`}
        autoComplete={`${prefix} country`}
        required
        options={countryOptions}
        defaultValue={defaults?.country ?? commerce.defaultCountry}
        error={err("country")}
        wrapperClassName="sm:col-span-2"
      />
      <Input label="Street address" name={`${prefix}.address1`} autoComplete={`${prefix} address-line1`} required placeholder="House number and street name" defaultValue={defaults?.address1} error={err("address1")} wrapperClassName="sm:col-span-2" />
      <Input label="Apartment, suite, unit" name={`${prefix}.address2`} autoComplete={`${prefix} address-line2`} defaultValue={defaults?.address2} wrapperClassName="sm:col-span-2" />
      <Input label="Town / city" name={`${prefix}.city`} autoComplete={`${prefix} address-level2`} required defaultValue={defaults?.city} error={err("city")} />
      <Input label="County / state" name={`${prefix}.county`} autoComplete={`${prefix} address-level1`} defaultValue={defaults?.county} />
      <Input label="Postcode / Eircode" name={`${prefix}.postcode`} autoComplete={`${prefix} postal-code`} required defaultValue={defaults?.postcode} error={err("postcode")} />
    </div>
  );
}

function readAddress(fd: FormData, prefix: string) {
  const keys = ["firstName", "lastName", "company", "country", "address1", "address2", "city", "county", "postcode"];
  return Object.fromEntries(keys.map((k) => [k, String(fd.get(`${prefix}.${k}`) ?? "")]));
}

export function CheckoutForm() {
  const hydrated = useHydrated();
  const router = useRouter();
  const user = useCurrentUser();
  const register = useAuth((s) => s.register);
  const updateProfile = useAuth((s) => s.updateProfile);
  const placeOrder = useOrders((s) => s.placeOrder);
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.couponCode);
  const method = useCart((s) => s.shippingMethod);
  const clearCart = useCart((s) => s.clear);
  const totals = computeTotals(lines, coupon, method);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(commerce.paymentMethods.find((p) => p.enabled)?.id ?? "");
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) return <Skeleton className="h-[40rem]" />;

  if (!lines.length) {
    return (
      <EmptyState icon={<ShoppingCart className="size-7" />} title="Your cart is empty" action={<LinkButton href="/shop">Return to shop</LinkButton>}>
        Add something to your cart before checking out.
      </EmptyState>
    );
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input = {
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      billing: readAddress(fd, "billing"),
      shipToDifferent,
      shipping: shipToDifferent ? readAddress(fd, "shipping") : {},
      notes: String(fd.get("notes") ?? ""),
      createAccount: !user && createAccount,
      accountPassword: String(fd.get("accountPassword") ?? ""),
      paymentMethod,
      terms: fd.get("terms") === "on",
    };
    const parsed = checkoutSchema.safeParse(input);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setFormError("Please fix the highlighted fields to place your order.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!totals.shippingMethod) {
      setFormError("No shipping method is available for this order.");
      return;
    }
    setErrors({});
    setFormError(null);
    setSubmitting(true);

    const data = parsed.data;
    const billing = data.billing as Address;
    const shipping = (data.shipToDifferent ? data.shipping : data.billing) as Address;

    let customerId = user?.id ?? null;
    if (!user && data.createAccount) {
      const r = register({
        email: data.email,
        password: data.accountPassword ?? "",
        firstName: billing.firstName,
        lastName: billing.lastName,
        role: "customer",
        billing: { ...billing, phone: data.phone },
        shipping,
      });
      if (!r.ok) {
        setSubmitting(false);
        setErrors({ email: r.error });
        setFormError(r.error);
        return;
      }
      customerId = useAuth.getState().sessionId;
    } else if (user) {
      updateProfile({ billing: { ...billing, phone: data.phone }, shipping });
    }

    // TODO(backend): replace with POST /checkout. The backend must re-price the cart and check stock.
    const order = placeOrder({
      customerId,
      email: data.email,
      phone: data.phone,
      billing,
      shipping,
      notes: data.notes,
      lines,
      subtotal: totals.subtotal,
      discount: totals.discount,
      couponCode: coupon,
      shippingMethod: totals.shippingMethod.label,
      shippingTotal: totals.shipping,
      total: totals.total,
      paymentMethod: commerce.paymentMethods.find((p) => p.id === data.paymentMethod)?.label ?? data.paymentMethod,
    });
    clearCart();
    router.push(`/checkout/order-received?order=${order.id}`);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid items-start gap-10 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-10">
        {formError ? <Notice tone="error">{formError}</Notice> : null}
        {!user ? (
          <Notice>
            Returning customer?{" "}
            <Link href="/my-account?redirect=/checkout" className="font-semibold underline">
              Log in
            </Link>{" "}
            to use your saved details.
          </Notice>
        ) : null}

        <section>
          <h2 className="mb-5 text-xl font-bold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Email address" name="email" type="email" autoComplete="email" required defaultValue={user?.email} error={errors.email} />
            <Input label="Phone" name="phone" type="tel" autoComplete="tel" required defaultValue={user?.billing?.phone} error={errors.phone} />
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-bold">Billing details</h2>
          <AddressFields prefix="billing" defaults={user?.billing ?? { firstName: user?.firstName, lastName: user?.lastName }} errors={errors} />
        </section>

        <section className="space-y-5">
          <Checkbox label="Ship to a different address?" checked={shipToDifferent} onChange={(e) => setShipToDifferent(e.target.checked)} />
          {shipToDifferent ? <AddressFields prefix="shipping" defaults={user?.shipping} errors={errors} /> : null}
          <Textarea label="Order notes" name="notes" placeholder="Notes about your order, e.g. delivery instructions." rows={3} />
        </section>

        {!user ? (
          <section className="space-y-4">
            <Checkbox label="Create an account for faster checkout next time" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} />
            {createAccount ? (
              <Input
                label="Account password"
                name="accountPassword"
                type="password"
                autoComplete="new-password"
                required
                hint="At least 8 characters with a letter and a number."
                error={errors.accountPassword}
                wrapperClassName="max-w-sm"
              />
            ) : null}
          </section>
        ) : null}
      </div>

      <aside className="space-y-6 rounded-lg border border-line p-6 lg:sticky lg:top-40" aria-label="Your order">
        <h2 className="text-lg font-bold">Your order</h2>
        <ul className="divide-y divide-line">
          {lines.map((l) => (
            <li key={l.productId} className="flex items-center gap-3 py-3 text-sm">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Media src={l.image} alt="" sizes="3rem" seed={l.name} size="sm" />
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-md bg-slate-700 text-[10px] font-bold text-white">{l.quantity}</span>
              </div>
              <span className="flex-1 font-medium">{l.name}</span>
              <span className="font-semibold">{formatMoney(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <CouponForm />
        <ShippingOptions totals={totals} />
        <TotalsRows totals={totals} />

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Payment</legend>
          <div className="space-y-2">
            {commerce.paymentMethods.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "block rounded-lg border p-3 text-sm",
                  !p.enabled ? "cursor-not-allowed border-line bg-surface text-slate-400" : paymentMethod === p.id ? "cursor-pointer border-brand-500 bg-brand-50" : "cursor-pointer border-line",
                )}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={p.id}
                    disabled={!p.enabled}
                    checked={paymentMethod === p.id}
                    onChange={() => setPaymentMethod(p.id)}
                    className="accent-brand-600"
                  />
                  {p.label}
                </span>
                <span className="mt-1 block pl-6 text-xs">{p.description}</span>
              </label>
            ))}
          </div>
          {errors.paymentMethod ? <p className="mt-1.5 text-xs font-medium text-red-600">{errors.paymentMethod}</p> : null}
        </fieldset>

        <Checkbox
          name="terms"
          error={errors.terms}
          label={
            <>
              I have read and agree to the{" "}
              <Link href="/terms-and-conditions" target="_blank" className="font-semibold text-brand-700 underline">
                terms and conditions
              </Link>
              .
            </>
          }
        />
        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          <Lock className="size-4" aria-hidden /> Place order · {formatMoney(totals.total)}
        </Button>
      </aside>
    </form>
  );
}
