"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { CartLine, cartDetails, readCart, saveCart } from "@/lib/cart";
import { formatMoney } from "@/lib/products";

function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { fbq?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  const event_id = crypto.randomUUID?.() || `${Date.now()}`;
  w.fbq?.("track", event, { ...data, event_id });
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data, event_id });
}

const inputClass = "rounded-xl border border-slate-200 px-4 py-4 outline-none transition focus:border-[#0b5f59] focus:ring-4 focus:ring-[#0b5f59]/10";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartLine[]>(() => readCart());
  const [method, setMethod] = useState("card");
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [billingSame, setBillingSame] = useState(true);
  const [placed, setPlaced] = useState(false);
  const details = cartDetails(cart);
  const shipping = details.count === 0 ? 0 : delivery === "express" ? 18 : details.shipping;
  const total = details.subtotal + shipping + details.tax;

  useEffect(() => {
    const loadedDetails = cartDetails(readCart());
    track("InitiateCheckout", { value: loadedDetails.total, currency: "USD", num_items: loadedDetails.count });
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!details.count) return;
    track("Purchase", { value: total, currency: "USD", num_items: details.count, payment_method: method, delivery_method: delivery });
    saveCart([]);
    setCart([]);
    setPlaced(true);
  }

  if (placed) {
    return (
      <main className="min-h-screen px-5 pb-16 pt-28">
        <SiteHeader />
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="mx-auto grid size-16 place-items-center rounded-full bg-[#edf6f4] text-3xl text-[#0b5f59]">✓</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#11263d]">Order placed.</h1>
          <p className="mt-4 text-[#475569]">Your frame selections are saved for review. We will follow up for any prescription details before fulfillment.</p>
          <Link href="/" className="mt-8 inline-block rounded-full bg-[#11263d] px-7 py-4 font-semibold text-white">Back to store</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <form onSubmit={submit} className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_25rem]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Checkout</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-[#11263d]">Confirm delivery and payment.</h1>
          {details.count === 0 && <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-[#6f4a1f]">Your cart is empty. <Link href="/shop" className="font-semibold underline">Add frames first</Link>.</div>}

          <div className="mt-8 grid gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#11263d]">Contact</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input required placeholder="Email address" className={`${inputClass} sm:col-span-2`} />
                <input required placeholder="First name" className={inputClass} />
                <input required placeholder="Last name" className={inputClass} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#11263d]">Shipping address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input required placeholder="Address line 1" className={`${inputClass} sm:col-span-2`} />
                <input placeholder="Apartment, suite, etc." className={`${inputClass} sm:col-span-2`} />
                <input required placeholder="City" className={inputClass} />
                <select className={inputClass}><option>United States</option><option>Canada</option><option>United Kingdom</option></select>
                <input required placeholder="State" className={inputClass} />
                <input required placeholder="ZIP code" className={inputClass} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#11263d]">Delivery</h2>
              <div className="mt-4 grid gap-3">
                <label className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 ${delivery === "standard" ? "border-[#0b5f59] bg-[#edf6f4]" : "border-slate-200 bg-white"}`}>
                  <span className="flex items-start gap-3"><input type="radio" name="delivery" value="standard" checked={delivery === "standard"} onChange={() => setDelivery("standard")} className="mt-1 accent-[#0b5f59]" /><span><b>Standard insured shipping</b><span className="block text-sm text-[#475569]">4-7 business days</span></span></span>
                  <span>{details.shipping === 0 ? "Free" : formatMoney(details.shipping)}</span>
                </label>
                <label className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 ${delivery === "express" ? "border-[#0b5f59] bg-[#edf6f4]" : "border-slate-200 bg-white"}`}>
                  <span className="flex items-start gap-3"><input type="radio" name="delivery" value="express" checked={delivery === "express"} onChange={() => setDelivery("express")} className="mt-1 accent-[#0b5f59]" /><span><b>Express shipping</b><span className="block text-sm text-[#475569]">2-3 business days</span></span></span>
                  <span>$18</span>
                </label>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#11263d]">Payment</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[["card", "Credit card"], ["apple", "Apple Pay"], ["paypal", "PayPal"]].map(([value, label]) => (
                  <button type="button" key={value} onClick={() => setMethod(value)} className={`rounded-xl border p-4 font-semibold ${method === value ? "border-[#11263d] bg-[#11263d] text-white" : "border-[#11263d]/20 bg-[#fffdf8] text-[#11263d] hover:border-[#11263d]"}`}>{label}</button>
                ))}
              </div>
              {method === "card" ? (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <label className="grid gap-2 text-sm font-semibold text-[#11263d]">Card number<input required placeholder="4242 4242 4242 4242" inputMode="numeric" className={`${inputClass} font-mono text-lg`} /></label>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <input required placeholder="MM / YY" className={inputClass} />
                    <input required placeholder="CVC" className={inputClass} />
                    <input required placeholder="ZIP" className={inputClass} />
                  </div>
                  <p className="mt-4 rounded-xl bg-[#f7f4ee] p-4 text-sm text-[#475569]">Payment fields are local to this static storefront preview.</p>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-[#f7f4ee] p-5 text-[#475569]">Continue with the selected wallet method after reviewing your order.</div>
              )}
              <label className="mt-5 flex items-center gap-3 text-sm text-[#11263d]"><input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} className="accent-[#0b5f59]" /> Billing address is the same as shipping</label>
              {!billingSame && <input placeholder="Billing address" className={`mt-4 w-full ${inputClass}`} />}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl bg-[#11263d] p-6 text-white shadow-sm">
          <h2 className="text-2xl font-semibold">Order summary</h2>
          <div className="mt-5 space-y-4">
            {details.lines.map((line) => {
              const summary = line.summary!;
              return (
                <div key={`${line.slug}-${line.lensId}-${line.frameSizeId}-${line.colorId}`} className="rounded-xl bg-white/10 p-4">
                  <div className="flex justify-between gap-3"><b>{summary.product.name}</b><span>x{line.qty}</span></div>
                  <p className="mt-1 text-sm text-[#d7e3e1]">{summary.color.name} / {summary.size.name} / {summary.lens.name}</p>
                  {summary.addOns.length > 0 && <p className="mt-1 text-xs text-[#c7d2d0]">{summary.addOns.map((addOn) => addOn?.name).join(", ")}</p>}
                </div>
              );
            })}
          </div>
          <div className="mt-6 space-y-3 text-sm text-[#e8f0ef]">
            <div className="flex justify-between"><span>Subtotal</span><b className="text-white">{formatMoney(details.subtotal)}</b></div>
            <div className="flex justify-between"><span>Shipping</span><b className="text-white">{shipping === 0 ? "Free" : formatMoney(shipping)}</b></div>
            <div className="flex justify-between"><span>Estimated tax</span><b className="text-white">{formatMoney(details.tax)}</b></div>
            <div className="flex justify-between border-t border-white/15 pt-4 text-xl text-white"><span>Total</span><b>{formatMoney(total)}</b></div>
          </div>
          <button disabled={!details.count} className="mt-6 w-full rounded-full bg-[#0b5f59] px-7 py-4 font-semibold text-white transition hover:bg-[#0a4f4a] disabled:bg-[#d7e3e1] disabled:text-[#334155]">Place order {details.count ? formatMoney(total) : ""}</button>
          <p className="mt-4 text-xs leading-5 text-[#c7d2d0]">Prescription details can be supplied after the order when required for the selected lens package.</p>
        </aside>
      </form>
    </main>
  );
}
