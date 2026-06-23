export type ProductColor = {
  id: string;
  name: string;
  swatch: string;
  finish: string;
};

export type ProductSize = {
  id: string;
  name: string;
  measurements: string;
  description: string;
};

export type LensPackage = {
  id: string;
  name: string;
  price: number;
  description: string;
  bestFor: string;
};

export type LensAddOn = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type PrescriptionMode = {
  id: string;
  name: string;
  description: string;
};

export type ProductVisual = {
  frameShape: "soft-square" | "rectangle" | "round" | "navigator" | "oval";
  frameColor: string;
  lensTint: string;
  templeColor: string;
};

export type Product = {
  slug: string;
  name: string;
  collection: string;
  price: number;
  compareAt?: number;
  color: string;
  lens: string;
  fit: string;
  tags: string[];
  rating: number;
  reviews: number;
  gradient: string;
  description: string;
  features: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  compatibleLensIds: string[];
  defaultColorId: string;
  defaultSizeId: string;
  visual: ProductVisual;
};

export const lensPackages: LensPackage[] = [
  {
    id: "clear",
    name: "Clear everyday",
    price: 0,
    description: "Balanced clarity for daily wear.",
    bestFor: "Non-prescription or light everyday use",
  },
  {
    id: "blue-light",
    name: "Blue-light comfort",
    price: 30,
    description: "A subtle filter for long screen sessions.",
    bestFor: "Desk work and evening reading",
  },
  {
    id: "single-vision",
    name: "Single vision Rx",
    price: 80,
    description: "Prescription lenses for distance or reading.",
    bestFor: "One field of vision",
  },
  {
    id: "progressive",
    name: "Progressive Rx",
    price: 180,
    description: "Premium lenses for near, mid, and distance vision.",
    bestFor: "Multifocal prescriptions",
  },
  {
    id: "sun-polarized",
    name: "Polarized sun",
    price: 60,
    description: "UV400 sun lenses with glare reduction.",
    bestFor: "Driving and bright outdoor days",
  },
];

export const lensAddOns: LensAddOn[] = [
  {
    id: "anti-reflective",
    name: "Anti-reflective coating",
    price: 20,
    description: "Reduces glare in photos, calls, and night driving.",
  },
  {
    id: "scratch-resistant",
    name: "Scratch-resistant finish",
    price: 18,
    description: "Adds a durable top coat for daily handling.",
  },
  {
    id: "thin-light",
    name: "Thin and light lens",
    price: 45,
    description: "A slimmer lens profile for stronger prescriptions.",
  },
];

export const prescriptionModes: PrescriptionMode[] = [
  {
    id: "upload-later",
    name: "Upload after order",
    description: "Send your Rx from the order confirmation page.",
  },
  {
    id: "enter-later",
    name: "Enter values later",
    description: "We will request the details before fulfillment.",
  },
  {
    id: "non-prescription",
    name: "Non-prescription",
    description: "Use clear, blue-light, or sun lenses without Rx values.",
  },
];

const standardSizes: ProductSize[] = [
  { id: "narrow", name: "Narrow", measurements: "47-19-140", description: "Best for smaller faces and a close temple fit." },
  { id: "medium", name: "Medium", measurements: "50-20-145", description: "A balanced fit for most face widths." },
  { id: "wide", name: "Wide", measurements: "53-21-148", description: "More room across the brow and temples." },
  { id: "low-bridge", name: "Low bridge", measurements: "51-18-145", description: "Added nose-pad comfort and a higher cheek clearance." },
];

