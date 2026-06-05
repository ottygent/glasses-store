import { PolicyPage } from "@/components/policy-page";

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title="Privacy notice"
      intro="LumaLens is a demo storefront, but the footer links behave like a production site and explain how a real eyewear store should handle customer data."
      sections={[
        { title: "What this demo stores", body: "Cart selections are saved locally in your browser so product options can carry into cart and checkout. The demo does not send payment or prescription data to a backend." },
        { title: "Production expectations", body: "A production build should use encrypted checkout providers, minimize prescription data, document analytics usage, and provide a clear path to request or delete customer records." },
        { title: "Analytics", body: "The storefront includes event hooks for storefront analytics and purchase-flow validation. Real deployments should disclose analytics providers and consent requirements." },
      ]}
    />
  );
}
