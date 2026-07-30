// Content script - avisa o background que a pagina esta pronta
// A injecao dos modulos eh feita pelo background.js via chrome.scripting.executeScript

(function() {
  'use strict';

  function isBaiakIdlePlayPage() {
    try {
      const host = location.hostname.toLowerCase();
      if (host !== 'baiakidle.com' && host !== 'www.baiakidle.com') return false;
      const path = location.pathname;
      return path === '/jogar' || path.startsWith('/jogar/');
    } catch(_) { return false; }
  }

  if (!isBaiakIdlePlayPage()) return;

  // Avisa o background que a pagina esta pronta para injecao
  try {
    chrome.runtime.sendMessage({ type: 'PAGE_READY', url: location.href });
  } catch(_) {}

  // Escuta mudancas de config (toggle via popup) e repassa pro background
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const [key, change] of Object.entries(changes)) {
      if (key.includes('Enabled')) {
        chrome.runtime.sendMessage({
          type: 'MODULE_TOGGLED',
          key: key,
          enabled: !!change.newValue
        });
      }
    }
  });
})();
