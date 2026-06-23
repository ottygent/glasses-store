import type { Metadata } from "next";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review configured LumaLens eyewear, delivery choices, payment details, and order totals.",
  alternates: { canonical: absoluteUrl("/checkout") },
  openGraph: {
    title: `Checkout | ${siteName}`,
    description: "Review your eyewear order before placing it.",
    url: absoluteUrl("/checkout"),
  },
};

export default function CheckoutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
