/**
 * main.js
 * -----------------------------------------------------------------------
 * App entry point. Load this with <script type="module" src="/js/main.js">
 * at the end of <body>. It's the only script tag your pages need beyond
 * the tiny inline "boot" snippet in <head> (see README.md).
 * -----------------------------------------------------------------------
 */

import { initI18n } from "./i18n/i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  initI18n();

  // Wire up any checkout buttons. Safe to leave this here even before
  // Stripe is fully configured — it just won't be called until a button
  // with [data-checkout] exists in the markup.
  document.querySelectorAll("[data-checkout]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const { createCheckoutSession } = await import("./stripe/checkout.js");
      const items = JSON.parse(btn.getAttribute("data-checkout"));
      try {
        btn.disabled = true;
        await createCheckoutSession(items);
      } catch (err) {
        console.error("[checkout] failed:", err);
        btn.disabled = false;
      }
    });
  });
});
