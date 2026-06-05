"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartDetails, readCart } from "@/lib/cart";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(cartDetails(readCart()).count);
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("lumalens-cart-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lumalens-cart-updated", sync);
    };
  }, []);

  const nav = [
    { href: "/#shop", label: "Shop" },
    { href: "/#tryon", label: "Try-on" },
    { href: "/#trust", label: "Trust" },
    { href: "/cart", label: "Cart" },
    { href: "/checkout", label: "Payment" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#11263d]/15 bg-[#fffdf8]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <button aria-label="Toggle navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="grid size-12 place-items-center rounded-full border border-[#11263d]/20 bg-white text-[#11263d] shadow-sm md:hidden">
            <span className="space-y-1.5">
              <span className={`block h-0.5 w-5 rounded bg-[#11263d] transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded bg-[#11263d] transition ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 rounded bg-[#11263d] transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-[#11263d]" onClick={() => setMenuOpen(false)}>
            <span className="grid size-10 place-items-center rounded-2xl bg-[#11263d] text-white">LL</span>
            LumaLens
          </Link>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#334155] md:flex">
          {nav.map((item) => <Link key={item.href} href={item.href} className="hover:text-[#11263d]">{item.label}</Link>)}
        </nav>
        <Link href="/cart" className="rounded-full bg-[#11263d] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20">Cart ({count})</Link>
      </div>
      {menuOpen && (
        <div className="border-t border-[#11263d]/10 bg-[#fffdf8] px-5 pb-5 md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2 pt-3">
            {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-2xl border border-transparent px-4 py-4 text-lg font-semibold text-[#11263d] hover:border-[#11263d]/20 hover:bg-[#e8f0ef]">{item.label}</Link>)}
          </nav>
        </div>
      )}
    </header>
  );
}
