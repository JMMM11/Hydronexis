import { demoPlaces } from "./demo-data.js";
import { getFirebaseServices, isFirebaseConfigured } from "./firebase-service.js";
import { requirePageAccess } from "./plan-guard.js";

await requirePageAccess();

if (typeof L === "undefined") {
  const mapError = document.getElementById("mapMessage");
  if (mapError) {
    mapError.textContent = "The interactive map could not be loaded. Check your connection and try again.";
    mapError.classList.remove("hidden");
  }
  throw new Error("Leaflet no cargó correctamente.");
}

const map = L.map("map", { zoomControl: true }).setView([8.89, -79.79], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const goldenMarker = L.divIcon({
  className: "hydronexis-marker",
  html: `<div class="marker-pin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg></div>`,
  iconSize: [39, 49],
  iconAnchor: [19, 46],
  popupAnchor: [0, -43]
});

const markersLayer = L.layerGroup().addTo(map);
const markerById = new Map();
let placesDatabase = [];

const elements = {
  search: document.getElementById("searchInput"),
  product: document.getElementById("productFilter"),
  district: document.getElementById("districtFilter"),
  list: document.getElementById("placesList"),
  counter: document.getElementById("resultsCounter"),
  badge: document.getElementById("connectionBadge"),
  message: document.getElementById("mapMessage")
};

const normalize = value => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim();

const escapeHtml = value => String(value ?? "").replace(
  /[&<>'"]/g,
  char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;"
  })[char]
);

function setBadge(text) {
  if (elements.badge) elements.badge.textContent = text;
}

function showMessage(text) {
  if (!elements.message) return;
  elements.message.textContent = text;
  elements.message.classList.remove("hidden");
  setTimeout(() => elements.message.classList.add("hidden"), 4000);
}

function populateFilters() {
  elements.product.innerHTML = '<option value="">All</option>';
  elements.district.innerHTML = '<option value="">All</option>';

  [...new Set(placesDatabase.map(place => place.product).filter(Boolean))]
    .sort()
    .forEach(value => elements.product.add(new Option(value, value)));

  [...new Set(placesDatabase.map(place => place.district).filter(Boolean))]
    .sort()
    .forEach(value => elements.district.add(new Option(value, value)));
}

function popup(place) {
  return `<div class="place-popup">
    <h3>${escapeHtml(place.name)}</h3>
    <p><strong>Seller:</strong> ${escapeHtml(place.seller)}</p>
    <p><strong>Product:</strong> ${escapeHtml(place.product)}</p>
    <p><strong>Location:</strong> ${escapeHtml(place.address)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(place.phone || "Not available")}</p>
  </div>`;
}

function focusPlace(id) {
  const place = placesDatabase.find(item => item.id === id);
  const marker = markerById.get(id);
  if (!place || !marker) return;
  map.flyTo([place.latitude, place.longitude], 16, { duration: 1 });
  setTimeout(() => marker.openPopup(), 650);
}

function renderPlaces(places, fit = true) {
  markersLayer.clearLayers();
  markerById.clear();
  elements.list.innerHTML = "";
  elements.counter.textContent = String(places.length);

  if (!places.length) {
    elements.list.innerHTML = '<div class="empty-results">No se encontraron lugares.</div>';
    return;
  }

  const bounds = [];

  places.forEach(place => {
    if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) return;

    const marker = L.marker([place.latitude, place.longitude], {
      icon: goldenMarker,
      title: place.name
    }).bindPopup(popup(place)).addTo(markersLayer);

    markerById.set(place.id, marker);
    bounds.push([place.latitude, place.longitude]);

    const card = document.createElement("article");
    card.className = "place-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Show ${place.name} on the map`);
    card.innerHTML = `<h3>${escapeHtml(place.name)}</h3>
      <p>${escapeHtml(place.address)}</p>
      <p>Vendedor: ${escapeHtml(place.seller)}</p>
      <span class="product-pill">${escapeHtml(place.product)}</span>`;
    card.addEventListener("click", () => focusPlace(place.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        focusPlace(place.id);
      }
    });
    elements.list.appendChild(card);
  });

  if (fit && bounds.length === 1) {
    map.setView(bounds[0], 15);
  } else if (fit && bounds.length > 1) {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
  }
}

