import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trust center",
  description: "Review LumaLens fit protection, prescription handling, shipping clarity, and order review details.",
  alternates: { canonical: absoluteUrl("/trust") },
  openGraph: {
    title: `Trust center | ${siteName}`,
    description: "Dedicated trust details for fit, prescription handling, shipping, and checkout review.",
    url: absoluteUrl("/trust"),
  },
};

const trustCards = [
  ["Fit protected", "Every order includes a 30-day comfort window and adjustment guidance."],
  ["Prescription support", "Choose how to provide prescription details after selecting a compatible lens package."],
  ["Clear delivery", "Standard and express options stay visible with taxes and totals before checkout."],
  ["Order review", "Frame color, size, lens package, finish, and quantity stay attached to every cart line."],
];

export default function TrustPage() {
  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Trust center</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-[#0c1b2a]">Buying glasses online should feel clear and supported.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#475569]">Review the fit, lens, delivery, and checkout details that help keep every order easy to understand.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {trustCards.map(([title, detail]) => (
            <article key={title} className="rounded-2xl border border-[#11263d]/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-[#11263d]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#475569]">{detail}</p>
            </article>
          ))}
        </div>
        <Link href="/shop" className="mt-8 inline-flex rounded-full bg-[#11263d] px-7 py-4 font-semibold text-white">Shop with confidence</Link>
      </section>
    </main>
  );
}
