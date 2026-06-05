"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = /\S+@\S+\.\S+/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }
    window.localStorage.setItem("lumalens-newsletter-email", email.trim());
    setStatus("success");
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[minmax(16rem,1fr)_auto]" aria-label="Newsletter signup">
      <label className="sr-only" htmlFor="footer-email">Email address</label>
      <input
        id="footer-email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setStatus("idle");
        }}
        required
        placeholder="you@example.com"
        aria-describedby="newsletter-status"
        className="min-h-12 rounded-full border border-white/20 bg-white px-5 text-[#11263d] placeholder:text-[#334155]"
      />
      <button type="submit" className="min-h-12 rounded-full bg-[#e8f0ef] px-6 font-semibold text-[#11263d] transition hover:bg-white">
        Notify me
      </button>
      <p id="newsletter-status" className={`text-sm sm:col-span-2 ${status === "error" ? "text-amber-100" : "text-[#d7e3e1]"}`} aria-live="polite">
        {status === "success" ? "You’re on the list — we’ll send frame drops and lens updates." : status === "error" ? "Enter a valid email address to join the list." : "No spam — just launch notes, fit guides, and product updates."}
      </p>
    </form>
  );
}
