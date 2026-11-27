import { countries } from "@/lib/config";
import { formatDate, formatMoney } from "@/lib/format";
import { orderStatusLabel, type Order } from "@/lib/store/orders";
import type { Address } from "@/lib/store/auth";

function AddressBlock({ title, address, extra }: { title: string; address: Address; extra?: string[] }) {
  const country = countries.find((c) => c.code === address.country)?.name ?? address.country;
  return (
    <div className="rounded-md border border-line p-5">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
      <address className="text-sm not-italic leading-6 text-slate-700">
        {address.firstName} {address.lastName}
        {address.company ? <><br />{address.company}</> : null}
        <br />
        {address.address1}
        {address.address2 ? <><br />{address.address2}</> : null}
        <br />
        {address.city}
        {address.county ? `, ${address.county}` : ""} {address.postcode}
        <br />
        {country}
        {extra?.map((e) => (
          <span key={e}>
            <br />
            {e}
          </span>
        ))}
      </address>
    </div>
  );
}

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="space-y-8">
      <dl className="grid gap-4 rounded-md bg-surface p-5 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted">Order number</dt>
          <dd className="font-semibold">#{order.number}</dd>
        </div>
        <div>
          <dt className="text-muted">Date</dt>
          <dd className="font-semibold">{formatDate(order.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted">Status</dt>
          <dd className="font-semibold">{orderStatusLabel[order.status]}</dd>
        </div>
        <div>
          <dt className="text-muted">Payment</dt>
          <dd className="font-semibold">{order.paymentMethod}</dd>
        </div>
      </dl>

      <div className="overflow-hidden rounded-md border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">Product</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {order.lines.map((l) => (
              <tr key={l.productId}>
                <td className="px-5 py-3">
                  {l.name} <span className="text-muted">× {l.quantity}</span>
                </td>
                <td className="px-5 py-3 text-right font-medium">{formatMoney(l.price * l.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-line">
            <tr>
              <th scope="row" className="px-5 py-2 text-left font-normal text-muted">Subtotal</th>
              <td className="px-5 py-2 text-right">{formatMoney(order.subtotal)}</td>
            </tr>
            {order.discount ? (
              <tr>
                <th scope="row" className="px-5 py-2 text-left font-normal text-muted">Discount ({order.couponCode})</th>
                <td className="px-5 py-2 text-right text-emerald-700">−{formatMoney(order.discount)}</td>
              </tr>
            ) : null}
            <tr>
              <th scope="row" className="px-5 py-2 text-left font-normal text-muted">Shipping ({order.shippingMethod})</th>
              <td className="px-5 py-2 text-right">{order.shippingTotal ? formatMoney(order.shippingTotal) : "Free"}</td>
            </tr>
            <tr className="text-base font-bold">
              <th scope="row" className="px-5 py-3 text-left">Total</th>
              <td className="px-5 py-3 text-right">{formatMoney(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {order.notes ? (
        <div className="rounded-md border border-line p-5 text-sm">
          <h3 className="mb-1 font-semibold">Order notes</h3>
          <p className="text-slate-600">{order.notes}</p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <AddressBlock title="Billing address" address={order.billing} extra={[order.email, order.phone]} />
        <AddressBlock title="Shipping address" address={order.shipping} />
      </div>
    </div>
  );
}
