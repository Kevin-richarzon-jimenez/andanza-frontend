function initCatalogSearch() {
  const cards = document.querySelectorAll('.catalog-grid .product-card');
  const input = document.querySelector('.site-search input');
  const countLabel = document.getElementById('result-count');
  if (!cards.length || !input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const name = card.querySelector('.name').textContent.toLowerCase();
      const match = name.includes(query);
      card.hidden = !match;
      if (match) visible += 1;
    });

    if (countLabel) {
      countLabel.textContent = `${visible} producto${visible === 1 ? '' : 's'} encontrado${visible === 1 ? '' : 's'}`;
    }
  });
}

function initClearFilters() {
  const btn = document.querySelector('.clear-filters');
  const filters = document.querySelector('.catalog-filters');
  if (!btn || !filters) return;

  btn.addEventListener('click', () => {
    filters.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
    filters.querySelectorAll('.swatch.selected, .pill.selected').forEach((el) => {
      el.classList.remove('selected');
    });
    const range = filters.querySelector('input[type="range"]');
    if (range) range.value = range.max || 100;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCatalogSearch();
  initClearFilters();
});
