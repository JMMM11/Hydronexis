// Matriz oficial de planes. Este archivo no depende de Firebase y puede
// reutilizarse en navegacion, guards, dashboards y pruebas.
export const PLAN_IDS = Object.freeze({
  GUEST: "guest",
  SPROUT: "sprout",
  BLOOMING: "blooming",
  GO_GREEN: "go_green"
});

export const ACCOUNT_PLAN_IDS = Object.freeze([
  PLAN_IDS.SPROUT,
  PLAN_IDS.BLOOMING,
  PLAN_IDS.GO_GREEN
]);

export const PLAN_LEVELS = Object.freeze({
  guest: 0,
  sprout: 1,
  blooming: 2,
  go_green: 3
});

export const PLAN_LABELS = Object.freeze({
  guest: "Guest",
  sprout: "Sprout",
  blooming: "Blooming",
  go_green: "Go Green"
});

export const PLAN_PRICES = Object.freeze({
  sprout: "FREE",
  blooming: "B/. 90.00",
  go_green: "B/. 149.00"
});

const SPROUT_PERMISSIONS = Object.freeze([
  "authenticated",
  "dashboard",
  "profile",
  "marketplace",
  "view_sellers",
  "product_details",
  "cart",
  "checkout",
  "orders",
  "hydrochat_shopping"
]);

const BLOOMING_PERMISSIONS = Object.freeze([
  ...SPROUT_PERMISSIONS,
  "exchange",
  "community",
  "guides",
  "courses",
  "tutorials",
  "plant_tracking",
  "hydrochat_blooming"
]);

const GO_GREEN_PERMISSIONS = Object.freeze([
  ...BLOOMING_PERMISSIONS,
  "seller",
  "publish_product",
  "manage_own_products",
  "inventory",
  "seller_orders",
  "sales",
  "seller_analytics",
  "maps",
  "basic_map",
  "advanced_map",
  "recipes",
  "hydroponic_menu",
  "mentoring",
  "hydrochat_full"
]);

export const PLAN_PERMISSIONS = Object.freeze({
  guest: Object.freeze(["public_info", "plans"]),
  sprout: SPROUT_PERMISSIONS,
  blooming: BLOOMING_PERMISSIONS,
  go_green: GO_GREEN_PERMISSIONS
});

const PERMISSION_MINIMUM_PLAN = Object.freeze({
  public_info: "guest",
  plans: "guest",
  authenticated: "sprout",
  dashboard: "sprout",
  profile: "sprout",
  marketplace: "sprout",
  view_sellers: "sprout",
  product_details: "sprout",
  cart: "sprout",
  checkout: "sprout",
  orders: "sprout",
  hydrochat_shopping: "sprout",
  exchange: "blooming",
  community: "blooming",
  tutorials: "blooming",
  guides: "blooming",
  courses: "blooming",
  maps: "go_green",
  basic_map: "go_green",
  plant_tracking: "blooming",
  hydrochat_blooming: "blooming",
  seller: "go_green",
  publish_product: "go_green",
  manage_own_products: "go_green",
  inventory: "go_green",
  seller_orders: "go_green",
  sales: "go_green",
  seller_analytics: "go_green",
  advanced_map: "go_green",
  recipes: "go_green",
  hydroponic_menu: "go_green",
  mentoring: "go_green",
  hydrochat_full: "go_green"
});

export function normalizePlan(value, fallback = "guest") {
  if (typeof value !== "string") return fallback;
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const alias = normalized === "gogreen" ? "go_green" : normalized;
  return Object.prototype.hasOwnProperty.call(PLAN_LEVELS, alias)
    ? alias
    : fallback;
}

// Firestore is an authorization boundary: aliases are useful for URLs/UI,
// but an account document must store one exact canonical value.
export function isCanonicalAccountPlan(value) {
  return typeof value === "string" && ACCOUNT_PLAN_IDS.includes(value);
}

export function hasPlanAccess(currentPlan, requiredPlan) {
  const current = normalizePlan(currentPlan);
  const required = normalizePlan(requiredPlan, "");
  return Boolean(required) && PLAN_LEVELS[current] >= PLAN_LEVELS[required];
}

export function getPermissionsForPlan(plan) {
  return PLAN_PERMISSIONS[normalizePlan(plan)] || PLAN_PERMISSIONS.guest;
}

export function hasPermissionForPlan(plan, permission) {
  return typeof permission === "string"
    && getPermissionsForPlan(plan).includes(permission.trim().toLowerCase());
}

export function getRequiredPlanForPermission(permission) {
  if (typeof permission !== "string") return null;
  return PERMISSION_MINIMUM_PLAN[permission.trim().toLowerCase()] || null;
}

export function getPlanLabel(plan) {
  return PLAN_LABELS[normalizePlan(plan)] || PLAN_LABELS.guest;
}
