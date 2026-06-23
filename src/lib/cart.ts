import {
  getLensAddOn,
  getLensPackage,
  getPrescriptionMode,
  getProduct,
  getProductColor,
  getProductSize,
  lensAddOns,
  lensPackages,
  prescriptionModes,
  products,
  type Product,
} from "@/lib/products";

export type CartLine = {
  slug: string;
  qty: number;
  lensId: string;
  frameSizeId: string;
  prescriptionId: string;
  colorId: string;
  addOnIds: string[];
};

type LegacyCartLine = {
  slug: string;
  qty: number;
  lens?: string;
  frameSize?: string;
  prescription?: string;
  color?: string;
  lensId?: string;
  frameSizeId?: string;
  prescriptionId?: string;
  colorId?: string;
  addOnIds?: string[];
};

const CART_KEY = "lumalens-cart";

function slugish(value = "") {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function findLensId(value?: string) {
  if (!value) return lensPackages[0].id;
  const needle = slugish(value);
  return lensPackages.find((lens) => lens.id === value || slugish(lens.name) === needle || lens.name.toLowerCase().includes(value.toLowerCase()))?.id ?? lensPackages[0].id;
}

function findPrescriptionId(value?: string) {
  if (!value) return prescriptionModes[0].id;
  const needle = slugish(value);
  return prescriptionModes.find((mode) => mode.id === value || slugish(mode.name) === needle || mode.name.toLowerCase().includes(value.toLowerCase()))?.id ?? prescriptionModes[0].id;
}

function normalizeCartLine(line: LegacyCartLine): CartLine | null {
  const product = getProduct(line.slug);
  if (!product) return null;
  const colorId = product.colors.find((color) => color.id === line.colorId || color.name === line.color)?.id ?? product.defaultColorId;
  const frameSizeId = product.sizes.find((size) => size.id === line.frameSizeId || size.name === line.frameSize)?.id ?? product.defaultSizeId;
  const lensId = product.compatibleLensIds.includes(line.lensId ?? "") ? line.lensId! : findLensId(line.lens);
  const compatibleLensId = product.compatibleLensIds.includes(lensId) ? lensId : product.compatibleLensIds[0];
  const addOnIds = Array.isArray(line.addOnIds) ? line.addOnIds.filter((id) => lensAddOns.some((addOn) => addOn.id === id)) : [];

  return {
    slug: product.slug,
    qty: Math.max(1, Number(line.qty) || 1),
    lensId: compatibleLensId,
    frameSizeId,
    prescriptionId: findPrescriptionId(line.prescriptionId ?? line.prescription),
    colorId,
    addOnIds,
  };
}

export function buildDefaultCartLine(product: Product): CartLine {
  return {
    slug: product.slug,
    qty: 1,
    lensId: product.compatibleLensIds[0],
    frameSizeId: product.defaultSizeId,
    prescriptionId: prescriptionModes[0].id,
    colorId: product.defaultColorId,
    addOnIds: ["anti-reflective"],
  };
}

export function lineKey(line: CartLine) {
  return [line.slug, line.lensId, line.frameSizeId, line.prescriptionId, line.colorId, [...line.addOnIds].sort().join(".")].join("::");
}

export function configuredUnitPrice(line: CartLine) {
  const product = getProduct(line.slug);
  if (!product) return 0;
  const addOns = line.addOnIds.reduce((sum, id) => sum + (getLensAddOn(id)?.price ?? 0), 0);
  return product.price + getLensPackage(line.lensId).price + addOns;
}

export function lineSummary(line: CartLine) {
  const product = getProduct(line.slug);
  if (!product) return null;
  return {
    product,
    lens: getLensPackage(line.lensId),
    size: getProductSize(product, line.frameSizeId),
    color: getProductColor(product, line.colorId),
    prescription: getPrescriptionMode(line.prescriptionId),
    addOns: line.addOnIds.map(getLensAddOn).filter(Boolean),
    unitPrice: configuredUnitPrice(line),
  };
}

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]") as LegacyCartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeCartLine).filter((line): line is CartLine => Boolean(line));
  } catch {
    return [];
  }
}

export function saveCart(cart: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("lumalens-cart-updated"));
}

export function addToCart(item: CartLine) {
  const cart = readCart();
  const key = lineKey(item);
  const next = cart.some((line) => lineKey(line) === key)
    ? cart.map((line) => (lineKey(line) === key ? { ...line, qty: line.qty + item.qty } : line))
    : [...cart, item];
  saveCart(next);
  return next;
}

export function updateCartLine(key: string, qty: number) {
  const next = readCart()
    .map((line) => (lineKey(line) === key ? { ...line, qty } : line))
    .filter((line) => line.qty > 0);
  saveCart(next);
  return next;
}

export function cartDetails(cart: CartLine[]) {
  const lines = cart
    .map((line) => ({ ...line, summary: lineSummary(line), product: products.find((product) => product.slug === line.slug) }))
    .filter((line) => Boolean(line.summary) && Boolean(line.product));
  const subtotal = lines.reduce((sum, line) => sum + (line.summary?.unitPrice ?? 0) * line.qty, 0);
  const shipping = subtotal === 0 || subtotal > 150 ? 0 : 12;
  const tax = Math.round(subtotal * 0.0825);
  const total = subtotal + shipping + tax;
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  return { lines, subtotal, shipping, tax, total, count };
}
