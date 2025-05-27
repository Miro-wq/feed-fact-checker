console.log('[FF] background.js loaded');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'CHECK_BATCH' && Array.isArray(msg.posts)) {
    console.log('[FF] background got batch', msg.posts.map(p=>p.id));
    const results = [];
    let pending = msg.posts.length;

    msg.posts.forEach(post => {
      fetchFactCheck(post.text)
        .then(verdict => {
          console.log('[FF] verdict for', post.id, verdict);
          results.push({ id: post.id, verdict });
        })
        .finally(() => {
          pending--;
          if (pending === 0) sendResponse(results);
        });
    });

    return true; // async
  }
});

function fetchFactCheck(text) {
  return new Promise(resolve => {
    setTimeout(() => {
      const r = Math.random();
      resolve(r < 0.7 ? 'ok' : r < 0.9 ? 'maybe' : 'fake');
    }, 1000 + Math.random() * 500);
  });
}
