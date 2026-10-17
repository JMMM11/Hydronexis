import { db } from "./firebase-config.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const STAGES = Object.freeze({
  seed: "Seed",
  germination: "Germination",
  seedling: "Seedling",
  vegetative: "Vegetative",
  ready_to_harvest: "Ready to Harvest",
  harvested: "Harvested"
});

const session = await requirePageAccess();
const list = document.getElementById("trackingList");
const feedback = document.getElementById("trackingFeedback");

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.style.background = isError ? "#fff0ec" : "#eff5ec";
  feedback.style.color = isError ? "#8b2d1e" : "#285421";
}

function stageSelect(currentStage) {
  const select = document.createElement("select");
  select.dataset.field = "stage";
  Object.entries(STAGES).forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = value === currentStage;
    select.appendChild(option);
  });
  return select;
}

function renderPlant(record) {
  const card = document.createElement("article");
  card.className = "account-list-item";
  card.dataset.trackingId = record.id;
  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = record.variety ? `${record.plant} · ${record.variety}` : record.plant;
  const date = document.createElement("p");
  date.textContent = `Started: ${record.startDate || "Date unavailable"}`;
  const notes = document.createElement("textarea");
  notes.dataset.field = "notes";
  notes.rows = 3;
  notes.maxLength = 1000;
  notes.value = record.notes || "";
  notes.setAttribute("aria-label", `Notes for ${record.plant}`);
  const controls = document.createElement("div");
  controls.className = "commerce-actions";
  const save = document.createElement("button");
  save.type = "button";
  save.className = "button button-sm button-secondary button-zakaria";
  save.dataset.action = "save";
  save.textContent = "Save Update";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "commerce-clear-button";
  remove.dataset.action = "delete";
  remove.textContent = "Delete";
  controls.append(save, remove);
  details.append(title, date, notes, controls);
  card.append(details, stageSelect(record.stage));
  return card;
}

async function loadPlants() {
  const snapshot = await getDocs(query(
    collection(db, "plantTracking"),
    where("ownerId", "==", session.user.uid)
  ));
  const records = snapshot.docs
    .map((entry) => ({ id: entry.id, ...entry.data() }))
    .sort((a, b) => (b.updatedAt?.toMillis?.() || 0) - (a.updatedAt?.toMillis?.() || 0));
  list.replaceChildren();
  if (!records.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty";
    empty.textContent = "You haven't added any plant tracking records yet.";
    list.appendChild(empty);
    return;
  }
  list.append(...records.map(renderPlant));
}

document.getElementById("trackingForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const button = document.getElementById("trackingSubmitButton");
  button.disabled = true;
  try {
    await addDoc(collection(db, "plantTracking"), {
      ownerId: session.user.uid,
      plant: String(data.get("plant") || "").trim(),
      variety: String(data.get("variety") || "").trim(),
      startDate: String(data.get("startDate") || ""),
      stage: String(data.get("stage") || "seed"),
      notes: String(data.get("notes") || "").trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    form.reset();
    await loadPlants();
    showFeedback("Plant tracking record saved.");
  } catch {
    showFeedback("The plant record could not be saved.", true);
  } finally {
    button.disabled = false;
  }
});

list?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const card = button.closest("[data-tracking-id]");
  button.disabled = true;
  try {
    if (button.dataset.action === "delete") {
      if (!window.confirm("Delete this plant tracking record?")) {
        button.disabled = false;
        return;
      }
      await deleteDoc(doc(db, "plantTracking", card.dataset.trackingId));
      showFeedback("Plant tracking record deleted.");
    } else {
      await updateDoc(doc(db, "plantTracking", card.dataset.trackingId), {
        stage: card.querySelector('[data-field="stage"]').value,
        notes: card.querySelector('[data-field="notes"]').value.trim(),
        updatedAt: serverTimestamp()
      });
      showFeedback("Plant tracking updated.");
    }
    await loadPlants();
  } catch {
    showFeedback("The plant record could not be updated.", true);
    button.disabled = false;
  }
});

try {
  await loadPlants();
} catch {
  console.error("[Plant Tracking] Data could not be loaded. Check Firebase Rules and connection.");
  list.innerHTML = '<p class="account-empty">We could not load your plant tracking data. Please refresh the page.</p>';
  showFeedback("Plant tracking is unavailable right now. Please try again later.", true);
}
