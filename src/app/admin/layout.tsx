import type { Metadata } from "next";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin workspace",
  description: "Internal LumaLens catalog and order workspace.",
  alternates: { canonical: absoluteUrl("/admin") },
  openGraph: {
    title: `Admin workspace | ${siteName}`,
    description: "Internal catalog and order workspace.",
    url: absoluteUrl("/admin"),
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
