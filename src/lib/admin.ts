import { products } from "@/lib/products";

export type AdminProduct = {
  slug: string;
  name: string;
  collection: string;
  price: number;
  compareAt?: number;
  color: string;
  lens: string;
  fit: string;
  status: "Live" | "Draft" | "Low stock";
  inventory: number;
  reorderPoint: number;
  unitsSold: number;
  conversionRate: number;
  margin: number;
  channel: "Storefront" | "Marketplace" | "Retail";
  updatedAt: string;
};

export type AdminOrder = {
  id: string;
  customer: string;
  product: string;
  status: "Paid" | "Fulfillment" | "Review" | "Refunded";
  total: number;
  date: string;
};

export type AdminCustomer = {
  name: string;
  email: string;
  segment: string;
  spend: number;
};

const inventory = [42, 18, 63, 9, 27, 51];
const sold = [384, 216, 171, 92, 128, 305];
const margins = [68, 61, 64, 66, 72, 58];
const status: AdminProduct["status"][] = ["Live", "Live", "Live", "Low stock", "Draft", "Live"];
const channels: AdminProduct["channel"][] = ["Storefront", "Marketplace", "Storefront", "Storefront", "Retail", "Marketplace"];

export const adminProducts: AdminProduct[] = products.map((product, index) => ({
  slug: product.slug,
  name: product.name,
  collection: product.collection,
  price: product.price,
  compareAt: product.compareAt,
  color: product.color,
  lens: product.lens,
  fit: product.fit,
  status: status[index] ?? "Live",
  inventory: inventory[index] ?? 24,
  reorderPoint: index === 3 ? 12 : 16,
  unitsSold: sold[index] ?? product.reviews,
  conversionRate: Number((3.6 + index * 0.4).toFixed(1)),
  margin: margins[index] ?? 62,
  channel: channels[index] ?? "Storefront",
  updatedAt: ["Today", "Yesterday", "2 days ago", "Today", "4 days ago", "1 week ago"][index] ?? "Today",
}));

export const adminOrders: AdminOrder[] = [
  { id: "LL-1048", customer: "Maya Carter", product: "Atlas Tortoise", status: "Paid", total: 228, date: "10:42 AM" },
  { id: "LL-1047", customer: "Noah Kim", product: "Coastal Green", status: "Fulfillment", total: 238, date: "9:16 AM" },
  { id: "LL-1046", customer: "Iris Patel", product: "Studio Clear", status: "Review", total: 119, date: "Yesterday" },
  { id: "LL-1045", customer: "Jon Bell", product: "Noir Line", status: "Refunded", total: 179, date: "Yesterday" },
];

export const adminCustomers: AdminCustomer[] = [
  { name: "Maya Carter", email: "maya@example.com", segment: "Repeat buyer", spend: 527 },
  { name: "Noah Kim", email: "noah@example.com", segment: "High intent", spend: 238 },
  { name: "Iris Patel", email: "iris@example.com", segment: "Prescription", spend: 389 },
];

export const adminInsights = [
  "Coastal Green is below reorder point; create a purchase order for 36 units.",
  "Blue-light collection traffic is up 18% after the homepage filter refresh.",
  "Aurora Gold draft has the highest margin; publish after hero photo approval.",
];

export function adminTotals(items = adminProducts) {
  const revenue = items.reduce((sum, product) => sum + product.unitsSold * product.price, 0);
  const inventoryValue = items.reduce((sum, product) => sum + product.inventory * product.price, 0);
  const lowStock = items.filter((product) => product.inventory <= product.reorderPoint).length;
  const live = items.filter((product) => product.status === "Live" || product.status === "Low stock").length;
  return { revenue, inventoryValue, lowStock, live };
}
