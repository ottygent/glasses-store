import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductOptions } from "@/components/product-options";
import { ProductPreview } from "@/components/product-preview";
import { SiteHeader } from "@/components/site-header";
import { compatibleLensPackages, formatMoney, getProduct, products } from "@/lib/products";
import { absoluteUrl, siteName } from "@/lib/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} glasses`;
  const description = `${product.description} Configure ${product.color.toLowerCase()} frames with fit, lens, and finish options.`;
  const url = absoluteUrl(`/products/${product.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return <main className="grid min-h-screen place-items-center p-10">Product not found.</main>;
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
  const lenses = compatibleLensPackages(product);

  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/shop" className="font-semibold text-[#11263d] transition hover:text-[#0b5f59]">Back to shop</Link>
          <Link href="/cart" className="rounded-full bg-[#11263d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f59]">View cart</Link>
        </div>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,.96fr)_minmax(0,1.04fr)] lg:items-start">
          <div className="grid gap-5">
            <ProductPreview product={product} large />
            <div className="grid gap-3 sm:grid-cols-3">
              {product.features.map((feature) => (
                <div key={feature} className="rounded-xl border border-[#11263d]/10 bg-white p-4 text-sm font-semibold text-[#11263d] shadow-sm">{feature}</div>
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-3xl border border-[#11263d]/10 bg-white/90 p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">{product.collection}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0c1b2a] md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-[#475569]">{product.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => <span key={tag} className="rounded-full bg-[#edf6f4] px-3 py-1 text-sm font-semibold text-[#0b5f59]">{tag}</span>)}
            </div>
            <div className="mt-8 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-semibold text-[#11263d]">{formatMoney(product.price)}</span>
              {product.compareAt && <span className="pb-1 text-lg text-[#64748b] line-through">{formatMoney(product.compareAt)}</span>}
              <span className="pb-1 text-sm font-semibold text-[#475569]">{product.rating} rating from {product.reviews} reviews</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#f7f4ee] p-5">
                <p className="text-sm text-[#64748b]">Frame colors</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((color) => <span key={color.id} className="size-7 rounded-full border border-[#11263d]/15" style={{ backgroundColor: color.swatch }} title={color.name} />)}
                </div>
              </div>
              <div className="rounded-xl bg-[#f7f4ee] p-5">
                <p className="text-sm text-[#64748b]">Fits available</p>
                <p className="mt-2 font-semibold text-[#11263d]">{product.sizes.map((size) => size.name).join(", ")}</p>
              </div>
              <div className="rounded-xl bg-[#f7f4ee] p-5 sm:col-span-2">
                <p className="text-sm text-[#64748b]">Lens packages</p>
                <p className="mt-2 font-semibold text-[#11263d]">{lenses.map((lens) => lens.name).join(", ")}</p>
              </div>
            </div>

            <ProductOptions product={product} />
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Fit notes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#11263d]">Measure once, choose confidently.</h2>
            <p className="mt-3 leading-7 text-[#475569]">Each size card shows lens, bridge, and temple measurements so shoppers can compare against a pair they already own.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#7a4f17]">Box contents</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#11263d]">Ready for daily wear.</h2>
            <ul className="mt-3 space-y-2 text-[#475569]"><li>Protective hard case</li><li>Microfiber cleaning cloth</li><li>30-day adjustment window</li></ul>
          </div>
          <div className="rounded-2xl bg-[#11263d] p-6 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#d7e3e1]">Lens support</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Prescription help after checkout.</h2>
            <p className="mt-3 text-[#e8f0ef]">Select how you want to provide your prescription and finish the frame order without entering private Rx values here.</p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-semibold tracking-tight text-[#11263d]">You may also like</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">{related.map((item) => <ProductCard product={item} key={item.slug} />)}</div>
        </section>
      </div>
    </main>
  );
}