function searchPlaces() {
  const term = normalize(elements.search.value);
  const product = elements.product.value;
  const district = elements.district.value;

  const results = placesDatabase.filter(place => {
    const haystack = normalize([
      place.name,
      place.seller,
      place.product,
      place.district,
      place.township,
      place.address,
      ...(place.keywords || [])
    ].join(" "));

    return (!term || haystack.includes(term))
      && (!product || place.product === product)
      && (!district || place.district === district);
  });

  renderPlaces(results);
}

function resetSearch() {
  elements.search.value = "";
  elements.product.value = "";
  elements.district.value = "";
  renderPlaces(placesDatabase);
}

function useCurrentLocation() {
  if (!navigator.geolocation) {
    showMessage("Tu navegador no permite obtener la ubicación.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const point = [position.coords.latitude, position.coords.longitude];
      map.flyTo(point, 14);
      L.circleMarker(point, {
        radius: 8,
        color: "#123c32",
        fillColor: "#d9f3e7",
        fillOpacity: 1,
        weight: 3
      }).addTo(map).bindPopup("Tu ubicación aproximada").openPopup();
    },
    error => {
      const messages = {
        1: "Location permission was denied. You can still search the map manually.",
        2: "Your location is currently unavailable. Try again or search manually.",
        3: "Getting your location took too long. Please try again."
      };
      showMessage(messages[error.code] || "Your location could not be determined.");
    },
    { enableHighAccuracy: true, timeout: 12000 }
  );
}

async function start() {
  if (!isFirebaseConfigured()) {
    placesDatabase = demoPlaces;
    setBadge("Modo demostración");
    populateFilters();
    renderPlaces(placesDatabase);
    return;
  }

  try {
    const { db, firestore } = await getFirebaseServices();
    const locationsRef = firestore.collection(db, "locations");
    const locationsQuery = firestore.query(
      locationsRef,
      firestore.where("active", "==", true)
    );

    const snapshot = await firestore.getDocs(locationsQuery);
    const firebasePlaces = snapshot.docs.map(documentSnapshot => {
      const data = documentSnapshot.data();
      return {
        id: documentSnapshot.id,
        name: data.businessName || "",
        seller: data.sellerName || "",
        product: data.product || "",
        district: data.district || "",
        township: data.township || "",
        address: data.address || "",
        phone: data.phone || "",
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        keywords: Array.isArray(data.keywords) ? data.keywords : []
      };
    });

    if (firebasePlaces.length === 0) {
      placesDatabase = demoPlaces;
      setBadge("Firebase connected - demo");
      showMessage("No verified locations are available yet. Clearly labeled demonstration data is shown.");
    } else {
      placesDatabase = firebasePlaces;
      setBadge("Firebase connected");
    }

    populateFilters();
    renderPlaces(placesDatabase);
  } catch (error) {
    console.error(error);
    placesDatabase = demoPlaces;
    setBadge("Firebase unavailable - demo");
    populateFilters();
    renderPlaces(placesDatabase);
    showMessage("Verified map locations could not be loaded. Clearly labeled demonstration data is shown.");
  }
}

document.getElementById("searchButton").addEventListener("click", searchPlaces);
document.getElementById("resetButton").addEventListener("click", resetSearch);
document.getElementById("nearMeButton").addEventListener("click", useCurrentLocation);
elements.search.addEventListener("input", searchPlaces);
elements.search.addEventListener("keydown", event => {
  if (event.key === "Enter") searchPlaces();
});
elements.product.addEventListener("change", searchPlaces);
elements.district.addEventListener("change", searchPlaces);

start();
