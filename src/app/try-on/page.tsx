import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frame fit guide",
  description: "Use LumaLens fit guidance to compare frame width, bridge comfort, temple length, and lens height before choosing glasses.",
  alternates: { canonical: absoluteUrl("/try-on") },
  openGraph: {
    title: `Frame fit guide | ${siteName}`,
    description: "A practical guide for confident frame selection and checkout review.",
    url: absoluteUrl("/try-on"),
  },
};

export default function TryOnPage() {
  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.85fr] lg:items-start">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#7a4f17]">Fit guide</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-[#0c1b2a]">Choose a frame that feels balanced from the first wear.</h1>
          <p className="mt-5 text-lg leading-8 text-[#475569]">Compare your current glasses to the measurements listed on each product page, then choose the fit that best matches your face width and bridge comfort.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["Frame width", "Use narrow, medium, wide, or low-bridge sizing as your starting point."],
              ["Bridge comfort", "Low-bridge options add nose support and cheek clearance."],
              ["Temple length", "Match the last number in the measurement set to a pair you already like."],
              ["Lens height", "Rounder and taller lenses give more vertical room for progressive prescriptions."],
            ].map(([title, detail], index) => (
              <div key={title} className="rounded-2xl border border-[#11263d]/10 bg-[#fffdf8] p-5">
                <span className="text-sm font-semibold text-[#0b5f59]">0{index + 1}</span>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#11263d]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#475569]">{detail}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded-3xl bg-[#11263d] p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#d7e3e1]">Need help choosing?</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Start with a versatile medium fit.</h2>
          <p className="mt-4 leading-7 text-[#e8f0ef]">If you are between sizes, choose the frame shape first, then compare bridge and temple measurements on the product page before adding lens options.</p>
          <div className="mt-7 grid gap-3">
            <Link href="/shop" className="rounded-2xl bg-white p-5 font-semibold text-[#11263d]">Shop frames</Link>
            <Link href="/shop/prescription" className="rounded-2xl border border-white/20 bg-white/10 p-5 font-semibold text-white">Prescription-ready frames</Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
