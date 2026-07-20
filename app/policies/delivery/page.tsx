import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Delivery Policy",
  description: "How delivery works for Moosiva Lux Wear orders in Bahrain.",
};

export default function DeliveryPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Policies"
      title="Delivery Policy"
      intro="A simple overview of how delivery works once you send a request through WhatsApp."
      points={[
        "Orders are confirmed through WhatsApp before delivery is arranged.",
        "Delivery details, including timing and courier, are confirmed by Moosiva staff.",
        "Delivery time and charges may vary depending on your location and order.",
        "Please make sure your contact number and delivery address are correct and up to date when you submit your request.",
      ]}
    />
  );
}
