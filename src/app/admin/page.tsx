"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { adminCustomers, adminInsights, adminOrders, adminProducts, adminTotals, type AdminProduct } from "@/lib/admin";
import { formatMoney } from "@/lib/products";

const tabs = ["Overview", "Products", "Orders", "Customers"] as const;
type AdminTab = (typeof tabs)[number];

type EditableProduct = Pick<AdminProduct, "name" | "price" | "inventory" | "status" | "channel">;

function statusClass(status: AdminProduct["status"] | string) {
  if (status === "Live" || status === "Paid") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "Low stock" || status === "Review") return "bg-amber-100 text-amber-800 border-amber-200";
  if (status === "Refunded") return "bg-rose-100 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function MetricCard({ label, value, detail, tone = "light" }: { label: string; value: string; detail: string; tone?: "light" | "dark" }) {
  return (
    <div className={`rounded-[2rem] border p-6 shadow-sm ${tone === "dark" ? "border-[#11263d] bg-[#11263d] text-white" : "border-[#11263d]/10 bg-white/85 text-[#11263d]"}`}>
      <p className={`text-sm font-semibold uppercase tracking-[.18em] ${tone === "dark" ? "text-[#d7e3e1]" : "text-[#0b5f59]"}`}>{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-[-.05em]">{value}</p>
      <p className={`mt-3 text-sm leading-6 ${tone === "dark" ? "text-[#e8f0ef]" : "text-[#334155]"}`}>{detail}</p>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("Overview");
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(adminProducts[0].slug);
  const [draftProducts, setDraftProducts] = useState(adminProducts);
  const [savedAt, setSavedAt] = useState("Unsaved demo workspace");

  const selectedProduct = draftProducts.find((product) => product.slug === selectedSlug) ?? draftProducts[0];
  const totals = useMemo(() => adminTotals(draftProducts), [draftProducts]);
  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return draftProducts;
    return draftProducts.filter((product) => [product.name, product.collection, product.status, product.channel, product.color].join(" ").toLowerCase().includes(needle));
  }, [draftProducts, query]);

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
    setDraftProducts((current) => [duplicate, ...current]);
    setSelectedSlug(duplicate.slug);
    setSavedAt("Created draft demo product");
    setActiveTab("Products");
  }

  function publishDraft() {
    setDraftProducts((current) => current.map((product) => product.slug === selectedProduct.slug ? { ...product, status: "Live", updatedAt: "Just now" } : product));
    setSavedAt(`Saved ${selectedProduct.name} locally`);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#11263d]">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-32">
        <div className="rounded-[2.5rem] bg-[#11263d] p-6 text-white shadow-2xl shadow-slate-900/20 md:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#d7e3e1]">Demo admin • static export safe</p>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-none tracking-[-.06em] md:text-7xl">Commerce command center for LumaLens.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d7e3e1]">A polished admin experience with dashboard metrics, orders, customers, inventory controls, and editable demo product management powered by local state.</p>
            </div>
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-[#d7e3e1]">Workspace status</p>
              <p className="mt-2 text-2xl font-semibold">{savedAt}</p>
              <div className="mt-5 flex gap-3">
                <button onClick={publishDraft} className="interactive-lift rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#11263d]">Save demo</button>
                <button onClick={duplicateProduct} className="interactive-lift rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white">New product</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 rounded-full border border-[#11263d]/10 bg-white/70 p-2 shadow-sm backdrop-blur">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-5 py-3 text-sm font-semibold transition ${activeTab === tab ? "bg-[#11263d] text-white shadow-lg shadow-slate-900/15" : "text-[#334155] hover:bg-[#e8f0ef] hover:text-[#11263d]"}`}>{tab}</button>
          ))}
          <Link href="/" className="ml-auto rounded-full px-5 py-3 text-sm font-semibold text-[#334155] hover:bg-[#e8f0ef]">View storefront →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-5">
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
                  <div className="rounded-[2rem] border border-[#11263d]/10 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Sales health</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Collection performance</h2></div>
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
                  <div className="rounded-[2rem] border border-[#11263d]/10 bg-white p-6 shadow-sm">
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
                <div className="rounded-[2rem] border border-[#11263d]/10 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Catalog manager</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Products and inventory</h2></div>
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="rounded-full border border-[#11263d]/15 bg-[#fffdf8] px-5 py-3 text-sm outline-none focus:border-[#0b5f59]" />
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
                <div className="rounded-[2rem] border border-[#11263d]/10 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#7a4f17]">Product editor</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{selectedProduct.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#334155]">Edit demo fields locally to preview a merchant-facing management flow. Static export safe; no backend writes.</p>
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
              <div className="rounded-[2rem] border border-[#11263d]/10 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Order operations</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Fulfillment queue</h2>
                <div className="mt-6 grid gap-3">
                  {adminOrders.map((order) => <div key={order.id} className="grid gap-3 rounded-3xl border border-[#11263d]/10 p-5 md:grid-cols-[120px_1fr_140px_120px] md:items-center"><b>{order.id}</b><div><p className="font-semibold">{order.customer}</p><p className="text-sm text-[#334155]">{order.product} • {order.date}</p></div><span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{order.status}</span><b>{formatMoney(order.total)}</b></div>)}
                </div>
              </div>
            )}

            {activeTab === "Customers" && (
              <div className="rounded-[2rem] border border-[#11263d]/10 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0b5f59]">Customer CRM</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Segments and lifetime value</h2>
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
