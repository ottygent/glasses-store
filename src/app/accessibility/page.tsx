import { PolicyPage } from "@/components/policy-page";

export default function AccessibilityPage() {
  return (
    <PolicyPage
      eyebrow="Accessibility"
      title="Accessibility commitment"
      intro="LumaLens is designed to keep essential commerce actions readable, keyboard reachable, and usable across storefront, cart, and checkout flows."
      sections={[
        { title: "Readable contrast", body: "Primary, secondary, wallet, and disabled actions use explicit foreground and background colors chosen to meet accessible contrast targets." },
        { title: "Navigation", body: "Header and footer links are structured with semantic navigation labels. The mobile menu remains discoverable and the cart action stays available." },
        { title: "Forms", body: "Checkout and newsletter fields use labels or accessible names, visible focusable controls, and clear grouping for contact, shipping, delivery, and payment steps." },
      ]}
    />
  );
}
