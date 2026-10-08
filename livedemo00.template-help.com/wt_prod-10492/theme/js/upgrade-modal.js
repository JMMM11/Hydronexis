import {
  getPlanLabel,
  getRequiredPlanForPermission,
  normalizePlan
} from "./permissions.js";

function createGate({ title, message, showPlans, backHref, backLabel }) {
  const gate = document.createElement("main");
  gate.className = "plan-access-gate";
  gate.setAttribute("role", "alert");
  gate.innerHTML = `
    <section class="plan-access-card" aria-labelledby="plan-access-title">
      <p class="plan-access-eyebrow">HYDRONEXIS</p>
      <h1 id="plan-access-title"></h1>
      <p class="plan-access-message"></p>
      <div class="plan-access-actions"></div>
    </section>`;

  gate.querySelector("h1").textContent = title;
  gate.querySelector(".plan-access-message").textContent = message;
  const actions = gate.querySelector(".plan-access-actions");
  if (showPlans) {
    const plansLink = document.createElement("a");
    plansLink.className = "button button-secondary button-zakaria";
    plansLink.href = "what-we-offer.html";
    plansLink.textContent = "View Plans";
    actions.appendChild(plansLink);
  }

  const backLink = document.createElement("a");
  backLink.className = "plan-access-back";
  backLink.href = backHref;
  backLink.textContent = backLabel;
  actions.appendChild(backLink);
  return gate;
}

export function showUpgradeGate({
  requiredPermission = "",
  requiredPlan = "",
  title = "",
  message = "",
  showPlans = true,
  backHref = "Dashboard2.html",
  backLabel = "Back to Dashboard"
} = {}) {
  const targetPlan = normalizePlan(
    requiredPlan || getRequiredPlanForPermission(requiredPermission),
    "blooming"
  );
  const planLabel = getPlanLabel(targetPlan);
  const resolvedTitle = title || "This feature is not included in your current plan.";
  const resolvedMessage = message || `Upgrade to ${planLabel} to unlock this feature.`;
  const gate = createGate({
    title: resolvedTitle,
    message: resolvedMessage,
    showPlans,
    backHref,
    backLabel
  });

  document.body.querySelectorAll(":scope > *").forEach((element) => {
    if (element.tagName !== "SCRIPT") element.hidden = true;
  });
  document.body.prepend(gate);
  document.body.classList.add("plan-access-denied");
  gate.querySelector("a")?.focus({ preventScroll: true });
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-upgrade-permission]");
  if (!trigger || !trigger.classList.contains("is-plan-locked")) return;
  event.preventDefault();
  showUpgradeGate({ requiredPermission: trigger.dataset.upgradePermission });
});
