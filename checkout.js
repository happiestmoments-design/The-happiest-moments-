/**
 * stripe/checkout.js
 * -----------------------------------------------------------------------
 * CLIENT-SIDE ONLY. This never touches your Stripe secret key — it just
 * asks your backend to create a Checkout Session, then redirects the
 * browser to the URL Stripe returns. The actual session creation (with
 * the secret key) must happen server-side — see /server/create-checkout-session.js
 * for an illustrative Express stub.
 * -----------------------------------------------------------------------
 */

import { getLanguage } from "../i18n/language-state.js";

/**
 * Map your app's language codes to Stripe Checkout's `locale` codes.
 * They happen to match here ("en"/"ar"), but keep this map explicit —
 * Stripe's supported locale list is its own contract and can change
 * independently of your app's language codes. Verify against Stripe's
 * current Checkout docs before launch.
 */
const STRIPE_LOCALE_MAP = {
  en: "en",
  ar: "ar",
};

/**
 * @param {Array<{ priceId: string, quantity: number }>} items
 *   e.g. [{ priceId: "price_1Nx...", quantity: 1 }] for "The Exclusive Box"
 */
export async function createCheckoutSession(items) {
  const lang = getLanguage();
  const locale = STRIPE_LOCALE_MAP[lang] || "auto";

  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      locale, // passed straight through to Stripe's `locale` param server-side
      successUrl: `${window.location.origin}/success?lang=${lang}`,
      cancelUrl: `${window.location.origin}/cancel?lang=${lang}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Checkout session request failed (HTTP ${response.status})`);
  }

  const { url } = await response.json();
  if (!url) throw new Error("No checkout URL returned from server.");

  window.location.assign(url); // hand off to Stripe-hosted Checkout
}
