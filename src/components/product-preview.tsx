import { getProductColor, type Product } from "@/lib/products";

type ProductPreviewProps = {
  product: Product;
  colorId?: string;
  large?: boolean;
  compact?: boolean;
};

const shapeRadius: Record<Product["visual"]["frameShape"], string> = {
  rectangle: "22% 22% 26% 26%",
  "soft-square": "32% 32% 36% 36%",
  round: "999px",
  navigator: "24% 24% 48% 48%",
  oval: "999px / 72%",
};

export function ProductPreview({ product, colorId, large = false, compact = false }: ProductPreviewProps) {
  const color = getProductColor(product, colorId ?? product.defaultColorId);
  const height = large ? "h-[28rem] rounded-3xl" : compact ? "h-28 rounded-xl" : "h-56 rounded-2xl";
  const lensSize = large ? "h-28 w-40 border-[13px]" : compact ? "h-11 w-16 border-[6px]" : "h-20 w-28 border-[9px]";
  const bridge = large ? "h-3 w-16" : compact ? "h-1.5 w-7" : "h-2.5 w-11";
  const templeTop = large ? "top-[12.4rem]" : compact ? "top-[4.6rem]" : "top-[7.6rem]";
  const frameColor = color.swatch || product.visual.frameColor;

  return (
    <div className={`relative isolate overflow-hidden ${height} bg-gradient-to-br ${product.gradient} product-stage`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,.85),transparent_22rem)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/25" />
      <div className={`absolute left-1/2 ${templeTop} h-3 w-[78%] -translate-x-1/2 rounded-full opacity-80`} style={{ backgroundColor: product.visual.templeColor }} />
      <div className={`absolute inset-x-0 flex items-center justify-center ${large ? "top-[10.4rem] gap-4" : compact ? "top-[3.6rem] gap-2" : "top-[6.2rem] gap-3"}`}>
        <span
          className={`${lensSize} shadow-[inset_0_0_0_999px_rgba(255,255,255,.24),0_18px_40px_rgba(17,38,61,.12)]`}
          style={{ borderColor: frameColor, backgroundColor: product.visual.lensTint, borderRadius: shapeRadius[product.visual.frameShape] }}
        />
        <span className={`${bridge} rounded-full`} style={{ backgroundColor: frameColor }} />
        <span
          className={`${lensSize} shadow-[inset_0_0_0_999px_rgba(255,255,255,.24),0_18px_40px_rgba(17,38,61,.12)]`}
          style={{ borderColor: frameColor, backgroundColor: product.visual.lensTint, borderRadius: shapeRadius[product.visual.frameShape] }}
        />
      </div>
      <div className={`absolute ${compact ? "left-3 top-3" : "left-5 top-5"} flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold text-[#11263d] shadow-sm`}>
        <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: frameColor }} />
        {color.name}
      </div>
    </div>
  );
}
