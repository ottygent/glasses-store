import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

const shopLinks = [
  { label: "Shop all frames", href: "/shop" },
  { label: "Blue-light glasses", href: "/shop/blue-light" },
  { label: "Prescription ready", href: "/shop/prescription" },
  { label: "Checkout demo", href: "/checkout" },
];

const supportLinks = [
  { label: "Fit guarantee", href: "/trust" },
  { label: "Lens options", href: "/products/atlas-tortoise" },
  { label: "Cart review", href: "/cart" },
  { label: "Payment security", href: "/checkout" },
];

const companyLinks = [
  { label: "Our promise", href: "/trust" },
  { label: "Try-on flow", href: "/try-on" },
  { label: "Storefront features", href: "/features" },
  { label: "Developer notes", href: "/features" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="min-w-0">
      <h2 className="text-sm font-semibold uppercase tracking-[.24em] text-[#d7e3e1]">{title}</h2>
      <nav className="mt-8 grid gap-5" aria-label={`${title} footer links`}>
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
  return (
    <footer className="lazy-render mt-32 border-t border-[#11263d]/10 bg-[#0c1b2a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28 lg:py-32">
        <div className="grid gap-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-28">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-white" aria-label="LumaLens home">
              <span className="grid size-12 place-items-center rounded-2xl bg-white text-[#11263d]">LL</span>
              <span className="text-2xl">LumaLens</span>
            </Link>
            <p className="mt-8 max-w-lg text-base leading-8 text-[#d7e3e1]">
              Premium eyewear storefront demo with product options, cart review, and a Stripe-ready checkout experience designed for confident online buying.
            </p>
          </div>

          <div className="grid gap-14 sm:grid-cols-3 lg:gap-16">
            <FooterColumn title="Shop" links={shopLinks} />
            <FooterColumn title="Support" links={supportLinks} />
            <FooterColumn title="Company" links={companyLinks} />
          </div>
        </div>

        <div className="mt-24 grid gap-6 text-base font-medium leading-7 text-[#e8f0ef] sm:grid-cols-2 lg:grid-cols-4">
          <p className="flex min-h-24 items-center rounded-[1.6rem] border border-white/15 bg-white/10 px-6 py-5">✓ Free shipping over $150</p>
          <p className="flex min-h-24 items-center rounded-[1.6rem] border border-white/15 bg-white/10 px-6 py-5">✓ 30-day fit guarantee</p>
          <p className="flex min-h-24 items-center rounded-[1.6rem] border border-white/15 bg-white/10 px-6 py-5">✓ Prescription-ready lenses</p>
          <p className="flex min-h-24 items-center rounded-[1.6rem] border border-white/15 bg-white/10 px-6 py-5">✓ Secure mock checkout</p>
        </div>

        <div className="mt-24 grid gap-10 rounded-[2.75rem] border border-white/15 bg-white/10 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10 lg:p-12">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-.04em]">Get frame drops and lens updates.</h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-[#d7e3e1]">Be first to see new frame drops, fit guides, and seasonal lens offers.</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-20 flex flex-col gap-8 border-t border-white/15 pt-10 text-sm leading-7 text-[#d7e3e1] md:flex-row md:items-center md:justify-between">
          <p>© 2026 LumaLens Eyewear. Mock commerce experience for production storefront validation.</p>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
            <Link href="/trust" className="hover:text-white">Trust</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
