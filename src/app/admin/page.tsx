"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { adminCustomers, adminInsights, adminOrders, adminProducts, adminTotals, type AdminProduct } from "@/lib/admin";
import { formatMoney } from "@/lib/products";

const tabs = ["Overview", "Products", "Orders", "Customers"] as const;
type AdminTab = (typeof tabs)[number];
type EditableProduct = Pick<AdminProduct, "name" | "price" | "inventory" | "status" | "channel">;
type NewProductForm = Pick<AdminProduct, "name" | "collection" | "price" | "inventory" | "status" | "channel" | "color" | "lens" | "fit">;

const ADMIN_COOKIE = "lumalens_admin_session";
const ADMIN_COOKIE_VALUE = "demo-admin-authenticated";
const ADMIN_PRODUCTS_KEY = "lumalens-admin-products";
const DEMO_EMAIL = "admin@lumalens.demo";
const DEMO_PASSWORD = "frames2026";

const initialNewProduct: NewProductForm = {
  name: "",
  collection: "Signature Acetate",
  price: 149,
  inventory: 24,
  status: "Draft",
  channel: "Storefront",
  color: "Custom acetate",
  lens: "Blue-light or prescription ready",
  fit: "Medium / universal bridge",
};

function statusClass(status: AdminProduct["status"] | string) {
  if (status === "Live" || status === "Paid") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "Low stock" || status === "Review") return "bg-amber-100 text-amber-800 border-amber-200";
  if (status === "Refunded") return "bg-rose-100 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function MetricCard({ label, value, detail, tone = "light" }: { label: string; value: string; detail: string; tone?: "light" | "dark" }) {
  return (
    <div className={`rounded-[1.75rem] border p-5 shadow-sm sm:rounded-[2rem] sm:p-6 ${tone === "dark" ? "border-[#11263d] bg-[#11263d] text-white" : "border-[#11263d]/10 bg-white/85 text-[#11263d]"}`}>
      <p className={`text-xs font-semibold uppercase tracking-[.16em] sm:text-sm sm:tracking-[.18em] ${tone === "dark" ? "text-[#d7e3e1]" : "text-[#0b5f59]"}`}>{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">{value}</p>
      <p className={`mt-3 text-sm leading-6 ${tone === "dark" ? "text-[#e8f0ef]" : "text-[#334155]"}`}>{detail}</p>
    </div>
  );
}

function readAdminCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((cookie) => cookie === `${ADMIN_COOKIE}=${ADMIN_COOKIE_VALUE}`);
}

function setAdminCookie() {
  document.cookie = `${ADMIN_COOKIE}=${ADMIN_COOKIE_VALUE}; path=/; max-age=86400; SameSite=Lax`;
}

