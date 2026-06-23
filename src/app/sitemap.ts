import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/shop", priority: 0.95 },
  { path: "/shop/blue-light", priority: 0.8 },
  { path: "/shop/prescription", priority: 0.8 },
  { path: "/try-on", priority: 0.75 },
  { path: "/trust", priority: 0.7 },
  { path: "/cart", priority: 0.55 },
  { path: "/checkout", priority: 0.5 },
  { path: "/privacy", priority: 0.25 },
  { path: "/terms", priority: 0.25 },
  { path: "/accessibility", priority: 0.25 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-07T00:00:00.000Z");

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];
}
