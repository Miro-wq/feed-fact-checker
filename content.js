// Debounce scroll handler
template = (function () {
  let timeout;
  function extractPosts() {
    const posts = [];
    document.querySelectorAll('div[data-testid="post_message"]').forEach(el => {
      const text = el.innerText.trim();
      if (text) posts.push({ id: el.closest('div[role="article"]').getAttribute('data-ft'), text });
    });
    if (posts.length) {
      chrome.runtime.sendMessage({ type: 'CHECK_POSTS', posts });
    }
  }
  window.addEventListener('scroll', () => {
    clearTimeout(timeout);
    timeout = setTimeout(extractPosts, 500);
  });
  // Initial run
  extractPosts();
})();

// Listen pentru verdict si badge
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'VERDICT') {
    msg.results.forEach(({ id, verdict }) => {
      const postEl = document.querySelector(`div[data-ft*="${id}"]`);
      if (postEl && !postEl.querySelector('.feedfact-badge')) {
        const badge = document.createElement('span');
        badge.className = 'feedfact-badge';
        badge.textContent = verdict === 'ok' ? '✅' : '⚠️';
        badge.style.position = 'absolute';
        badge.style.top = '8px'; badge.style.right = '8px';
        postEl.style.position = 'relative';
        postEl.appendChild(badge);
      }
    });
  }
});