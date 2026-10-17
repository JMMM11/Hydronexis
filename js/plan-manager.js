// Fuente unica de sesion, plan y permisos para toda HYDRONEXIS.
import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import {
  PLAN_IDS,
  ACCOUNT_PLAN_IDS,
  PLAN_LABELS,
  PLAN_LEVELS,
  PLAN_PERMISSIONS,
  PLAN_PRICES,
  getPermissionsForPlan,
  getPlanLabel,
  getRequiredPlanForPermission,
  hasPermissionForPlan,
  hasPlanAccess,
  isCanonicalAccountPlan,
  normalizePlan
} from "./permissions.js";

export {
  PLAN_IDS,
  ACCOUNT_PLAN_IDS,
  PLAN_LABELS,
  PLAN_LEVELS,
  PLAN_PERMISSIONS,
  PLAN_PRICES,
  getPermissionsForPlan,
  getPlanLabel,
  getRequiredPlanForPermission,
  hasPermissionForPlan,
  hasPlanAccess,
  isCanonicalAccountPlan,
  normalizePlan
};

export const PLAN_LANDING_PAGES = Object.freeze({
  guest: "index.html",
  sprout: "Dashboard2.html",
  blooming: "Dashboard2.html",
  go_green: "Dashboard2.html"
});

const AUTH_TIMEOUT_MS = 10000;
let sessionPromise = null;
let observedAuthUid;
let currentSession = Object.freeze({
  user: null,
  profile: null,
  plan: PLAN_IDS.GUEST,
  permissions: PLAN_PERMISSIONS.guest,
  status: "signed_out",
  error: null
});

// Keep the in-memory session from leaking across cross-tab sign-in/sign-out
// changes. Plan changes remain available through forceRefresh or a page reload.
onAuthStateChanged(auth, (user) => {
  const nextUid = user?.uid || null;
  if (observedAuthUid === undefined) {
    observedAuthUid = nextUid;
    return;
  }
  if (observedAuthUid === nextUid) return;
  observedAuthUid = nextUid;
  sessionPromise = null;
  currentSession = createSession({
    user,
    plan: PLAN_IDS.GUEST,
    status: user ? "refreshing" : "signed_out"
  });
  document.dispatchEvent(new CustomEvent("hydronexisSessionChanged", {
    detail: currentSession
  }));
});

function createSession({ user = null, profile = null, plan = "guest", status, error = null }) {
  const safePlan = normalizePlan(plan, user ? PLAN_IDS.SPROUT : PLAN_IDS.GUEST);
  return Object.freeze({
    user,
    profile,
    plan: safePlan,
    permissions: getPermissionsForPlan(safePlan),
    status: status || (user ? "authenticated" : "signed_out"),
    error
  });
}

export function waitForAuthState() {
  return new Promise((resolve, reject) => {
    let unsubscribe = () => {};
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      unsubscribe();
      reject(new Error("Authentication verification timed out."));
    }, AUTH_TIMEOUT_MS);

    unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        unsubscribe();
        resolve(user);
      },
      (error) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        unsubscribe();
        reject(error);
      }
    );
  });
}

async function resolveCurrentSession() {
  let user;
  try {
    user = await waitForAuthState();
  } catch (error) {
    return createSession({ status: "unavailable", error });
  }

  if (!user) return createSession({ status: "signed_out" });

  try {
    const snapshot = await getDoc(doc(db, "users", user.uid));
    if (!snapshot.exists()) {
      return createSession({
        user,
        plan: PLAN_IDS.GUEST,
        status: "profile_missing",
        error: new Error("The authenticated account does not have a Firestore profile.")
      });
    }

    const profile = snapshot.data();
    if (profile.accountStatus !== "active") {
      return createSession({
        user,
        profile,
        plan: PLAN_IDS.GUEST,
        status: "inactive",
        error: new Error("This account is not active.")
      });
    }

    if (!isCanonicalAccountPlan(profile.plan)) {
      return createSession({
        user,
        profile,
        plan: PLAN_IDS.GUEST,
        status: "invalid_plan",
        error: new Error("The profile contains an unknown plan. Access was denied safely.")
      });
    }

    return createSession({ user, profile, plan: profile.plan });
  } catch (error) {
    // A profile that cannot be verified receives no functional UI access.
    // Firestore Rules remains the authority for every protected document.
    return createSession({
      user,
      plan: PLAN_IDS.GUEST,
      status: "profile_unavailable",
      error
    });
  }
}

export function getCurrentSession({ forceRefresh = false } = {}) {
  if (!sessionPromise || forceRefresh) {
    sessionPromise = resolveCurrentSession().then((session) => {
      currentSession = session;
      document.dispatchEvent(new CustomEvent("hydronexisSessionChanged", {
        detail: session
      }));
      return session;
    });
  }
  return sessionPromise;
}

export async function getCurrentUserPlan(options) {
  const session = await getCurrentSession(options);
  return { ...session };
}

export async function getCurrentPlan(options) {
  return (await getCurrentSession(options)).plan;
}

export async function getCurrentPermissions(options) {
  return (await getCurrentSession(options)).permissions;
}

export async function hasPermission(permission, options) {
  return hasPermissionForPlan((await getCurrentSession(options)).plan, permission);
}

export const canAccess = hasPermission;

export function getCachedSession() {
  return currentSession;
}

export function getPlanLandingPage(plan) {
  return PLAN_LANDING_PAGES[normalizePlan(plan)] || PLAN_LANDING_PAGES.guest;
}

export async function requirePermission(permission) {
  const session = await getCurrentSession();
  return {
    allowed: Boolean(session.user) && hasPermissionForPlan(session.plan, permission),
    requiredPlan: getRequiredPlanForPermission(permission),
    ...session
  };
}

export async function signOutCurrentUser() {
  sessionPromise = null;
  currentSession = createSession({ status: "signed_out" });
  await signOut(auth);
}

function normalizePlanList(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((item) => normalizePlan(item, item === "all" ? "all" : ""));
}

export function applyPlanPermissions(plan, root = document) {
  const currentPlan = normalizePlan(plan);

  root.querySelectorAll("[data-plan]").forEach((element) => {
    const allowedPlans = normalizePlanList(element.dataset.plan);
    const canView = allowedPlans.includes("all") || allowedPlans.includes(currentPlan);
    element.hidden = !canView;
    element.classList.toggle("plan-protected", !canView);
  });

  root.querySelectorAll("[data-requires-permission]").forEach((element) => {
    const permission = element.dataset.requiresPermission;
    const canView = hasPermissionForPlan(currentPlan, permission);
    const keepPreview = element.hasAttribute("data-locked-preview");
    element.hidden = !canView && !keepPreview;
    element.classList.toggle("plan-protected", !canView && !keepPreview);
    element.classList.toggle("is-plan-locked", !canView && keepPreview);
    element.setAttribute("aria-disabled", String(!canView));
  });

  root.querySelectorAll("[data-current-plan]").forEach((element) => {
    element.textContent = getPlanLabel(currentPlan);
  });
}