const TRASH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';

function formatCOP(amount) {
  return '$' + amount.toLocaleString('es-CO');
}

function getCartRows() {
  return document.querySelectorAll('.cart-row');
}

function recalcRow(row) {
  const unitPrice = Number(row.dataset.price);
  const qty = Number(row.querySelector('.quantity-value').textContent);
  row.querySelector('.item-info .price').textContent = formatCOP(unitPrice * qty);
}

function recalcSummary() {
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  let subtotal = 0;

  getCartRows().forEach((row) => {
    const unitPrice = Number(row.dataset.price);
    const qty = Number(row.querySelector('.quantity-value').textContent);
    subtotal += unitPrice * qty;
  });

  if (subtotalEl) subtotalEl.textContent = formatCOP(subtotal);
  if (totalEl) totalEl.textContent = formatCOP(subtotal);
}

function checkEmptyCart() {
  const list = document.querySelector('.cart-list');
  if (!list || getCartRows().length > 0) return;
  list.innerHTML = '<p class="cart-empty">Tu carrito está vacío. <a href="/catalog.html">Ver catálogo</a></p>';
}

function removeCartRow(row) {
  row.style.opacity = '0';
  setTimeout(() => {
    row.remove();
    recalcSummary();
    checkEmptyCart();
  }, 200);
}

function bindCartRow(row) {
  const [decreaseBtn, increaseBtn] = row.querySelectorAll('.quantity-stepper button');
  const qtyEl = row.querySelector('.quantity-value');

  function updateDecreaseButton() {
    const qty = Number(qtyEl.textContent);
    const atMinimum = qty <= 1;
    decreaseBtn.innerHTML = atMinimum ? TRASH_ICON : '−';
    decreaseBtn.classList.toggle('is-remove', atMinimum);
    decreaseBtn.setAttribute('aria-label', atMinimum ? 'Eliminar del carrito' : 'Disminuir cantidad');
  }

  decreaseBtn.addEventListener('click', () => {
    const qty = Number(qtyEl.textContent);
    if (qty <= 1) {
      removeCartRow(row);
      return;
    }
    qtyEl.textContent = qty - 1;
    updateDecreaseButton();
    recalcRow(row);
    recalcSummary();
  });

  increaseBtn.addEventListener('click', () => {
    qtyEl.textContent = Number(qtyEl.textContent) + 1;
    updateDecreaseButton();
    recalcRow(row);
    recalcSummary();
  });

  updateDecreaseButton();
}

function initCart() {
  const rows = getCartRows();
  if (!rows.length) return;
  rows.forEach(bindCartRow);
  recalcSummary();
}

document.addEventListener('DOMContentLoaded', initCart);
