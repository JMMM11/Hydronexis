import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const signupForm = document.getElementById("signup");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupConfirm = document.getElementById("signupConfirm");
const signupMessage = document.getElementById("signupMessage");
const signupButton = document.getElementById("signupButton");

function showSignupMessage(text, type = "error") {
  if (!signupMessage) return;
  signupMessage.className = `message ${type}`;
  signupMessage.textContent = text;
}

function clearSignupMessage() {
  if (!signupMessage) return;
  signupMessage.className = "message";
  signupMessage.textContent = "";
}

function setSignupLoading(isLoading) {
  if (!signupButton) return;
  signupButton.disabled = isLoading;
  signupButton.textContent = isLoading ? "Creating account..." : "Create Account";
}

function getRegisterErrorMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/network-request-failed":
      return "Please check your internet connection.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "permission-denied":
      return "The account was created, but your profile could not be finished. Please contact HYDRONEXIS support.";
    case "unavailable":
      return "Firebase is temporarily unavailable. Check your connection and try again.";
    default:
      return "The account could not be created. Please try again.";
  }
}

function getSafeNextPage() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !/^[a-z0-9-]+\.html(?:\?[^#]*)?(?:#.*)?$/i.test(next)) return null;
  return next.toLowerCase().startsWith("login.html") ? null : next;
}

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearSignupMessage();

  const name = signupName?.value.trim() ?? "";
  const email = signupEmail?.value.trim() ?? "";
  const password = signupPassword?.value ?? "";
  const confirmPassword = signupConfirm?.value ?? "";

  if (!name || !email || !password || !confirmPassword) {
    showSignupMessage("Please complete every field before creating your account.");
    return;
  }
  if (password.length < 6) {
    showSignupMessage("The password must contain at least 6 characters.");
    return;
  }
  if (password !== confirmPassword) {
    showSignupMessage("Passwords do not match.");
    return;
  }

  setSignupLoading(true);
  let credential = null;
  try {
    credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    // Every self-service registration starts at Sprout. Premium changes must
    // come from an authorized backend or an administrator in Firebase.
    await setDoc(doc(db, "users", credential.user.uid), {
      uid: credential.user.uid,
      name,
      email,
      plan: "sprout",
      requestedPlan: "sprout",
      role: "user",
      accountStatus: "active",
      provider: "password",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    showSignupMessage("Account created successfully. Redirecting...", "success");
    window.location.replace(getSafeNextPage() || "Dashboard2.html");
  } catch (error) {
    console.error("Hydronexis account creation failed.", {
      code: error?.code || "unknown",
      message: error?.message || String(error),
      authUserCreated: Boolean(credential?.user),
      uid: credential?.user?.uid || null,
      email
    });

    // Avoid leaving an authenticated account without its required Firestore
    // profile when provisioning fails after Authentication succeeds.
    if (credential?.user) {
      try {
        await deleteUser(credential.user);
      } catch {
        await signOut(auth).catch(() => {});
      }
    }
    showSignupMessage(getRegisterErrorMessage(error.code));
  } finally {
    setSignupLoading(false);
  }
});
