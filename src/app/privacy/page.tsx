import { PolicyPage } from "@/components/policy-page";

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title="Privacy notice"
      intro="LumaLens keeps the shopping experience focused on the information needed to configure frames, review an order, and request follow-up support."
      sections={[
        { title: "Cart preferences", body: "Frame selections can be remembered in your browser so color, fit, lens package, and finish choices remain available while you shop." },
        { title: "Prescription privacy", body: "Prescription details are requested only when they are needed to fulfill a lens order, and shoppers can choose to provide them after checkout." },
        { title: "Analytics", body: "Storefront analytics should be used to understand product interest and checkout health, with clear disclosure of providers and consent requirements." },
      ]}
    />
  );
}
