chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'CHECK_POSTS') {
    const results = msg.posts.map(p => ({ id: p.id, verdict: 'ok' }));
    // Simulare
    chrome.tabs.sendMessage(sender.tab.id, { type: 'VERDICT', results });
  }
});