import { db } from "./firebase-config.js";
import {
  deleteUploadedImage,
  isHttpsImageUrl,
  uploadImageFile,
  validateImageFile
} from "./image-upload.js";
import {
  applyPlanPermissions,
  getPlanLabel,
  PLAN_PRICES,
  signOutCurrentUser
} from "./plan-manager.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  doc,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

let session;
const photoUrlInput = document.getElementById("profilePhotoInput");
const photoFileInput = document.getElementById("profilePhotoFile");
const photoPreview = document.getElementById("profilePhotoPreview");
const photoStatus = document.getElementById("profilePhotoStatus");
const photoRemoveButton = document.getElementById("profilePhotoRemove");
let localPreviewUrl = "";

function getDisplayName() {
  return session.profile?.name?.trim()
    || session.user?.displayName?.trim()
    || session.user?.email?.split("@")[0]
    || "Hydronexis user";
}

function getInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase()).join("") || "HN";
}

function formatMemberSince(value) {
  const date = value?.toDate?.() || session.user?.metadata?.creationTime;
  if (!date) return "Unavailable";
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unavailable";
  return new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(parsed);
}

function showFeedback(message, isError = false) {
  const feedback = document.getElementById("profileFeedback");
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.style.background = isError ? "#fff0ec" : "#eff5ec";
  feedback.style.color = isError ? "#8b2d1e" : "#285421";
}

function releaseLocalPreview() {
  if (!localPreviewUrl) return;
  URL.revokeObjectURL(localPreviewUrl);
  localPreviewUrl = "";
}

function renderAvatar(photoUrl, name) {
  const avatar = document.getElementById("profileAvatar");
  avatar.replaceChildren();
  if (!photoUrl) {
    avatar.textContent = getInitials(name);
    return;
  }
  const image = document.createElement("img");
  image.src = photoUrl;
  image.alt = `${name} profile`;
  image.addEventListener("error", () => {
    avatar.textContent = getInitials(name);
  }, { once: true });
  avatar.appendChild(image);
}

function updateHeaderProfile(photoUrl, name) {
  const nameNode = document.getElementById("navbarUserName");
  if (nameNode) nameNode.textContent = name;
  const initials = getInitials(name);
  ["navbarUserAvatar", "navbarUserAvatarSmall"].forEach((id) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.replaceChildren();
    if (!photoUrl) {
      node.textContent = initials;
      return;
    }
    const image = document.createElement("img");
    image.src = photoUrl;
    image.alt = `${name} profile`;
    image.addEventListener("error", () => {
      node.textContent = initials;
    }, { once: true });
    node.appendChild(image);
  });
}

function showPhotoPreview(source, message = "", file = null) {
  releaseLocalPreview();
  let previewSource = source;
  if (file) {
    localPreviewUrl = URL.createObjectURL(file);
    previewSource = localPreviewUrl;
  }
  const name = document.getElementById("profileNameInput").value.trim() || getDisplayName();
  renderAvatar(previewSource, name);
  if (previewSource) {
    photoPreview.src = previewSource;
    photoPreview.hidden = false;
  } else {
    photoPreview.hidden = true;
    photoPreview.removeAttribute("src");
  }
  photoStatus.textContent = message;
}

function renderProfile() {
  const name = getDisplayName();
  const planLabel = getPlanLabel(session.plan);
  const photoUrl = session.profile?.photoUrl?.trim() || session.user.photoURL?.trim() || "";
  document.getElementById("profileName").textContent = name;
  document.getElementById("profileNameInput").value = name;
  photoUrlInput.disabled = false;
  photoUrlInput.value = photoUrl;
  photoFileInput.value = "";
  showPhotoPreview(photoUrl, photoUrl ? "Current profile photo." : "No profile photo selected.");
  document.getElementById("profileEmail").textContent = session.user.email || "Unavailable";
  document.getElementById("profileMemberSince").textContent = formatMemberSince(session.profile?.createdAt);
  document.getElementById("profilePlanBadge").textContent = planLabel;
  document.getElementById("profilePlanPrice").textContent = PLAN_PRICES[session.plan] || "";
  const upgradeLink = document.getElementById("profileUpgradeLink");
  if (session.plan === "go_green") upgradeLink.textContent = "Review Current Plan";
  applyPlanPermissions(session.plan, document.getElementById("profileLinks"));
  document.getElementById("profileMain").setAttribute("aria-busy", "false");
}

