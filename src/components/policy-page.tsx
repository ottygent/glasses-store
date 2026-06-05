import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

type Section = {
  title: string;
  body: string;
};

export function PolicyPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: Section[] }) {
  return (
    <main className="min-h-screen px-5 pb-16 pt-28">
      <SiteHeader />
      <article className="mx-auto max-w-4xl rounded-[2.5rem] bg-white/85 p-8 stripe-shadow md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#0b5f59]">{eyebrow}</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-.05em] text-[#0c1b2a]">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-[#334155]">{intro}</p>
        <div className="mt-10 grid gap-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-[2rem] border border-[#11263d]/10 bg-[#fffdf8] p-6">
              <h2 className="text-2xl font-semibold tracking-[-.03em] text-[#11263d]">{section.title}</h2>
              <p className="mt-3 leading-7 text-[#334155]">{section.body}</p>
            </section>
          ))}
        </div>
        <Link href="/" className="mt-10 inline-flex rounded-full bg-[#11263d] px-7 py-4 font-semibold text-white">
          Back to store
        </Link>
      </article>
    </main>
  );
}