function clearAdminCookie() {
  document.cookie = `${ADMIN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

function loadStoredProducts() {
  if (typeof window === "undefined") return adminProducts;
  try {
    const stored = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!stored) return adminProducts;
    const parsed = JSON.parse(stored) as AdminProduct[];
    return Array.isArray(parsed) && parsed.length ? parsed : adminProducts;
  } catch {
    return adminProducts;
  }
}

function persistProducts(products: AdminProduct[]) {
  window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `product-${Date.now()}`;
}

function buildInsertedProduct(form: NewProductForm, existing: AdminProduct[]): AdminProduct {
  const baseSlug = slugify(form.name);
  const slug = existing.some((product) => product.slug === baseSlug) ? `${baseSlug}-${existing.length + 1}` : baseSlug;
  return {
    slug,
    name: form.name.trim(),
    collection: form.collection.trim() || "Admin Capsule",
    price: Number(form.price) || 0,
    color: form.color.trim() || "Custom acetate",
    lens: form.lens.trim() || "Demo clear",
    fit: form.fit.trim() || "Medium / universal bridge",
    status: form.status,
    inventory: Number(form.inventory) || 0,
    reorderPoint: 12,
    unitsSold: 0,
    conversionRate: 0,
    margin: 62,
    channel: form.channel,
    updatedAt: "Just now",
  };
}

function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError("Use the demo admin credentials shown below.");
      return;
    }
    setAdminCookie();
    onLogin();
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#11263d]">
      <SiteHeader />
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-24 sm:px-5 sm:py-28 lg:grid-cols-[1fr_460px]">
        <div>
          <p className="inline-flex rounded-full border border-[#0b5f59]/20 bg-white px-3 py-2 text-xs font-semibold text-[#0b5f59] sm:px-4 sm:text-sm">Cookie authentication • demo admin</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[.95] tracking-[-.06em] sm:mt-6 sm:text-5xl md:text-7xl">Admin sign in for the LumaLens back office.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#334155] sm:mt-6 sm:text-lg sm:leading-8">This static GitHub Pages demo uses a browser cookie for the admin session and localStorage for inserted catalog records. Production would replace this with server-side auth and a database.</p>
        </div>
        <form onSubmit={submit} className="rounded-[1.75rem] border border-[#11263d]/10 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:rounded-[2.5rem] sm:p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#7a4f17]">Admin sign in</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Access dashboard</h2>
          <label className="mt-6 grid gap-2 text-sm font-semibold">Email<input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-2xl border border-[#11263d]/15 px-4 py-3 font-normal outline-none focus:border-[#0b5f59]" /></label>
          <label className="mt-4 grid gap-2 text-sm font-semibold">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-2xl border border-[#11263d]/15 px-4 py-3 font-normal outline-none focus:border-[#0b5f59]" /></label>
          {error && <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
          <button type="submit" className="interactive-lift mt-6 w-full rounded-full bg-[#11263d] px-6 py-4 font-semibold text-white">Sign in with cookie</button>
          <div className="mt-5 rounded-2xl bg-[#f7f4ee] p-4 text-sm leading-6 text-[#334155]">
            <p><b>Demo email:</b> {DEMO_EMAIL}</p>
            <p><b>Demo password:</b> {DEMO_PASSWORD}</p>
          </div>
        </form>
      </section>
    </main>
  );
}

export default function AdminPage() {
  const [hydrated, setHydrated] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("Overview");
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(adminProducts[0].slug);
  const [draftProducts, setDraftProducts] = useState(adminProducts);
  const [newProduct, setNewProduct] = useState<NewProductForm>(initialNewProduct);
  const [savedAt, setSavedAt] = useState("Unsaved demo workspace");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const authed = readAdminCookie();
      setAuthenticated(authed);
      setHydrated(true);
      if (authed) {
        const stored = loadStoredProducts();
        setDraftProducts(stored);
        setSelectedSlug(stored[0]?.slug ?? adminProducts[0].slug);
        setSavedAt(window.localStorage.getItem(`${ADMIN_PRODUCTS_KEY}-status`) ?? "Loaded admin workspace");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedProduct = draftProducts.find((product) => product.slug === selectedSlug) ?? draftProducts[0] ?? adminProducts[0];
  const totals = useMemo(() => adminTotals(draftProducts), [draftProducts]);
  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return draftProducts;
    return draftProducts.filter((product) => [product.name, product.collection, product.status, product.channel, product.color].join(" ").toLowerCase().includes(needle));
  }, [draftProducts, query]);

  function saveProducts(nextProducts: AdminProduct[], message: string) {
    setDraftProducts(nextProducts);
    setSavedAt(message);
    persistProducts(nextProducts);
    window.localStorage.setItem(`${ADMIN_PRODUCTS_KEY}-status`, message);
  }

  function updateSelected(field: keyof EditableProduct, value: string) {
    setDraftProducts((current) => current.map((product) => {
      if (product.slug !== selectedProduct.slug) return product;
      const nextValue = field === "price" || field === "inventory" ? Number(value) : value;
      return { ...product, [field]: nextValue } as AdminProduct;
    }));
  }

  function duplicateProduct() {
    const duplicate: AdminProduct = {
      ...selectedProduct,
      slug: `${selectedProduct.slug}-demo-${draftProducts.length}`,
      name: `${selectedProduct.name} Studio Sample`,
      status: "Draft",
      inventory: 0,
      unitsSold: 0,
      updatedAt: "Just now",
    };
    const nextProducts = [duplicate, ...draftProducts];
    saveProducts(nextProducts, "Created draft demo product");
    setSelectedSlug(duplicate.slug);
    setActiveTab("Products");
  }

  function publishDraft() {
    const nextProducts = draftProducts.map((product) => product.slug === selectedProduct.slug ? { ...product, status: "Live" as const, updatedAt: "Just now" } : product);
    saveProducts(nextProducts, `Saved ${selectedProduct.name} to localStorage`);
  }

  function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newProduct.name.trim()) {
      setSavedAt("Add a product name before inserting");
      return;
    }
    const inserted = buildInsertedProduct(newProduct, draftProducts);
    const nextProducts = [inserted, ...draftProducts];
    saveProducts(nextProducts, `Inserted ${inserted.name} into localStorage`);
    setSelectedSlug(inserted.slug);
    setNewProduct(initialNewProduct);
    setActiveTab("Products");
  }

  function resetDemoData() {
    window.localStorage.removeItem(ADMIN_PRODUCTS_KEY);
    window.localStorage.removeItem(`${ADMIN_PRODUCTS_KEY}-status`);
    setDraftProducts(adminProducts);
    setSelectedSlug(adminProducts[0].slug);
    setSavedAt("Reset to seeded demo data");
  }

  function logout() {
    clearAdminCookie();
    setAuthenticated(false);
    setSavedAt("Signed out");
  }

  if (!hydrated) {
    return <main className="min-h-screen bg-[#f7f4ee] pt-32 text-center text-[#11263d]">Loading admin workspace…</main>;
  }

  if (!authenticated) {
    return <LoginPanel onLogin={() => { setAuthenticated(true); setDraftProducts(loadStoredProducts()); setSavedAt("Authenticated with admin cookie"); }} />;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#11263d]">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-5 sm:pb-10 sm:pt-32">
        <div className="rounded-[1.75rem] bg-[#11263d] p-5 text-white shadow-2xl shadow-slate-900/20 sm:rounded-[2.5rem] sm:p-6 md:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="inline-flex max-w-full rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-[#d7e3e1] sm:px-4 sm:text-sm">Cookie-authenticated admin • localStorage catalog</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[.95] tracking-[-.06em] sm:mt-6 sm:text-5xl md:text-7xl">Commerce command center for LumaLens.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#d7e3e1] sm:mt-6 sm:text-lg sm:leading-8">A polished admin experience with dashboard metrics, orders, customers, inventory controls, cookie authentication, and persistent local product insertion.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur sm:rounded-[2rem] sm:p-5">
              <p className="text-sm text-[#d7e3e1]">Workspace status</p>
              <p className="mt-2 text-xl font-semibold leading-tight sm:text-2xl">{savedAt}</p>
              <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
                <button onClick={publishDraft} className="interactive-lift rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#11263d]">Save demo</button>
                <button onClick={duplicateProduct} className="interactive-lift rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white">Duplicate</button>
                <button onClick={logout} className="interactive-lift rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white">Sign out</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-[1.5rem] border border-[#11263d]/10 bg-white/70 p-2 shadow-sm backdrop-blur sm:mt-6 sm:flex sm:flex-wrap sm:gap-3 sm:rounded-full">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-3 text-sm font-semibold transition sm:px-5 ${activeTab === tab ? "bg-[#11263d] text-white shadow-lg shadow-slate-900/15" : "text-[#334155] hover:bg-[#e8f0ef] hover:text-[#11263d]"}`}>{tab}</button>
          ))}
          <Link href="/" className="col-span-2 rounded-full px-4 py-3 text-center text-sm font-semibold text-[#334155] hover:bg-[#e8f0ef] sm:col-span-1 sm:ml-auto sm:px-5">View storefront →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-5 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden space-y-5 lg:block">
            <div className="rounded-[2rem] border border-[#11263d]/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Admin modules</p>
              <div className="mt-5 grid gap-2">
                {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold ${activeTab === tab ? "bg-[#e8f0ef] text-[#0b5f59]" : "text-[#334155] hover:bg-[#f7f4ee]"}`}>{tab}</button>)}
              </div>
            </div>
            <div className="rounded-[2rem] border border-[#11263d]/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#7a4f17]">AI merch notes</p>
              <div className="mt-4 space-y-3">
                {adminInsights.map((insight) => <p key={insight} className="rounded-2xl bg-[#fff8e8] p-4 text-sm leading-6 text-[#6f4a1f]">{insight}</p>)}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {activeTab === "Overview" && (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Revenue" value={formatMoney(totals.revenue)} detail="Lifetime demo revenue across configured frames." tone="dark" />
                  <MetricCard label="Live SKUs" value={`${totals.live}`} detail="Published and purchasable product records." />
                  <MetricCard label="Inventory value" value={formatMoney(totals.inventoryValue)} detail="Retail value of sellable stock on hand." />
                  <MetricCard label="Low stock" value={`${totals.lowStock}`} detail="Products at or below reorder point." />
                </div>
                <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
                  <div className="rounded-[1.75rem] border border-[#11263d]/10 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Sales health</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">Collection performance</h2></div>
                      <button onClick={() => setActiveTab("Products")} className="rounded-full bg-[#11263d] px-5 py-3 text-sm font-semibold text-white">Manage products</button>
                    </div>
                    <div className="mt-6 space-y-4">
                      {draftProducts.slice(0, 5).map((product) => (
                        <button key={product.slug} onClick={() => { setSelectedSlug(product.slug); setActiveTab("Products"); }} className="grid w-full gap-3 rounded-3xl border border-[#11263d]/10 p-4 text-left transition hover:border-[#0b5f59]/40 hover:bg-[#f8fbfa] md:grid-cols-[1fr_160px_110px] md:items-center">
                          <div><p className="font-semibold">{product.name}</p><p className="mt-1 text-sm text-[#334155]">{product.collection} • {product.unitsSold} sold</p></div>
                          <div className="h-3 overflow-hidden rounded-full bg-[#e8f0ef]"><span className="block h-full rounded-full bg-[#0b5f59]" style={{ width: `${Math.min(product.conversionRate * 14, 100)}%` }} /></div>
                          <p className="text-sm font-semibold text-[#0b5f59]">{product.conversionRate}% CVR</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] border border-[#11263d]/10 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
                    <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#7a4f17]">Recent orders</p>
                    <div className="mt-5 space-y-3">
                      {adminOrders.map((order) => <div key={order.id} className="rounded-2xl bg-[#f7f4ee] p-4"><div className="flex items-center justify-between gap-3"><b>{order.id}</b><span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{order.status}</span></div><p className="mt-2 text-sm text-[#334155]">{order.customer} • {order.product}</p><p className="mt-2 font-semibold">{formatMoney(order.total)} <span className="text-sm font-normal text-[#334155]">{order.date}</span></p></div>)}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Products" && (
              <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
                <div className="space-y-6">
                  <form onSubmit={createProduct} className="rounded-[1.75rem] border border-[#11263d]/10 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Real data insertion</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">Create product</h2></div>
                      <button type="submit" className="interactive-lift w-full rounded-full bg-[#0b5f59] px-6 py-3 text-sm font-semibold text-white sm:w-auto">Insert product</button>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold">Product name<input value={newProduct.name} onChange={(event) => setNewProduct((current) => ({ ...current, name: event.target.value }))} placeholder="Riviera Blue" className="rounded-2xl border border-[#11263d]/15 px-4 py-3 font-normal outline-none focus:border-[#0b5f59]" /></label>
                      <label className="grid gap-2 text-sm font-semibold">Collection<input value={newProduct.collection} onChange={(event) => setNewProduct((current) => ({ ...current, collection: event.target.value }))} className="rounded-2xl border border-[#11263d]/15 px-4 py-3 font-normal outline-none focus:border-[#0b5f59]" /></label>
                      <label className="grid gap-2 text-sm font-semibold">Price<input type="number" value={newProduct.price} onChange={(event) => setNewProduct((current) => ({ ...current, price: Number(event.target.value) }))} className="rounded-2xl border border-[#11263d]/15 px-4 py-3 font-normal outline-none focus:border-[#0b5f59]" /></label>
                      <label className="grid gap-2 text-sm font-semibold">Inventory<input type="number" value={newProduct.inventory} onChange={(event) => setNewProduct((current) => ({ ...current, inventory: Number(event.target.value) }))} className="rounded-2xl border border-[#11263d]/15 px-4 py-3 font-normal outline-none focus:border-[#0b5f59]" /></label>
                      <label className="grid gap-2 text-sm font-semibold">Status<select value={newProduct.status} onChange={(event) => setNewProduct((current) => ({ ...current, status: event.target.value as AdminProduct["status"] }))} className="rounded-2xl border border-[#11263d]/15 bg-white px-4 py-3 font-normal outline-none focus:border-[#0b5f59]"><option>Live</option><option>Draft</option><option>Low stock</option></select></label>
                      <label className="grid gap-2 text-sm font-semibold">Channel<select value={newProduct.channel} onChange={(event) => setNewProduct((current) => ({ ...current, channel: event.target.value as AdminProduct["channel"] }))} className="rounded-2xl border border-[#11263d]/15 bg-white px-4 py-3 font-normal outline-none focus:border-[#0b5f59]"><option>Storefront</option><option>Marketplace</option><option>Retail</option></select></label>
                    </div>
                  </form>

                  <div className="rounded-[1.75rem] border border-[#11263d]/10 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Catalog manager</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">Products and inventory</h2></div>
                      <div className="flex flex-col gap-3 sm:flex-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="rounded-full border border-[#11263d]/15 bg-[#fffdf8] px-5 py-3 text-sm outline-none focus:border-[#0b5f59]" /><button onClick={resetDemoData} className="rounded-full border border-[#11263d]/20 px-5 py-3 text-sm font-semibold text-[#11263d]">Reset data</button></div>
                    </div>
                    <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#11263d]/10">
                      <div className="hidden grid-cols-[1.4fr_110px_110px_100px] bg-[#f7f4ee] px-4 py-3 text-xs font-semibold uppercase tracking-[.16em] text-[#334155] md:grid"><span>Product</span><span>Status</span><span>Stock</span><span>Price</span></div>
                      {filteredProducts.map((product) => (
                        <button key={product.slug} onClick={() => setSelectedSlug(product.slug)} className={`grid w-full gap-3 border-t border-[#11263d]/10 px-4 py-4 text-left transition md:grid-cols-[1.4fr_110px_110px_100px] md:items-center ${selectedSlug === product.slug ? "bg-[#e8f0ef]/70" : "bg-white hover:bg-[#fffdf8]"}`}>
                          <div><p className="font-semibold">{product.name}</p><p className="mt-1 text-sm text-[#334155]">{product.collection} • {product.channel}</p></div>
                          <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(product.status)}`}>{product.status}</span>
                          <span className="text-sm font-semibold">{product.inventory} units</span>
                          <span className="font-semibold">{formatMoney(product.price)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-[#11263d]/10 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#7a4f17]">Product editor</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">{selectedProduct.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#334155]">Edit fields locally, save to localStorage, then reload the admin panel to see inserted data persist.</p>
                  <div className="mt-6 grid gap-4">
                    <label className="grid gap-2 text-sm font-semibold">Name<input value={selectedProduct.name} onChange={(event) => updateSelected("name", event.target.value)} className="rounded-2xl border border-[#11263d]/15 px-4 py-3 font-normal outline-none focus:border-[#0b5f59]" /></label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold">Price<input type="number" value={selectedProduct.price} onChange={(event) => updateSelected("price", event.target.value)} className="rounded-2xl border border-[#11263d]/15 px-4 py-3 font-normal outline-none focus:border-[#0b5f59]" /></label>
                      <label className="grid gap-2 text-sm font-semibold">Inventory<input type="number" value={selectedProduct.inventory} onChange={(event) => updateSelected("inventory", event.target.value)} className="rounded-2xl border border-[#11263d]/15 px-4 py-3 font-normal outline-none focus:border-[#0b5f59]" /></label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold">Status<select value={selectedProduct.status} onChange={(event) => updateSelected("status", event.target.value)} className="rounded-2xl border border-[#11263d]/15 bg-white px-4 py-3 font-normal outline-none focus:border-[#0b5f59]"><option>Live</option><option>Draft</option><option>Low stock</option></select></label>
                      <label className="grid gap-2 text-sm font-semibold">Channel<select value={selectedProduct.channel} onChange={(event) => updateSelected("channel", event.target.value)} className="rounded-2xl border border-[#11263d]/15 bg-white px-4 py-3 font-normal outline-none focus:border-[#0b5f59]"><option>Storefront</option><option>Marketplace</option><option>Retail</option></select></label>
                    </div>
                    <div className="rounded-3xl bg-[#f7f4ee] p-5"><p className="text-sm font-semibold">Merchandising notes</p><p className="mt-2 text-sm leading-6 text-[#334155]">{selectedProduct.color} • {selectedProduct.lens} • {selectedProduct.fit}</p><p className="mt-3 text-sm text-[#334155]">Margin: <b>{selectedProduct.margin}%</b> • Reorder point: <b>{selectedProduct.reorderPoint}</b></p></div>
                    <div className="flex flex-col gap-3 sm:flex-row"><button onClick={publishDraft} className="interactive-lift rounded-full bg-[#11263d] px-6 py-4 font-semibold text-white">Save product</button><button onClick={duplicateProduct} className="interactive-lift rounded-full border border-[#11263d]/20 px-6 py-4 font-semibold text-[#11263d]">Duplicate draft</button></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Orders" && (
              <div className="rounded-[1.75rem] border border-[#11263d]/10 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Order operations</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">Fulfillment queue</h2>
                <div className="mt-6 grid gap-3">
                  {adminOrders.map((order) => <div key={order.id} className="grid gap-3 rounded-3xl border border-[#11263d]/10 p-5 md:grid-cols-[120px_1fr_140px_120px] md:items-center"><b>{order.id}</b><div><p className="font-semibold">{order.customer}</p><p className="text-sm text-[#334155]">{order.product} • {order.date}</p></div><span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{order.status}</span><b>{formatMoney(order.total)}</b></div>)}
                </div>
              </div>
            )}

            {activeTab === "Customers" && (
              <div className="rounded-[1.75rem] border border-[#11263d]/10 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Customer CRM</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">Segments and lifetime value</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {adminCustomers.map((customer) => <div key={customer.email} className="rounded-3xl border border-[#11263d]/10 bg-[#fffdf8] p-5"><div className="grid size-12 place-items-center rounded-2xl bg-[#11263d] font-semibold text-white">{customer.name.split(" ").map((part) => part[0]).join("")}</div><h3 className="mt-4 text-xl font-semibold">{customer.name}</h3><p className="mt-1 text-sm text-[#334155]">{customer.email}</p><p className="mt-4 rounded-full bg-[#e8f0ef] px-3 py-2 text-sm font-semibold text-[#0b5f59]">{customer.segment}</p><p className="mt-4 text-2xl font-semibold">{formatMoney(customer.spend)}</p></div>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
