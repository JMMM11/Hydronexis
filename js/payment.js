import { db } from "./firebase-config.js";
import {
  PLAN_LEVELS,
  PLAN_PRICES,
  getPlanLabel,
  normalizePlan
} from "./plan-manager.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const UPGRADE_PLANS = Object.freeze(["blooming", "go_green"]);
const form = document.getElementById("planRequestForm");
const button = document.getElementById("planRequestButton");
const feedback = document.getElementById("planRequestFeedback");
const summary = document.getElementById("requestedPlanSummary");
const main = document.getElementById("planRequestMain");
const options = [...document.querySelectorAll('input[name="requestedPlan"]')];

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.classList.toggle("is-error", isError);
}

function selectedPlan() {
  return options.find((option) => option.checked)?.value || null;
}

function renderSummary() {
  const plan = selectedPlan();
  summary.textContent = plan
    ? `${getPlanLabel(plan)} - ${PLAN_PRICES[plan]}`
    : "No eligible upgrade selected";
}

const session = await requirePageAccess();
if (!session.user) {
  const next = encodeURIComponent(`payment.html${location.search}`);
  location.replace(`login.html?next=${next}`);
} else {
  const currentPlan = normalizePlan(session.plan, "sprout");
  const currentLabel = getPlanLabel(currentPlan);
  document.getElementById("currentPlanBadge").textContent = currentLabel;
  document.getElementById("currentPlanDescription").textContent =
    `${currentLabel} is active on this account. Only an administrator or trusted backend can change that value.`;

  options.forEach((option) => {
    const eligible = PLAN_LEVELS[option.value] > PLAN_LEVELS[currentPlan];
    option.disabled = !eligible;
    option.closest(".plan-request-option").classList.toggle("is-unavailable", !eligible);
  });

  const rawRequestedPlan = new URLSearchParams(location.search).get("plan");
  const requestedPlan = normalizePlan(rawRequestedPlan, "");
  const requestedOption = options.find((option) =>
    option.value === requestedPlan && !option.disabled
  );
  const firstEligible = options.find((option) => !option.disabled);
  (requestedOption || firstEligible)?.click();

  const hasUpgrade = Boolean(firstEligible);
  button.disabled = !hasUpgrade;
  if (!hasUpgrade) {
    showFeedback("Go Green is already the highest HYDRONEXIS plan on this account.");
  } else if (requestedPlan === "sprout") {
    showFeedback("Sprout is the free starting plan and is already assigned when an account is created.");
  }

  options.forEach((option) => option.addEventListener("change", renderSummary));
  renderSummary();
  main.setAttribute("aria-busy", "false");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const targetPlan = selectedPlan();
    if (!UPGRADE_PLANS.includes(targetPlan)
      || PLAN_LEVELS[targetPlan] <= PLAN_LEVELS[currentPlan]) {
      showFeedback("Choose a plan above your current access level.", true);
      return;
    }

    button.disabled = true;
    button.textContent = "Submitting...";

    const requestReference = doc(
      db,
      "planUpgradeRequests",
      `${session.user.uid}_${targetPlan}`
    );

    try {
      const existingRequest = await getDoc(requestReference);
      if (existingRequest.exists()) {
        showFeedback(`A ${getPlanLabel(targetPlan)} request already exists for this account.`);
        return;
      }

      await setDoc(requestReference, {
        userId: session.user.uid,
        currentPlan,
        requestedPlan: targetPlan,
        status: "pending",
        source: "web",
        createdAt: serverTimestamp()
      });

      showFeedback(
        `${getPlanLabel(targetPlan)} was requested. Your current plan has not changed and no payment was charged.`
      );
      form.querySelectorAll("input").forEach((input) => { input.disabled = true; });
    } catch (error) {
      console.error("Plan request could not be submitted.", error);
      showFeedback(
        "The request could not be submitted. Verify your Firestore rules and try again.",
        true
      );
      button.disabled = false;
    } finally {
      button.textContent = "Submit Plan Request";
    }
  });
}
