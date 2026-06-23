"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { compatibleLensPackages, type Product } from "@/lib/products";

type ProductBrowserProps = {
  products: Product[];
};

const priceRanges = [
  { label: "All prices", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Under $150", min: 0, max: 149 },
  { label: "$150-$199", min: 150, max: 199 },
  { label: "$200+", min: 200, max: Number.POSITIVE_INFINITY },
];

function unique(values: string[]) {
  return Array.from(new Set(values)).sort();
}

export function ProductBrowser({ products }: ProductBrowserProps) {
  const collections = useMemo(() => ["All collections", ...unique(products.map((product) => product.collection))], [products]);
  const lensTypes = useMemo(() => ["All lenses", ...unique(products.flatMap((product) => compatibleLensPackages(product).map((lens) => lens.name)))], [products]);
  const fits = useMemo(() => ["All fits", ...unique(products.flatMap((product) => product.sizes.map((size) => size.name)))], [products]);
  const [collection, setCollection] = useState(collections[0]);
  const [lens, setLens] = useState(lensTypes[0]);
  const [fit, setFit] = useState(fits[0]);
  const [price, setPrice] = useState(priceRanges[0].label);

  const visibleProducts = useMemo(() => {
    const selectedPrice = priceRanges.find((range) => range.label === price) ?? priceRanges[0];
    return products.filter((product) => {
      const collectionMatch = collection === collections[0] || product.collection === collection;
      const lensMatch = lens === lensTypes[0] || compatibleLensPackages(product).some((item) => item.name === lens);
      const fitMatch = fit === fits[0] || product.sizes.some((size) => size.name === fit);
      const priceMatch = product.price >= selectedPrice.min && product.price <= selectedPrice.max;
      return collectionMatch && lensMatch && fitMatch && priceMatch;
    });
  }, [collection, collections, fit, fits, lens, lensTypes, price, products]);

  return (
    <div>
      <div className="mb-8 grid gap-3 rounded-2xl border border-[#11263d]/10 bg-white p-4 shadow-sm md:grid-cols-4">
        <label className="grid gap-2 text-sm font-semibold text-[#11263d]">
          Collection
          <select value={collection} onChange={(event) => setCollection(event.target.value)} className="h-12 rounded-xl border border-[#11263d]/15 bg-white px-3 font-normal text-[#11263d]">
            {collections.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#11263d]">
          Lens
          <select value={lens} onChange={(event) => setLens(event.target.value)} className="h-12 rounded-xl border border-[#11263d]/15 bg-white px-3 font-normal text-[#11263d]">
            {lensTypes.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#11263d]">
          Fit
          <select value={fit} onChange={(event) => setFit(event.target.value)} className="h-12 rounded-xl border border-[#11263d]/15 bg-white px-3 font-normal text-[#11263d]">
            {fits.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#11263d]">
          Price
          <select value={price} onChange={(event) => setPrice(event.target.value)} className="h-12 rounded-xl border border-[#11263d]/15 bg-white px-3 font-normal text-[#11263d]">
            {priceRanges.map((item) => <option key={item.label}>{item.label}</option>)}
          </select>
        </label>
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[#475569]">{visibleProducts.length} frame{visibleProducts.length === 1 ? "" : "s"} found</p>
        <button type="button" onClick={() => { setCollection(collections[0]); setLens(lensTypes[0]); setFit(fits[0]); setPrice(priceRanges[0].label); }} className="text-sm font-semibold text-[#0b5f59]">Reset filters</button>
      </div>

      {visibleProducts.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => <ProductCard product={product} key={product.slug} />)}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-[#11263d]">No frames match those filters.</h2>
          <p className="mt-3 text-[#475569]">Try another lens package, fit, or price range.</p>
        </div>
      )}
    </div>
  );
}
