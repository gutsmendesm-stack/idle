// Overlay único do Tibia Bot
// - Lista bots/módulos ativos
// - Countdown/status (ex.: Auto Sell)
// - Fila AutoBoss (status por boss)
// - Arrastável (posição salva no storage)
// - SOMENTE em https://baiakidle.com/jogar/

(function () {
  const OVERLAY_ID = 'tibia-bot-active-modules-overlay';
  const LEGACY_AUTO_SELL_ID = 'baiakidle-auto-sell-countdown';
  const POS_STORAGE_KEY = 'tibiaBotOverlayPosition';
  const VISIBLE_STORAGE_KEY = 'tibiaBotOverlayVisible';
  const AUTOBOSS_RUN_KEY = 'baiakIdleAutoBossRun';

  function isBaiakIdlePlayPage() {
    try {
      const host = String(location.hostname || '').toLowerCase();
      if (host !== 'baiakidle.com' && host !== 'www.baiakidle.com') return false;
      const path = String(location.pathname || '');
      return path === '/jogar' || path === '/jogar/' || path.startsWith('/jogar/');
    } catch (_) {
      return false;
    }
  }

  function destroyOverlay() {
    try {
      document.getElementById(OVERLAY_ID)?.remove();
      document.getElementById(LEGACY_AUTO_SELL_ID)?.remove();
    } catch (_) {}
  }

  // Guard absoluto: nunca cria overlay fora da página do jogo
  if (!isBaiakIdlePlayPage()) {
    destroyOverlay();
    return;
  }

  /** @type {{ hasActive: boolean, bots: Record<string, { botLabel: string, modules: string[] }> } | null} */
  let modulesPayload = null;

  /** @type {Record<string, { moduleLabel: string, status: string, remainingMs: number, remainingText: string, running: boolean, botId: string }>} */
  let moduleStatuses = {};

  /** @type {{ running: boolean, queue: Array, index: number, currentId: string, stopAfterCurrent?: boolean } | null} */
  let autoBossRun = null;

  /** @type {{ left: number, top: number } | null} */
  let savedPos = null;
  let dragBound = false;
  let stopBound = false;
  /** Preferência de exibição (só UI; módulos continuam ativos). Default: visível. */
  let overlayVisible = true;

  function removeLegacyOverlays() {
    try {
      document.getElementById(LEGACY_AUTO_SELL_ID)?.remove();
      document.getElementById('tibiabot-autoboss-overlay')?.remove();
    } catch (_) {}
  }

  function clampPosition(left, top, el) {
    const pad = 8;
    const w = el.offsetWidth || 200;
    const h = el.offsetHeight || 80;
    const maxLeft = Math.max(pad, window.innerWidth - w - pad);
    const maxTop = Math.max(pad, window.innerHeight - h - pad);
    return {
      left: Math.min(Math.max(pad, left), maxLeft),
      top: Math.min(Math.max(pad, top), maxTop)
    };
  }

  function applyPosition(el, left, top) {
    const pos = clampPosition(left, top, el);
    el.style.left = pos.left + 'px';
    el.style.top = pos.top + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    return pos;
  }

  async function loadSavedPosition() {
    try {
      const data = await chrome.storage.local.get(POS_STORAGE_KEY);
      const pos = data[POS_STORAGE_KEY];
      if (pos && Number.isFinite(pos.left) && Number.isFinite(pos.top)) {
        savedPos = { left: pos.left, top: pos.top };
      }
    } catch (_) {}
  }

  async function loadOverlayVisible() {
    try {
      const data = await chrome.storage.local.get(VISIBLE_STORAGE_KEY);
      overlayVisible =
        data[VISIBLE_STORAGE_KEY] === undefined ? true : !!data[VISIBLE_STORAGE_KEY];
    } catch (_) {
      overlayVisible = true;
    }
  }

  async function loadAutoBossRun() {
    try {
      const data = await chrome.storage.local.get(AUTOBOSS_RUN_KEY);
      applyAutoBossRun(data[AUTOBOSS_RUN_KEY]);
    } catch (_) {
      autoBossRun = null;
    }
  }

  async function savePosition(left, top) {
    savedPos = { left, top };
    try {
      await chrome.storage.local.set({ [POS_STORAGE_KEY]: savedPos });
    } catch (_) {}
  }

  function bindDrag(el) {
    if (dragBound || !el) return;
    dragBound = true;

    const handle = el.querySelector('[data-role="drag-handle"]') || el;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;

    const onMove = (event) => {
      if (!dragging) return;
      const point = event.touches ? event.touches[0] : event;
      if (!point) return;
      if (event.cancelable) event.preventDefault();

      const nextLeft = originLeft + (point.clientX - startX);
      const nextTop = originTop + (point.clientY - startY);
      applyPosition(el, nextLeft, nextTop);
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      el.style.opacity = '1';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);

      const left = parseFloat(el.style.left) || 16;
      const top = parseFloat(el.style.top) || 16;
      savePosition(left, top);
    };

    const onDown = (event) => {
      const point = event.touches ? event.touches[0] : event;
      if (!point) return;
      if (event.type === 'mousedown' && event.button !== 0) return;
      if (event.target?.closest?.('[data-ab-stop]')) return;

      dragging = true;
      startX = point.clientX;
      startY = point.clientY;
      originLeft = parseFloat(el.style.left) || el.getBoundingClientRect().left;
      originTop = parseFloat(el.style.top) || el.getBoundingClientRect().top;
      el.style.opacity = '0.92';

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    };

    handle.addEventListener('mousedown', onDown);
    handle.addEventListener('touchstart', onDown, { passive: true });
  }

  function bindStop(el) {
    if (stopBound || !el) return;
    stopBound = true;
    el.addEventListener('click', (event) => {
      const btn = event.target?.closest?.('[data-ab-stop]');
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      if (btn.disabled) return;
      try {
        window.postMessage(
          { source: 'TIBIA_BOT_CONTENT', type: 'AUTOBOSS_REQUEST_STOP_AFTER' },
          '*'
        );
      } catch (_) {}
      if (autoBossRun) {
        autoBossRun = { ...autoBossRun, stopAfterCurrent: true };
        render();
      }
    });
  }

  function ensureOverlay() {
    let el = document.getElementById(OVERLAY_ID);
    if (el) {
      bindDrag(el);
      bindStop(el);
      syncBrandFromSidebar(el);
      return el;
    }

    el = document.createElement('div');
    el.id = OVERLAY_ID;
    el.setAttribute('data-tibia-bot', 'overlay');
    el.style.cssText = [
      'position:fixed',
      'top:16px',
      'left:16px',
      'z-index:2147483647',
      'min-width:200px',
      'max-width:320px',
      'padding:12px 14px',
      'border-radius:12px',
      'background:rgba(12,18,25,0.94)',
      'border:1px solid rgba(212,162,76,0.55)',
      'box-shadow:0 12px 28px rgba(0,0,0,0.4)',
      'color:#e8eef6',
      'font:600 12px/1.4 Segoe UI, Tahoma, sans-serif',
      'pointer-events:auto',
      'user-select:none',
      'display:none'
    ].join(';');

    el.innerHTML = [
      '<div data-role="drag-handle" title="Arraste para mover" style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;cursor:grab;">',
      '<div data-role="brand">TibiaBot.Online</div>',
      '<div style="font-size:11px;color:#93a4b8;letter-spacing:.12em;">⋮⋮</div>',
      '</div>',
      '<div data-role="body"></div>'
    ].join('');

    (document.documentElement || document.body).appendChild(el);

    if (savedPos) {
      applyPosition(el, savedPos.left, savedPos.top);
    }

    bindDrag(el);
    bindStop(el);
    syncBrandFromSidebar(el);
    return el;
  }

  let brandSynced = false;

  function syncBrandFromSidebar(overlayEl) {
    if (brandSynced) return;
    const root = overlayEl || document.getElementById(OVERLAY_ID);
    if (!root) return;

    let brand = root.querySelector('[data-role="brand"]');
    if (!brand) {
      const handle = root.querySelector('[data-role="drag-handle"]');
      brand = handle?.firstElementChild || null;
      if (brand) brand.setAttribute('data-role', 'brand');
    }
    if (!brand) return;

    if (brand.textContent !== 'TibiaBot.Online') {
      brand.textContent = 'TibiaBot.Online';
    }

    const source =
      document.querySelector('#panel-tibiabot > h3.tb-brand-title') ||
      document.querySelector('#panel-tibiabot > h3');

    if (source) {
      const cs = getComputedStyle(source);
      brand.style.cssText = [
        'font-family:' + cs.fontFamily,
        'font-size:' + cs.fontSize,
        'font-weight:' + cs.fontWeight,
        'font-style:' + cs.fontStyle,
        'letter-spacing:' + cs.letterSpacing,
        'text-transform:' + cs.textTransform,
        'line-height:' + cs.lineHeight,
        'color:' + cs.color,
        'margin:0',
        'padding:0'
      ].join(';');
      brandSynced = true;
      return;
    }

    brand.style.cssText =
      'font:inherit;font-size:13px;font-weight:700;letter-spacing:normal;text-transform:none;color:#e8eef6;margin:0;padding:0';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function statusSuffix(moduleLabel, botId) {
    const key = Object.keys(moduleStatuses).find((k) => {
      const item = moduleStatuses[k];
      return item && item.botId === botId && item.moduleLabel === moduleLabel;
    });

    if (!key) return '';
    const item = moduleStatuses[key];
    if (!item || item.status === 'stopped') return '';

    if (item.remainingText) {
      return `<span style="margin-left:auto;color:#3dba7a;font-variant-numeric:tabular-nums;">${escapeHtml(item.remainingText)}</span>`;
    }
    if (item.status === 'confirm') {
      return `<span style="margin-left:auto;color:#fbbf24;font-size:11px;">confirmando</span>`;
    }
    if (item.status === 'unlock') {
      return `<span style="margin-left:auto;color:#fbbf24;font-size:11px;">liberando</span>`;
    }
    return '';
  }

  function shortBossName(name) {
    const s = String(name || '').trim();
    if (s.length <= 10) return s;
    return s.slice(0, 10);
  }

  function bossStatusMeta(item, index, runIndex) {
    if (!item) return { label: '', color: '#93a4b8' };
    if (item.status === 'fighting') {
      return { label: 'Executando', color: '#fbbf24' };
    }
    if (item.status === 'done') {
      if (item.outcome === 'death') return { label: 'Morreu', color: '#f87171' };
      if (item.outcome === 'kill') return { label: 'Matou', color: '#86efac' };
      if (item.outcome === 'skipped') return { label: 'Cancelado', color: '#94a3b8' };
      if (item.outcome === 'error') return { label: 'Erro', color: '#f87171' };
      return { label: 'Concluído', color: '#93a4b8' };
    }
    if (index === runIndex) return { label: 'Próximo', color: '#d4a24c' };
    return { label: 'Esperando', color: '#93a4b8' };
  }

  function renderAutoBossHtml() {
    const run = autoBossRun;
    if (!run || !run.running || !Array.isArray(run.queue) || !run.queue.length) {
      return '';
    }

    const total = run.queue.length;
    const done = run.queue.filter((b) => b && b.status === 'done').length;
    const stopAfter = !!run.stopAfterCurrent;
    const rows = run.queue
      .map((item, i) => {
        const meta = bossStatusMeta(item, i, run.index || 0);
        const dot =
          item.status === 'fighting'
            ? '#fbbf24'
            : item.status === 'done'
              ? item.outcome === 'death' || item.outcome === 'error'
                ? '#f87171'
                : item.outcome === 'kill'
                  ? '#3dba7a'
                  : '#64748b'
              : i === (run.index || 0)
                ? '#d4a24c'
                : '#475569';
        return (
          `<div style="display:flex;align-items:center;gap:8px;margin-top:4px;">` +
          `<span style="width:6px;height:6px;border-radius:50%;background:${dot};flex-shrink:0;"></span>` +
          `<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(
            i + 1 + '. ' + shortBossName(item.name || item.id || 'Boss')
          )}</span>` +
          `<span style="margin-left:auto;font-size:11px;color:${meta.color};white-space:nowrap;">${escapeHtml(
            meta.label
          )}</span>` +
          `</div>`
        );
      })
      .join('');

    return (
      `<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(36,48,65,.95);">` +
      `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">` +
      `<div style="font-size:13px;font-weight:700;">AutoBoss</div>` +
      `<div style="display:flex;align-items:center;gap:8px;">` +
      `<span style="font-size:11px;color:#93a4b8;">${done}/${total}</span>` +
      `<button type="button" data-ab-stop ${stopAfter ? 'disabled' : ''} style="` +
      `appearance:none;border:1px solid rgba(248,113,113,.65);background:rgba(185,28,28,.28);` +
      `color:#fecaca;border-radius:6px;height:22px;padding:0 8px;cursor:pointer;` +
      `font:700 11px/1 Segoe UI,Tahoma,sans-serif;opacity:${stopAfter ? '0.6' : '1'};">` +
      (stopAfter ? 'Parando…' : 'Parar') +
      `</button>` +
      `</div></div>` +
      rows +
      (stopAfter
        ? `<div style="margin-top:6px;font-size:11px;color:#9a8b6e;">Finaliza o atual e para a fila</div>`
        : '') +
      `</div>`
    );
  }

  function render() {
    if (!isBaiakIdlePlayPage()) {
      destroyOverlay();
      return;
    }

    removeLegacyOverlays();

    const el = ensureOverlay();
    syncBrandFromSidebar(el);
    const body = el.querySelector('[data-role="body"]');
    if (!body) return;

    const bots = modulesPayload?.bots || {};
    const botIds = Object.keys(bots);
    const hasModules = !!(modulesPayload?.hasActive && botIds.length);

    const hasStatus = Object.values(moduleStatuses).some(
      (s) => s && s.running && s.status !== 'stopped'
    );

    const hasAutoBoss = !!(
      autoBossRun &&
      autoBossRun.running &&
      Array.isArray(autoBossRun.queue) &&
      autoBossRun.queue.length
    );

    if (!hasModules && !hasStatus && !hasAutoBoss) {
      el.style.display = 'none';
      body.innerHTML = '';
      return;
    }

    if (!overlayVisible) {
      el.style.display = 'none';
      return;
    }

    let html = '';

    if (hasModules) {
      html = botIds
        .map((botId) => {
          const bot = bots[botId];
          const modules = (bot.modules || [])
            .map((name) => {
              const extra = statusSuffix(name, botId);
              return (
                `<div style="display:flex;align-items:center;gap:8px;margin-top:4px;">` +
                `<span style="width:6px;height:6px;border-radius:50%;background:#3dba7a;flex-shrink:0;"></span>` +
                `<span>${escapeHtml(name)}</span>` +
                extra +
                `</div>`
              );
            })
            .join('');

          return (
            `<div style="margin-bottom:4px;">` +
            `<div style="font-size:13px;font-weight:700;margin-bottom:2px;">${escapeHtml(bot.botLabel || botId)}</div>` +
            modules +
            `</div>`
          );
        })
        .join('');
    }

    html += renderAutoBossHtml();

    body.innerHTML = html;
    el.style.maxWidth = hasAutoBoss ? '340px' : '300px';
    el.style.display = 'block';

    if (savedPos) {
      applyPosition(el, savedPos.left, savedPos.top);
    }
  }

  function applyModulesPayload(payload) {
    modulesPayload = payload || null;
    render();
  }

  function applyModuleStatus(payload) {
    if (!payload?.moduleId) return;
    const key = `${payload.botId || 'bot'}:${payload.moduleId}`;

    if (payload.status === 'stopped' || payload.running === false) {
      delete moduleStatuses[key];
    } else {
      moduleStatuses[key] = {
        botId: payload.botId || '',
        moduleLabel: payload.moduleLabel || payload.moduleId,
        status: payload.status || 'watching',
        remainingMs: Number(payload.remainingMs) || 0,
        remainingText: payload.remainingText || '',
        running: !!payload.running
      };
    }

    render();
  }

  function applyAutoBossRun(raw) {
    if (!raw || typeof raw !== 'object' || !raw.running) {
      autoBossRun = null;
      render();
      return;
    }
    const queue = Array.isArray(raw.queue)
      ? raw.queue.map((b) => ({
          id: String(b?.id || '').trim(),
          name: String(b?.name || b?.id || '').trim(),
          status: String(b?.status || 'waiting'),
          outcome: b?.outcome || null
        }))
      : [];
    autoBossRun = {
      running: true,
      queue,
      index: Math.max(0, Number(raw.index) || 0),
      currentId: String(raw.currentId || ''),
      stopAfterCurrent: !!raw.stopAfterCurrent
    };
    render();
  }

  async function syncFromBackground() {
    await loadSavedPosition();
    await loadOverlayVisible();
    await loadAutoBossRun();
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'TIBIA_BOT_GET_ACTIVE_MODULES'
      });
      if (response?.success) {
        applyModulesPayload(response.payload);
      } else {
        render();
      }
    } catch (_) {
      render();
    }
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes[VISIBLE_STORAGE_KEY]) {
      overlayVisible =
        changes[VISIBLE_STORAGE_KEY].newValue === undefined
          ? true
          : !!changes[VISIBLE_STORAGE_KEY].newValue;
      render();
    }
    if (changes[AUTOBOSS_RUN_KEY]) {
      applyAutoBossRun(changes[AUTOBOSS_RUN_KEY].newValue);
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (!isBaiakIdlePlayPage()) {
      destroyOverlay();
      return;
    }
    if (message?.type === 'TIBIA_BOT_OVERLAY_UPDATE') {
      applyModulesPayload(message.payload);
    }
  });

  window.addEventListener('message', (event) => {
    if (!isBaiakIdlePlayPage()) {
      destroyOverlay();
      return;
    }
    const data = event?.data;
    if (!data || data.source !== 'TIBIA_BOT_MAIN') return;
    if (data.type === 'MODULE_STATUS') {
      applyModuleStatus(data.payload);
      return;
    }
    if (data.type === 'AUTOBOSS_PROGRESS') {
      applyAutoBossRun(data.payload);
      return;
    }
    if (
      data.type === 'AUTOBOSS_COMPLETED' ||
      data.type === 'AUTOBOSS_STOPPED' ||
      data.type === 'AUTOBOSS_ERROR'
    ) {
      if (data.type === 'AUTOBOSS_STOPPED' && data.payload?.reason === 'reload') return;
      autoBossRun = null;
      render();
    }
  });

  window.addEventListener('resize', () => {
    if (!isBaiakIdlePlayPage()) return;
    const el = document.getElementById(OVERLAY_ID);
    if (!el || el.style.display === 'none') return;
    const left = parseFloat(el.style.left) || 16;
    const top = parseFloat(el.style.top) || 16;
    const pos = applyPosition(el, left, top);
    savePosition(pos.left, pos.top);
  });

  let lastHref = location.href;
  setInterval(() => {
    if (location.href === lastHref) return;
    lastHref = location.href;
    if (!isBaiakIdlePlayPage()) destroyOverlay();
  }, 1000);

  removeLegacyOverlays();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncFromBackground, { once: true });
  } else {
    syncFromBackground();
  }
})();
