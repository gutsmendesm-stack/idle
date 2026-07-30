/**
 * Ponte site (tibiabot.online) ↔ extensão.
 * A página dispara CustomEvent / postMessage; a extensão revalida a sessão.
 */
(function () {
  function notify(reason) {
    try {
      chrome.runtime.sendMessage({ type: 'TIBIA_BOT_AUTH_SYNC', reason: reason || 'site' });
    } catch (_) {}
  }

  window.addEventListener('tibiabot:auth', function (ev) {
    const detail = ev && ev.detail ? ev.detail : {};
    notify(detail.reason || detail.state || 'event');
  });

  window.addEventListener('message', function (ev) {
    if (!ev || !ev.data || ev.data.source !== 'tibiabot-site') return;
    if (ev.data.type === 'TIBIA_BOT_AUTH') {
      notify(ev.data.reason || ev.data.state || 'postMessage');
    }
  });

  // Ao abrir/navegar no site, sincroniza
  notify('page_load');
})();
