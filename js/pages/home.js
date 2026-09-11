function initOverlayHeader() {
  const header = document.querySelector('.site-header--overlay');
  const topbar = document.querySelector('.topbar');
  if (!header) return;
  const topbarHeight = topbar ? topbar.offsetHeight : 0;
  let ticking = false;

  function applyScrollState() {
    const scrollTop = window.scrollY;
    if (scrollTop > topbarHeight) {
      header.classList.add('is-pinned');
      header.style.top = '0px';
    } else {
      header.classList.remove('is-pinned');
      header.style.top = (topbarHeight - scrollTop) + 'px';
    }
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyScrollState);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  applyScrollState();
}

document.addEventListener('DOMContentLoaded', () => {
  initFormFeedback('newsletter-form', '¡Listo! Revisa tu correo para confirmar la suscripción.', { resetForm: true });
  initOverlayHeader();
});
