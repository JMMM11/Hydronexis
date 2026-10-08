import { auth, db } from "./firebase-config.js";
import { getCurrentUserPlan, getPlanLandingPage } from "./plan-manager.js";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const signinForm = document.getElementById("signin");
const emailInput = document.getElementById("signinEmail");
const passwordInput = document.getElementById("signinPassword");

const signinButton = document.getElementById("signinButton");
const googleLoginButton = document.getElementById("googleLoginButton");
const guestLoginButton = document.getElementById("guestLoginButton");

const signinMessage = document.getElementById("signinMessage");

const googleProvider = new GoogleAuthProvider();

function showMessage(text, type = "error") {
  if (!signinMessage) return;

  signinMessage.className = `message ${type}`;
  signinMessage.textContent = text;
}

function clearMessage() {
  if (!signinMessage) return;

  signinMessage.className = "message";
  signinMessage.textContent = "";
}

function setButtonLoading(button, loading, loadingText, normalText) {
  if (!button) return;

  button.disabled = loading;
  button.textContent = loading ? loadingText : normalText;
}

function getSafeNextPage() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !/^[a-z0-9-]+\.html(?:\?[^#]*)?(?:#.*)?$/i.test(next)) return null;
  return next.toLowerCase().startsWith("login.html") ? null : next;
}

async function redirectAfterLogin() {
  const safeNextPage = getSafeNextPage();
  if (safeNextPage) {
    window.location.replace(safeNextPage);
    return;
  }

  const { plan } = await getCurrentUserPlan();
  window.location.replace(getPlanLandingPage(plan));
}

async function ensureSproutProfile(user) {
  const profileReference = doc(db, "users", user.uid);
  const profileSnapshot = await getDoc(profileReference);
  if (profileSnapshot.exists()) return;

  const provider = user.providerData?.[0]?.providerId || "password";
  const fallbackName = user.email?.split("@")[0] || "Hydronexis user";
  await setDoc(profileReference, {
    uid: user.uid,
    name: user.displayName?.trim() || fallbackName,
    email: user.email || "",
    plan: "sprout",
    requestedPlan: "sprout",
    role: "user",
    accountStatus: "active",
    provider,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

function getLoginErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "The email or password is incorrect.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed.";

    case "auth/popup-blocked":
      return "The browser blocked the Google sign-in window.";

    case "auth/network-request-failed":
      return "Please check your internet connection.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    default:
      console.error("Firebase authentication error:", code);
      return "Authentication could not be completed.";
  }
}

/* Correo y contraseña */
signinForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const email = emailInput?.value.trim() ?? "";
  const password = passwordInput?.value ?? "";

  if (!email || !password) {
    showMessage("Please complete both fields.");
    return;
  }

  setButtonLoading(
    signinButton,
    true,
    "Signing in...",
    "Sign In"
  );

  let credential = null;
  try {
    credential = await signInWithEmailAndPassword(auth, email, password);
    await ensureSproutProfile(credential.user);

    showMessage(
      "Login successful. Redirecting...",
      "success"
    );

    await redirectAfterLogin();
  } catch (error) {
    if (credential?.user) await signOut(auth).catch(() => {});
    showMessage(getLoginErrorMessage(error.code));
  } finally {
    setButtonLoading(
      signinButton,
      false,
      "Signing in...",
      "Sign In"
    );
  }
});

/* Google */
googleLoginButton?.addEventListener("click", async () => {
  clearMessage();

  setButtonLoading(
    googleLoginButton,
    true,
    "Connecting...",
    "Continue with Google"
  );

  let credential = null;
  try {
    credential = await signInWithPopup(auth, googleProvider);
    await ensureSproutProfile(credential.user);

    showMessage(
      "Google sign-in successful. Redirecting...",
      "success"
    );

    await redirectAfterLogin();
  } catch (error) {
    if (credential?.user) await signOut(auth).catch(() => {});
    showMessage(getLoginErrorMessage(error.code));
  } finally {
    setButtonLoading(
      googleLoginButton,
      false,
      "Connecting...",
      "Continue with Google"
    );
  }
});

/* Visitante público: no crea una sesión ni concede un plan. */
guestLoginButton?.addEventListener("click", async () => {
  clearMessage();

  setButtonLoading(
    guestLoginButton,
    true,
    "Opening public site...",
    "Continue without an account"
  );

  try {
    await signOut(auth);
    window.location.replace("index.html");
  } catch (error) {
    showMessage(getLoginErrorMessage(error.code));
  } finally {
    setButtonLoading(
      guestLoginButton,
      false,
      "Opening public site...",
      "Continue without an account"
    );
  }
});
