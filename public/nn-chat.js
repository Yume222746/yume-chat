'use-strict';
window.addEventListener('load', () => {
  window.scrollTo(0, document.body.scrollHeight)
});

const formElement = document.forms['message-form'];
const textareaElement = formElement.elements['content']
textareaElement.addEventListener('keydown', (event) => {
  if (isPressedSubmitKey(event)) {
    event.preventDefault();
    formElement.submit();
  }
});

function isPressedSubmitKey(event) {
  if (event.key !== 'Enter') {
    return false;
  }
  if (event.ctrlKey) {
    return true;
  }
  if (event.metaKey) {
    return true;
  }
}

// ツールチップの有効化
const tooltipTriggerElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltipTriggerElements.forEach((tooltipTriggerElement) => {
  new bootstrap.Tooltip(tooltipTriggerElement);
});