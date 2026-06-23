import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const notes = [
  ["Fit first", "Start with face width, bridge comfort, and temple length before choosing a color."],
  ["Lens package", "Pick clear everyday, blue-light comfort, prescription, or polarized sun lenses based on daily use."],
  ["Finish details", "Add anti-reflective, scratch-resistant, or thin-and-light finishes when they improve everyday wear."],
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-[#11263d] p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#d7e3e1]">Lens and fit guide</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight tracking-tight">Choose frames around comfort, clarity, and daily use.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#e8f0ef]">A quick guide to the choices shoppers make before configuring a LumaLens pair.</p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {notes.map(([title, detail]) => (
            <article key={title} className="rounded-2xl bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-[#11263d]">{title}</h2>
              <p className="mt-4 leading-7 text-[#475569]">{detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-full bg-[#11263d] px-7 py-4 font-semibold text-white">Shop frames</Link>
          <Link href="/trust" className="rounded-full border border-[#11263d]/25 bg-white px-7 py-4 font-semibold text-[#11263d]">View trust center</Link>
        </div>
      </section>
    </main>
  );
}
