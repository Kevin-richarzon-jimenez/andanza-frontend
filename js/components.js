function initWishlistButtons() {
  document.querySelectorAll('.wishlist-btn').forEach((btn) => {
    const svg = btn.querySelector('svg');
    const card = btn.closest('.product-card');

    function applyState(active) {
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-label', active ? 'Quitar de favoritos' : 'Agregar a favoritos');
      if (svg) svg.setAttribute('fill', active ? 'currentColor' : 'none');
    }

    btn.addEventListener('click', () => {
      const active = !btn.classList.contains('active');
      applyState(active);

      const favoritesGrid = card ? card.closest('.favorites-grid') : null;
      if (!active && favoritesGrid) {
        card.style.opacity = '0';
        setTimeout(() => {
          card.remove();
          if (!favoritesGrid.children.length) {
            favoritesGrid.hidden = true;
            const emptyState = document.getElementById('favorites-empty');
            if (emptyState) emptyState.hidden = false;
          }
        }, 200);
      }
    });
  });
}

function initSelectableGroups() {
  // Product page: pick one color/size per group.
  document.querySelectorAll('.product-info .color-options, .product-info .size-options').forEach((group) => {
    const items = group.querySelectorAll('.swatch, .pill');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        items.forEach((other) => other.classList.remove('selected'));
        item.classList.add('selected');
      });
    });
  });

  // Catalog filters: each color/size toggles independently.
  document.querySelectorAll('.catalog-filters .color-options, .catalog-filters .size-options').forEach((group) => {
    group.querySelectorAll('.swatch, .pill').forEach((item) => {
      item.addEventListener('click', () => {
        item.classList.toggle('selected');
      });
    });
  });
}

function initFormFeedback(formId, message, { resetForm = false } = {}) {
  const form = document.getElementById(formId);
  if (!form) return;
  const feedback = form.parentElement.querySelector('.form-feedback');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (feedback) {
      feedback.textContent = message;
      feedback.hidden = false;
    }
    if (resetForm) form.reset();
  });
}

function addToCart(quantity = 1) {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return null;
  const next = Number(badge.textContent) + quantity;
  badge.textContent = next;
  return next;
}

document.addEventListener('DOMContentLoaded', () => {
  initWishlistButtons();
  initSelectableGroups();
});
