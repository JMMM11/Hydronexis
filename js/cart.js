import {
  clearCart,
  getCart,
  getCartSummary,
  initializeCart,
  removeCartItem,
  updateCartQuantity
} from "./cart-store.js";
import { requirePageAccess } from "./plan-guard.js";

await requirePageAccess();

const elements = {
  list: document.getElementById("cartItems"),
  empty: document.getElementById("cartEmptyState"),
  subtotal: document.getElementById("cartSubtotal"),
  total: document.getElementById("cartTotal"),
  count: document.getElementById("cartItemCount"),
  checkout: document.getElementById("cartCheckoutLink"),
  clear: document.getElementById("cartClearButton"),
  feedback: document.getElementById("cartFeedback"),
  live: document.getElementById("cartLiveStatus")
};
let pendingFocus = null;

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function showFeedback(message, isError = false) {
  if (!elements.feedback) return;
  elements.feedback.textContent = message;
  elements.feedback.hidden = !message;
  elements.feedback.classList.toggle("is-error", isError);
}

function createPlaceholder(itemName) {
  const placeholder = document.createElement("div");
  placeholder.className = "commerce-product-placeholder";
  placeholder.textContent = "HN";
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute("aria-label", `No image available for ${itemName}`);
  return placeholder;
}

function createMedia(item) {
  if (!item.image) return createPlaceholder(item.name);

  const media = document.createElement("div");
  media.className = "commerce-cart-media";
  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.name;
  image.width = 110;
  image.height = 90;
  image.addEventListener("error", () => {
    media.replaceChildren(createPlaceholder(item.name));
  }, { once: true });
  media.appendChild(image);
  return media;
}

function createQuantityButton(action, label, symbol, disabled = false) {
  const button = document.createElement("button");
  button.className = "commerce-quantity-button";
  button.type = "button";
  button.dataset.action = action;
  button.setAttribute("aria-label", label);
  button.textContent = symbol;
  button.disabled = disabled;
  return button;
}

function createItem(item) {
  const card = document.createElement("article");
  card.className = "commerce-cart-item";
  card.dataset.productId = item.productId;
  card.dataset.sellerId = item.sellerId;
  card.dataset.quantity = String(item.quantity);
  card.dataset.maxQuantity = String(item.maxQuantity || 999);
  card.setAttribute("role", "listitem");

  const copy = document.createElement("div");
  copy.className = "commerce-cart-copy";
  const title = document.createElement("h2");
  title.textContent = item.name;
  const seller = document.createElement("p");
  seller.textContent = `Seller: ${item.sellerName}`;
  const note = document.createElement("small");
  note.textContent = item.category
    ? `${item.category} · Price and stock are validated before checkout.`
    : "Price and stock are validated before checkout.";
  copy.append(title, seller, note);

  const controls = document.createElement("div");
  controls.className = "commerce-cart-controls";
  const quantityLabel = document.createElement("span");
  quantityLabel.className = "commerce-quantity-label";
  quantityLabel.textContent = "Quantity";

  const quantity = document.createElement("div");
  quantity.className = "commerce-quantity";
  const decrease = createQuantityButton(
    "decrease",
    `Decrease quantity of ${item.name}`,
    "\u2212",
    item.quantity <= 1
  );
  const output = document.createElement("output");
  output.value = String(item.quantity);
  output.textContent = String(item.quantity);
  output.setAttribute("aria-label", `Quantity of ${item.name}`);
  output.setAttribute("aria-live", "polite");
  const increase = createQuantityButton(
    "increase",
    `Increase quantity of ${item.name}`,
    "+",
    Boolean(item.maxQuantity && item.quantity >= item.maxQuantity)
  );
  quantity.append(decrease, output, increase);

  const price = document.createElement("strong");
  price.className = "commerce-cart-line-total";
  price.textContent = formatMoney(item.displayPrice * item.quantity);
  const remove = document.createElement("button");
  remove.className = "commerce-cart-remove";
  remove.type = "button";
  remove.dataset.action = "remove";
  remove.setAttribute("aria-label", `Remove ${item.name} from cart`);
  remove.textContent = "Remove";

  controls.append(quantityLabel, quantity, price, remove);
  card.append(createMedia(item), copy, controls);
  return card;
}