export const products: Product[] = [
  {
    slug: "atlas-tortoise",
    name: "Atlas Tortoise",
    collection: "Signature Acetate",
    price: 149,
    compareAt: 189,
    color: "Warm tortoise",
    lens: "Blue-light or prescription ready",
    fit: "Medium / universal bridge",
    tags: ["Best seller", "Acetate", "Blue-light"],
    rating: 4.9,
    reviews: 384,
    gradient: "from-amber-100 via-stone-50 to-teal-50",
    description: "A refined rectangular acetate frame with a confident brow and polished brass details.",
    features: ["Premium Italian acetate", "Universal bridge", "Hard case and cloth included"],
    colors: [
      { id: "tortoise", name: "Warm tortoise", swatch: "#6f4326", finish: "Layered acetate" },
      { id: "espresso", name: "Espresso fade", swatch: "#2a1d18", finish: "Gloss acetate" },
      { id: "honey", name: "Honey amber", swatch: "#b87232", finish: "Translucent acetate" },
    ],
    sizes: standardSizes.filter((size) => ["medium", "wide", "low-bridge"].includes(size.id)),
    compatibleLensIds: ["clear", "blue-light", "single-vision", "progressive"],
    defaultColorId: "tortoise",
    defaultSizeId: "medium",
    visual: { frameShape: "rectangle", frameColor: "#6f4326", lensTint: "#f7fbfb", templeColor: "#b88a44" },
  },
  {
    slug: "noir-line",
    name: "Noir Line",
    collection: "Minimal Metal",
    price: 179,
    color: "Matte black",
    lens: "Polarized sun lenses",
    fit: "Narrow / adjustable nose pads",
    tags: ["Polarized", "Featherweight", "Sun"],
    rating: 4.8,
    reviews: 216,
    gradient: "from-zinc-100 via-stone-50 to-slate-100",
    description: "A lean stainless frame with slim temples and glare-cutting sun lens options.",
    features: ["18g stainless build", "Adjustable silicone pads", "Polarized-ready lens shape"],
    colors: [
      { id: "black", name: "Matte black", swatch: "#111827", finish: "Powder-coated metal" },
      { id: "graphite", name: "Graphite", swatch: "#4b5563", finish: "Satin metal" },
      { id: "silver", name: "Brushed silver", swatch: "#c7ccd3", finish: "Brushed metal" },
    ],
    sizes: standardSizes.filter((size) => ["narrow", "medium"].includes(size.id)),
    compatibleLensIds: ["clear", "single-vision", "sun-polarized"],
    defaultColorId: "black",
    defaultSizeId: "narrow",
    visual: { frameShape: "navigator", frameColor: "#111827", lensTint: "#d8dee4", templeColor: "#111827" },
  },
  {
    slug: "sienna-round",
    name: "Sienna Round",
    collection: "Heritage Optical",
    price: 129,
    color: "Honey champagne",
    lens: "Prescription ready",
    fit: "Small-medium / keyhole bridge",
    tags: ["Prescription", "Lightweight", "Round"],
    rating: 4.7,
    reviews: 171,
    gradient: "from-orange-50 via-rose-50 to-yellow-50",
    description: "Soft round lenses and translucent acetate for an expressive everyday optical frame.",
    features: ["Spring hinges", "Keyhole bridge", "Lightweight acetate profile"],
    colors: [
      { id: "champagne", name: "Honey champagne", swatch: "#d2a66b", finish: "Translucent acetate" },
      { id: "rose", name: "Rose smoke", swatch: "#b98686", finish: "Tinted acetate" },
      { id: "clear", name: "Soft crystal", swatch: "#eef2f2", finish: "Crystal acetate" },
    ],
    sizes: standardSizes.filter((size) => ["narrow", "medium", "low-bridge"].includes(size.id)),
    compatibleLensIds: ["clear", "blue-light", "single-vision", "progressive"],
    defaultColorId: "champagne",
    defaultSizeId: "medium",
    visual: { frameShape: "round", frameColor: "#d2a66b", lensTint: "#fff8ed", templeColor: "#b98686" },
  },
  {
    slug: "coastal-green",
    name: "Coastal Green",
    collection: "Modern Classics",
    price: 159,
    compareAt: 199,
    color: "Deep sea green",
    lens: "Blue-light or clear demo",
    fit: "Wide / low bridge option",
    tags: ["Wide fit", "New", "Blue-light"],
    rating: 4.9,
    reviews: 92,
    gradient: "from-emerald-100 via-teal-50 to-stone-50",
    description: "A confident square silhouette in deep green acetate with extra bridge comfort.",
    features: ["Low bridge option", "Scratch-resistant coating", "Two-year frame warranty"],
    colors: [
      { id: "sea-green", name: "Deep sea green", swatch: "#0f4f46", finish: "Gloss acetate" },
      { id: "sage", name: "Smoked sage", swatch: "#7d927d", finish: "Soft matte acetate" },
      { id: "ink", name: "Ink green", swatch: "#102f2b", finish: "Polished acetate" },
    ],
    sizes: standardSizes.filter((size) => ["medium", "wide", "low-bridge"].includes(size.id)),
    compatibleLensIds: ["clear", "blue-light", "single-vision", "progressive"],
    defaultColorId: "sea-green",
    defaultSizeId: "wide",
    visual: { frameShape: "soft-square", frameColor: "#0f4f46", lensTint: "#edf8f6", templeColor: "#0f4f46" },
  },
  {
    slug: "aurora-gold",
    name: "Aurora Gold",
    collection: "Luxury Metal",
    price: 219,
    color: "Brushed champagne gold",
    lens: "Gradient sun lenses",
    fit: "Medium / adjustable nose pads",
    tags: ["Luxury", "Sun", "Metal"],
    rating: 4.8,
    reviews: 128,
    gradient: "from-yellow-50 via-stone-50 to-sky-50",
    description: "Architectural metalwork and warm gradient lenses for refined travel days.",
    features: ["Titanium-blend temples", "UV400 gradient lenses", "Premium travel case"],
    colors: [
      { id: "gold", name: "Champagne gold", swatch: "#c29b52", finish: "Brushed metal" },
      { id: "bronze", name: "Warm bronze", swatch: "#8a5a31", finish: "Satin metal" },
      { id: "pearl", name: "Pearl silver", swatch: "#d6d9d6", finish: "Polished metal" },
    ],
    sizes: standardSizes.filter((size) => ["medium", "wide"].includes(size.id)),
    compatibleLensIds: ["clear", "single-vision", "sun-polarized"],
    defaultColorId: "gold",
    defaultSizeId: "medium",
    visual: { frameShape: "oval", frameColor: "#c29b52", lensTint: "#eac87d", templeColor: "#c29b52" },
  },
  {
    slug: "studio-clear",
    name: "Studio Clear",
    collection: "Creative Desk",
    price: 119,
    color: "Crystal clear",
    lens: "Blue-light filtering",
    fit: "Medium-wide / universal bridge",
    tags: ["Desk", "Blue-light", "Value"],
    rating: 4.6,
    reviews: 305,
    gradient: "from-blue-50 via-white to-amber-50",
    description: "Clean crystal frames built for long screen days and a polished studio look.",
    features: ["Blue-light filter", "Ultra-clear acetate", "30-day fit guarantee"],
    colors: [
      { id: "crystal", name: "Crystal clear", swatch: "#edf3f4", finish: "Transparent acetate" },
      { id: "smoke", name: "Soft smoke", swatch: "#b7c0c4", finish: "Translucent acetate" },
      { id: "sky", name: "Pale sky", swatch: "#b9d9e8", finish: "Tinted acetate" },
    ],
    sizes: standardSizes.filter((size) => ["medium", "wide", "low-bridge"].includes(size.id)),
    compatibleLensIds: ["clear", "blue-light", "single-vision"],
    defaultColorId: "crystal",
    defaultSizeId: "medium",
    visual: { frameShape: "soft-square", frameColor: "#dce8ea", lensTint: "#f8fdff", templeColor: "#a9bbc1" },
  },
];

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getLensPackage(id: string) {
  return lensPackages.find((lens) => lens.id === id) ?? lensPackages[0];
}

export function getLensAddOn(id: string) {
  return lensAddOns.find((addOn) => addOn.id === id);
}

export function getPrescriptionMode(id: string) {
  return prescriptionModes.find((mode) => mode.id === id) ?? prescriptionModes[0];
}

export function getProductColor(product: Product, id: string) {
  return product.colors.find((color) => color.id === id) ?? product.colors[0];
}

export function getProductSize(product: Product, id: string) {
  return product.sizes.find((size) => size.id === id) ?? product.sizes[0];
}

export function compatibleLensPackages(product: Product) {
  return product.compatibleLensIds.map(getLensPackage);
}
