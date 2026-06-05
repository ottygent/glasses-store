"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCart, lensOptions, prescriptionOptions, sizeOptions } from "@/lib/cart";
import { Product, formatMoney } from "@/lib/products";

function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { fbq?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  const event_id = crypto.randomUUID?.() || `${Date.now()}`;
  w.fbq?.("track", event, { ...data, event_id });
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data, event_id });
}

export function ProductOptions({ product }: { product: Product }) {
  const [lens, setLens] = useState(lensOptions[0].name);
  const [frameSize, setFrameSize] = useState("Medium");
  const [prescription, setPrescription] = useState("Upload later");
  const [color, setColor] = useState(product.color);
  const [added, setAdded] = useState(false);
  const selectedLens = lensOptions.find((option) => option.name === lens) ?? lensOptions[0];
  const total = product.price + selectedLens.price;

  function submit() {
    addToCart({ slug: product.slug, qty: 1, lens, frameSize, prescription, color });
    setAdded(true);
    track("AddToCart", { content_ids: [product.slug], content_name: product.name, value: total, currency: "USD" });
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-[#11263d]/10 bg-white p-5">
      <h2 className="text-2xl font-semibold tracking-[-.03em]">Choose your options</h2>
      <div className="mt-5 grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-[#11263d]">Frame color
          <select value={color} onChange={(e) => setColor(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal">
            <option>{product.color}</option><option>Matte black</option><option>Champagne gold</option><option>Crystal clear</option><option>Deep sea green</option>
          </select>
        </label>
        <div>
          <p className="text-sm font-semibold text-[#11263d]">Lens type</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {lensOptions.map((option) => (
              <button key={option.name} onClick={() => setLens(option.name)} className={`rounded-2xl border p-4 text-left text-[#11263d] transition ${lens === option.name ? "border-[#0b5f59] bg-[#e8f0ef]" : "border-[#11263d]/20 bg-white hover:border-[#11263d]"}`}>
                <span className="block font-semibold">{option.name} {option.price ? `+${formatMoney(option.price)}` : ""}</span>
                <span className="mt-1 block text-sm text-[#334155]">{option.description}</span>
              </button>
            ))}
          </div>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-[#11263d]">Frame fit
          <select value={frameSize} onChange={(e) => setFrameSize(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal">
            {sizeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#11263d]">Prescription option
          <select value={prescription} onChange={(e) => setPrescription(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal">
            {prescriptionOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-6 rounded-2xl bg-[#f7f4ee] p-4">
        <div className="flex justify-between text-sm"><span>Frame</span><b>{formatMoney(product.price)}</b></div>
        <div className="mt-2 flex justify-between text-sm"><span>{selectedLens.name} lenses</span><b>{selectedLens.price ? formatMoney(selectedLens.price) : "Included"}</b></div>
        <div className="mt-3 flex justify-between border-t border-[#11263d]/10 pt-3 text-xl font-semibold"><span>Total</span><span>{formatMoney(total)}</span></div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button onClick={submit} className="rounded-full bg-[#11263d] px-7 py-4 font-semibold text-white">Add configured pair</button>
        <Link href="/cart" className="rounded-full border border-[#11263d]/25 px-7 py-4 text-center font-semibold text-[#11263d] hover:border-[#11263d]">Go to full cart</Link>
      </div>
      {added && <p className="mt-3 rounded-2xl bg-[#e8f0ef] p-3 text-sm font-semibold text-[#0b5f59]">Added with your selected options.</p>}
    </div>
  );
}
