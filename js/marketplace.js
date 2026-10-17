(() => {
  const search = document.getElementById("marketplace-search");
  const status = document.getElementById("marketplace-search-status");
  const products = [...document.querySelectorAll("#product-grid > [data-category]")];
  if (!search || !products.length) return;

  products.forEach((product) => {
    const name = product.querySelector(".product-title")?.textContent?.trim() || "";
    product.dataset.searchText = name.toLowerCase();
  });

  let timer;
  function applySearch() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    products.forEach((product) => {
      const matches = !query || product.dataset.searchText.includes(query);
      product.toggleAttribute("data-search-hidden", !matches);
      if (matches && product.getAttribute("data-hidden-col") !== "true") visible += 1;
    });
    status.textContent = query
      ? `${visible} Marketplace ${visible === 1 ? "product" : "products"} match your search.`
      : "Choose a product to view its community sellers.";
  }

  search.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(applySearch, 250);
  });
})();
