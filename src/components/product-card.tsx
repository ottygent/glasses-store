import Link from "next/link";
import { ProductPreview } from "@/components/product-preview";
import { compatibleLensPackages, formatMoney, type Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  cta?: "View" | "Configure";
};

export function ProductCard({ product, cta = "Configure" }: ProductCardProps) {
  const lenses = compatibleLensPackages(product).slice(0, 2).map((lens) => lens.name).join(" + ");

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#11263d]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <ProductPreview product={product} />
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#0b5f59]">{product.collection}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#11263d]">{product.name}</h2>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold text-[#11263d]">{formatMoney(product.price)}</p>
            {product.compareAt && <p className="text-xs text-[#64748b] line-through">{formatMoney(product.compareAt)}</p>}
          </div>
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-[#475569]">{product.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.colors.slice(0, 4).map((color) => (
            <span key={color.id} className="size-5 rounded-full border border-[#11263d]/15" style={{ backgroundColor: color.swatch }} title={color.name} />
          ))}
          <span className="rounded-full bg-[#edf6f4] px-3 py-1 text-xs font-semibold text-[#0b5f59]">{product.fit.split("/")[0].trim()}</span>
        </div>
        <p className="mt-4 text-xs font-medium text-[#64748b]">{lenses}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[#11263d]">{product.rating} rating ({product.reviews})</p>
          <Link href={`/products/${product.slug}`} className="rounded-full bg-[#11263d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f59]">
            {cta}
          </Link>
        </div>
      </div>
    </article>
  );
}