photoFileInput?.addEventListener("change", () => {
  const file = photoFileInput.files?.[0];
  if (!file) {
    photoUrlInput.disabled = false;
    const url = photoUrlInput.value.trim();
    showPhotoPreview(isHttpsImageUrl(url) ? url : "", "");
    return;
  }
  try {
    validateImageFile(file);
    photoUrlInput.disabled = true;
    showPhotoPreview("", `${file.name} is ready to upload.`, file);
  } catch (error) {
    photoFileInput.value = "";
    photoUrlInput.disabled = false;
    const currentUrl = photoUrlInput.value.trim();
    showPhotoPreview(isHttpsImageUrl(currentUrl) ? currentUrl : "", error.message);
  }
});

photoUrlInput?.addEventListener("change", () => {
  if (photoFileInput.files?.[0]) return;
  const url = photoUrlInput.value.trim();
  showPhotoPreview(
    isHttpsImageUrl(url) ? url : "",
    url && !isHttpsImageUrl(url) ? "Enter a valid HTTPS profile photo URL." : ""
  );
});

photoRemoveButton?.addEventListener("click", () => {
  photoFileInput.value = "";
  photoUrlInput.disabled = false;
  photoUrlInput.value = "";
  showPhotoPreview("", "Selected profile photo removed.");
});

photoPreview?.addEventListener("error", () => {
  photoPreview.hidden = true;
  renderAvatar("", document.getElementById("profileNameInput").value.trim() || getDisplayName());
  photoStatus.textContent = "The photo preview could not be loaded. Choose another image or URL.";
});

window.addEventListener("pagehide", releaseLocalPreview, { once: true });

document.getElementById("profileForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = document.getElementById("profileSaveButton");
  const name = document.getElementById("profileNameInput").value.trim();
  const selectedFile = photoFileInput.files?.[0];
  const requestedPhotoUrl = photoUrlInput.disabled ? "" : photoUrlInput.value.trim();
  if (name.length < 2 || name.length > 80) {
    showFeedback("Enter a name between 2 and 80 characters.", true);
    return;
  }
  if (!isHttpsImageUrl(requestedPhotoUrl)) {
    showFeedback("Enter a valid HTTPS profile photo URL.", true);
    return;
  }

  button.disabled = true;
  button.textContent = "Saving...";
  let uploadedPhoto = null;
  let profileSaved = false;
  try {
    let photoUrl = requestedPhotoUrl;
    let photoStoragePath = requestedPhotoUrl === (session.profile?.photoUrl?.trim() || "")
      ? session.profile?.photoStoragePath || ""
      : "";

    if (selectedFile) {
      uploadedPhoto = await uploadImageFile(selectedFile, {
        folder: "profiles",
        uid: session.user.uid,
        recordType: "profile",
        relatedRecordId: session.user.uid,
        onProgress: (percent) => {
          photoStatus.textContent = `Uploading photo: ${percent}%`;
        }
      });
      photoUrl = uploadedPhoto.url;
      photoStoragePath = uploadedPhoto.path;
    }

    console.log("Payload a Firestore:", {
      name,
      photoUrl,
      photoStoragePath,
      uid: session.user.uid,
      expectedPhotoStoragePathPrefix: `profiles/${session.user.uid}/`,
      pathMatchesExpectedPrefix: photoStoragePath === "" || photoStoragePath.startsWith(`profiles/${session.user.uid}/`),
      accountStatus: session.profile?.accountStatus,
      plan: session.profile?.plan
    });

    await updateDoc(doc(db, "users", session.user.uid), {
      name,
      photoUrl,
      photoStoragePath,
      updatedAt: serverTimestamp()
    });
    profileSaved = true;

    const previousStoragePath = session.profile?.photoStoragePath || "";
    session = {
      ...session,
      profile: { ...session.profile, name, photoUrl, photoStoragePath }
    };
    if (previousStoragePath && previousStoragePath !== photoStoragePath) {
      await deleteUploadedImage(previousStoragePath).catch(() => {});
    }
    renderProfile();
    updateHeaderProfile(photoUrl, name);
    showFeedback("Your profile was updated.");
  } catch (error) {
    if (uploadedPhoto?.path && !profileSaved) {
      await deleteUploadedImage(uploadedPhoto.path).catch(() => {});
    }
    showFeedback(
      profileSaved
        ? "Your profile was saved, but the page could not be refreshed. Reload to see the changes."
        : error?.message || "Your profile could not be updated. Please try again.",
      true
    );
  } finally {
    button.disabled = false;
    button.textContent = "Save Changes";
  }
});

document.getElementById("profileLogoutButton")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await signOutCurrentUser();
    location.replace("index.html");
  } catch {
    button.disabled = false;
    showFeedback("Logout could not be completed. Please try again.", true);
  }
});

session = await requirePageAccess();
renderProfile();
