import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { gcpTutorial } from "@/lib/gcp-tutorial";

export function GcpTutorialPage({ label }: { label: "Writes" | "Blog" }) {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 pb-16 pt-28 text-[#11263d]">
      <SiteHeader />
      <article className="mx-auto max-w-5xl">
        <section className="rounded-[2.5rem] bg-[#11263d] p-7 text-white stripe-shadow md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#d7e3e1]">
            <Link href={label === "Writes" ? "/writes" : "/blog"} className="rounded-full border border-white/20 px-4 py-2 hover:bg-white/10">
              {label}
            </Link>
            <span>{gcpTutorial.updated}</span>
            <span>{gcpTutorial.readingTime}</span>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[.98] tracking-[-.05em] md:text-6xl">
            {gcpTutorial.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e8f0ef]">
            {gcpTutorial.subtitle}
          </p>
        </section>

        <section className="mt-8 grid gap-5 rounded-[2rem] bg-white/85 p-6 stripe-shadow md:p-8">
          {gcpTutorial.intro.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-9 text-[#334155]">
              {paragraph}
            </p>
          ))}
        </section>

        <nav className="mt-8 rounded-[2rem] border border-[#11263d]/10 bg-white/80 p-6 stripe-shadow" aria-label="Tutorial sections">
          <h2 className="text-2xl font-semibold tracking-[-.03em]">Table of contents</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {gcpTutorial.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="rounded-2xl border border-[#11263d]/10 bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-[#11263d] transition hover:border-[#0b5f59]/40 hover:bg-[#e8f0ef]">
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-8 grid gap-8">
          {gcpTutorial.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28 rounded-[2rem] bg-white/85 p-6 stripe-shadow md:p-8">
              <h2 className="text-3xl font-semibold leading-tight tracking-[-.04em] text-[#0c1b2a] md:text-4xl">
                {section.title}
              </h2>
              <div className="mt-5 grid gap-5">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-[#334155] md:text-lg md:leading-9">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-[1.5rem] bg-[#e8f0ef] p-5">
                  <h3 className="text-xl font-semibold tracking-[-.03em]">Checklist</h3>
                  <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#334155]">
                    {section.checklist.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#0b5f59] text-xs font-bold text-white">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.5rem] bg-[#0c1b2a] p-5 text-white">
                  <h3 className="text-xl font-semibold tracking-[-.03em]">Useful commands</h3>
                  <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/35 p-4 text-sm leading-7 text-[#e8f0ef]"><code>{section.commands.join("\n\n")}</code></pre>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-[2rem] bg-[#11263d] p-6 text-white stripe-shadow md:p-8">
          <h2 className="text-3xl font-semibold tracking-[-.04em]">Official references</h2>
          <p className="mt-4 max-w-3xl leading-8 text-[#d7e3e1]">
            These links point to the Google Cloud documentation used to ground the commands and service guidance in this tutorial.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {gcpTutorial.sources.map((source) => (
              <a key={source.href} href={source.href} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15">
                {source.label}
              </a>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
