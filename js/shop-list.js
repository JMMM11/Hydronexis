/* ===========================================================
   Shop List — filtering / sorting logic
   Extracted from the inline <script> block in shop-list.html
=========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const productContainer = document.getElementById('product-list');
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const filterBtn = document.getElementById('price-filter-btn');
  const sliderRange = document.getElementById('price-slider-range');
  const filterStatus = document.getElementById('price-filter-status');
  const checkboxList = document.getElementById('category-filter-list');
  const sortSelect = document.getElementById('sort-select');
  const resultsText = document.getElementById('results-count-text');
  const noResultsMsg = document.getElementById('no-results-message');

  if (!productContainer || !minInput || !maxInput) return;
  const products = Array.from(productContainer.querySelectorAll('[data-category]'));

  function getSelectedCategories() {
    if (!checkboxList) return ['all'];
    return Array.from(checkboxList.querySelectorAll('input[type="checkbox"]:checked')).map(function (input) {
      return input.dataset.cat;
    });
  }

  function normalizePrices() {
    let min = Number(minInput.value);
    let max = Number(maxInput.value);
    const lowerLimit = Number(minInput.min);
    const upperLimit = Number(minInput.max);
    if (min > max) [min, max] = [max, min];
    min = Math.max(lowerLimit, min);
    max = Math.min(upperLimit, max);
    minInput.value = String(min);
    maxInput.value = String(max);
    return { min, max };
  }

  function updatePriceSlider() {
    const prices = normalizePrices();
    const lowerLimit = Number(minInput.min);
    const upperLimit = Number(minInput.max);
    const minPercent = ((prices.min - lowerLimit) / (upperLimit - lowerLimit)) * 100;
    const maxPercent = ((prices.max - lowerLimit) / (upperLimit - lowerLimit)) * 100;
    if (sliderRange) {
      sliderRange.style.left = minPercent + '%';
      sliderRange.style.right = (100 - maxPercent) + '%';
    }
    if (filterStatus) filterStatus.textContent = '$' + prices.min.toFixed(2) + ' \u2013 $' + prices.max.toFixed(2);
    minInput.style.zIndex = prices.min > upperLimit - 25 ? '5' : '3';
    maxInput.style.zIndex = '4';
  }

  function sortProducts() {
    if (!sortSelect) return;
    const criterion = sortSelect.value;
    const sorted = products.slice().sort(function (a, b) {
      if (criterion === 'alphabet') return a.dataset.name.localeCompare(b.dataset.name);
      if (criterion === 'popularity') return Number(b.dataset.popularity) - Number(a.dataset.popularity);
      if (criterion === 'price-low') return Number(a.dataset.price) - Number(b.dataset.price);
      if (criterion === 'price-high') return Number(b.dataset.price) - Number(a.dataset.price);
      return Number(a.dataset.order) - Number(b.dataset.order);
    });
    sorted.forEach(function (product) { productContainer.appendChild(product); });
  }

  function applyFilters() {
    const prices = normalizePrices();
    const categories = getSelectedCategories();
    const showAll = categories.length === 0 || categories.includes('all');
    let visible = 0;
    products.forEach(function (product) {
      const price = Number(product.dataset.price);
      const categoryMatches = showAll || categories.includes(product.dataset.category);
      const shouldShow = categoryMatches && price >= prices.min && price <= prices.max;
      product.style.display = shouldShow ? '' : 'none';
      if (shouldShow) visible += 1;
    });
    updatePriceSlider();
    if (resultsText) resultsText.textContent = visible === 0 ? 'No results' : 'Showing 1\u2013' + visible + ' of ' + visible + ' results';
    if (noResultsMsg) noResultsMsg.style.display = visible === 0 ? 'block' : 'none';
  }

  if (checkboxList) {
    checkboxList.addEventListener('change', function (event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      const allCheckbox = checkboxList.querySelector('input[data-cat="all"]');
      const categoryCheckboxes = Array.from(checkboxList.querySelectorAll('input[type="checkbox"]:not([data-cat="all"])'));
      if (target.dataset.cat === 'all' && target.checked) {
        categoryCheckboxes.forEach(function (checkbox) { checkbox.checked = false; });
      } else if (target.dataset.cat !== 'all' && target.checked && allCheckbox) {
        allCheckbox.checked = false;
      }
      if (!categoryCheckboxes.some(function (checkbox) { return checkbox.checked; }) && allCheckbox) allCheckbox.checked = true;
      applyFilters();
    });
  }

  if (filterBtn) filterBtn.addEventListener('click', applyFilters);

  minInput.addEventListener('input', function () {
    if (Number(minInput.value) > Number(maxInput.value)) minInput.value = maxInput.value;
    updatePriceSlider();
  });

  maxInput.addEventListener('input', function () {
    if (Number(maxInput.value) < Number(minInput.value)) maxInput.value = minInput.value;
    updatePriceSlider();
  });

  if (sortSelect) sortSelect.addEventListener('change', function () {
    sortProducts();
    applyFilters();
  });

  updatePriceSlider();
  sortProducts();
  applyFilters();
});