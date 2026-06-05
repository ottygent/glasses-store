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
    return <main className="min-h-screen px-5 pb-16 pt-28"><SiteHeader /><section className="mx-auto max-w-3xl rounded-[2.5rem] bg-white p-10 text-center stripe-shadow"><p className="mx-auto grid size-16 place-items-center rounded-full bg-[#e8f0ef] text-3xl">✓</p><h1 className="mt-6 text-4xl font-semibold tracking-[-.04em]">Mock payment complete.</h1><p className="mt-4 text-[#334155]">This real-looking checkout flow captured the frontend steps. In production, submit to Stripe Checkout or Payment Element and store the order in Supabase.</p><Link href="/" className="mt-8 inline-block rounded-full bg-[#11263d] px-7 py-4 font-semibold text-white">Back to store</Link></section></main>;
  }

  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <form onSubmit={submit} className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_25rem]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#0b5f59]">Payment process</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">Secure checkout.</h1>
          {details.count === 0 && <div className="mt-6 rounded-3xl bg-amber-50 p-5 text-[#6f4a1f]">Your cart is empty. <Link href="/#shop" className="font-semibold underline">Add frames first</Link>.</div>}

          <div className="mt-8 grid gap-6">
            <div className="rounded-[2rem] bg-white/80 p-6 stripe-shadow"><h2 className="text-2xl font-semibold">Contact</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><input required placeholder="Email address" className="rounded-2xl border border-slate-200 px-4 py-4 sm:col-span-2"/><input required placeholder="First name" className="rounded-2xl border border-slate-200 px-4 py-4"/><input required placeholder="Last name" className="rounded-2xl border border-slate-200 px-4 py-4"/></div></div>
            <div className="rounded-[2rem] bg-white/80 p-6 stripe-shadow"><h2 className="text-2xl font-semibold">Shipping address</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><input required placeholder="Address line 1" className="rounded-2xl border border-slate-200 px-4 py-4 sm:col-span-2"/><input placeholder="Apartment, suite, etc." className="rounded-2xl border border-slate-200 px-4 py-4 sm:col-span-2"/><input required placeholder="City" className="rounded-2xl border border-slate-200 px-4 py-4"/><select className="rounded-2xl border border-slate-200 px-4 py-4"><option>United States</option><option>Canada</option><option>United Kingdom</option></select><input required placeholder="State" className="rounded-2xl border border-slate-200 px-4 py-4"/><input required placeholder="ZIP code" className="rounded-2xl border border-slate-200 px-4 py-4"/></div></div>
            <div className="rounded-[2rem] bg-white/80 p-6 stripe-shadow"><h2 className="text-2xl font-semibold">Delivery options</h2><div className="mt-4 grid gap-3"><label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 ${delivery === "standard" ? "border-[#0b5f59] bg-[#e8f0ef]" : "border-slate-200 bg-white"}`}><span className="flex items-start gap-3"><input type="radio" name="delivery" value="standard" checked={delivery === "standard"} onChange={() => setDelivery("standard")} className="mt-1"/><span><b>Standard insured shipping</b><span className="block text-sm text-[#334155]">4–7 business days</span></span></span><span>{details.shipping === 0 ? "Free" : formatMoney(details.shipping)}</span></label><label className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 ${delivery === "express" ? "border-[#0b5f59] bg-[#e8f0ef]" : "border-slate-200 bg-white"}`}><span className="flex items-start gap-3"><input type="radio" name="delivery" value="express" checked={delivery === "express"} onChange={() => setDelivery("express")} className="mt-1"/><span><b>Express shipping</b><span className="block text-sm text-[#334155]">2–3 business days</span></span></span><span>$18</span></label></div></div>
            <div className="rounded-[2rem] bg-white/80 p-6 stripe-shadow"><h2 className="text-2xl font-semibold">Payment method</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{[["card","Credit card"],["apple","Apple Pay"],["paypal","PayPal"]].map(([value,label]) => <button type="button" key={value} onClick={() => setMethod(value)} className={`rounded-2xl border p-4 font-semibold ${method === value ? "border-[#11263d] bg-[#11263d] text-white" : "border-[#11263d]/20 bg-[#fffdf8] text-[#11263d] hover:border-[#11263d]"}`}>{label}</button>)}</div>{method === "card" ? <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4"><label className="grid gap-2 text-sm font-semibold">Card number<input required placeholder="4242 4242 4242 4242" inputMode="numeric" className="rounded-2xl border border-slate-200 px-4 py-4 font-mono text-lg"/></label><div className="mt-4 grid gap-4 sm:grid-cols-3"><input required placeholder="MM / YY" className="rounded-2xl border border-slate-200 px-4 py-4"/><input required placeholder="CVC" className="rounded-2xl border border-slate-200 px-4 py-4"/><input required placeholder="ZIP" className="rounded-2xl border border-slate-200 px-4 py-4"/></div><div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f7f4ee] p-4 text-sm text-[#334155]"><span>🔒</span><span>Mock secure field styling. No card data is sent anywhere.</span></div></div> : <div className="mt-5 rounded-3xl bg-[#f7f4ee] p-5 text-[#334155]">A production build would redirect to the selected wallet provider. This demo keeps the full flow local.</div>}<label className="mt-5 flex items-center gap-3 text-sm"><input type="checkbox" checked={billingSame} onChange={(e)=>setBillingSame(e.target.checked)} /> Billing address is the same as shipping</label>{!billingSame && <input placeholder="Billing address" className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-4"/>}</div>
          </div>
        </section>
        <aside className="h-fit rounded-[2rem] bg-[#11263d] p-6 text-white stripe-shadow"><h2 className="text-2xl font-semibold">Order summary</h2><div className="mt-5 space-y-4">{details.lines.map((line) => <div key={`${line.slug}-${line.lens}-${line.frameSize}`} className="rounded-2xl bg-white/10 p-4"><div className="flex justify-between gap-3"><b>{line.product?.name}</b><span>x{line.qty}</span></div><p className="mt-1 text-sm text-[#d7e3e1]">{line.lens} • {line.frameSize} • {line.color}</p></div>)}</div><div className="mt-6 space-y-3 text-sm text-[#e8f0ef]"><div className="flex justify-between"><span>Subtotal</span><b className="text-white">{formatMoney(details.subtotal)}</b></div><div className="flex justify-between"><span>Shipping</span><b className="text-white">{shipping === 0 ? "Free" : formatMoney(shipping)}</b></div><div className="flex justify-between"><span>Estimated tax</span><b className="text-white">{formatMoney(details.tax)}</b></div><div className="flex justify-between border-t border-white/15 pt-4 text-xl text-white"><span>Total</span><b>{formatMoney(total)}</b></div></div><button disabled={!details.count} className="mt-6 w-full rounded-full bg-[#0b5f59] px-7 py-4 font-semibold text-white disabled:bg-[#d7e3e1] disabled:text-[#334155]">Pay {formatMoney(total)}</button><p className="mt-4 text-xs leading-5 text-[#c7d2d0]">Facebook Pixel Purchase and CAPI-ready event data fires on mock completion with browser/server dedupe-friendly event IDs.</p></aside>
      </form>
      <section className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-3">
        <div className="rounded-[2rem] bg-white/80 p-6 stripe-shadow">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#0b5f59]">Security</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.03em] text-[#11263d]">No payment data leaves this demo.</h2>
          <p className="mt-3 text-[#334155]">The mock card fields show a realistic payment process while keeping all card entries local to the browser.</p>
        </div>
        <div className="rounded-[2rem] bg-white/80 p-6 stripe-shadow">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#7a4f17]">Delivery</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.03em] text-[#11263d]">Shipping choices stay visible.</h2>
          <p className="mt-3 text-[#334155]">Standard and express shipping cards use strong labels, readable helper text, and clear totals.</p>
        </div>
        <div className="rounded-[2rem] bg-[#11263d] p-6 text-white stripe-shadow">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#d7e3e1]">Support</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.03em]">Review before payment.</h2>
          <p className="mt-3 text-[#e8f0ef]">Order summary, selected lens options, and payment button states are all high-contrast for final review.</p>
        </div>
      </section>
    </main>
  );
}
