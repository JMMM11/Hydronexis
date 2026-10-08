import { db } from "./firebase-config.js";
import {
  deleteUploadedImage,
  isHttpsImageUrl,
  uploadImageFile,
  validateImageFile
} from "./image-upload.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const feedback = document.getElementById("exchangeFeedback");
const offeredSelect = document.getElementById("offeredItem");
const requestedSelect = document.getElementById("requestedItem");
const exchangeList = document.getElementById("exchangeList");
const itemList = document.getElementById("exchangeItemList");
const imageUrlInput = document.getElementById("exchangeItemImage");
const imageFileInput = document.getElementById("exchangeItemImageFile");
const imagePreview = document.getElementById("exchangeImagePreview");
const imageStatus = document.getElementById("exchangeImageStatus");
const imageRemoveButton = document.getElementById("exchangeImageRemove");
const session = await requirePageAccess();
let ownItems = [];
let publicItems = [];
let localPreviewUrl = "";

function reportFirebaseError(context, error) {
  console.error(`[Exchanges] ${context}`, {
    code: error?.code || "unknown",
    message: error?.message || String(error),
    error
  });
}

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.style.background = isError ? "#fff0ec" : "#eff5ec";
  feedback.style.color = isError ? "#8b2d1e" : "#285421";
}

function firebaseErrorMessage(area, error) {
  const code = error?.code || "unknown";
  if (code === "permission-denied") {
    return "We could not load your exchanges right now. Please refresh the page or contact HYDRONEXIS support.";
  }
  if (code === "failed-precondition") {
    return "We could not organize your exchanges right now. Please try again later.";
  }
  return "We could not load your exchanges right now. Please refresh the page or contact HYDRONEXIS support.";
}

function option(value, label) {
  const node = document.createElement("option");
  node.value = value;
  node.textContent = label;
  return node;
}

function releaseLocalPreview() {
  if (!localPreviewUrl) return;
  URL.revokeObjectURL(localPreviewUrl);
  localPreviewUrl = "";
}

function showImagePreview(source, message = "") {
  releaseLocalPreview();
  if (!source) {
    imagePreview.hidden = true;
    imagePreview.removeAttribute("src");
    imageStatus.textContent = message;
    return;
  }
  imagePreview.src = source;
  imagePreview.hidden = false;
  imageStatus.textContent = message;
}

function previewDeviceImage(file) {
  validateImageFile(file);
  releaseLocalPreview();
  localPreviewUrl = URL.createObjectURL(file);
  imagePreview.src = localPreviewUrl;
  imagePreview.hidden = false;
  imageStatus.textContent = `${file.name} is ready to upload.`;
}

function itemById(id) {
  return [...ownItems, ...publicItems].find((item) => item.id === id);
}

function renderOwnItems() {
  itemList.replaceChildren();
  if (!ownItems.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty";
    empty.textContent = "No exchange items yet. Register your first item to start exchanging with the community.";
    itemList.appendChild(empty);
    return;
  }

  ownItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = item.image ? "account-list-item account-list-item-media" : "account-list-item";
    if (item.image) {
      const image = document.createElement("img");
      image.className = "account-list-thumbnail";
      image.src = item.image;
      image.alt = "";
      image.loading = "lazy";
      card.appendChild(image);
    }
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.name;
    const description = document.createElement("p");
    description.textContent = item.description || "No description.";
    details.append(title, description);
    const status = document.createElement("span");
    status.className = "account-list-item-status";
    status.textContent = item.status || "active";
    card.append(details, status);
    itemList.appendChild(card);
  });
}

function fillSelects() {
  offeredSelect.replaceChildren(option("", ownItems.length ? "Select your item" : "Register an item first"));
  ownItems.filter((item) => item.status === "active").forEach((item) => {
    offeredSelect.appendChild(option(item.id, item.name));
  });

  const available = publicItems.filter((item) => item.ownerId !== session.user.uid);
  requestedSelect.replaceChildren(option("", available.length ? "Select an item" : "No exchange items available"));
  available.forEach((item) => {
    requestedSelect.appendChild(option(item.id, item.name));
  });
}

async function loadItems() {
  const [ownSnapshot, publicSnapshot] = await Promise.all([
    getDocs(query(collection(db, "exchangeItems"), where("ownerId", "==", session.user.uid))),
    getDocs(query(collection(db, "exchangeItems"), where("status", "==", "active")))
  ]);
  ownItems = ownSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  publicItems = publicSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  fillSelects();
  renderOwnItems();
}

function itemName(id) {
  return itemById(id)?.name || "Exchange item";
}

function actionButton(label, status) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button-sm button-secondary button-zakaria";
  button.dataset.nextStatus = status;
  button.textContent = label;
  return button;
}

