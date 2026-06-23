"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ProductPreview } from "@/components/product-preview";
import {
  adminCustomers,
  adminInsights,
  adminOrders,
  adminProducts,
  adminTotals,
  type AdminCustomer,
  type AdminOrder,
  type AdminProduct,
} from "@/lib/admin";
import { formatMoney, getProduct } from "@/lib/products";

type AdminTab = "Overview" | "Products" | "Orders" | "Customers";
type EditableProduct = Pick<AdminProduct, "name" | "collection" | "price" | "inventory" | "status" | "channel" | "color" | "lens" | "fit">;
type NewProductForm = Pick<AdminProduct, "name" | "collection" | "price" | "inventory" | "status" | "channel" | "color" | "lens" | "fit">;
type OrderStatus = AdminOrder["status"];

const ADMIN_COOKIE = "lumalens_admin_session";
const ADMIN_COOKIE_VALUE = "admin-authenticated";
const ADMIN_PRODUCTS_KEY = "lumalens-admin-products";
const USERNAME = "admin";
const PASSWORD = "admin123";

const orderStatuses: OrderStatus[] = ["Paid", "Fulfillment", "Review", "Refunded"];
const adminNav = [
  { tab: "Overview", label: "Dashboard", detail: "Sales, stock, and work queue" },
  { tab: "Products", label: "Catalog", detail: "Merchandising and options" },
  { tab: "Orders", label: "Orders", detail: "Fulfillment status" },
  { tab: "Customers", label: "Customers", detail: "Segments and outreach" },
] satisfies { tab: AdminTab; label: string; detail: string }[];

const initialNewProduct: NewProductForm = {
  name: "",
  collection: "Signature Acetate",
  price: 149,
  inventory: 24,
  status: "Draft",
  channel: "Storefront",
  color: "Custom acetate",
  lens: "Clear everyday, blue-light, single vision",
  fit: "Medium / universal bridge",
};

const inputClass = "rounded-xl border border-[#11263d]/15 bg-white px-4 py-3 font-normal text-[#11263d] outline-none transition focus:border-[#0b5f59] focus:ring-4 focus:ring-[#0b5f59]/10";

function statusClass(status: AdminProduct["status"] | OrderStatus) {
  if (status === "Live" || status === "Paid") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "Low stock" || status === "Review") return "bg-amber-100 text-amber-800 border-amber-200";
  if (status === "Refunded") return "bg-rose-100 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
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
    lens: form.lens.trim() || "Clear everyday",
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

