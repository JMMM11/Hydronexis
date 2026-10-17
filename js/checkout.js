import { db } from "./firebase-config.js";
import { getCart, getCartSummary, initializeCart } from "./cart-store.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const form = document.getElementById("checkoutForm");
const submitButton = document.getElementById("checkoutSubmitButton");
const feedback = document.getElementById("checkoutFeedback");
let cartItems = [];
let session;
let submitted = false;

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function showFeedback(message, isError = false) {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.classList.toggle("is-error", isError);
  feedback.scrollIntoView({ behavior: "smooth", block: "center" });
}

function createSummaryItem(item) {
  const row = document.createElement("div");
  row.className = "commerce-checkout-item";
  row.setAttribute("role", "listitem");
  const name = document.createElement("span");
  name.textContent = `${item.name} \u00d7 ${item.quantity}`;
  const price = document.createElement("strong");
  price.textContent = formatMoney(item.displayPrice * item.quantity);
  row.append(name, price);
  return row;
}

async function renderCheckout() {
  cartItems = await getCart();
  const summary = await getCartSummary();
  const list = document.getElementById("checkoutItems");
  list.replaceChildren(...cartItems.map(createSummaryItem));
  document.getElementById("checkoutItemCount").textContent = String(summary.itemCount);
  document.getElementById("checkoutItemLabel").textContent = summary.itemCount === 1 ? "item" : "items";
  document.getElementById("checkoutSubtotal").textContent = formatMoney(summary.displaySubtotal);
  document.getElementById("checkoutDisplayTotal").textContent = formatMoney(summary.displayTotal);
  submitButton.disabled = submitted || !cartItems.length;
  if (!cartItems.length) {
    showFeedback("Your cart is empty. Add a product before checkout.", true);
  }
}

function normalizeRequestItems(items) {
  return items
    .map((item) => ({
      productId: String(item.productId || "").trim(),
      sellerId: String(item.sellerId || "").trim(),
      quantity: Math.trunc(Number(item.quantity)),
      operation: item.operation === "exchange" ? "exchange" : "sale"
    }))
    .sort((left, right) => {
      const leftKey = JSON.stringify(left);
      const rightKey = JSON.stringify(right);
      return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
    });
}

async function createIdempotencyKey(userId, items) {
  if (!globalThis.crypto?.subtle) {
    const error = new Error("Secure hashing is unavailable outside localhost or HTTPS.");
    error.code = "secure-context-required";
    throw error;
  }

  const canonicalContent = JSON.stringify({ buyerId: userId, items });
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalContent)
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitted || !cartItems.length) return;
  if (!form.reportValidity()) return;

  submitted = true;
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  const data = new FormData(form);
  let requestReference = null;

  try {
    const items = normalizeRequestItems(cartItems);
    const idempotencyKey = await createIdempotencyKey(session.user.uid, items);
    requestReference = doc(
      db,
      "checkoutRequests",
      `${session.user.uid}_${idempotencyKey}`
    );
    await setDoc(requestReference, {
      buyerId: session.user.uid,
      items,
      customer: {
        name: String(data.get("name") || "").trim(),
        email: session.user.email || "",
        phone: String(data.get("phone") || "").trim(),
        district: String(data.get("district") || "").trim(),
        address: String(data.get("address") || "").trim()
      },
      paymentMethod: "pending_provider",
      status: "pending_validation",
      idempotencyKey,
      createdAt: serverTimestamp()
    });

    showFeedback(`Checkout request ${requestReference.id} was received. No payment was charged. The authorized backend must validate stock and price before creating an order.`);
    submitButton.textContent = "Request Submitted";
  } catch (error) {
    // If two tabs submit the same cart concurrently, the first create wins and
    // the second setDoc is denied as an update. A re-read treats that race as
    // the same successful idempotent request rather than as a duplicate order.
    if (requestReference) {
      try {
        const existingRequest = await getDoc(requestReference);
        if (existingRequest.exists()) {
          showFeedback(`Checkout request ${requestReference.id} was already received for this cart. No duplicate request or payment was created.`);
          submitButton.textContent = "Request Already Submitted";
          return;
        }
      } catch {
        // Continue to the original error response below.
      }
    }

    submitted = false;
    submitButton.disabled = false;
    submitButton.textContent = "Submit for Validation";
    showFeedback(
      error?.code === "secure-context-required"
        ? "Checkout requires localhost or HTTPS so the browser can create a secure idempotency key."
        : "Checkout could not be submitted. Please verify Firebase Rules and your connection, then try again.",
      true
    );
  }
});

session = await requirePageAccess();
document.getElementById("checkoutName").value = session.profile?.name || session.user.displayName || "";
document.getElementById("checkoutEmail").value = session.user.email || "";
document.addEventListener("hydronexisCartSyncError", (event) => {
  showFeedback(event.detail?.message || "Cloud cart sync is temporarily unavailable.", true);
});
await initializeCart();
document.addEventListener("hydronexisCartChanged", () => {
  void renderCheckout().catch((error) => {
    console.error("No se pudo refrescar el checkout:", error);
    showFeedback("Checkout could not refresh the cart. Please try again.", true);
  });
});
await renderCheckout();
