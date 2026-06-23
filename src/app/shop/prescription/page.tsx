import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { compatibleLensPackages, products } from "@/lib/products";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prescription-ready optical frames",
  description: "Shop LumaLens optical frames with practical prescription handling, fit guidance, and lens package choices.",
  alternates: { canonical: absoluteUrl("/shop/prescription") },
  openGraph: {
    title: `Prescription-ready optical frames | ${siteName}`,
    description: "Choose premium prescription-ready glasses with fit guidance and lens options.",
    url: absoluteUrl("/shop/prescription"),
  },
};

const prescriptionFrames = products.filter((product) => compatibleLensPackages(product).some((lens) => lens.id.includes("vision") || lens.id === "progressive"));

export default function PrescriptionShopPage() {
  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-3xl border border-[#11263d]/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Prescription ready</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-[#0c1b2a]">Optical frames ready for your Rx.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#475569]">Choose a frame first, then select single vision or progressive lens handling on the product page.</p>
          <Link href="/try-on" className="mt-7 inline-flex rounded-full border border-[#11263d]/20 px-6 py-3 font-semibold text-[#11263d] transition hover:border-[#11263d]">Read the fit guide</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prescriptionFrames.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>
    </main>
  );
}
