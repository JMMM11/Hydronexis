import { requirePageAccess } from "./plan-guard.js";

await requirePageAccess();

const items = [...document.querySelectorAll("[data-tutorial-item]")];
const search = document.getElementById("tutorialSearch");
const level = document.getElementById("tutorialLevel");
const category = document.getElementById("tutorialCategory");
const type = document.getElementById("tutorialType");
const status = document.getElementById("tutorialFilterStatus");

[...new Set(items.map((item) => item.dataset.category).filter(Boolean))]
  .sort((left, right) => left.localeCompare(right))
  .forEach((value) => category.add(new Option(value, value)));

items.forEach((item) => {
  item.dataset.searchText = item.textContent.toLowerCase();
});

function render() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  items.forEach((item) => {
    const matches = (!query || item.dataset.searchText.includes(query))
      && (!level.value || item.dataset.level === level.value)
      && (!category.value || item.dataset.category === category.value)
      && (!type.value || item.dataset.type === type.value);
    item.hidden = !matches;
    if (matches) visible += 1;
  });
  status.textContent = visible
    ? `${visible} reviewed ${visible === 1 ? "resource" : "resources"} shown.`
    : "No reviewed content matches these filters. Guides, courses and missing levels remain [DATA REQUIRED].";
}

let timer;
search.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(render, 200);
});
[level, category, type].forEach((control) => control.addEventListener("change", render));
render();
