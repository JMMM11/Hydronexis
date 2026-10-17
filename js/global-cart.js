let initialized = false;
let cartStore = null;
let previousItemCount = 0;
let ready = false;
let returnFocus = null;
let pendingFocus = null;

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function getElements() {
  return {
    panel: document.getElementById("hydronexisCartPanel"),
    backdrop: document.querySelector(".hydronexis-cart-backdrop"),
    list: document.getElementById("hydronexisCartItems"),
    empty: document.getElementById("hydronexisCartEmptyState"),
    subtotal: document.getElementById("hydronexisCartSubtotal"),
    total: document.getElementById("hydronexisCartTotal"),
    clear: document.getElementById("hydronexisCartClear"),
    checkout: document.getElementById("hydronexisCartCheckout"),
    feedback: document.getElementById("hydronexisCartFeedback")
  };
}

function showFeedback(message, isError = false) {
  const feedback = getElements().feedback;
  if (!feedback) return;
  feedback.textContent = message;
  feedback.hidden = !message;
  feedback.classList.toggle("is-error", isError);
}

function setOpenState(open) {
  const { panel, backdrop } = getElements();
  if (!panel || !backdrop) return;
  const wasOpen = panel.classList.contains("is-open");
  panel.classList.toggle("is-open", open);
  backdrop.classList.toggle("is-open", open);
  panel.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("hydronexis-cart-open", open);
  document.querySelectorAll("[data-hydronexis-cart-trigger]").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", String(open));
  });

  if (open && !wasOpen) {
    returnFocus = document.activeElement;
    panel.querySelector(".hydronexis-cart-close")?.focus();
  } else if (!open && wasOpen) {
    const focusTarget = returnFocus instanceof HTMLElement && document.contains(returnFocus)
      ? returnFocus
      : [...document.querySelectorAll("[data-hydronexis-cart-trigger]")].find((trigger) => (
        trigger instanceof HTMLElement && trigger.offsetParent !== null
      ));
    focusTarget?.focus();
    returnFocus = null;
  }
}

function createMedia(item) {
  const media = document.createElement("div");
  media.className = "hydronexis-cart-item-media";
  if (item.image) {
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.width = 68;
    image.height = 68;
    image.addEventListener("error", () => {
      media.replaceChildren(createPlaceholder());
    }, { once: true });
    media.appendChild(image);
  } else {
    media.appendChild(createPlaceholder());
  }
  return media;
}

function createPlaceholder() {
  const placeholder = document.createElement("span");
  placeholder.className = "hydronexis-cart-item-placeholder";
  placeholder.textContent = "HN";
  placeholder.setAttribute("aria-hidden", "true");
  return placeholder;
}

function createQuantityButton(action, label, symbol, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.cartAction = action;
  button.setAttribute("aria-label", label);
  button.textContent = symbol;
  button.disabled = disabled;
  return button;
}

function createCartItem(item) {
  const article = document.createElement("article");
  article.className = "hydronexis-cart-item";
  article.dataset.productId = item.productId;
  article.dataset.sellerId = item.sellerId;
  article.dataset.quantity = String(item.quantity);
  article.dataset.maxQuantity = String(item.maxQuantity || 999);
  article.setAttribute("role", "listitem");

  const copy = document.createElement("div");
  copy.className = "hydronexis-cart-item-copy";

  const top = document.createElement("div");
  top.className = "hydronexis-cart-item-top";
  const title = document.createElement("h3");
  title.textContent = item.name;
  const lineTotal = document.createElement("strong");
  lineTotal.className = "hydronexis-cart-item-line-total";
  lineTotal.textContent = formatMoney(item.displayPrice * item.quantity);
  top.append(title, lineTotal);

  const seller = document.createElement("p");
  seller.className = "hydronexis-cart-item-seller";
  seller.textContent = `Seller: ${item.sellerName}`;

  const bottom = document.createElement("div");
  bottom.className = "hydronexis-cart-item-bottom";
  const quantity = document.createElement("div");
  quantity.className = "hydronexis-cart-quantity";
  const decrease = createQuantityButton(
    "decrease",
    `Decrease quantity of ${item.name}`,
    "−",
    item.quantity <= 1
  );
  const output = document.createElement("output");
  output.setAttribute("aria-label", `Quantity of ${item.name}`);
  output.textContent = String(item.quantity);
  const increase = createQuantityButton(
    "increase",
    `Increase quantity of ${item.name}`,
    "+",
    Boolean(item.maxQuantity && item.quantity >= item.maxQuantity)
  );
  quantity.append(decrease, output, increase);

  const remove = document.createElement("button");
  remove.className = "hydronexis-cart-remove";
  remove.type = "button";
  remove.dataset.cartAction = "remove";
  remove.setAttribute("aria-label", `Remove ${item.name} from cart`);
  remove.textContent = "Remove";
  bottom.append(quantity, remove);

  copy.append(top, seller, bottom);
  article.append(createMedia(item), copy);
  return article;
}

function restorePendingFocus() {
  if (!pendingFocus) return;
  const { panel, list } = getElements();
  if (!panel?.classList.contains("is-open") || !list) {
    pendingFocus = null;
    return;
  }

  const matchingItem = [...list.querySelectorAll("[data-product-id]")].find((item) => (
    item.dataset.productId === pendingFocus.productId
    && item.dataset.sellerId === pendingFocus.sellerId
  ));
  const matchingAction = matchingItem
    ? [...matchingItem.querySelectorAll("[data-cart-action]")].find((button) => (
      button.dataset.cartAction === pendingFocus.action && !button.disabled
    ))
    : null;
  const fallback = matchingItem?.querySelector("[data-cart-action]:not(:disabled)")
    || list.querySelector("[data-cart-action]:not(:disabled)")
    || panel.querySelector(".hydronexis-cart-close");

  (matchingAction || fallback)?.focus();
  pendingFocus = null;
}

