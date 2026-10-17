import Stripe from "stripe";
import { serverEnv } from "@/lib/env.server";

export const hasValidStripe =
  /^sk_(test|live)_/.test(serverEnv.STRIPE_SECRET_KEY) &&
  !serverEnv.STRIPE_SECRET_KEY.includes("placeholder");

let client: Stripe | null = null;

/**
 * Lazily constructed Stripe client. Accessing `stripe` without valid
 * credentials throws a clear error instead of failing at import time.
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, property) {
    if (!client) {
      if (!hasValidStripe) {
        throw new Error("Stripe is not configured: set a valid STRIPE_SECRET_KEY.");
      }
      client = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
        apiVersion: "2025-02-24.acacia",
        typescript: true,
      });
    }
    return Reflect.get(client as object, property);
  },
});
