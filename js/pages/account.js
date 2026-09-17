function initLogout() {
  document.querySelectorAll('.account-menu .logout').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = '/auth/login.html';
    });
  });
}

function checkEmptyList(listId, emptyId) {
  const list = document.getElementById(listId);
  const emptyState = document.getElementById(emptyId);
  if (!list || !emptyState) return;
  const isEmpty = list.children.length === 0;
  list.hidden = isEmpty;
  emptyState.hidden = !isEmpty;
}

function initRemovableAddresses() {
  document.querySelectorAll('.address-card').forEach((card) => {
    const removeBtn = card.querySelector('[data-action="delete"]');
    if (!removeBtn) return;
    removeBtn.addEventListener('click', () => {
      card.style.opacity = '0';
      setTimeout(() => {
        card.remove();
        checkEmptyList('addresses-list', 'addresses-empty');
      }, 200);
    });
  });
}

function bindCommentRow(row) {
  const deleteBtn = row.querySelector('[aria-label="Eliminar comentario"]');
  const editBtn = row.querySelector('[aria-label="Editar comentario"]');

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      row.style.opacity = '0';
      setTimeout(() => {
        row.remove();
        checkEmptyList('comments-list', 'comments-empty');
      }, 200);
    });
  }

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const textEl = row.querySelector('.comment-text');
      const actionsEl = row.querySelector('.comment-actions');
      if (!textEl || !actionsEl) return;

      const originalText = textEl.textContent;
      const originalActionsHTML = actionsEl.innerHTML;

      const textarea = document.createElement('textarea');
      textarea.className = 'comment-edit-textarea';
      textarea.value = originalText;
      textEl.replaceWith(textarea);
      textarea.focus();

      actionsEl.innerHTML = '';
      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'btn btn-fill btn-small';
      saveBtn.textContent = 'Guardar';
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-outline btn-small';
      cancelBtn.textContent = 'Cancelar';
      actionsEl.append(saveBtn, cancelBtn);

      function finishEdit(newText) {
        const p = document.createElement('p');
        p.className = 'comment-text';
        p.textContent = newText;
        textarea.replaceWith(p);
        actionsEl.innerHTML = originalActionsHTML;
        bindCommentRow(row);
      }

      saveBtn.addEventListener('click', () => finishEdit(textarea.value.trim() || originalText));
      cancelBtn.addEventListener('click', () => finishEdit(originalText));
    });
  }
}

function initComments() {
  document.querySelectorAll('.comment-row').forEach(bindCommentRow);
}

document.addEventListener('DOMContentLoaded', () => {
  initLogout();
  initRemovableAddresses();
  initComments();
  initFormFeedback('profile-form', '¡Datos guardados!');
  initFormFeedback('address-form', '¡Dirección guardada!');
  initFormFeedback('change-password-form', '¡Contraseña actualizada!', { resetForm: true });
  checkEmptyList('orders-list', 'orders-empty');
});
