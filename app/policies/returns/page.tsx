import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Returns & Exchange",
  description: "Returns and exchange guidelines for Moosiva Lux Wear.",
};

export default function ReturnsPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Policies"
      title="Returns & Exchange"
      intro="We want you to love your Moosiva pieces. Here's how returns and exchanges work."
      points={[
        "Returns and exchanges are subject to the condition of the product and confirmation by our team.",
        "Items must be unused, unworn, and in their original condition to be considered.",
        "Final approval for any return or exchange is given by Moosiva staff.",
        "Some items may not be eligible for return or exchange depending on their condition or category — please check with us on WhatsApp before sending anything back.",
      ]}
    />
  );
}
