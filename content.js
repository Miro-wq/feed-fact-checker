(() => {
  const BATCH_SIZE = 5;
  let queue = [];
  let timer = null;
  let globalId = 0;

  console.log('[FF] content.js loaded');

  function collectPosts() {
    const posts = document.querySelectorAll('div[role="article"]');
    posts.forEach(post => {
      if (post.dataset.ffChecked) return;
      const textNode = post.querySelector('div[dir="auto"]');
      if (!textNode) return;
      const text = textNode.innerText.trim();
      if (!text) return;
      post.dataset.ffChecked = 'pending';
      const id = `p${globalId++}`;
      queue.push({ id, text, element: post });
      console.log('[FF] queued post', id, text.slice(0,30) + '…');
    });
    if (queue.length && !timer) {
      timer = setTimeout(flushQueue, 1000);
    }
  }

  function flushQueue() {
    const batch = queue.splice(0, BATCH_SIZE);
    timer = null;
    const payload = batch.map(item => ({ id: item.id, text: item.text }));
    console.log('[FF] sending batch', payload.map(p=>p.id));
    chrome.runtime.sendMessage(
      { type: 'CHECK_BATCH', posts: payload },
      response => {
        console.log('[FF] received response', response);
        response.forEach((result, i) => {
          const match = batch[i];
          if (!match) return;
          match.element.dataset.ffChecked = result.verdict;
          window.FFinsertBadge(match.element, result.verdict);
        });
      }
    );
    if (queue.length) timer = setTimeout(flushQueue, 1000);
  }

  const observer = new MutationObserver(collectPosts);
  observer.observe(document.body, { childList: true, subtree: true });
  collectPosts();
})();
