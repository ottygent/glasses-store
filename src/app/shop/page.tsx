import type { Metadata } from "next";
import Link from "next/link";
import { ProductBrowser } from "@/components/product-browser";
import { SiteHeader } from "@/components/site-header";
import { products } from "@/lib/products";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop premium glasses",
  description: "Browse LumaLens optical and sun frames by collection, fit, lens package, and price.",
  alternates: { canonical: absoluteUrl("/shop") },
  openGraph: {
    title: `Shop premium glasses | ${siteName}`,
    description: "Compare LumaLens eyewear collections and configure frame, fit, lens, and finish options.",
    url: absoluteUrl("/shop"),
  },
};

export default function ShopPage() {
  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 rounded-3xl border border-[#11263d]/10 bg-white p-8 shadow-sm lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Shop</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-[#0c1b2a]">Find the frame that fits your day.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#475569]">Filter by collection, lens package, fit, and price, then configure the pair on the product page.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop/blue-light" className="rounded-full border border-[#11263d]/20 bg-white px-5 py-3 text-sm font-semibold text-[#11263d] transition hover:border-[#11263d]">Blue-light</Link>
            <Link href="/shop/prescription" className="rounded-full border border-[#11263d]/20 bg-white px-5 py-3 text-sm font-semibold text-[#11263d] transition hover:border-[#11263d]">Prescription</Link>
          </div>
        </div>

        <ProductBrowser products={products} />
      </section>
    </main>
  );
}
