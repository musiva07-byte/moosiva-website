"use server";

import { createWebsiteOrderRequest } from "@/lib/services/checkout";

export async function submitCheckoutRequestAction(input: unknown) {
  return createWebsiteOrderRequest(input);
}