async function renderCart({ openWhenIncreased = false } = {}) {
  if (!cartStore) return;
  const { list, empty, subtotal, total, clear, checkout } = getElements();
  if (!list || !empty || !subtotal || !total || !clear || !checkout) return;

  const [items, summary] = await Promise.all([
    cartStore.getCart(),
    cartStore.getCartSummary()
  ]);
  list.replaceChildren(...items.map(createCartItem));
  list.hidden = items.length === 0;
  empty.hidden = items.length > 0;
  subtotal.textContent = formatMoney(summary.displaySubtotal);
  total.textContent = formatMoney(summary.displayTotal);
  clear.disabled = items.length === 0;
  checkout.classList.toggle("is-disabled", items.length === 0);
  checkout.setAttribute("aria-disabled", String(items.length === 0));
  checkout.tabIndex = items.length === 0 ? -1 : 0;

  document.querySelectorAll("[data-hydronexis-cart-badge]").forEach((badge) => {
    badge.textContent = String(summary.itemCount);
  });
  document.querySelectorAll("[data-hydronexis-cart-trigger]").forEach((trigger) => {
    trigger.setAttribute(
      "aria-label",
      `Open shopping cart, ${summary.itemCount} ${summary.itemCount === 1 ? "item" : "items"}`
    );
  });

  if (
    ready
    && openWhenIncreased
    && summary.itemCount > previousItemCount
    && !getElements().panel?.classList.contains("is-open")
  ) {
    setOpenState(true);
  }
  previousItemCount = summary.itemCount;
  restorePendingFocus();
}

async function runItemAction(button) {
  if (!cartStore) return;
  const item = button.closest("[data-product-id]");
  if (!item) return;
  const productId = item.dataset.productId;
  const sellerId = item.dataset.sellerId;
  const quantity = Number(item.dataset.quantity) || 1;
  const maxQuantity = Number(item.dataset.maxQuantity) || 999;

  button.disabled = true;
  pendingFocus = {
    productId,
    sellerId,
    action: button.dataset.cartAction
  };
  try {
    if (button.dataset.cartAction === "remove") {
      await cartStore.removeCartItem(productId, sellerId);
    } else if (button.dataset.cartAction === "decrease") {
      await cartStore.updateCartQuantity(productId, sellerId, Math.max(1, quantity - 1));
    } else if (button.dataset.cartAction === "increase") {
      await cartStore.updateCartQuantity(productId, sellerId, Math.min(maxQuantity, quantity + 1));
    }
  } catch (error) {
    pendingFocus = null;
    console.error("No se pudo actualizar el carrito:", error);
    showFeedback("Unable to update your cart. Please try again.", true);
    button.disabled = false;
  }
}

function handleClick(event) {
  const trigger = event.target.closest("[data-hydronexis-cart-trigger]");
  if (trigger) {
    event.preventDefault();
    const isOpen = getElements().panel?.classList.contains("is-open");
    setOpenState(!isOpen);
    return;
  }

  if (event.target.closest("[data-hydronexis-cart-close]")) {
    event.preventDefault();
    setOpenState(false);
    return;
  }

  const action = event.target.closest("[data-cart-action]");
  if (action) {
    event.preventDefault();
    void runItemAction(action);
    return;
  }

  const clear = event.target.closest("#hydronexisCartClear");
  if (clear && cartStore) {
    event.preventDefault();
    clear.disabled = true;
    cartStore.clearCart()
      .then(() => showFeedback("Your cart is empty."))
      .catch((error) => {
        console.error("No se pudo vaciar el carrito:", error);
        showFeedback("Unable to clear your cart. Please try again.", true);
        clear.disabled = false;
      });
    return;
  }

  const checkout = event.target.closest("#hydronexisCartCheckout");
  if (checkout?.classList.contains("is-disabled")) {
    event.preventDefault();
    showFeedback("Add at least one product before checkout.", true);
  }
}

function handleKeydown(event) {
  const { panel } = getElements();
  if (!panel?.classList.contains("is-open")) return;
  if (event.key === "Escape") {
    event.preventDefault();
    setOpenState(false);
    return;
  }
  if (event.key !== "Tab") return;

  const focusable = [...panel.querySelectorAll(
    'a[href]:not([tabindex="-1"]), button:not(:disabled), [tabindex]:not([tabindex="-1"])'
  )].filter((element) => !element.hidden);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export async function initializeGlobalCart() {
  if (initialized || !document.getElementById("hydronexisCartPanel")) return;
  initialized = true;
  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("hydronexisCartChanged", () => {
    void renderCart({ openWhenIncreased: true });
  });
  document.addEventListener("hydronexisCartSyncError", (event) => {
    showFeedback(event.detail?.message || "Cloud cart sync is temporarily unavailable.", true);
  });

  try {
    cartStore = await import("./cart-store.js");
    await cartStore.initializeCart();
    await renderCart();
    ready = true;
  } catch (error) {
    console.error("No se pudo cargar el estado del carrito:", error);
    showFeedback("Unable to load your cart. Please refresh the page.", true);
  }
}
