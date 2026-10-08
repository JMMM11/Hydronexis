import { db } from "./firebase-config.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

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
  const list = document.getElementById("ordersList");
  list.replaceChildren();
  if (!orders.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty";
    empty.textContent = "You don't have any orders yet.";
    list.appendChild(empty);
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement("article");
    card.className = "account-list-item";
    const details = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = `Order ${order.orderId || order.id}`;
    const items = Array.isArray(order.items) ? order.items : [];
    const itemSummary = items.length
      ? items.map((item) => `${item.name || "Product"} × ${item.quantity || 1}`).join(", ")
      : "Items unavailable";
    const meta = document.createElement("p");
    meta.textContent = `${formatDate(order.createdAt)} · ${itemSummary}`;
    const seller = document.createElement("p");
    seller.textContent = `Seller: ${order.sellerName || "See order details"} · Payment: ${order.paymentStatus || "pending"} · Total: ${formatMoney(order.total)}`;
    const status = document.createElement("span");
    status.className = "account-list-item-status";
    status.textContent = order.status || "pending";
    details.append(title, meta, seller);
    card.append(details, status);
    list.appendChild(card);
  });
}

async function initializeOrders() {
  const feedback = document.getElementById("ordersFeedback");
  try {
    const session = await requirePageAccess();
    const snapshot = await getDocs(query(
      collection(db, "orders"),
      where("buyerId", "==", session.user.uid)
    ));
    const orders = snapshot.docs
      .map((entry) => ({ id: entry.id, ...entry.data() }))
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    renderOrders(orders);
  } catch {
    renderOrders([]);
    feedback.textContent = "Your order history could not be loaded. Please try again later.";
    feedback.hidden = false;
  }
}

initializeOrders();
