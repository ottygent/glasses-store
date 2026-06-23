"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewsletterForm } from "@/components/newsletter-form";

const shopLinks = [
  { label: "Shop all frames", href: "/shop" },
  { label: "Blue-light glasses", href: "/shop/blue-light" },
  { label: "Prescription ready", href: "/shop/prescription" },
  { label: "Cart", href: "/cart" },
];

const supportLinks = [
  { label: "Fit guide", href: "/try-on" },
  { label: "Trust center", href: "/trust" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Contact studio", href: "/#location" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="min-w-0">
      <h2 className="text-sm font-semibold uppercase tracking-[.18em] text-[#d7e3e1]">{title}</h2>
      <nav className="mt-6 grid gap-4" aria-label={`${title} footer links`}>
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="text-base font-medium leading-7 text-[#e8f0ef] transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-[#11263d]/10 bg-[#0c1b2a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-white" aria-label="LumaLens home">
              <span className="grid size-12 place-items-center rounded-2xl bg-white text-[#11263d]">LL</span>
              <span className="text-2xl">LumaLens</span>
            </Link>
            <p className="mt-7 max-w-lg text-base leading-8 text-[#d7e3e1]">
              Premium eyewear with clear frame fit, practical lens packages, and support before and after checkout.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <FooterColumn title="Shop" links={shopLinks} />
            <FooterColumn title="Support" links={supportLinks} />
            <FooterColumn title="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="mt-16 grid gap-4 text-base font-medium leading-7 text-[#e8f0ef] sm:grid-cols-2 lg:grid-cols-4">
          <p className="flex min-h-20 items-center rounded-2xl border border-white/15 bg-white/10 px-5 py-4">Free shipping over $150</p>
          <p className="flex min-h-20 items-center rounded-2xl border border-white/15 bg-white/10 px-5 py-4">30-day fit support</p>
          <p className="flex min-h-20 items-center rounded-2xl border border-white/15 bg-white/10 px-5 py-4">Prescription-ready lenses</p>
          <p className="flex min-h-20 items-center rounded-2xl border border-white/15 bg-white/10 px-5 py-4">Secure order review</p>
        </div>

        <div className="mt-16 grid gap-8 rounded-3xl border border-white/15 bg-white/10 p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Get frame drops and fit guides.</h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-[#d7e3e1]">New colors, seasonal lens notes, and sizing advice from the studio.</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/15 pt-8 text-sm leading-7 text-[#d7e3e1] md:flex-row md:items-center md:justify-between">
          <p>© 2026 LumaLens Eyewear.</p>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {legalLinks.map((link) => <Link key={link.label} href={link.href} className="hover:text-white">{link.label}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
