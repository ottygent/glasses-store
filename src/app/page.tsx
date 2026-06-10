"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addToCart } from "@/lib/cart";
import { formatMoney, products } from "@/lib/products";
import { FrameArt } from "@/components/frame-art";
import { LazyFrameArt } from "@/components/lazy-frame-art";
import { SiteHeader } from "@/components/site-header";

function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { fbq?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  const event_id = crypto.randomUUID?.() || `${Date.now()}`;
  w.fbq?.("track", event, { ...data, event_id });
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data, event_id });
}

export default function Home() {
  const [category, setCategory] = useState("All");
  const [clickedQuickAdd, setClickedQuickAdd] = useState<string | null>(null);
  const visibleProducts = useMemo(() => category === "All" ? products : products.filter((p) => p.tags.includes(category) || p.collection.includes(category)), [category]);
  const categories = ["All", "Blue-light", "Sun", "Prescription", "Wide fit", "Luxury"];

  useEffect(() => {
    track("PageView", { content_name: "LumaLens storefront" });
  }, []);

  useEffect(() => {
    function applyShopHash() {
      const hash = window.location.hash;
      const next = hash === "#shop-blue-light" ? "Blue-light" : hash === "#shop-prescription" ? "Prescription" : hash === "#shop-all" ? "All" : null;
      if (!next) return;
      setCategory(next);
      window.requestAnimationFrame(() => document.getElementById("shop")?.scrollIntoView({ block: "start" }));
    }
    applyShopHash();
    window.addEventListener("hashchange", applyShopHash);
    return () => window.removeEventListener("hashchange", applyShopHash);
  }, []);

  function quickAdd(slug: string) {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;
    addToCart({ slug, qty: 1, lens: "Demo clear", frameSize: "Medium", prescription: "Upload later", color: product.color });
    setClickedQuickAdd(slug);
    window.setTimeout(() => setClickedQuickAdd((current) => current === slug ? null : current), 1200);
    track("AddToCart", { content_ids: [slug], currency: "USD", value: product.price });
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />
      <section id="top" className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-32 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div className="reveal-up">
          <p className="mb-5 inline-flex rounded-full border border-[#b88a44]/30 bg-white/60 px-4 py-2 text-sm font-medium text-[#6f4a1f]">Prescription-ready eyewear • free shipping over $150</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[.98] tracking-[-.05em] text-[#0c1b2a] md:text-7xl">Premium glasses that make buying online feel safe.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#334155]">A polished Next.js storefront with hamburger navigation, product option pages, a full cart, and a realistic card payment flow ready to wire to Stripe.</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row"><Link href="/shop" className="interactive-lift rounded-full bg-[#0b5f59] px-10 py-3 text-center font-semibold text-white shadow-xl shadow-teal-900/20">Shop frames</Link><Link href="/checkout" className="interactive-lift rounded-full border border-[#11263d]/25 bg-white px-10 py-3 text-center font-semibold text-[#11263d] hover:border-[#11263d]">Try payment flow</Link></div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4 text-sm"><div><b className="block text-2xl text-[#11263d]">4.8/5</b><span className="text-[#334155]">customer rating</span></div><div><b className="block text-2xl text-[#11263d]">30 days</b><span className="text-[#334155]">fit guarantee</span></div><div><b className="block text-2xl text-[#11263d]">UV400</b><span className="text-[#334155]">lens options</span></div></div>
        </div>
        <div className="reveal-up-delay glass-card stripe-shadow rounded-[2.5rem] p-5"><FrameArt gradient="from-teal-200 via-stone-100 to-amber-100" /><div className="mt-5 grid grid-cols-2 gap-4"><div className="rounded-3xl bg-[#11263d] p-5 text-white"><p className="text-sm text-[#e8f0ef]">New flow</p><b className="text-3xl">Full cart</b><p className="mt-3 text-sm text-[#e8f0ef]">Dedicated cart and checkout pages.</p></div><div className="rounded-3xl bg-white p-5"><p className="text-sm text-[#334155]">Realistic form</p><b className="text-3xl text-[#11263d]">Payment</b><p className="mt-3 text-sm text-[#334155]">Card, PayPal, Apple Pay, billing, shipping.</p></div></div></div>
      </section>

      <section id="trust" className="px-5 pb-10">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#11263d]/10 bg-white/80 p-3 shadow-[0_28px_80px_rgba(17,38,61,0.12)] backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ["Fit protected", "30-day comfort guarantee", "↺"],
              ["Secure checkout", "Card, wallet, and PayPal-ready", "⌁"],
              ["Lens-ready", "Upload Rx later or use demo lenses", "+"],
              ["Fast delivery", "Free shipping over $150", "→"],
            ].map(([title, detail, icon]) => (
              <div key={title} className="group rounded-[1.5rem] border border-[#11263d]/10 bg-gradient-to-br from-white via-[#fffdf8] to-[#e8f0ef] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#0b5f59]/30 hover:shadow-xl">
                <div className="mb-5 inline-grid size-11 place-items-center rounded-2xl bg-[#11263d] text-lg font-semibold text-white shadow-lg shadow-slate-900/20 transition duration-300 group-hover:scale-105 group-hover:bg-[#0b5f59]">{icon}</div>
                <h2 className="text-lg font-semibold tracking-[-.03em] text-[#11263d]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#334155]">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="lazy-render mx-auto max-w-7xl px-5 py-28"><div className="mx-auto mb-16 max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[.2em] text-[#0b5f59]">Shop the edit</p><h2 className="mt-6 text-4xl font-semibold tracking-[-.04em] md:text-5xl">Frames for every face.</h2><p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#334155]">Open a product page to choose color, lens type, frame fit, and prescription handling.</p></div><div className="mb-14 flex justify-center gap-4 overflow-x-auto pb-2 no-scrollbar">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`interactive-lift shrink-0 rounded-full border px-5 py-3 text-sm font-semibold ${category === item ? "border-[#11263d] bg-[#11263d] text-white" : "border-[#11263d]/20 bg-white text-[#11263d] hover:border-[#11263d]"}`}>{item}</button>)}</div><div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{visibleProducts.map((p) => (<article key={p.slug} className="interactive-lift glass-card rounded-[2rem] p-4 transition hover:-translate-y-1 hover:shadow-2xl"><Link href={`/products/${p.slug}`} aria-label={`View ${p.name}`} onClick={() => track("ViewContent", { content_ids: [p.slug] })}><LazyFrameArt gradient={p.gradient} /></Link><div className="p-4"><div className="mb-3 flex flex-wrap gap-2">{p.tags.slice(0,2).map((tag) => <span key={tag} className="rounded-full bg-[#e8f0ef] px-3 py-1 text-xs font-semibold text-[#0b5f59]">{tag}</span>)}</div><h3 className="text-2xl font-semibold tracking-[-.03em]">{p.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[#334155]">{p.description}</p><div className="mt-5 flex items-center justify-between"><div><span className="text-xl font-semibold">{formatMoney(p.price)}</span>{p.compareAt && <span className="ml-2 text-sm text-[#334155] line-through">{formatMoney(p.compareAt)}</span>}<p className="text-xs text-[#334155]">★ {p.rating} ({p.reviews})</p></div><button onClick={() => quickAdd(p.slug)} style={clickedQuickAdd === p.slug ? { backgroundColor: "#0b5f59" } : undefined} className={`quick-add-button interactive-lift cursor-pointer rounded-full px-4 py-3 text-sm font-semibold text-white ${clickedQuickAdd === p.slug ? "is-clicked bg-[#0b5f59]" : "bg-[#11263d]"}`} aria-live="polite">{clickedQuickAdd === p.slug ? "Added ✓" : "Quick add"}</button></div><Link href={`/products/${p.slug}`} className="mt-4 block text-sm font-semibold text-[#0b5f59]">Choose options →</Link></div></article>))}</div></section>

      <section id="tryon" className="lazy-render mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-2"><div className="rounded-[2rem] bg-[#fffdf8] p-8 stripe-shadow"><p className="text-sm font-semibold uppercase tracking-[.2em] text-[#7a4f17]">Modern ecommerce features</p><h2 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Built like a real storefront, without requiring admin.</h2><ul className="mt-6 space-y-4 text-[#334155]"><li>• Hamburger menu navigation across storefront, cart, and checkout.</li><li>• Product detail pages with configurable frame and lens options.</li><li>• Full cart page with shipping, tax, line editing, and order summary.</li><li>• Real-looking payment page with multiple payment methods.</li></ul></div><div id="checkout" className="rounded-[2rem] bg-[#11263d] p-8 text-white"><p className="text-sm text-[#d7e3e1]">Checkout preview</p><h3 className="mt-2 text-3xl font-semibold">Choose a payment method</h3><div className="mt-6 grid gap-3"><Link href="/checkout" className="rounded-2xl bg-white p-5 font-semibold text-[#11263d]">Credit / debit card →</Link><Link href="/checkout" className="rounded-2xl border border-[#e8f0ef] bg-[#e8f0ef] p-5 font-semibold text-[#11263d]">Apple Pay / PayPal →</Link></div></div></section>

      <section className="lazy-render mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-7 stripe-shadow">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#0b5f59]">Lens lab</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-[#11263d]">Every frame can be finished for how you actually use it.</h2>
            <p className="mt-4 text-[#334155]">Choose demo clear, blue-light, single vision, or progressive lenses on the product page. Pricing updates before you add to cart.</p>
          </div>
          <div className="rounded-[2rem] bg-[#11263d] p-7 text-white stripe-shadow">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#d7e3e1]">Fit promise</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">30-day comfort check.</h2>
            <p className="mt-4 text-[#e8f0ef]">The full cart preserves fit, color, and prescription choices so the checkout summary is easy to review before payment.</p>
          </div>
          <div className="rounded-[2rem] bg-white p-7 stripe-shadow">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#7a4f17]">Secure flow</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-[#11263d]">Buttons and forms are built for clarity.</h2>
            <p className="mt-4 text-[#334155]">Primary, secondary, wallet, and disabled payment actions now use explicit high-contrast colors instead of low-opacity text.</p>
          </div>
        </div>
      </section>

    </main>
  );
}