function MetricCard({ label, value, detail, tone = "light" }: { label: string; value: string; detail: string; tone?: "light" | "dark" }) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${tone === "dark" ? "border-[#11263d] bg-[#11263d] text-white" : "border-[#11263d]/10 bg-white text-[#11263d]"}`}>
      <p className={`text-xs font-semibold uppercase tracking-[.14em] ${tone === "dark" ? "text-[#d7e3e1]" : "text-[#0b5f59]"}`}>{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className={`mt-3 text-sm leading-6 ${tone === "dark" ? "text-[#e8f0ef]" : "text-[#475569]"}`}>{detail}</p>
    </div>
  );
}

function RevenueTrendChart({ total }: { total: number }) {
  const points = [0.54, 0.62, 0.58, 0.7, 0.76, 0.83, 0.91].map((ratio) => Math.round(total * ratio));
  const max = Math.max(...points);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <section className="rounded-2xl border border-[#11263d]/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#0b5f59]">Revenue trend</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#11263d]">Weekly sales pace</h2>
        </div>
        <p className="rounded-full bg-[#edf6f4] px-3 py-2 text-sm font-semibold text-[#0b5f59]">+18%</p>
      </div>
      <div className="mt-8 flex h-56 items-end gap-3">
        {points.map((point, index) => (
          <div key={labels[index]} className="flex h-full flex-1 flex-col justify-end gap-3">
            <div className="relative flex flex-1 items-end rounded-xl bg-[#f7f4ee]">
              <div className="w-full rounded-xl bg-[#0b5f59]" style={{ height: `${Math.max(18, (point / max) * 100)}%` }} />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-[#11263d]">{labels[index]}</p>
              <p className="mt-1 text-[0.7rem] text-[#64748b]">{formatMoney(point)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChannelMixChart({ products }: { products: AdminProduct[] }) {
  const channels = ["Storefront", "Marketplace", "Retail"] as const;
  const totals = channels.map((channel) => ({
    channel,
    value: products.filter((product) => product.channel === channel).reduce((sum, product) => sum + product.unitsSold, 0),
  }));
  const total = totals.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <section className="rounded-2xl border border-[#11263d]/10 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#7a4f17]">Channel mix</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#11263d]">Units sold by channel</h2>
      <div className="mt-8 grid gap-4">
        {totals.map((item) => {
          const percent = Math.round((item.value / total) * 100);
          return (
            <div key={item.channel}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-[#11263d]">{item.channel}</span>
                <span className="text-[#64748b]">{percent}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-[#f7f4ee]">
                <div className="h-full rounded-full bg-[#11263d]" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InventoryRiskChart({ products }: { products: AdminProduct[] }) {
  const sorted = [...products].sort((a, b) => (a.inventory - a.reorderPoint) - (b.inventory - b.reorderPoint)).slice(0, 5);

  return (
    <section className="rounded-2xl border border-[#11263d]/10 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#0b5f59]">Inventory risk</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#11263d]">Closest to reorder point</h2>
      <div className="mt-7 space-y-4">
        {sorted.map((product) => {
          const ratio = Math.min(100, Math.round((product.inventory / Math.max(product.reorderPoint * 2, 1)) * 100));
          return (
            <div key={product.slug} className="rounded-xl bg-[#f7f4ee] p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-[#11263d]">{product.name}</p>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(product.status)}`}>{product.inventory} units</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                <div className={product.inventory <= product.reorderPoint ? "h-full rounded-full bg-amber-500" : "h-full rounded-full bg-[#0b5f59]"} style={{ width: `${ratio}%` }} />
              </div>
              <p className="mt-2 text-xs text-[#64748b]">Reorder point: {product.reorderPoint}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState(USERNAME);
  const [password, setPassword] = useState(PASSWORD);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username.trim().toLowerCase() !== USERNAME || password !== PASSWORD) {
      setError("Use the local preview credentials shown below.");
      return;
    }
    setAdminCookie();
    onLogin();
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-8 text-[#11263d]">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-3 font-semibold">
          <span className="grid size-10 place-items-center rounded-xl bg-[#11263d] text-white">LL</span>
          LumaLens Admin
        </Link>
        <Link href="/" className="rounded-full border border-[#11263d]/20 bg-white px-5 py-3 text-sm font-semibold">Storefront</Link>
      </div>
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-[90rem] items-center gap-12 lg:grid-cols-[1fr_27rem]">
        <div>
          <p className="inline-flex rounded-full border border-[#0b5f59]/20 bg-white px-4 py-2 text-sm font-semibold text-[#0b5f59]">Internal catalog workspace</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-none tracking-tight md:text-7xl">Manage frames, orders, and customer signals.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#475569]">Use the local workspace to review catalog health, update merchandising fields, and triage fulfillment work.</p>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-[#11263d]/10 bg-white p-8 shadow-xl shadow-slate-900/10">
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#7a4f17]">Sign in</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Admin access</h2>
          <label className="mt-6 grid gap-2 text-sm font-semibold">Username<input value={username} onChange={(event) => setUsername(event.target.value)} className={inputClass} /></label>
          <label className="mt-4 grid gap-2 text-sm font-semibold">Password<input value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} /></label>
          {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
          <button type="submit" className="mt-6 w-full rounded-full bg-[#11263d] px-6 py-4 font-semibold text-white transition hover:bg-[#0b5f59]">Open workspace</button>
          <div className="mt-5 rounded-xl bg-[#f7f4ee] p-4 text-sm leading-6 text-[#475569]">
            <p><b>Username:</b> {USERNAME}</p>
            <p><b>Password:</b> {PASSWORD}</p>
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
  const [orders, setOrders] = useState(adminOrders);
  const [customers] = useState<AdminCustomer[]>(adminCustomers);
  const [newProduct, setNewProduct] = useState<NewProductForm>(initialNewProduct);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "All">("All");
  const [customerQuery, setCustomerQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProductSlugs, setSelectedProductSlugs] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const authed = readAdminCookie();
      setAuthenticated(authed);
      setHydrated(true);
      if (authed) {
        const stored = loadStoredProducts();
        setDraftProducts(stored);
        setSelectedSlug(stored[0]?.slug ?? adminProducts[0].slug);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedProduct = draftProducts.find((product) => product.slug === selectedSlug) ?? draftProducts[0] ?? adminProducts[0];
  const storefrontProduct = getProduct(selectedProduct.slug);
  const totals = useMemo(() => adminTotals(draftProducts), [draftProducts]);
  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return draftProducts;
    return draftProducts.filter((product) => [product.name, product.collection, product.status, product.channel, product.color, product.lens, product.fit].join(" ").toLowerCase().includes(needle));
  }, [draftProducts, query]);
  const filteredOrders = useMemo(() => orderFilter === "All" ? orders : orders.filter((order) => order.status === orderFilter), [orders, orderFilter]);
  const filteredCustomers = useMemo(() => {
    const needle = customerQuery.trim().toLowerCase();
    if (!needle) return customers;
    return customers.filter((customer) => [customer.name, customer.email, customer.segment].join(" ").toLowerCase().includes(needle));
  }, [customers, customerQuery]);

  useEffect(() => {
    if (!editorOpen && !createOpen) return;
    const previousOverflow = document.body.style.overflow;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setEditorOpen(false);
        setCreateOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [editorOpen, createOpen]);

  function saveProducts(nextProducts: AdminProduct[], message: string) {
    setDraftProducts(nextProducts);
    persistProducts(nextProducts);
    window.localStorage.setItem(`${ADMIN_PRODUCTS_KEY}-status`, message);
  }

  function updateSelected(field: keyof EditableProduct, value: string) {
    setDraftProducts((current) => current.map((product) => {
      if (product.slug !== selectedProduct.slug) return product;
      const nextValue = field === "price" || field === "inventory" ? Number(value) : value;
      return { ...product, [field]: nextValue, updatedAt: "Just now" } as AdminProduct;
    }));
  }

  function duplicateProduct() {
    const duplicate: AdminProduct = {
      ...selectedProduct,
      slug: `${selectedProduct.slug}-copy-${draftProducts.length}`,
      name: `${selectedProduct.name} Studio Sample`,
      status: "Draft",
      inventory: 0,
      unitsSold: 0,
      updatedAt: "Just now",
    };
    const nextProducts = [duplicate, ...draftProducts];
    saveProducts(nextProducts, "Draft product duplicated");
    setSelectedSlug(duplicate.slug);
    setEditorOpen(true);
    setActiveTab("Products");
  }

  function publishDraft() {
    const nextProducts = draftProducts.map((product) => product.slug === selectedProduct.slug ? { ...product, status: "Live" as const, updatedAt: "Just now" } : product);
    saveProducts(nextProducts, `${selectedProduct.name} saved`);
    setEditorOpen(false);
  }

  function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newProduct.name.trim()) {
      return;
    }
    const inserted = buildInsertedProduct(newProduct, draftProducts);
    const nextProducts = [inserted, ...draftProducts];
    saveProducts(nextProducts, `${inserted.name} inserted`);
    setSelectedSlug(inserted.slug);
    setSelectedProductSlugs([]);
    setNewProduct(initialNewProduct);
    setCreateOpen(false);
    setEditorOpen(true);
    setActiveTab("Products");
  }

  function resetWorkspace() {
    window.localStorage.removeItem(ADMIN_PRODUCTS_KEY);
    window.localStorage.removeItem(`${ADMIN_PRODUCTS_KEY}-status`);
    setDraftProducts(adminProducts);
    setOrders(adminOrders);
    setSelectedSlug(adminProducts[0].slug);
    setSelectedProductSlugs([]);
  }

  function toggleProductSelection(slug: string, checked: boolean) {
    setSelectedProductSlugs((current) => checked ? Array.from(new Set([...current, slug])) : current.filter((item) => item !== slug));
  }

  function toggleVisibleProductSelection(checked: boolean) {
    const visibleSlugs = filteredProducts.map((product) => product.slug);
    setSelectedProductSlugs((current) => checked ? Array.from(new Set([...current, ...visibleSlugs])) : current.filter((slug) => !visibleSlugs.includes(slug)));
  }

  function deleteProducts(slugs: string[]) {
    const uniqueSlugs = Array.from(new Set(slugs));
    if (!uniqueSlugs.length) return;
    const nextProducts = draftProducts.filter((product) => !uniqueSlugs.includes(product.slug));
    saveProducts(nextProducts, uniqueSlugs.length === 1 ? "Deleted product" : `Deleted ${uniqueSlugs.length} products`);
    setSelectedProductSlugs((current) => current.filter((slug) => !uniqueSlugs.includes(slug)));
    if (uniqueSlugs.includes(selectedSlug)) {
      setEditorOpen(false);
      setSelectedSlug(nextProducts[0]?.slug ?? adminProducts[0].slug);
    }
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
  }

  function contactCustomer(customer: AdminCustomer) {
    void customer;
  }

  function logout() {
    clearAdminCookie();
    setAuthenticated(false);
  }

  if (!hydrated) {
    return <main className="min-h-screen bg-[#f7f4ee] pt-32 text-center text-[#11263d]">Loading admin workspace...</main>;
  }

  if (!authenticated) {
    return <LoginPanel onLogin={() => { setAuthenticated(true); setDraftProducts(loadStoredProducts()); }} />;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#11263d]">
      <header className="sticky top-0 z-50 border-b border-[#11263d]/10 bg-[#fffdf8]/95 backdrop-blur">
	        <div className="mx-auto flex max-w-[90rem] items-center gap-5 overflow-x-auto px-6 py-4">
	            <Link href="/admin" className="inline-flex min-w-0 shrink-0 items-center gap-3 font-semibold">
	              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#11263d] text-white">LL</span>
	              <span className="truncate">LumaLens Admin</span>
	            </Link>
	          <nav className="ml-auto flex shrink-0 items-center gap-2" aria-label="Admin modules">
	            {adminNav.map((item) => (
	              <button
	                key={item.tab}
	                onClick={() => setActiveTab(item.tab)}
	                title={item.detail}
	                aria-current={activeTab === item.tab ? "page" : undefined}
	                className="shrink-0 rounded-full border border-[#11263d]/20 bg-white px-4 py-2 text-sm font-semibold text-[#11263d] transition hover:border-[#11263d]/35"
	              >
	                {item.label}
	              </button>
	            ))}
	          </nav>
	            <div className="flex shrink-0 items-center gap-3">
	              <Link href="/" className="hidden rounded-full border border-[#11263d]/20 bg-white px-4 py-2 text-sm font-semibold sm:inline-flex">Storefront</Link>
	              <button onClick={logout} className="rounded-full bg-[#11263d] px-4 py-2 text-sm font-semibold text-white">Sign out</button>
	            </div>
	        </div>
	      </header>

      <section className="mx-auto max-w-[90rem] px-6 py-10 pb-20">
        <div className="min-w-0 space-y-8">
            {activeTab === "Overview" && (
              <>
                <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
                  <MetricCard label="Revenue" value={formatMoney(totals.revenue)} detail="Merchandised revenue across current catalog." tone="dark" />
                  <MetricCard label="Live SKUs" value={`${totals.live}`} detail="Published and purchasable product records." />
                  <MetricCard label="Inventory value" value={formatMoney(totals.inventoryValue)} detail="Retail value of sellable stock on hand." />
                  <MetricCard label="Low stock" value={`${totals.lowStock}`} detail="Products at or below reorder point." />
                </div>
                <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
                  <RevenueTrendChart total={totals.revenue} />
                  <ChannelMixChart products={draftProducts} />
                </div>
                <InventoryRiskChart products={draftProducts} />
                <div className="grid gap-4 lg:grid-cols-3">
                  {adminInsights.map((insight) => (
                    <p key={insight} className="rounded-2xl border border-[#11263d]/10 bg-[#fff8e8] p-5 text-sm leading-6 text-[#6f4a1f] shadow-sm">{insight}</p>
                  ))}
                </div>
                <div className="grid gap-8 2xl:grid-cols-[1.12fr_.88fr]">
                  <div className="rounded-2xl border border-[#11263d]/10 bg-white p-8 shadow-sm">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#0b5f59]">Sales health</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Collection performance</h2></div>
                      <button onClick={() => setActiveTab("Products")} className="rounded-full bg-[#11263d] px-5 py-3 text-sm font-semibold text-white">Manage catalog</button>
                    </div>
                    <div className="mt-8 space-y-4">
                      {draftProducts.slice(0, 5).map((product) => (
                        <button key={product.slug} onClick={() => { setSelectedSlug(product.slug); setEditorOpen(true); setActiveTab("Products"); }} className="grid w-full gap-4 rounded-xl border border-[#11263d]/10 p-5 text-left transition hover:border-[#0b5f59]/40 hover:bg-[#f8fbfa] md:grid-cols-[1fr_180px_120px] md:items-center">
                          <div><p className="font-semibold">{product.name}</p><p className="mt-1 text-sm text-[#475569]">{product.collection} / {product.unitsSold} sold</p></div>
                          <div className="h-3 overflow-hidden rounded-full bg-[#e8f0ef]"><span className="block h-full rounded-full bg-[#0b5f59]" style={{ width: `${Math.min(product.conversionRate * 14, 100)}%` }} /></div>
                          <p className="text-sm font-semibold text-[#0b5f59]">{product.conversionRate}% CVR</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#11263d]/10 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#7a4f17]">Recent orders</p>
                    <div className="mt-5 space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="rounded-xl bg-[#f7f4ee] p-4">
                          <div className="flex items-center justify-between gap-3"><b>{order.id}</b><span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{order.status}</span></div>
                          <p className="mt-2 text-sm text-[#475569]">{order.customer} / {order.product}</p>
                          <p className="mt-2 font-semibold">{formatMoney(order.total)} <span className="text-sm font-normal text-[#475569]">{order.date}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Products" && (
              <div className="space-y-8">
                  <div className="rounded-2xl border border-[#11263d]/10 bg-white p-8 shadow-sm">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#0b5f59]">Catalog manager</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Products and inventory</h2></div>
                      <div className="flex flex-col gap-3 sm:flex-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="min-w-72 rounded-full border border-[#11263d]/15 bg-[#fffdf8] px-5 py-3 text-sm outline-none focus:border-[#0b5f59]" /><button onClick={() => setCreateOpen(true)} className="rounded-full bg-[#0b5f59] px-5 py-3 text-sm font-semibold text-white">Create product</button><button disabled={!selectedProductSlugs.length} onClick={() => deleteProducts(selectedProductSlugs)} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 disabled:border-[#11263d]/10 disabled:text-[#94a3b8]">Delete selected</button><button onClick={resetWorkspace} className="rounded-full border border-[#11263d]/20 px-5 py-3 text-sm font-semibold text-[#11263d]">Reset workspace</button></div>
                    </div>
                    {selectedProductSlugs.length > 0 && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{selectedProductSlugs.length} selected for deletion</p>}
                    <div className="mt-6 overflow-hidden rounded-xl border border-[#11263d]/10">
                      <div className="hidden grid-cols-[3rem_minmax(16rem,1.4fr)_8rem_8rem_7rem_6rem] bg-[#f7f4ee] px-5 py-4 text-xs font-semibold uppercase tracking-[.14em] text-[#475569] md:grid"><span><input aria-label="Select all visible products" type="checkbox" checked={filteredProducts.length > 0 && filteredProducts.every((product) => selectedProductSlugs.includes(product.slug))} onChange={(event) => toggleVisibleProductSelection(event.target.checked)} /></span><span>Product</span><span>Status</span><span>Stock</span><span>Price</span><span>Action</span></div>
                      {filteredProducts.map((product) => (
                        <div key={product.slug} className={`grid w-full gap-4 border-t border-[#11263d]/10 px-5 py-5 text-left transition md:grid-cols-[3rem_minmax(16rem,1.4fr)_8rem_8rem_7rem_6rem] md:items-center ${selectedSlug === product.slug ? "bg-[#edf6f4]" : "bg-white"}`}>
                          <input aria-label={`Select ${product.name}`} type="checkbox" checked={selectedProductSlugs.includes(product.slug)} onChange={(event) => toggleProductSelection(product.slug, event.target.checked)} />
                          <div><p className="font-semibold">{product.name}</p><p className="mt-1 text-sm text-[#475569]">{product.collection} / {product.channel}</p></div>
                          <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(product.status)}`}>{product.status}</span>
                          <span className="text-sm font-semibold">{product.inventory} units</span>
                          <span className="font-semibold">{formatMoney(product.price)}</span>
                          <button onClick={() => { setSelectedSlug(product.slug); setEditorOpen(true); }} className="w-fit rounded-full bg-[#11263d] px-4 py-2 text-sm font-semibold text-white">Edit</button>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            )}

            {activeTab === "Orders" && (
              <div className="rounded-2xl border border-[#11263d]/10 bg-white p-8 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#0b5f59]">Order operations</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Fulfillment queue</h2></div>
                  <div className="flex flex-wrap gap-2">
                    {(["All", ...orderStatuses] as const).map((status) => <button key={status} onClick={() => setOrderFilter(status)} className={`rounded-full px-4 py-2 text-sm font-semibold ${orderFilter === status ? "bg-[#11263d] text-white" : "border border-[#11263d]/15 bg-[#fffdf8] text-[#11263d]"}`}>{status}</button>)}
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {filteredOrders.map((order) => <div key={order.id} className="grid gap-4 rounded-xl border border-[#11263d]/10 p-5 xl:grid-cols-[8rem_minmax(18rem,1fr)_10rem_8rem_11rem] xl:items-center"><b>{order.id}</b><div><p className="font-semibold">{order.customer}</p><p className="text-sm text-[#475569]">{order.product} / {order.date}</p></div><span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{order.status}</span><b>{formatMoney(order.total)}</b><select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)} className={inputClass}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></div>)}
                </div>
              </div>
            )}

            {activeTab === "Customers" && (
              <div className="rounded-2xl border border-[#11263d]/10 bg-white p-8 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#0b5f59]">Customer CRM</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Segments and lifetime value</h2></div>
                  <input value={customerQuery} onChange={(event) => setCustomerQuery(event.target.value)} placeholder="Search customers" className="rounded-full border border-[#11263d]/15 bg-[#fffdf8] px-5 py-3 text-sm outline-none focus:border-[#0b5f59]" />
                </div>
                <div className="mt-8 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredCustomers.map((customer) => <div key={customer.email} className="rounded-xl border border-[#11263d]/10 bg-[#fffdf8] p-6"><div className="grid size-12 place-items-center rounded-xl bg-[#11263d] font-semibold text-white">{customer.name.split(" ").map((part) => part[0]).join("")}</div><h3 className="mt-4 text-xl font-semibold">{customer.name}</h3><p className="mt-1 text-sm text-[#475569]">{customer.email}</p><p className="mt-4 w-fit rounded-full bg-[#e8f0ef] px-3 py-2 text-sm font-semibold text-[#0b5f59]">{customer.segment}</p><p className="mt-4 text-2xl font-semibold">{formatMoney(customer.spend)}</p><button onClick={() => contactCustomer(customer)} className="mt-5 w-full rounded-full border border-[#11263d]/20 px-5 py-3 text-sm font-semibold text-[#11263d]">Prepare outreach</button></div>)}
                </div>
              </div>
	            )}
	          </div>
	      </section>
      {createOpen && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto bg-[#0c1b2a]/55 px-4 py-6 backdrop-blur-sm sm:px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCreateOpen(false);
          }}
        >
          <form
            onSubmit={createProduct}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-product-title"
            className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-950/30"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#11263d]/10 bg-white/95 p-6 backdrop-blur">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#0b5f59]">Catalog insertion</p>
                <h2 id="create-product-title" className="mt-2 text-3xl font-semibold tracking-tight text-[#11263d]">Create product</h2>
                <p className="mt-2 text-sm leading-6 text-[#475569]">Add a new catalog record with merchandising, stock, and publishing details.</p>
              </div>
              <button type="button" onClick={() => setCreateOpen(false)} aria-label="Close create product" className="grid size-10 shrink-0 place-items-center rounded-full border border-[#11263d]/15 bg-white text-xl leading-none text-[#11263d] transition hover:border-[#11263d]">x</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">Product name<input value={newProduct.name} onChange={(event) => setNewProduct((current) => ({ ...current, name: event.target.value }))} placeholder="Riviera Blue" className={inputClass} /></label>
                <label className="grid gap-2 text-sm font-semibold">Collection<input value={newProduct.collection} onChange={(event) => setNewProduct((current) => ({ ...current, collection: event.target.value }))} className={inputClass} /></label>
                <label className="grid gap-2 text-sm font-semibold">Price<input type="number" value={newProduct.price} onChange={(event) => setNewProduct((current) => ({ ...current, price: Number(event.target.value) }))} className={inputClass} /></label>
                <label className="grid gap-2 text-sm font-semibold">Inventory<input type="number" value={newProduct.inventory} onChange={(event) => setNewProduct((current) => ({ ...current, inventory: Number(event.target.value) }))} className={inputClass} /></label>
                <label className="grid gap-2 text-sm font-semibold">Color story<input value={newProduct.color} onChange={(event) => setNewProduct((current) => ({ ...current, color: event.target.value }))} className={inputClass} /></label>
                <label className="grid gap-2 text-sm font-semibold">Fit guidance<input value={newProduct.fit} onChange={(event) => setNewProduct((current) => ({ ...current, fit: event.target.value }))} className={inputClass} /></label>
                <label className="grid gap-2 text-sm font-semibold lg:col-span-2">Lens compatibility<input value={newProduct.lens} onChange={(event) => setNewProduct((current) => ({ ...current, lens: event.target.value }))} className={inputClass} /></label>
                <label className="grid gap-2 text-sm font-semibold">Status<select value={newProduct.status} onChange={(event) => setNewProduct((current) => ({ ...current, status: event.target.value as AdminProduct["status"] }))} className={inputClass}><option>Live</option><option>Draft</option><option>Low stock</option></select></label>
                <label className="grid gap-2 text-sm font-semibold">Channel<select value={newProduct.channel} onChange={(event) => setNewProduct((current) => ({ ...current, channel: event.target.value as AdminProduct["channel"] }))} className={inputClass}><option>Storefront</option><option>Marketplace</option><option>Retail</option></select></label>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#11263d]/10 bg-white/95 p-5 backdrop-blur sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-full border border-[#11263d]/20 px-6 py-3 font-semibold text-[#11263d]">Close</button>
              <button type="submit" className="rounded-full bg-[#0b5f59] px-6 py-3 font-semibold text-white">Insert product</button>
            </div>
          </form>
        </div>
      )}
      {editorOpen && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto bg-[#0c1b2a]/55 px-4 py-6 backdrop-blur-sm sm:px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditorOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-editor-title"
            className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-950/30"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#11263d]/10 bg-white/95 p-6 backdrop-blur">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#7a4f17]">Product editor</p>
                <h2 id="product-editor-title" className="mt-2 text-3xl font-semibold tracking-tight text-[#11263d]">{selectedProduct.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#475569]">Update merchandising fields, stock, channel, and shopper-facing option summaries.</p>
              </div>
              <button onClick={() => setEditorOpen(false)} aria-label="Close product editor" className="grid size-10 shrink-0 place-items-center rounded-full border border-[#11263d]/15 bg-white text-xl leading-none text-[#11263d] transition hover:border-[#11263d]">x</button>
            </div>

            <div className="grid flex-1 gap-8 overflow-y-auto p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:p-8">
              <div className="grid gap-5">
                <section className="rounded-2xl border border-[#11263d]/10 p-5">
                  <h3 className="text-lg font-semibold tracking-tight text-[#11263d]">Core details</h3>
                  <div className="mt-5 grid gap-5">
                    <label className="grid gap-2 text-sm font-semibold">Name<input value={selectedProduct.name} onChange={(event) => updateSelected("name", event.target.value)} className={inputClass} /></label>
                    <label className="grid gap-2 text-sm font-semibold">Collection<input value={selectedProduct.collection} onChange={(event) => updateSelected("collection", event.target.value)} className={inputClass} /></label>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold">Price<input type="number" value={selectedProduct.price} onChange={(event) => updateSelected("price", event.target.value)} className={inputClass} /></label>
                      <label className="grid gap-2 text-sm font-semibold">Inventory<input type="number" value={selectedProduct.inventory} onChange={(event) => updateSelected("inventory", event.target.value)} className={inputClass} /></label>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#11263d]/10 p-5">
                  <h3 className="text-lg font-semibold tracking-tight text-[#11263d]">Shopper-facing options</h3>
                  <div className="mt-5 grid gap-5">
                    <label className="grid gap-2 text-sm font-semibold">Color story<input value={selectedProduct.color} onChange={(event) => updateSelected("color", event.target.value)} className={inputClass} /></label>
                    <label className="grid gap-2 text-sm font-semibold">Fit guidance<input value={selectedProduct.fit} onChange={(event) => updateSelected("fit", event.target.value)} className={inputClass} /></label>
                    <label className="grid gap-2 text-sm font-semibold">Lens compatibility<input value={selectedProduct.lens} onChange={(event) => updateSelected("lens", event.target.value)} className={inputClass} /></label>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#11263d]/10 p-5">
                  <h3 className="text-lg font-semibold tracking-tight text-[#11263d]">Publishing</h3>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold">Status<select value={selectedProduct.status} onChange={(event) => updateSelected("status", event.target.value)} className={inputClass}><option>Live</option><option>Draft</option><option>Low stock</option></select></label>
                    <label className="grid gap-2 text-sm font-semibold">Channel<select value={selectedProduct.channel} onChange={(event) => updateSelected("channel", event.target.value)} className={inputClass}><option>Storefront</option><option>Marketplace</option><option>Retail</option></select></label>
                  </div>
                </section>
              </div>

              <aside className="grid content-start gap-5">
                {storefrontProduct && <ProductPreview product={storefrontProduct} compact />}
                <div className="rounded-xl bg-[#f7f4ee] p-5 text-sm leading-6 text-[#475569]">
                  <p><b className="text-[#11263d]">Margin:</b> {selectedProduct.margin}%</p>
                  <p><b className="text-[#11263d]">Reorder point:</b> {selectedProduct.reorderPoint} units</p>
                  <p><b className="text-[#11263d]">Updated:</b> {selectedProduct.updatedAt}</p>
                </div>
                <div className="grid gap-3">
                  <button onClick={duplicateProduct} className="rounded-full border border-[#11263d]/20 px-6 py-4 font-semibold text-[#11263d]">Duplicate draft</button>
                </div>
              </aside>
            </div>
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#11263d]/10 bg-white/95 p-5 backdrop-blur sm:flex-row sm:justify-end">
              <button onClick={() => deleteProducts([selectedProduct.slug])} className="rounded-full border border-red-200 px-6 py-3 font-semibold text-red-700 sm:mr-auto">Delete product</button>
              <button onClick={() => setEditorOpen(false)} className="rounded-full border border-[#11263d]/20 px-6 py-3 font-semibold text-[#11263d]">Close</button>
              <button onClick={publishDraft} className="rounded-full bg-[#11263d] px-6 py-3 font-semibold text-white">Save product</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
