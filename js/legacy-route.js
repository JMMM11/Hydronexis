// Legacy aliases wait for the central plan guard before changing routes.
(() => {
  const script = document.currentScript;
  const target = script?.dataset.legacyTarget || "";
  const allowedTargets = new Set(["grid-shop.html", "hydrochat.html"]);

  if (!allowedTargets.has(target)) return;

  document.addEventListener("planGuardReady", () => {
    const status = document.querySelector('[role="status"]');
    if (status) status.textContent = "Access confirmed. Redirecting…";
    window.location.replace(target);
  }, { once: true });
})();
