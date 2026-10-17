// Protege rutas mediante Authentication + Firestore + permiso explicito.
import {
  applyPlanPermissions,
  getCurrentSession,
  getRequiredPlanForPermission,
  hasPermissionForPlan,
  hasPlanAccess,
  normalizePlan
} from "./plan-manager.js";
import { showUpgradeGate } from "./upgrade-modal.js";

let guardedSessionKey = null;

function sessionKey(session) {
  return `${session.user?.uid || "guest"}:${session.plan}:${session.status}`;
}

document.addEventListener("hydronexisSessionChanged", (event) => {
  if (!guardedSessionKey) return;
  if (sessionKey(event.detail) !== guardedSessionKey) window.location.reload();
});

function getCurrentRelativeUrl() {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  return `${fileName}${window.location.search}${window.location.hash}`;
}

async function guardCurrentPage() {
  let requiredPermission = document.body?.dataset.requiredPermission?.trim();
  const permissionQuery = document.body?.dataset.permissionQuery?.trim();
  const permissionMap = document.body?.dataset.permissionMap?.trim();
  if (requiredPermission && permissionQuery && permissionMap) {
    const queryValue = new URLSearchParams(window.location.search).get(permissionQuery) || "";
    const mappedPermission = permissionMap
      .split(",")
      .map((entry) => entry.split(":").map((part) => part.trim()))
      .find(([value, permission]) => value === queryValue && permission)?.[1];
    if (mappedPermission) requiredPermission = mappedPermission;
  }
  const rawRequiredPlan = document.body?.dataset.requiredPlan?.trim();
  if (!requiredPermission && !rawRequiredPlan) {
    document.documentElement.classList.remove("plan-guard-pending");
    return { allowed: true, session: null, requiredPermission: null, requiredPlan: null };
  }

  const session = await getCurrentSession();
  if (!session.user) {
    const next = encodeURIComponent(getCurrentRelativeUrl());
    window.location.replace(`login.html?next=${next}`);
    return { allowed: false, session, reason: "authentication_required" };
  }

  if (session.status === "inactive") {
    guardedSessionKey = sessionKey(session);
    showUpgradeGate({
      title: "Account unavailable",
      message: "This account is currently inactive. Please contact HYDRONEXIS support.",
      showPlans: false,
      backHref: "index.html",
      backLabel: "Return Home"
    });
    document.documentElement.classList.remove("plan-guard-pending");
    return { allowed: false, session, reason: "inactive" };
  }

  if (["profile_missing", "invalid_plan", "profile_unavailable"].includes(session.status)) {
    guardedSessionKey = sessionKey(session);
    const canRetry = session.status === "profile_unavailable";
    showUpgradeGate({
      title: "Account access could not be verified",
      message: canRetry
        ? "HYDRONEXIS could not read your account profile. Check your connection and try again."
        : "This account needs a valid Firestore profile and canonical plan before functional access can be granted.",
      showPlans: false,
      backHref: canRetry ? getCurrentRelativeUrl() : "login.html",
      backLabel: canRetry ? "Try Again" : "Open Sign In"
    });
    document.documentElement.classList.remove("plan-guard-pending");
    return { allowed: false, session, reason: session.status };
  }

  let allowed = true;
  let requiredPlan = null;
  if (requiredPermission) {
    allowed = hasPermissionForPlan(session.plan, requiredPermission);
    requiredPlan = getRequiredPlanForPermission(requiredPermission);
  } else {
    requiredPlan = normalizePlan(rawRequiredPlan, "");
    allowed = Boolean(requiredPlan) && hasPlanAccess(session.plan, requiredPlan);
  }

  if (!allowed) {
    showUpgradeGate({ requiredPermission, requiredPlan });
    document.documentElement.classList.remove("plan-guard-pending");
    return { allowed: false, session, reason: "insufficient_plan", requiredPermission, requiredPlan };
  }

  applyPlanPermissions(session.plan);
  guardedSessionKey = sessionKey(session);
  document.documentElement.classList.remove("plan-guard-pending");
  document.dispatchEvent(new CustomEvent("planGuardReady", {
    detail: { ...session, requiredPermission, requiredPlan }
  }));
  return { allowed: true, session, requiredPermission, requiredPlan };
}

export const planGuardReady = guardCurrentPage().catch((error) => {
  console.error("No se pudo validar el acceso a la pagina.", error);
  showUpgradeGate({
    title: "Access could not be verified",
    message: "HYDRONEXIS could not verify your plan. Please try again.",
    showPlans: true
  });
  document.documentElement.classList.remove("plan-guard-pending");
  return { allowed: false, session: null, reason: "verification_failed" };
});

// Functional modules import this helper before touching local state or
// Firestore. Firestore Rules remain the security boundary; this prevents UI
// code from racing the route authorization while that verification is pending.
export async function requirePageAccess() {
  const result = await planGuardReady;
  if (!result.allowed) {
    throw new DOMException("HYDRONEXIS route access was denied.", "AbortError");
  }
  return result.session;
}

globalThis.hydronexisPlanGuardReady = planGuardReady;
