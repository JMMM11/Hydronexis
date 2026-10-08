import { addCartItem, initializeCart } from "./cart-store.js";
import { applyPlanPermissions } from "./plan-manager.js";
import { requirePageAccess } from "./plan-guard.js";

const session = await requirePageAccess();
await initializeCart();
applyPlanPermissions(session.plan);

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-cart-product-id]");
  if (!button) return;
  event.preventDefault();
  if (button.dataset.cartBusy === "true") return;
  button.dataset.cartBusy = "true";
  const feedback = document.getElementById("marketplaceActionFeedback");
  button.setAttribute("aria-busy", "true");
  button.setAttribute("aria-disabled", "true");
  button.classList.add("is-loading");

  try {
    await addCartItem({
      productId: button.dataset.cartProductId,
      sellerId: button.dataset.cartSellerId,
      sellerName: button.dataset.cartSellerName,
      name: button.dataset.cartProductName,
      category: button.dataset.cartCategory,
      image: button.dataset.cartImage,
      displayPrice: button.dataset.cartDisplayPrice,
      maxQuantity: button.dataset.cartMaxQuantity,
      operation: "sale"
    });
    if (feedback) {
      feedback.textContent = "Product added to your cart. The final price and availability will be verified at checkout.";
      feedback.hidden = false;
      feedback.classList.remove("is-error");
    }
    button.removeAttribute("data-cart-product-id");
    button.textContent = "View Cart";
    button.href = "cart-page.html";
  } catch {
    if (feedback) {
      feedback.textContent = "The product could not be added. Please try again.";
      feedback.hidden = false;
      feedback.classList.add("is-error");
    }
  } finally {
    delete button.dataset.cartBusy;
    button.removeAttribute("aria-busy");
    button.removeAttribute("aria-disabled");
    button.classList.remove("is-loading");
  }
});