function renderExchange(exchange) {
  const offeredItem = itemById(exchange.offeredProductId);
  const card = document.createElement("article");
  card.className = offeredItem?.image ? "account-list-item account-list-item-media" : "account-list-item";
  card.dataset.exchangeId = exchange.id;
  if (offeredItem?.image) {
    const image = document.createElement("img");
    image.className = "account-list-thumbnail";
    image.src = offeredItem.image;
    image.alt = "";
    image.loading = "lazy";
    card.appendChild(image);
  }
  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = `${itemName(exchange.offeredProductId)} for ${itemName(exchange.requestedProductId)}`;
  const role = exchange.creatorId === session.user.uid ? "Sent request" : "Received request";
  const copy = document.createElement("p");
  copy.textContent = exchange.message ? `${role} · ${exchange.message}` : role;
  const actions = document.createElement("div");
  actions.className = "commerce-actions";

  if (exchange.status === "pending" && exchange.creatorId === session.user.uid) {
    actions.appendChild(actionButton("Cancel", "cancelled"));
  }
  if (exchange.status === "pending" && exchange.receiverId === session.user.uid) {
    actions.append(actionButton("Accept", "accepted"), actionButton("Reject", "rejected"));
  }
  if (exchange.status === "accepted") {
    actions.appendChild(actionButton("Mark Completed", "completed"));
  }

  details.append(title, copy, actions);
  const status = document.createElement("span");
  status.className = "account-list-item-status";
  status.textContent = exchange.status;
  card.append(details, status);
  return card;
}

imageFileInput?.addEventListener("change", () => {
  const file = imageFileInput.files?.[0];
  if (!file) {
    imageUrlInput.disabled = false;
    showImagePreview(imageUrlInput.value.trim(), "");
    return;
  }
  try {
    previewDeviceImage(file);
    imageUrlInput.disabled = true;
  } catch (error) {
    imageFileInput.value = "";
    imageUrlInput.disabled = false;
    showImagePreview(imageUrlInput.value.trim(), error.message);
  }
});

imageUrlInput?.addEventListener("change", () => {
  if (imageFileInput.files?.[0]) return;
  const url = imageUrlInput.value.trim();
  showImagePreview(isHttpsImageUrl(url) ? url : "", url && !isHttpsImageUrl(url) ? "Enter a valid HTTPS image URL." : "");
});

imageRemoveButton?.addEventListener("click", () => {
  imageFileInput.value = "";
  imageUrlInput.disabled = false;
  imageUrlInput.value = "";
  showImagePreview("", "Selected exchange image removed.");
});

imagePreview?.addEventListener("error", () => {
  imagePreview.hidden = true;
  imageStatus.textContent = "The image preview could not be loaded. Choose another image or URL.";
});
window.addEventListener("pagehide", releaseLocalPreview, { once: true });

const EXCHANGE_GROUPS = Object.freeze([
  { title: "Pending", statuses: ["pending"] },
  { title: "Accepted", statuses: ["accepted"] },
  { title: "Completed", statuses: ["completed"] },
  { title: "Cancelled", statuses: ["cancelled", "rejected"] }
]);

