import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { gcpTutorial } from "@/lib/gcp-tutorial";

export default function WritesPage() {
  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[2.5rem] bg-[#11263d] p-8 text-white stripe-shadow">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#d7e3e1]">Writes</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight tracking-[-.05em]">Long-form guides and notes.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#e8f0ef]">Technical writing for shipping, operating, and improving web commerce projects.</p>
        </div>
        <Link href="/writes/gcp-usage" className="mt-8 block rounded-[2rem] bg-white/85 p-7 stripe-shadow transition hover:-translate-y-1">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#0b5f59]">{gcpTutorial.updated} • {gcpTutorial.readingTime}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-[#11263d]">{gcpTutorial.title}</h2>
          <p className="mt-4 max-w-3xl leading-8 text-[#334155]">{gcpTutorial.subtitle}</p>
        </Link>
      </section>
    </main>
  );
}
