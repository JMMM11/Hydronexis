import { db } from "./firebase-config.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const elements = {
  form: document.getElementById("sellerForm"),
  fieldset: document.getElementById("sellerFieldset"),
  authTitle: document.getElementById("authTitle"),
  authDescription: document.getElementById("authDescription"),
  currentLocationButton: document.getElementById("currentLocationButton"),
  saveButton: document.getElementById("saveButton"),
  message: document.getElementById("formMessage")
};

function setMessage(text, type = "") {
  elements.message.textContent = text;
  elements.message.className = `form-message ${type}`.trim();
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function parseKeywords(value) {
  return [...new Set(value.split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean))].slice(0, 20);
}

function validateCoordinates(latitude, longitude) {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }
}

const session = await requirePageAccess();
const locationReference = session.user
  ? doc(db, "locations", session.user.uid)
  : null;
if (session.user) {
  const sellerName = session.profile?.name?.trim()
    || session.user.displayName?.trim()
    || session.user.email?.split("@")[0]
    || "HYDRONEXIS Seller";
  elements.authTitle.textContent = `${sellerName} - Go Green verified`;
  elements.authDescription.textContent = "The saved marker will be owned by this account.";
  elements.fieldset.disabled = false;
  document.getElementById("sellerName").value = sellerName;
}

elements.currentLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    setMessage("Geolocation is not supported by this browser.", "error");
    return;
  }

  elements.currentLocationButton.disabled = true;
  setMessage("Getting your location...");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      document.getElementById("latitude").value = position.coords.latitude.toFixed(7);
      document.getElementById("longitude").value = position.coords.longitude.toFixed(7);
      setMessage("Location obtained. Review the coordinates before saving.", "success");
      elements.currentLocationButton.disabled = false;
    },
    (error) => {
      const messages = {
        1: "Location permission was denied.",
        2: "Your location is currently unavailable.",
        3: "Getting your location took too long."
      };
      setMessage(messages[error.code] || "Your location could not be determined.", "error");
      elements.currentLocationButton.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!session.user) {
    setMessage("Your authenticated session could not be verified.", "error");
    return;
  }
  if (!elements.form.checkValidity()) {
    elements.form.reportValidity();
    return;
  }

  const latitude = Number(getValue("latitude"));
  const longitude = Number(getValue("longitude"));
  try {
    validateCoordinates(latitude, longitude);
    elements.saveButton.disabled = true;
    elements.saveButton.textContent = "Saving...";

    const existingLocation = await getDoc(locationReference);
    const locationData = {
      businessName: getValue("businessName"),
      sellerName: getValue("sellerName"),
      product: getValue("product"),
      district: getValue("district"),
      township: getValue("township"),
      address: getValue("address"),
      phone: getValue("phone"),
      latitude,
      longitude,
      keywords: parseKeywords(getValue("keywords")),
      active: true,
      ownerId: session.user.uid,
      updatedAt: serverTimestamp()
    };

    if (existingLocation.exists()) {
      await setDoc(locationReference, locationData, { merge: true });
    } else {
      await setDoc(locationReference, {
        ...locationData,
        createdAt: serverTimestamp()
      });
    }

    elements.form.reset();
    const sellerName = session.profile?.name?.trim() || session.user.displayName?.trim() || "";
    document.getElementById("sellerName").value = sellerName;
    setMessage("Seller location saved. This account now has one current marker on the map.", "success");
  } catch (error) {
    console.error("Seller location could not be saved.", error);
    setMessage(error.message || "Seller location could not be saved.", "error");
  } finally {
    elements.saveButton.disabled = false;
    elements.saveButton.textContent = "Save seller";
  }
});
