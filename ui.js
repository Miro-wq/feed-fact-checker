console.log('[FF] ui.js loaded');
window.FFinsertBadge = (postElement, verdict) => {
  let badge = postElement.querySelector('.ff-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.classList.add('ff-badge');
    postElement.style.position = 'relative';
    postElement.prepend(badge);
  }
  badge.classList.remove('ff-ok', 'ff-maybe', 'ff-fake');
  badge.classList.add(`ff-${verdict}`);
  badge.textContent = verdict === 'ok' ? '✅' : verdict === 'maybe' ? '⚠️' : '❌';
  badge.title = verdict === 'ok'
    ? 'Credibil'
    : verdict === 'maybe'
    ? 'Posibil dezinformare'
    : 'Fals';
};
