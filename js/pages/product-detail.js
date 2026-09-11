function initProductTabs() {
  const tabs = document.querySelectorAll('.product-tabs button');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      if (target === 'reviews') {
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      tabs.forEach((other) => other.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.hidden = panel.dataset.tabPanel !== target;
      });
    });
  });
}

function initFavoriteToggle() {
  const btn = document.querySelector('.favorite-toggle');
  if (!btn) return;
  const label = btn.querySelector('.favorite-label');

  btn.addEventListener('click', () => {
    const active = !btn.classList.contains('active');
    btn.classList.toggle('active', active);
    if (label) label.textContent = active ? 'En favoritos' : 'Agregar a favoritos';
  });
}

function initAddToCart() {
  const btn = document.querySelector('.add-to-cart');
  if (!btn) return;

  btn.addEventListener('click', () => {
    addToCart(1);
    const originalText = btn.textContent;
    btn.textContent = 'Agregado ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1200);
  });
}

function initReviewForm() {
  const toggleBtn = document.getElementById('toggle-review-form');
  const form = document.getElementById('review-form');
  const cancelBtn = document.getElementById('cancel-review');
  const starPicker = document.getElementById('review-star-picker');
  const textarea = document.getElementById('review-text');
  const reviewList = document.getElementById('review-list');
  if (!toggleBtn || !form || !starPicker || !textarea || !reviewList) return;

  let rating = 5;

  function renderStars() {
    starPicker.querySelectorAll('button').forEach((btn) => {
      btn.classList.toggle('selected', Number(btn.dataset.value) <= rating);
    });
  }
  renderStars();

  starPicker.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      rating = Number(btn.dataset.value);
      renderStars();
    });
  });

  function showForm() {
    form.hidden = false;
    toggleBtn.hidden = true;
    textarea.focus();
  }

  function hideForm() {
    form.hidden = true;
    toggleBtn.hidden = false;
    form.reset();
    rating = 5;
    renderStars();
  }

  toggleBtn.addEventListener('click', showForm);
  cancelBtn.addEventListener('click', hideForm);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!textarea.value.trim()) {
      textarea.reportValidity();
      return;
    }

    const starsMarkup = Array.from({ length: 5 }, (_, i) => {
      const cls = i < rating ? 'star-icon' : 'star-icon empty';
      return `<svg class="${cls}" aria-hidden="true"><use href="#icon-star"></use></svg>`;
    }).join('');

    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const today = new Date();
    const dateLabel = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const row = document.createElement('div');
    row.className = 'comment-row';
    row.innerHTML = `
      <div class="comment-top"><span class="comment-author">Juan Pérez</span><span class="comment-stars" aria-label="${rating} de 5 estrellas">${starsMarkup}</span></div>
      <p class="comment-text"></p>
      <div class="comment-date">${dateLabel}</div>
    `;
    row.querySelector('.comment-text').textContent = textarea.value.trim();

    reviewList.prepend(row);
    hideForm();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initProductTabs();
  initFavoriteToggle();
  initAddToCart();
  initReviewForm();
});
