import Link from "next/link";

const shopLinks = [
  { label: "Shop all frames", href: "/#shop" },
  { label: "Blue-light glasses", href: "/#shop" },
  { label: "Prescription ready", href: "/#shop" },
  { label: "Checkout demo", href: "/checkout" },
];

const supportLinks = [
  { label: "Fit guarantee", href: "/#trust" },
  { label: "Lens options", href: "/products/atlas-tortoise" },
  { label: "Cart review", href: "/cart" },
  { label: "Payment security", href: "/checkout" },
];

const companyLinks = [
  { label: "Our promise", href: "/#trust" },
  { label: "Try-on flow", href: "/#tryon" },
  { label: "Storefront features", href: "/#top" },
  { label: "Developer notes", href: "/#trust" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[.2em] text-[#d7e3e1]">{title}</h2>
      <nav className="mt-5 grid gap-3" aria-label={`${title} footer links`}>
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="text-sm font-medium text-[#e8f0ef] transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#11263d]/10 bg-[#0c1b2a] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1.85fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-white" aria-label="LumaLens home">
              <span className="grid size-11 place-items-center rounded-2xl bg-white text-[#11263d]">LL</span>
              <span className="text-xl">LumaLens</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#d7e3e1]">
              Premium eyewear storefront demo with product options, cart review, and a Stripe-ready checkout experience designed for confident online buying.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-[#e8f0ef] sm:grid-cols-2">
              <p className="rounded-2xl border border-white/15 bg-white/10 p-4">✓ Free shipping over $150</p>
              <p className="rounded-2xl border border-white/15 bg-white/10 p-4">✓ 30-day fit guarantee</p>
              <p className="rounded-2xl border border-white/15 bg-white/10 p-4">✓ Prescription-ready lenses</p>
              <p className="rounded-2xl border border-white/15 bg-white/10 p-4">✓ Secure mock checkout</p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterColumn title="Shop" links={shopLinks} />
            <FooterColumn title="Support" links={supportLinks} />
            <FooterColumn title="Company" links={companyLinks} />
          </div>
        </div>

        <div className="mt-12 grid gap-6 rounded-[2rem] border border-white/15 bg-white/10 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-.03em]">Get frame drops and lens updates.</h2>
            <p className="mt-2 text-sm leading-6 text-[#d7e3e1]">Be first to see new frame drops, fit guides, and seasonal lens offers.</p>
          </div>
          <form className="grid gap-3 sm:grid-cols-[minmax(16rem,1fr)_auto]" aria-label="Newsletter signup">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input id="footer-email" type="email" placeholder="you@example.com" className="min-h-12 rounded-full border border-white/20 bg-white px-5 text-[#11263d] placeholder:text-[#334155]" />
            <button type="button" className="min-h-12 rounded-full bg-[#e8f0ef] px-6 font-semibold text-[#11263d] transition hover:bg-white">
              Notify me
            </button>
          </form>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/15 pt-6 text-sm text-[#d7e3e1] md:flex-row md:items-center md:justify-between">
          <p>© 2026 LumaLens Eyewear. Mock commerce experience for production storefront validation.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
            <Link href="/#trust" className="hover:text-white">Trust</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
