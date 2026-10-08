import { db } from "./firebase-config.js";
import { getCurrentSession } from "./plan-manager.js";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const STORAGE_PREFIX = "hydronexis.cart.v2";
let initialized = false;
let initializationPromise = null;
let session = null;
let cart = [];

function storageKey(userId = "guest") {
  return `${STORAGE_PREFIX}.${userId}`;
}

function itemKey(item) {
  return `${item.productId}::${item.sellerId || "hydronexis"}`;
}

function sanitizeItem(item) {
  if (!item || typeof item !== "object") return null;
  const productId = String(item.productId || "").trim();
  const name = String(item.name || "").trim();
  if (!productId || !name) return null;
  const rawMaximum = Math.trunc(Number(item.maxQuantity));
  const maxQuantity = Number.isInteger(rawMaximum) && rawMaximum > 0
    ? Math.min(999, rawMaximum)
    : null;
  return {
    productId,
    sellerId: String(item.sellerId || "hydronexis").trim(),
    sellerName: String(item.sellerName || "HYDRONEXIS").trim(),
    name,
    category: String(item.category || "").trim(),
    image: String(item.image || "").trim(),
    displayPrice: Math.max(0, Number(item.displayPrice) || 0),
    quantity: Math.max(1, Math.min(maxQuantity || 999, Math.trunc(Number(item.quantity) || 1))),
    maxQuantity,
    operation: item.operation === "exchange" ? "exchange" : "sale"
  };
}

function readLocal(userId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(userId)) || "[]");
    return Array.isArray(parsed) ? parsed.map(sanitizeItem).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveLocal() {
  const userId = session?.user?.uid || "guest";
  localStorage.setItem(storageKey(userId), JSON.stringify(cart));
}

function mergeCarts(remoteCart, ownLocalCart, guestCart) {
  const merged = new Map();
  [remoteCart, ownLocalCart].flat().map(sanitizeItem).filter(Boolean).forEach((item) => {
    const key = itemKey(item);
    const existing = merged.get(key);
    if (existing) {
      // Local and Firestore normally contain the same cart. Keeping the
      // greatest quantity prevents a fresh page load from duplicating items.
      existing.maxQuantity = existing.maxQuantity && item.maxQuantity
        ? Math.min(existing.maxQuantity, item.maxQuantity)
        : existing.maxQuantity || item.maxQuantity;
      existing.quantity = Math.min(existing.maxQuantity || 999, Math.max(existing.quantity, item.quantity));
    } else {
      merged.set(key, { ...item });
    }
  });

  // A guest cart represents new shopping activity and is therefore added
  // once when the user signs in, then its local key is removed.
  (guestCart || []).map(sanitizeItem).filter(Boolean).forEach((item) => {
    const key = itemKey(item);
    const existing = merged.get(key);
    if (existing) {
      existing.maxQuantity = existing.maxQuantity && item.maxQuantity
        ? Math.min(existing.maxQuantity, item.maxQuantity)
        : existing.maxQuantity || item.maxQuantity;
      existing.quantity = Math.min(existing.maxQuantity || 999, existing.quantity + item.quantity);
    } else {
      merged.set(key, { ...item });
    }
  });
  return [...merged.values()];
}

function notify() {
  document.dispatchEvent(new CustomEvent("hydronexisCartChanged", {
    detail: getCartSummarySync()
  }));
}

async function persistRemote() {
  if (!session?.user) return;
  try {
    await setDoc(doc(db, "carts", session.user.uid), {
      userId: session.user.uid,
      items: cart,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    document.dispatchEvent(new CustomEvent("hydronexisCartSyncError", {
      detail: { message: "Your cart is saved on this device, but cloud sync is unavailable.", error }
    }));
  }
}

async function initializeInternal() {
  session = await getCurrentSession();
  const userId = session.user?.uid || "guest";
  const ownLocal = readLocal(userId);

  if (!session.user) {
    cart = ownLocal;
    initialized = true;
    notify();
    return cart;
  }

  const guestLocal = readLocal("guest");
  let remote = [];
  try {
    const snapshot = await getDoc(doc(db, "carts", userId));
    if (snapshot.exists() && Array.isArray(snapshot.data().items)) {
      remote = snapshot.data().items;
    }
  } catch (error) {
    document.dispatchEvent(new CustomEvent("hydronexisCartSyncError", {
      detail: { message: "We could not sync your cart right now. This device copy is still available.", error }
    }));
  }

  cart = mergeCarts(remote, ownLocal, guestLocal);
  localStorage.removeItem(storageKey("guest"));
  saveLocal();
  initialized = true;
  notify();
  await persistRemote();
  return cart;
}

export function initializeCart() {
  if (!initializationPromise) initializationPromise = initializeInternal();
  return initializationPromise;
}

async function ensureInitialized() {
  if (!initialized) await initializeCart();
}

async function persist() {
  saveLocal();
  notify();
  await persistRemote();
}

export async function getCart() {
  await ensureInitialized();
  return cart.map((item) => ({ ...item }));
}

export async function addCartItem(item, quantity = 1) {
  await ensureInitialized();
  const normalized = sanitizeItem({ ...item, quantity });
  if (!normalized) throw new Error("A valid product is required.");
  const key = itemKey(normalized);
  const existing = cart.find((entry) => itemKey(entry) === key);
  if (existing) {
    existing.maxQuantity = existing.maxQuantity && normalized.maxQuantity
      ? Math.min(existing.maxQuantity, normalized.maxQuantity)
      : existing.maxQuantity || normalized.maxQuantity;
    existing.quantity = Math.min(existing.maxQuantity || 999, existing.quantity + normalized.quantity);
  } else {
    cart.push(normalized);
  }
  await persist();
  return getCart();
}

export async function updateCartQuantity(productId, sellerId, quantity) {
  await ensureInitialized();
  const targetKey = itemKey({ productId, sellerId });
  const item = cart.find((entry) => itemKey(entry) === targetKey);
  if (!item) return getCart();
  const nextQuantity = Math.trunc(Number(quantity) || 0);
  if (nextQuantity <= 0) {
    cart = cart.filter((entry) => itemKey(entry) !== targetKey);
  } else {
    item.quantity = Math.min(item.maxQuantity || 999, nextQuantity);
  }
  await persist();
  return getCart();
}

export async function removeCartItem(productId, sellerId) {
  return updateCartQuantity(productId, sellerId, 0);
}

export async function clearCart() {
  await ensureInitialized();
  cart = [];
  await persist();
}

export function getCartSummarySync() {
  const summary = cart.reduce((result, item) => {
    result.itemCount += item.quantity;
    result.displaySubtotal += item.displayPrice * item.quantity;
    return result;
  }, { itemCount: 0, displaySubtotal: 0 });
  summary.displaySubtotal = Math.round(summary.displaySubtotal * 100) / 100;
  summary.displayTotal = summary.displaySubtotal;
  return summary;
}

export async function getCartSummary() {
  await ensureInitialized();
  return getCartSummarySync();
}