async function loadExchanges() {
  const [createdSnapshot, receivedSnapshot] = await Promise.all([
    getDocs(query(collection(db, "exchanges"), where("creatorId", "==", session.user.uid))),
    getDocs(query(collection(db, "exchanges"), where("receiverId", "==", session.user.uid)))
  ]);
  const merged = new Map();
  [...createdSnapshot.docs, ...receivedSnapshot.docs].forEach((entry) => {
    merged.set(entry.id, { id: entry.id, ...entry.data() });
  });
  const exchanges = [...merged.values()].sort((a, b) =>
    (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  exchangeList.replaceChildren();
  if (!exchanges.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty";
    empty.textContent = "No exchange requests yet. Send or receive a request and it will appear here.";
    exchangeList.appendChild(empty);
    return;
  }
  EXCHANGE_GROUPS.forEach((group) => {
    const section = document.createElement("section");
    section.className = "account-section";
    section.setAttribute("aria-labelledby", `exchange-group-${group.title.toLowerCase()}`);
    const heading = document.createElement("h3");
    heading.id = `exchange-group-${group.title.toLowerCase()}`;
    heading.textContent = group.title;
    const groupList = document.createElement("div");
    groupList.className = "account-list";
    const matching = exchanges.filter((exchange) => group.statuses.includes(exchange.status));
    if (matching.length) {
      groupList.append(...matching.map(renderExchange));
    } else {
      const empty = document.createElement("p");
      empty.className = "account-empty";
      empty.textContent = `No ${group.title.toLowerCase()} exchange requests right now.`;
      groupList.appendChild(empty);
    }
    section.append(heading, groupList);
    exchangeList.appendChild(section);
  });
}

document.getElementById("exchangeItemForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  button.disabled = true;
  const selectedFile = data.get("imageFile");
  const requestedImageUrl = String(data.get("image") || "").trim();
  let uploadedImage = null;
  let itemSaved = false;
  try {
    if (!isHttpsImageUrl(requestedImageUrl)) {
      throw new Error("Enter a valid HTTPS image URL.");
    }

    let image = requestedImageUrl;
    let imageStoragePath = "";
    if (selectedFile instanceof File && selectedFile.size) {
      uploadedImage = await uploadImageFile(selectedFile, {
        folder: "exchanges",
        uid: session.user.uid,
        recordType: "exchange_item",
        onProgress: (percent) => {
          imageStatus.textContent = `Uploading image: ${percent}%`;
        }
      });
      image = uploadedImage.url;
      imageStoragePath = uploadedImage.path;
    }

    await addDoc(collection(db, "exchangeItems"), {
      ownerId: session.user.uid,
      name: String(data.get("name") || "").trim(),
      description: String(data.get("description") || "").trim(),
      image,
      imageStoragePath,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    itemSaved = true;
    form.reset();
    imageUrlInput.disabled = false;
    showImagePreview("");
    try {
      await loadItems();
      showFeedback("Your item is now available for exchange.");
    } catch {
      showFeedback("Your item was saved, but the list could not be refreshed. Reload the page to see it.", true);
    }
  } catch (error) {
    if (uploadedImage?.path && !itemSaved) {
      await deleteUploadedImage(uploadedImage.path).catch(() => {});
    }
    showFeedback(error?.message || "The exchange item could not be saved.", true);
  } finally {
    button.disabled = false;
  }
});

document.getElementById("exchangeRequestForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = document.getElementById("exchangeSubmitButton");
  const data = new FormData(form);
  const requestedItem = publicItems.find((item) => item.id === data.get("requestedItem"));
  if (!requestedItem) {
    showFeedback("Select an available item from another member.", true);
    return;
  }

  button.disabled = true;
  try {
    await addDoc(collection(db, "exchanges"), {
      creatorId: session.user.uid,
      receiverId: requestedItem.ownerId,
      offeredProductId: String(data.get("offeredItem")),
      requestedProductId: requestedItem.id,
      message: String(data.get("message") || "").trim(),
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    form.reset();
    try {
      await loadExchanges();
      showFeedback("Exchange request sent.");
    } catch {
      showFeedback("The request was sent, but the list could not be refreshed. Reload the page to see it.", true);
    }
  } catch {
    showFeedback("The exchange request could not be created.", true);
  } finally {
    button.disabled = false;
  }
});

exchangeList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-next-status]");
  if (!button) return;
  const card = button.closest("[data-exchange-id]");
  button.disabled = true;
  try {
    await updateDoc(doc(db, "exchanges", card.dataset.exchangeId), {
      status: button.dataset.nextStatus,
      updatedAt: serverTimestamp()
    });
    try {
      await loadExchanges();
      showFeedback("Exchange status updated.");
    } catch {
      showFeedback("The status was updated, but the list could not be refreshed. Reload the page to see it.", true);
    }
  } catch {
    showFeedback("This exchange action is not permitted or could not be saved.", true);
    button.disabled = false;
  }
});

let itemsLoaded = true;
try {
  await loadItems();
} catch (error) {
  reportFirebaseError("Could not load exchange items.", error);
  itemsLoaded = false;
  fillSelects();
  itemList.innerHTML = '<p class="account-empty">We could not load your exchange items. Please refresh the page.</p>';
  showFeedback(firebaseErrorMessage("Exchange items", error), true);
}

let exchangesLoaded = true;
try {
  await loadExchanges();
} catch (error) {
  reportFirebaseError("Could not load exchange requests.", error);
  exchangesLoaded = false;
  exchangeList.innerHTML = '<p class="account-empty">We could not load your exchange requests. Please refresh the page.</p>';
  showFeedback(firebaseErrorMessage("Exchange requests", error), true);
}

if (!itemsLoaded || !exchangesLoaded) {
  console.warn("[Exchanges] Some Firebase exchange data could not be loaded.", {
    itemsLoaded,
    exchangesLoaded,
    uid: session.user.uid,
    plan: session.plan,
    accountStatus: session.profile?.accountStatus
  });
} else if (new URLSearchParams(location.search).has("product")) {
  showFeedback("Register an eligible item below, then choose an available exchange item. Marketplace products do not automatically become exchange listings.");
}
