// Overlay do BaiakBot - mostra modulos ativos no jogo
// Injetado como content script em baiakidle.com/jogar

(function() {
  'use strict';

  const OVERLAY_ID = 'baiak-bot-overlay';
  const POS_KEY = 'baiakBotOverlayPosition';

  function isBaiakIdlePlayPage() {
    try {
      const host = location.hostname.toLowerCase();
      if (host !== 'baiakidle.com' && host !== 'www.baiakidle.com') return false;
      const path = location.pathname;
      return path === '/jogar' || path.startsWith('/jogar/');
    } catch(_) { return false; }
  }

  if (!isBaiakIdlePlayPage()) return;

  let savedPos = null;
  let dragBound = false;
  let moduleStatuses = {};

  function loadPosition() {
    chrome.storage.local.get(POS_KEY, (data) => {
      const pos = data[POS_KEY];
      if (pos && Number.isFinite(pos.left) && Number.isFinite(pos.top)) {
        savedPos = { left: pos.left, top: pos.top };
        const el = document.getElementById(OVERLAY_ID);
        if (el) applyPosition(el, savedPos.left, savedPos.top);
      }
    });
  }

  function savePosition(left, top) {
    savedPos = { left, top };
    chrome.storage.local.set({ [POS_KEY]: savedPos });
  }

  function applyPosition(el, left, top) {
    const pad = 8;
    const w = el.offsetWidth || 220;
    const h = el.offsetHeight || 80;
    const maxLeft = Math.max(pad, window.innerWidth - w - pad);
    const maxTop = Math.max(pad, window.innerHeight - h - pad);
    el.style.left = Math.min(Math.max(pad, left), maxLeft) + 'px';
    el.style.top = Math.min(Math.max(pad, top), maxTop) + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  }

  function bindDrag(el) {
    if (dragBound) return;
    dragBound = true;

    let dragging = false, startX = 0, startY = 0, originLeft = 0, originTop = 0;

    el.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      originLeft = parseFloat(el.style.left) || el.getBoundingClientRect().left;
      originTop = parseFloat(el.style.top) || el.getBoundingClientRect().top;
      el.style.opacity = '0.92';
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const nextLeft = originLeft + (e.clientX - startX);
      const nextTop = originTop + (e.clientY - startY);
      applyPosition(el, nextLeft, nextTop);
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      el.style.opacity = '1';
      const left = parseFloat(el.style.left) || 16;
      const top = parseFloat(el.style.top) || 16;
      savePosition(left, top);
    });
  }

  function createOverlay() {
    let el = document.getElementById(OVERLAY_ID);
    if (el) return el;

    el = document.createElement('div');
    el.id = OVERLAY_ID;
    el.style.cssText = [
      'position:fixed', 'top:16px', 'left:16px', 'z-index:2147483647',
      'min-width:200px', 'max-width:320px', 'padding:12px 14px',
      'border-radius:12px', 'background:rgba(12,18,25,0.94)',
      'border:1px solid rgba(212,162,76,0.55)',
      'box-shadow:0 12px 28px rgba(0,0,0,0.4)',
      'color:#e8eef6', 'font:600 12px/1.4 "Segoe UI",Tahoma,sans-serif',
      'pointer-events:auto', 'user-select:none', 'display:none'
    ].join(';');

    el.innerHTML = [
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;cursor:grab;">',
      '<div style="font-size:13px;font-weight:700;color:#d4a24c;">BaiakBot</div>',
      '<div style="font-size:11px;color:#93a4b8;letter-spacing:.12em;">&#8942;&#8942;</div>',
      '</div>',
      '<div id="baiak-bot-overlay-body"></div>'
    ].join('');

    (document.body || document.documentElement).appendChild(el);
    bindDrag(el);

    if (savedPos) applyPosition(el, savedPos.left, savedPos.top);
    return el;
  }

  function render() {
    if (!isBaiakIdlePlayPage()) return;

    const el = createOverlay();
    const body = el.querySelector('#baiak-bot-overlay-body');
    if (!body) return;

    chrome.runtime.sendMessage({ type: 'GET_ACTIVE_MODULES' }, (response) => {
      if (chrome.runtime.lastError) return;
      if (!response?.success) return;

      const bots = response.payload?.bots || {};
      const botIds = Object.keys(bots);
      const hasActive = response.payload?.hasActive;

      if (!hasActive || !botIds.length) {
        el.style.display = 'none';
        body.innerHTML = '';
        return;
      }

      let html = '';
      for (const botId of botIds) {
        const bot = bots[botId];
        const modules = (bot.modules || []).map(name => {
          const statusInfo = moduleStatuses[name] || {};
          const extra = statusInfo.remainingText
            ? '<span style="margin-left:auto;color:#3dba7a;font-variant-numeric:tabular-nums;">' + statusInfo.remainingText + '</span>'
            : '';
          return [
            '<div style="display:flex;align-items:center;gap:8px;margin-top:4px;">',
            '<span style="width:6px;height:6px;border-radius:50%;background:#3dba7a;flex-shrink:0;"></span>',
            '<span>' + name + '</span>',
            extra,
            '</div>'
          ].join('');
        }).join('');

        html += '<div style="margin-bottom:4px;">' +
          '<div style="font-size:13px;font-weight:700;margin-bottom:2px;">' + (bot.botLabel || botId) + '</div>' +
          modules + '</div>';
      }

      body.innerHTML = html;
      el.style.display = 'block';
    });
  }

  // Escuta status dos modulos vindo da pagina (postMessage)
  window.addEventListener('message', (event) => {
    const data = event?.data;
    if (!data || data.source !== 'TIBIA_BOT_MAIN') return;
    if (data.type === 'MODULE_STATUS') {
      const p = data.payload || {};
      if (p.moduleLabel) {
        if (p.running && p.status !== 'stopped') {
          moduleStatuses[p.moduleLabel] = {
            status: p.status,
            remainingText: p.remainingText || ''
          };
        } else {
          delete moduleStatuses[p.moduleLabel];
        }
        render();
      }
    }
  });

  // Escuta mudancas no storage (toggle via popup)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    // Qualquer mudanca de modulo, re-renderiza
    for (const key of Object.keys(changes)) {
      if (key.includes('Enabled')) {
        setTimeout(render, 300);
        break;
      }
    }
  });

  // Render periodico
  setInterval(render, 5000);

  // Init
  loadPosition();
  setTimeout(render, 1000);
})();