function restorePendingFocus() {
  if (!pendingFocus || !elements.list) return;
  const matchingItem = [...elements.list.querySelectorAll("[data-product-id]")].find((item) => (
    item.dataset.productId === pendingFocus.productId
    && item.dataset.sellerId === pendingFocus.sellerId
  ));
  const matchingAction = matchingItem
    ? [...matchingItem.querySelectorAll("button[data-action]")].find((button) => (
      button.dataset.action === pendingFocus.action && !button.disabled
    ))
    : null;
  const fallback = matchingItem?.querySelector("button[data-action]:not(:disabled)")
    || elements.list.querySelector("button[data-action]:not(:disabled)")
    || elements.empty;

  (matchingAction || fallback)?.focus();
  pendingFocus = null;
}

async function renderCart() {
  const requiredElements = [
    elements.list,
    elements.empty,
    elements.subtotal,
    elements.total,
    elements.count,
    elements.checkout,
    elements.clear
  ];
  if (requiredElements.some((element) => !element)) return;

  elements.list.setAttribute("aria-busy", "true");
  try {
    const [items, summary] = await Promise.all([getCart(), getCartSummary()]);
    elements.list.replaceChildren(...items.map(createItem));
    elements.list.hidden = items.length === 0;
    elements.empty.hidden = items.length > 0;
    elements.subtotal.textContent = formatMoney(summary.displaySubtotal);
    elements.total.textContent = formatMoney(summary.displayTotal);
    elements.count.textContent = `${summary.itemCount} ${summary.itemCount === 1 ? "item" : "items"}`;
    if (elements.live) {
      elements.live.textContent = `${summary.itemCount} ${summary.itemCount === 1 ? "item" : "items"}. Cart total ${formatMoney(summary.displayTotal)}.`;
    }
    elements.clear.disabled = items.length === 0;
    elements.checkout.classList.toggle("is-disabled", items.length === 0);
    elements.checkout.setAttribute("aria-disabled", String(items.length === 0));
    elements.checkout.tabIndex = items.length === 0 ? -1 : 0;
    restorePendingFocus();
  } finally {
    elements.list.removeAttribute("aria-busy");
  }
}

async function changeQuantity(button, item) {
  const current = Number(item.dataset.quantity) || 1;
  const maximum = Number(item.dataset.maxQuantity) || 999;
  const action = button.dataset.action;

  if (action === "remove") {
    await removeCartItem(item.dataset.productId, item.dataset.sellerId);
    return;
  }

  const next = action === "increase"
    ? Math.min(maximum, current + 1)
    : Math.max(1, current - 1);
  await updateCartQuantity(item.dataset.productId, item.dataset.sellerId, next);
}

elements.list?.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("button[data-action]");
  const item = button?.closest("[data-product-id]");
  if (!button || !item) return;

  button.disabled = true;
  pendingFocus = {
    productId: item.dataset.productId,
    sellerId: item.dataset.sellerId,
    action: button.dataset.action
  };
  try {
    await changeQuantity(button, item);
  } catch (error) {
    pendingFocus = null;
    console.error("No se pudo actualizar el carrito:", error);
    showFeedback("Unable to update your cart. Please try again.", true);
    button.disabled = false;
  }
});

elements.clear?.addEventListener("click", async () => {
  elements.clear.disabled = true;
  try {
    await clearCart();
  } catch (error) {
    console.error("No se pudo vaciar el carrito:", error);
    showFeedback("Unable to clear your cart. Please try again.", true);
    elements.clear.disabled = false;
  }
});

elements.checkout?.addEventListener("click", (event) => {
  if (!elements.checkout.classList.contains("is-disabled")) return;
  event.preventDefault();
  showFeedback("Add at least one available product before checkout.", true);
});

document.addEventListener("hydronexisCartSyncError", (event) => {
  showFeedback(event.detail?.message || "Cloud cart sync is temporarily unavailable.", true);
});

try {
  await initializeCart();
  document.addEventListener("hydronexisCartChanged", () => {
    void renderCart().catch((error) => {
      console.error("No se pudo refrescar el carrito:", error);
      showFeedback("Unable to refresh your cart. Please try again.", true);
    });
  });
  await renderCart();
} catch (error) {
  console.error("No se pudo cargar el carrito:", error);
  showFeedback("Unable to load your cart. Please refresh the page.", true);
}
