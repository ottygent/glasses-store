import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { compatibleLensPackages, products } from "@/lib/products";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blue-light glasses for screen-heavy days",
  description: "Shop LumaLens blue-light frames for desk work, long screen sessions, and clear everyday eyewear.",
  alternates: { canonical: absoluteUrl("/shop/blue-light") },
  openGraph: {
    title: `Blue-light glasses | ${siteName}`,
    description: "A dedicated edit of LumaLens frames that support blue-light filtering and clear desk lenses.",
    url: absoluteUrl("/shop/blue-light"),
  },
};

const blueLightFrames = products.filter((product) => compatibleLensPackages(product).some((lens) => lens.id === "blue-light"));

export default function BlueLightShopPage() {
  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-3xl bg-[#11263d] p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#d7e3e1]">Blue-light glasses</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight tracking-tight">Frames for screen-heavy days.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#e8f0ef]">Choose frames that pair with blue-light comfort lenses for desk work, evening reading, and everyday screen routines.</p>
          <Link href="/shop" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-[#11263d]">Compare all frames</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blueLightFrames.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>
    </main>
  );
}
