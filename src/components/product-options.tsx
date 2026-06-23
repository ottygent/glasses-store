"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addToCart, buildDefaultCartLine } from "@/lib/cart";
import {
  compatibleLensPackages,
  formatMoney,
  getLensAddOn,
  getLensPackage,
  getPrescriptionMode,
  getProductColor,
  getProductSize,
  lensAddOns,
  prescriptionModes,
  type Product,
} from "@/lib/products";

function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { fbq?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  const event_id = crypto.randomUUID?.() || `${Date.now()}`;
  w.fbq?.("track", event, { ...data, event_id });
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data, event_id });
}

export function ProductOptions({ product }: { product: Product }) {
  const defaults = useMemo(() => buildDefaultCartLine(product), [product]);
  const [lensId, setLensId] = useState(defaults.lensId);
  const [frameSizeId, setFrameSizeId] = useState(defaults.frameSizeId);
  const [prescriptionId, setPrescriptionId] = useState(defaults.prescriptionId);
  const [colorId, setColorId] = useState(defaults.colorId);
  const [addOnIds, setAddOnIds] = useState<string[]>(defaults.addOnIds);
  const [added, setAdded] = useState(false);

  const selectedLens = getLensPackage(lensId);
  const selectedColor = getProductColor(product, colorId);
  const selectedSize = getProductSize(product, frameSizeId);
  const selectedPrescription = getPrescriptionMode(prescriptionId);
  const selectedAddOns = addOnIds.map(getLensAddOn).filter(Boolean);
  const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + (addOn?.price ?? 0), 0);
  const total = product.price + selectedLens.price + addOnTotal;

  function toggleAddOn(id: string) {
    setAddOnIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function submit() {
    addToCart({ slug: product.slug, qty: 1, lensId, frameSizeId, prescriptionId, colorId, addOnIds });
    setAdded(true);
    track("AddToCart", { content_ids: [product.slug], content_name: product.name, value: total, currency: "USD" });
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#11263d]/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#11263d]">Build your pair</h2>
          <p className="mt-2 text-sm leading-6 text-[#475569]">Choose a color, fit, lens package, and finish before adding to cart.</p>
        </div>
        <div className="rounded-xl bg-[#f7f4ee] px-4 py-3 text-right">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#64748b]">Live total</p>
          <p className="text-2xl font-semibold text-[#11263d]">{formatMoney(total)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-7">
        <div>
          <p className="text-sm font-semibold text-[#11263d]">Frame color</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {product.colors.map((color) => (
              <button
                type="button"
                key={color.id}
                onClick={() => setColorId(color.id)}
                className={`rounded-xl border p-4 text-left transition ${colorId === color.id ? "border-[#0b5f59] bg-[#edf6f4]" : "border-[#11263d]/15 bg-white hover:border-[#11263d]/35"}`}
              >
                <span className="flex items-center gap-3">
                  <span className="size-7 rounded-full border border-[#11263d]/15" style={{ backgroundColor: color.swatch }} />
                  <span>
                    <span className="block font-semibold text-[#11263d]">{color.name}</span>
                    <span className="text-sm text-[#64748b]">{color.finish}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#11263d]">Frame fit</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {product.sizes.map((size) => (
              <button
                type="button"
                key={size.id}
                onClick={() => setFrameSizeId(size.id)}
                className={`rounded-xl border p-4 text-left transition ${frameSizeId === size.id ? "border-[#0b5f59] bg-[#edf6f4]" : "border-[#11263d]/15 bg-white hover:border-[#11263d]/35"}`}
              >
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block font-semibold text-[#11263d]">{size.name}</span>
                    <span className="mt-1 block text-sm text-[#475569]">{size.description}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-[#f7f4ee] px-3 py-1 text-xs font-semibold text-[#11263d]">{size.measurements}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#11263d]">Lens package</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {compatibleLensPackages(product).map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setLensId(option.id)}
                className={`rounded-xl border p-4 text-left transition ${lensId === option.id ? "border-[#0b5f59] bg-[#edf6f4]" : "border-[#11263d]/15 bg-white hover:border-[#11263d]/35"}`}
              >
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block font-semibold text-[#11263d]">{option.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#475569]">{option.description}</span>
                    <span className="mt-2 block text-xs font-semibold text-[#64748b]">{option.bestFor}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-[#11263d]">{option.price ? `+${formatMoney(option.price)}` : "Included"}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#11263d]">Lens finish</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {lensAddOns.map((addOn) => (
              <label key={addOn.id} className={`cursor-pointer rounded-xl border p-4 transition ${addOnIds.includes(addOn.id) ? "border-[#0b5f59] bg-[#edf6f4]" : "border-[#11263d]/15 bg-white hover:border-[#11263d]/35"}`}>
                <span className="flex items-start gap-3">
                  <input type="checkbox" checked={addOnIds.includes(addOn.id)} onChange={() => toggleAddOn(addOn.id)} className="mt-1 accent-[#0b5f59]" />
                  <span>
                    <span className="block font-semibold text-[#11263d]">{addOn.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#475569]">{addOn.description}</span>
                    <span className="mt-2 block text-sm font-semibold text-[#11263d]">+{formatMoney(addOn.price)}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#11263d]">Prescription handling</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {prescriptionModes.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setPrescriptionId(option.id)}
                className={`rounded-xl border p-4 text-left transition ${prescriptionId === option.id ? "border-[#0b5f59] bg-[#edf6f4]" : "border-[#11263d]/15 bg-white hover:border-[#11263d]/35"}`}
              >
                <span className="block font-semibold text-[#11263d]">{option.name}</span>
                <span className="mt-1 block text-sm leading-6 text-[#475569]">{option.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 rounded-xl bg-[#f7f4ee] p-4">
        <div className="grid gap-2 text-sm text-[#475569]">
          <div className="flex justify-between gap-4"><span>{product.name}</span><b className="text-[#11263d]">{formatMoney(product.price)}</b></div>
          <div className="flex justify-between gap-4"><span>{selectedColor.name} / {selectedSize.name}</span><b className="text-[#11263d]">Included</b></div>
          <div className="flex justify-between gap-4"><span>{selectedLens.name}</span><b className="text-[#11263d]">{selectedLens.price ? formatMoney(selectedLens.price) : "Included"}</b></div>
          <div className="flex justify-between gap-4"><span>{selectedAddOns.length ? selectedAddOns.map((addOn) => addOn?.name).join(", ") : "No added finish"}</span><b className="text-[#11263d]">{addOnTotal ? formatMoney(addOnTotal) : "Included"}</b></div>
          <div className="flex justify-between gap-4"><span>{selectedPrescription.name}</span><b className="text-[#11263d]">No charge</b></div>
        </div>
        <div className="mt-4 flex justify-between border-t border-[#11263d]/10 pt-4 text-xl font-semibold text-[#11263d]"><span>Total</span><span>{formatMoney(total)}</span></div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button onClick={submit} className="rounded-full bg-[#11263d] px-7 py-4 font-semibold text-white transition hover:bg-[#0b5f59]">Add configured pair</button>
        <Link href="/cart" className="rounded-full border border-[#11263d]/25 px-7 py-4 text-center font-semibold text-[#11263d] transition hover:border-[#11263d]">Review cart</Link>
      </div>
      {added && <p className="mt-3 rounded-xl bg-[#edf6f4] p-3 text-sm font-semibold text-[#0b5f59]">Added with your selected fit, lenses, and finish.</p>}
    </section>
  );
}
