function submitAndRedirect(form, label) {
  const btn = form.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = label;
  }
  window.location.href = '/index.html';
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    submitAndRedirect(form, 'Ingresando...');
  });
}

function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');

  confirmPassword.addEventListener('input', () => {
    confirmPassword.setCustomValidity('');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity('Las contraseñas no coinciden');
    } else {
      confirmPassword.setCustomValidity('');
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitAndRedirect(form, 'Creando cuenta...');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initRegisterForm();
  initFormFeedback('forgot-password-form', 'Si el correo existe, te enviaremos un enlace para recuperar tu contraseña.', { resetForm: true });
});
