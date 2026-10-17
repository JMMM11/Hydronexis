const requiredPlan = new URLSearchParams(window.location.search).get("required");
const messages = Object.freeze({
  sprout: {
    title: "A verified Hydronexis account is required",
    text: "Sign in again to verify your Sprout plan before opening the Marketplace and purchase tools."
  },
  blooming: {
    title: "This feature requires Blooming",
    text: "Upgrade to Blooming or Go Green to unlock this area. Compare the plans below and choose the access level that fits you."
  },
  go_green: {
    title: "This feature is exclusive to Go Green",
    text: "Seller and premium tools are available with Go Green. Marketplace browsing remains available on every account plan."
  }
});

const message = messages[requiredPlan];
if (message) {
  const notice = document.getElementById("plan-access-notice");
  const title = document.getElementById("plan-access-notice-title");
  const text = document.getElementById("plan-access-notice-text");
  if (notice && title && text) {
    title.textContent = message.title;
    text.textContent = message.text;
    notice.hidden = false;
    notice.focus({ preventScroll: true });
  }
}

const checkoutLinks = Object.freeze({
  sprout: "https://buy.stripe.com/test_3cI14m9oB5IGf3I7mF8bS03",
  blooming: "https://buy.stripe.com/test_8x2dR81W92wug7MfSL8bS01",
  go_green: "https://buy.stripe.com/test_00waEWcAN5IG2gW6ib8bS02"
});

document.querySelectorAll("[data-plan-choice]").forEach((link) => {
  const targetPlan = link.dataset.planChoice;
  if (checkoutLinks[targetPlan]) {
    link.href = checkoutLinks[targetPlan];
  }
});
