import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductPreview } from "@/components/product-preview";
import { SiteHeader } from "@/components/site-header";
import { products } from "@/lib/products";

const featured = products.slice(0, 3);
const heroProduct = products[0];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />

      <section id="top" className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-28 lg:grid-cols-[1fr_.95fr] lg:items-center">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-[#0b5f59]/20 bg-white px-4 py-2 text-sm font-semibold text-[#0b5f59]">Free shipping over $150 and 30-day fit support</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-none tracking-tight text-[#0c1b2a] md:text-7xl">LumaLens Eyewear</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#334155]">Premium optical and sun frames with clear fit guidance, practical lens options, and a calm checkout flow built for buying glasses online.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="rounded-full bg-[#11263d] px-8 py-4 text-center font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#0b5f59]">Shop all frames</Link>
            <Link href="/try-on" className="rounded-full border border-[#11263d]/20 bg-white px-8 py-4 text-center font-semibold text-[#11263d] transition hover:border-[#11263d]">Find your fit</Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-sm">
            <div><b className="block text-2xl text-[#11263d]">4.8/5</b><span className="text-[#475569]">average rating</span></div>
            <div><b className="block text-2xl text-[#11263d]">30 days</b><span className="text-[#475569]">fit support</span></div>
            <div><b className="block text-2xl text-[#11263d]">UV400</b><span className="text-[#475569]">sun options</span></div>
          </div>
        </div>
        <div className="rounded-3xl border border-[#11263d]/10 bg-white p-4 shadow-xl shadow-slate-900/10">
          <ProductPreview product={heroProduct} large />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f7f4ee] p-5">
              <p className="text-sm text-[#64748b]">Featured frame</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#11263d]">{heroProduct.name}</h2>
            </div>
            <div className="rounded-2xl bg-[#11263d] p-5 text-white">
              <p className="text-sm text-[#d7e3e1]">Customize</p>
              <h2 className="mt-1 text-2xl font-semibold">Color, fit, lenses</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
          {[
            ["Fit protected", "30-day comfort window and adjustment guidance."],
            ["Lens-ready", "Clear, blue-light, prescription, and sun packages."],
            ["Simple Rx handling", "Upload or enter prescription details after order."],
            ["Clear delivery", "Free standard shipping on orders over $150."],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-2xl border border-[#11263d]/10 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight text-[#11263d]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Best sellers</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#11263d] md:text-5xl">Frames people come back for.</h2>
          </div>
          <Link href="/shop" className="rounded-full border border-[#11263d]/20 bg-white px-6 py-3 text-center font-semibold text-[#11263d] transition hover:border-[#11263d]">Browse the full shop</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-3xl bg-[#11263d] p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#d7e3e1]">Lens guide</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Choose lenses around how you live.</h2>
          <p className="mt-5 leading-8 text-[#e8f0ef]">Start with everyday clear lenses, add blue-light comfort for screen-heavy days, or choose prescription and polarized sun packages where compatible.</p>
          <Link href="/shop/prescription" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-[#11263d]">Shop prescription-ready frames</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Clear everyday", "Balanced clarity for daily wear."],
            ["Blue-light comfort", "A subtle filter for screen-heavy routines."],
            ["Single vision Rx", "Distance or reading lenses with checkout guidance."],
            ["Polarized sun", "UV400 protection with glare reduction."],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold tracking-tight text-[#11263d]">{title}</h3>
              <p className="mt-3 leading-7 text-[#475569]">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="location" className="mx-auto max-w-7xl px-5 pb-24">
        <div className="grid overflow-hidden rounded-3xl border border-[#11263d]/10 bg-white shadow-sm lg:grid-cols-[.9fr_1.1fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Visit our studio</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[#11263d] md:text-5xl">Get a frame fit in person.</h2>
            <p className="mt-6 text-lg leading-8 text-[#475569]">Stop by for sizing, lens guidance, and a closer look at the collection.</p>
            <address className="mt-8 rounded-2xl bg-[#f7f4ee] p-5 not-italic leading-7 text-[#475569]">
              <b className="text-[#11263d]">LumaLens Studio</b><br />
              126 Greene Street<br />
              New York, NY 10012<br />
              Open Mon-Sat, 10:00 AM-7:00 PM
            </address>
            <a href="https://www.google.com/maps/search/?api=1&query=126%20Greene%20Street%2C%20New%20York%2C%20NY%2010012" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-[#11263d] px-7 py-4 font-semibold text-white transition hover:bg-[#0b5f59]">Open in Google Maps</a>
          </div>
          <div className="min-h-[24rem] bg-[#e8f0ef] lg:min-h-[34rem]">
            <iframe
              title="Google Maps location for LumaLens Studio"
              src="https://www.google.com/maps?q=126%20Greene%20Street%2C%20New%20York%2C%20NY%2010012&output=embed"
              className="h-full min-h-[24rem] w-full border-0 lg:min-h-[34rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  );
}
