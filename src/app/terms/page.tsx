import { PolicyPage } from "@/components/policy-page";

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Terms"
      title="Store terms"
      intro="These terms frame the demo as a realistic ecommerce experience while making clear where production integrations would be required."
      sections={[
        { title: "Demo checkout", body: "Checkout screens and payment fields are mock UI for product validation. No order is fulfilled and no card charge is created from this static storefront." },
        { title: "Product information", body: "Frames, pricing, reviews, and lens options are sample merchandising data. A production catalog should connect to inventory, taxes, shipping rules, and fulfillment systems." },
        { title: "Returns and adjustments", body: "The displayed 30-day fit guarantee is a storefront promise pattern. Production terms should specify return windows, adjustment partners, exclusions, and customer support channels." },
      ]}
    />
  );
}
