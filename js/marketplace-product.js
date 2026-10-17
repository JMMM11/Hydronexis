import { db } from "./firebase-config.js";
import {
  applyPlanPermissions,
  hasPermissionForPlan
} from "./plan-manager.js";
import { requirePageAccess } from "./plan-guard.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const productId = new URLSearchParams(location.search).get("id");
const feedback = document.getElementById("marketplaceProductFeedback");
const card = document.getElementById("marketplaceProductCard");
const session = await requirePageAccess();

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function fail(message) {
  feedback.textContent = message;
  feedback.hidden = false;
  card.hidden = true;
}

try {
  if (!productId) throw new Error("missing-product");
  const snapshot = await getDoc(doc(db, "products", productId));
  if (!snapshot.exists()) throw new Error("missing-product");
  const product = { id: snapshot.id, ...snapshot.data() };
  if (product.status === "inactive") throw new Error("inactive-product");
  applyPlanPermissions(session.plan);

  document.title = `${product.name} | HYDRONEXIS Marketplace`;
  document.getElementById("marketplaceProductTitle").textContent = product.name;
  document.getElementById("marketplaceProductSeller").textContent = `Sold by ${product.sellerName || "HYDRONEXIS Seller"}`;
  document.getElementById("marketplaceProductName").textContent = product.name;
  document.getElementById("marketplaceProductDescription").textContent = product.description || "Product description unavailable.";
  const productStatus = String(product.status || "unavailable");
  document.getElementById("marketplaceProductStatus").textContent = productStatus.replaceAll("_", " ");
  document.getElementById("marketplaceProductPrice").textContent = formatMoney(product.price);
  document.getElementById("marketplaceProductStock").textContent = product.status === "out_of_stock" ? "Out of stock" : String(product.stock);
  document.getElementById("marketplaceProductCategory").textContent = product.category || "Uncategorized";
  document.getElementById("marketplaceProductLocation").textContent = product.location || "Location unavailable";

  const media = document.getElementById("marketplaceProductMedia");
  if (product.image) {
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.decoding = "async";
    media.replaceChildren(image);
  } else {
    media.textContent = "No image available";
  }
  media.setAttribute("aria-busy", "false");

  const cartButton = document.getElementById("marketplaceProductCartButton");
  cartButton.dataset.cartProductId = product.id;
  cartButton.dataset.cartSellerId = product.sellerId;
  cartButton.dataset.cartSellerName = product.sellerName || "HYDRONEXIS Seller";
  cartButton.dataset.cartProductName = product.name;
  cartButton.dataset.cartCategory = product.category || "";
  cartButton.dataset.cartImage = product.image || "";
  cartButton.dataset.cartDisplayPrice = String(product.price);
  cartButton.dataset.cartMaxQuantity = String(Math.max(0, Math.trunc(Number(product.stock) || 0)));
  if (productStatus === "out_of_stock" || productStatus === "inactive") {
    cartButton.removeAttribute("data-cart-product-id");
    cartButton.setAttribute("aria-disabled", "true");
    cartButton.classList.add("is-disabled");
    cartButton.textContent = "Out of Stock";
  }

  const chatParameters = new URLSearchParams({
    mode: "purchase",
    product: product.id,
    seller: product.sellerId,
    productName: product.name,
    sellerName: product.sellerName || "HYDRONEXIS Seller",
    price: String(product.price)
  });
  document.getElementById("marketplaceProductContact").href = `hydrochat.html?${chatParameters}`;
  const exchange = document.getElementById("marketplaceProductExchange");
  const canExchange = product.exchangeEnabled
    && hasPermissionForPlan(session.plan, "exchange")
    && ["available", "low_stock"].includes(productStatus);
  exchange.hidden = !canExchange;
  if (canExchange) {
    exchange.href = `exchanges.html?product=${encodeURIComponent(product.id)}&seller=${encodeURIComponent(product.sellerId)}`;
  }
  feedback.hidden = true;
  card.setAttribute("aria-busy", "false");
} catch {
  fail("This product is unavailable or could not be loaded.");
}
