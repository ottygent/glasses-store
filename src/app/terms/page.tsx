import { PolicyPage } from "@/components/policy-page";

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Terms"
      title="Store terms"
      intro="These store terms outline how LumaLens presents frame information, checkout review, delivery choices, and fit support."
      sections={[
        { title: "Checkout review", body: "Shoppers should review frame color, fit, lens package, finish, delivery, taxes, and totals before placing an order." },
        { title: "Product information", body: "Frame descriptions, pricing, reviews, and lens options should be kept current so shoppers can compare choices confidently." },
        { title: "Returns and adjustments", body: "The 30-day fit support window covers comfort guidance and adjustment help. Final return terms should define timing, exclusions, and support channels." },
      ]}
    />
  );
}
