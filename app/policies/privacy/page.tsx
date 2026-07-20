import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Moosiva Lux Wear handles your details when you submit a request.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Policies"
      title="Privacy Policy"
      intro="A short, plain-language summary of how we use the details you share with us."
      points={[
        "Details you share with us — such as your name, mobile number, and delivery address — are used only to process your request or order.",
        "We may use your information to contact you on WhatsApp about your request, order, or delivery.",
        "We do not sell your personal information to third parties.",
        "If you have any questions about your details, feel free to message us on WhatsApp.",
      ]}
    />
  );
}
