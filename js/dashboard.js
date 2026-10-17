import { db } from "./firebase-config.js";
import { getCartSummary } from "./cart-store.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  getPlanLabel,
  hasPermissionForPlan,
  PLAN_PRICES
} from "./plan-manager.js";
import {
  collection,
  getDocs,
  limit,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const FEATURES = Object.freeze([
  { permission: "marketplace", title: "Marketplace", description: "Browse products and view community sellers.", href: "grid-shop.html" },
  { permission: "cart", title: "Cart", description: "Keep products together before checkout.", href: "cart-page.html" },
  { permission: "orders", title: "Order History", description: "Review your verified purchases and statuses.", href: "orders.html" },
  { permission: "hydrochat_shopping", title: "HydroChat Shopping", description: "Get help finding products and sellers.", href: "hydrochat.html" },
  { permission: "exchange", title: "Product Exchange", description: "Create and manage exchange requests.", href: "exchanges.html" },
  { permission: "community", title: "Community", description: "Share questions, experiences and growing tips.", href: "community.html" },
  { permission: "tutorials", title: "Tutorials & Courses", description: "Open educational content for your growing journey.", href: "grid-blog.html" },
  { permission: "maps", title: "Hydroponic Map", description: "Explore relevant locations and available map information.", href: "maps.html" },
  { permission: "plant_tracking", title: "Plant Growth Tracking", description: "Record and follow the progress of your plants.", href: "process.html" },
  { permission: "seller", title: "Seller Module", description: "Manage your own products, inventory, orders and sales.", href: "seller-dashboard.html" },
  { permission: "recipes", title: "Premium Experience", description: "Access recipes, hydroponic menu and mentoring tools.", href: "premium.html" }
]);

const QUICK_ACTIONS = Object.freeze([
  { permission: "marketplace", label: "Browse Marketplace", href: "grid-shop.html" },
  { permission: "cart", label: "Open Cart", href: "cart-page.html" },
  { permission: "orders", label: "My Orders", href: "orders.html" },
  { permission: "exchange", label: "My Exchanges", href: "exchanges.html" },
  { permission: "plant_tracking", label: "Track a Plant", href: "process.html" },
  { permission: "seller", label: "Seller Dashboard", href: "seller-dashboard.html" },
  { permission: "profile", label: "My Profile", href: "profile.html" }
]);

const PLAN_GUIDES = Object.freeze({
  sprout: "Start by exploring the Marketplace and adding products to your cart. Sprout keeps shopping simple.",
  blooming: "You can now access Tutorials, Community, Exchange and Plant Tracking to grow with more support.",
  go_green: "Publish your first product, register your seller location and manage the complete Marketplace seller flow."
});

function displayNameFor(session) {
  return session.profile?.name?.trim()
    || session.user?.displayName?.trim()
    || session.user?.email?.split("@")[0]
    || "Hydronexis user";
}

function createFeatureCard(feature, locked = false) {
  const card = document.createElement("article");
  card.className = "dashboard-feature-card";
  const title = document.createElement("h3");
  title.textContent = feature.title;
  const description = document.createElement("p");
  description.textContent = feature.description;
  const link = document.createElement("a");
  link.href = locked ? "what-we-offer.html" : feature.href;
  link.textContent = locked ? "View plans" : "Open feature";
  card.append(title, description, link);
  return card;
}

function renderFeatures(plan) {
  const available = document.getElementById("availableFeatures");
  const locked = document.getElementById("lockedFeatures");
  const lockedPanel = document.getElementById("lockedFeaturesPanel");
  available.replaceChildren();
  locked.replaceChildren();

  FEATURES.forEach((feature) => {
    const canUse = hasPermissionForPlan(plan, feature.permission);
    (canUse ? available : locked).appendChild(createFeatureCard(feature, !canUse));
  });
  lockedPanel.hidden = locked.childElementCount === 0;
}

function renderQuickActions(plan) {
  const container = document.getElementById("quickActions");
  container.replaceChildren();
  QUICK_ACTIONS
    .filter((action) => hasPermissionForPlan(plan, action.permission))
    .forEach((action) => {
      const link = document.createElement("a");
      link.href = action.href;
      link.textContent = action.label;
      container.appendChild(link);
    });
}

function formatDate(value) {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  if (!date || Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function renderOrders(orders) {
  const container = document.getElementById("recentOrders");
  container.replaceChildren();
  if (!orders.length) {
    const empty = document.createElement("p");
    empty.className = "dashboard-empty";
    empty.textContent = "You don't have any orders yet.";
    container.appendChild(empty);
    return;
  }

  orders.slice(0, 3).forEach((order) => {
    const item = document.createElement("article");
    item.className = "dashboard-order-item";
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = `Order ${order.orderId || order.id}`;
    const meta = document.createElement("span");
    meta.textContent = `${formatDate(order.createdAt)} · ${order.status || "pending"}`;
    const total = document.createElement("strong");
    total.textContent = formatMoney(order.total);
    copy.append(title, meta);
    item.append(copy, total);
    container.appendChild(item);
  });
}

function renderActivity(orders) {
  const container = document.getElementById("recentActivity");
  container.replaceChildren();
  if (!orders.length) {
    const empty = document.createElement("p");
    empty.className = "dashboard-empty";
    empty.textContent = "Your verified account activity will appear here.";
    container.appendChild(empty);
    return;
  }
  orders.slice(0, 3).forEach((order) => {
    const item = document.createElement("article");
    item.className = "dashboard-activity-item";
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = "Order created";
    const meta = document.createElement("span");
    meta.textContent = formatDate(order.createdAt);
    const status = document.createElement("strong");
    status.textContent = order.status || "pending";
    copy.append(title, meta);
    item.append(copy, status);
    container.appendChild(item);
  });
}

async function loadOrders(userId) {
  const snapshot = await getDocs(query(
    collection(db, "orders"),
    where("buyerId", "==", userId),
    limit(12)
  ));
  return snapshot.docs
    .map((documentSnapshot) => ({ id: documentSnapshot.id, ...documentSnapshot.data() }))
    .sort((a, b) => {
      const first = a.createdAt?.toMillis?.() || 0;
      const second = b.createdAt?.toMillis?.() || 0;
      return second - first;
    });
}

function configureUpgrade(plan) {
  const card = document.getElementById("upgradeCard");
  const title = document.getElementById("upgradeTitle");
  const copy = document.getElementById("upgradeCopy");
  if (plan === "go_green") {
    title.textContent = "Your plan includes all HYDRONEXIS features.";
    copy.textContent = "Use the shortcuts above to access the complete premium experience.";
    card.querySelector("a").hidden = true;
  } else if (plan === "blooming") {
    title.textContent = "Upgrade to Go Green";
    copy.textContent = "Unlock Seller, inventory, advanced map and premium tools.";
  }
}

async function initializeDashboard() {
  const main = document.getElementById("dashboardMain");
  const feedback = document.getElementById("dashboardFeedback");
  const session = await requirePageAccess();
  const planLabel = getPlanLabel(session.plan);

  document.getElementById("dashboardUserName").textContent = displayNameFor(session);
  document.getElementById("dashboardPlanName").textContent = planLabel;
  document.getElementById("dashboardPlanPrice").textContent = PLAN_PRICES[session.plan] || "";
  document.getElementById("dashboardPlanGuide").textContent =
    PLAN_GUIDES[session.plan] || "Everything available in your account, organized by your current plan.";
  document.getElementById("summaryPlan").textContent = planLabel;
  const cartSummary = await getCartSummary();
  document.getElementById("summaryCartCount").textContent = `${cartSummary.itemCount} items`;
  renderFeatures(session.plan);
  renderQuickActions(session.plan);
  configureUpgrade(session.plan);

  if (session.error && session.status !== "authenticated") {
    feedback.textContent = session.status === "profile_missing"
      ? "Your account is ready for basic Sprout access while we finish loading the full profile."
      : "Some account details could not be loaded right now. Please refresh the page.";
    feedback.hidden = false;
  }

  try {
    const orders = await loadOrders(session.user.uid);
    document.getElementById("summaryOrderCount").textContent = `${orders.length} orders`;
    renderOrders(orders);
    renderActivity(orders);
  } catch {
    renderOrders([]);
    renderActivity([]);
    feedback.textContent = "Orders could not be loaded right now. Please try again later.";
    feedback.hidden = false;
  } finally {
    main.setAttribute("aria-busy", "false");
  }
}

initializeDashboard();
