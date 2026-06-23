"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductPreview } from "@/components/product-preview";
import { SiteHeader } from "@/components/site-header";
import { CartLine, cartDetails, lineKey, readCart, updateCartLine } from "@/lib/cart";
import { formatMoney } from "@/lib/products";

export default function CartPage() {
  const [cart, setCart] = useState<CartLine[]>(() => readCart());
  const details = cartDetails(cart);

  useEffect(() => {
    const sync = () => setCart(readCart());
    window.addEventListener("storage", sync);
    window.addEventListener("lumalens-cart-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lumalens-cart-updated", sync);
    };
  }, []);

  function setQty(key: string, qty: number) {
    setCart(updateCartLine(key, qty));
  }

  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Cart</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight text-[#11263d]">Review your eyewear order.</h1>
          </div>
          <Link href="/shop" className="rounded-full border border-[#11263d]/25 bg-white px-6 py-4 text-center font-semibold text-[#11263d] transition hover:border-[#11263d]">Continue shopping</Link>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="grid gap-4">
            {details.lines.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-semibold text-[#11263d]">Your cart is empty.</h2>
                <p className="mt-3 text-[#475569]">Add a configured pair from any product page.</p>
                <Link href="/shop" className="mt-6 inline-block rounded-full bg-[#11263d] px-7 py-4 font-semibold text-white">Shop frames</Link>
              </div>
            ) : details.lines.map((line) => {
              const summary = line.summary!;
              const product = summary.product;
              const key = lineKey(line);
              return (
                <article key={key} className="grid gap-4 rounded-2xl border border-[#11263d]/10 bg-white p-4 shadow-sm md:grid-cols-[10rem_1fr_auto] md:items-stretch">
                  <ProductPreview product={product} colorId={line.colorId} compact />
                  <div className="min-w-0 py-1">
                    <Link href={`/products/${product.slug}`} className="text-xl font-semibold tracking-tight text-[#11263d] transition hover:text-[#0b5f59]">{product.name}</Link>
                    <p className="mt-1 text-sm leading-6 text-[#475569]">{product.description}</p>
                    <div className="mt-4 grid gap-x-5 gap-y-2 text-sm text-[#475569] sm:grid-cols-2">
                      <span><b className="text-[#11263d]">Color:</b> {summary.color.name}</span>
                      <span><b className="text-[#11263d]">Fit:</b> {summary.size.name} ({summary.size.measurements})</span>
                      <span><b className="text-[#11263d]">Lens:</b> {summary.lens.name}</span>
                      <span><b className="text-[#11263d]">Rx:</b> {summary.prescription.name}</span>
                    </div>
                    {summary.addOns.length > 0 && <p className="mt-3 text-sm text-[#475569]"><b className="text-[#11263d]">Finish:</b> {summary.addOns.map((addOn) => addOn?.name).join(", ")}</p>}
                    <Link href={`/products/${product.slug}`} className="mt-4 inline-flex text-sm font-semibold text-[#0b5f59]">Edit options</Link>
                  </div>
                  <div className="flex items-center justify-between gap-4 md:w-28 md:flex-col md:items-end md:text-right">
                    <label className="sr-only" htmlFor={`qty-${key}`}>Quantity for {product.name}</label>
                    <select
                      id={`qty-${key}`}
                      value={line.qty}
                      onChange={(e) => setQty(key, Number(e.target.value))}
                      className="h-11 w-20 rounded-full border border-[#11263d]/15 bg-white px-4 text-center font-semibold text-[#11263d]"
                      aria-label={`Quantity for ${product.name}`}
                    >
                      {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <p className="text-2xl font-bold tracking-tight text-[#11263d]">{formatMoney(summary.unitPrice * line.qty)}</p>
                    <button onClick={() => setQty(key, 0)} className="rounded-full px-2 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50">Remove</button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-2xl bg-[#11263d] p-6 text-white shadow-sm">
            <h2 className="text-2xl font-semibold">Order summary</h2>
            <div className="mt-6 space-y-3 text-sm text-[#e8f0ef]">
              <div className="flex justify-between"><span>Subtotal</span><b className="text-white">{formatMoney(details.subtotal)}</b></div>
              <div className="flex justify-between"><span>Shipping</span><b className="text-white">{details.shipping === 0 ? "Free" : formatMoney(details.shipping)}</b></div>
              <div className="flex justify-between"><span>Estimated tax</span><b className="text-white">{formatMoney(details.tax)}</b></div>
              <div className="flex justify-between border-t border-white/15 pt-4 text-xl text-white"><span>Total</span><b>{formatMoney(details.total)}</b></div>
            </div>
            <div className="mt-6 rounded-xl bg-white/10 p-4 text-sm text-[#e8f0ef]">
              <b className="text-white">Included with every order:</b>
              <p className="mt-2">Fit support, clear prescription follow-up, case, cloth, and insured delivery.</p>
            </div>
            <Link href="/checkout" className={`mt-6 block rounded-full px-7 py-4 text-center font-semibold transition ${details.count ? "bg-[#0b5f59] text-white hover:bg-[#0a4f4a]" : "pointer-events-none bg-[#d7e3e1] text-[#334155]"}`}>Proceed to checkout</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
