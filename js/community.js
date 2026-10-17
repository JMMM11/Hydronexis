import { db } from "./firebase-config.js";
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

const session = await requirePageAccess();
const feed = document.getElementById("communityFeed");
const feedback = document.getElementById("communityFeedback");

function displayName() {
  return session.profile?.name?.trim()
    || session.user.displayName?.trim()
    || session.user.email?.split("@")[0]
    || "Hydronexis member";
}

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.style.background = isError ? "#fff0ec" : "#eff5ec";
  feedback.style.color = isError ? "#8b2d1e" : "#285421";
}

function formatDate(value) {
  const date = value?.toDate?.();
  if (!date) return "Just now";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function renderPost(post) {
  const card = document.createElement("article");
  card.className = "account-list-item";
  card.dataset.postId = post.id;
  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = `${post.authorName || "Community member"} · ${post.category || "post"}`;
  const content = document.createElement("p");
  content.textContent = post.content;
  const date = document.createElement("p");
  date.textContent = formatDate(post.createdAt);
  details.append(title, content, date);
  const actions = document.createElement("div");
  if (post.authorId === session.user.uid) {
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.action = "delete";
    remove.className = "commerce-clear-button";
    remove.textContent = "Remove";
    actions.appendChild(remove);
  }
  card.append(details, actions);
  return card;
}

async function loadPosts() {
  const snapshot = await getDocs(query(
    collection(db, "community"),
    where("status", "==", "active")
  ));
  const posts = snapshot.docs
    .map((entry) => ({ id: entry.id, ...entry.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  feed.replaceChildren();
  if (!posts.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty";
    empty.textContent = "No community posts yet. Start the first conversation.";
    feed.appendChild(empty);
    return;
  }
  feed.append(...posts.map(renderPost));
}

document.getElementById("communityForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const button = document.getElementById("communitySubmitButton");
  button.disabled = true;
  try {
    await addDoc(collection(db, "community"), {
      authorId: session.user.uid,
      authorName: displayName(),
      category: String(data.get("category") || "question"),
      content: String(data.get("content") || "").trim(),
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    form.reset();
    await loadPosts();
    showFeedback("Your post was published.");
  } catch {
    showFeedback("Your post could not be published.", true);
  } finally {
    button.disabled = false;
  }
});

feed?.addEventListener("click", async (event) => {
  const button = event.target.closest('[data-action="delete"]');
  if (!button) return;
  const card = button.closest("[data-post-id]");
  button.disabled = true;
  try {
    await updateDoc(doc(db, "community", card.dataset.postId), {
      status: "deleted",
      updatedAt: serverTimestamp()
    });
    await loadPosts();
    showFeedback("Your post was removed.");
  } catch {
    showFeedback("The post could not be removed.", true);
    button.disabled = false;
  }
});

try {
  await loadPosts();
} catch {
  console.error("[Community] Posts could not be loaded. Check Firebase Rules and connection.");
  feed.innerHTML = '<p class="account-empty">We could not load community posts. Please refresh the page.</p>';
  showFeedback("Community is unavailable right now. Please try again later.", true);
}
