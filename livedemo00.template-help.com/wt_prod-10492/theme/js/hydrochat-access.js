import {
  getPlanLabel,
  hasPermissionForPlan
} from "./plan-manager.js";
import { requirePageAccess } from "./plan-guard.js";
import { showUpgradeGate } from "./upgrade-modal.js";

const ACTIONS = Object.freeze([
  { permission: "cart", label: "Cart", href: "cart-page.html" },
  { permission: "orders", label: "Orders", href: "orders.html" },
  { permission: "exchange", label: "Exchange", href: "exchanges.html" },
  { permission: "tutorials", label: "Tutorials", href: "grid-blog.html" },
  { permission: "maps", label: "Map", href: "maps.html" },
  { permission: "community", label: "Community", href: "community.html" },
  { permission: "plant_tracking", label: "Tracking", href: "process.html" },
  { permission: "seller", label: "Seller", href: "seller-dashboard.html" }
]);

const MODE_PERMISSIONS = Object.freeze({
  purchase: "hydrochat_shopping",
  exchange: "exchange",
  seller: "hydrochat_full"
});

const session = await requirePageAccess();
const requestedMode = new URLSearchParams(location.search).get("mode") || "purchase";
const modePermission = MODE_PERMISSIONS[requestedMode] || "hydrochat_shopping";
if (!hasPermissionForPlan(session.plan, modePermission)) {
  showUpgradeGate({ requiredPermission: modePermission });
} else {
  document.getElementById("hydrochatPlanName").textContent = `${getPlanLabel(session.plan)} - ${requestedMode}`;
  const navigation = document.getElementById("hydrochatPlanActions");
  ACTIONS.filter((action) => hasPermissionForPlan(session.plan, action.permission))
    .forEach((action) => {
      const link = document.createElement("a");
      link.href = action.href;
      link.textContent = action.label;
      navigation.appendChild(link);
    });
}
