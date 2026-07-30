// Content script — só na página do jogo.
// Avisa o background quando a página fica pronta.
// Sincroniza hunt ativa + tiers do Mover Itens + config Stamina (chrome.storage → MAIN world).
// Observa conclusão de boss: "X derrotado!" (kill);
// morte: "Você caiu para…" / "Exp acumulada perdida" → marca o último Enfrentar.

(function () {
  const SELECTED_HUNT_KEY = 'baiakIdleSelectedHunt';
  const MOVER_TIERS_KEY = 'baiakIdleMoverItensTiers';
  const STAMINA_CONFIG_KEY = 'baiakIdleStaminaConfig';
  const AUTO_SELL_CONFIG_KEY = 'baiakIdleAutoSellConfig';
  const AUTO_ANUNCIO_CONFIG_KEY = 'baiakIdleAutoAnuncioConfig';
  const BOSS_TRACK_KEY = 'baiakIdleBossTrack';
  const AUTOBOSS_RUN_KEY = 'baiakIdleAutoBossRun';
  const CHARACTERS_KEY = 'baiakIdleCharacters';
  const BOSS_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const DEFEAT_RE = /^(.+?)\s+derrotado!?$/i;
  const EXP_LOST_RE = /exp\s+acumulada\s+perdida/i;
  const FELL_TO_RE = /voc[eê]\s+caiu\s+para/i;
  const ATTR_ORIGINAL_NAME = 'data-tb-original-name';
  const NAME_REPLACEMENT = 'TibiaBot.Online';
  const VOCATIONS = [
    'Elder Druid',
    'Master Sorcerer',
    'Royal Paladin',
    'Elite Knight',
    'Exalted Monk',
    'Druid',
    'Sorcerer',
    'Paladin',
    'Knight',
    'Monk'
  ];

  /** Evita marcar o mesmo evento várias vezes seguidas. */
  let lastOutcomeKey = '';
  let lastOutcomeAt = 0;
  let lastCharactersSaveKey = '';
  let lastCharactersSaveAt = 0;

  function normalizeCharKey(name) {
    return String(name || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function parseClassAndName(raw) {
    const text = String(raw || '')
      .trim()
      .replace(/\s+/g, ' ');
    if (!text || text === NAME_REPLACEMENT) return null;
    for (const vocation of VOCATIONS) {
      if (text === vocation) return { className: vocation, name: '' };
      const prefix = vocation + ' ';
      if (
        text.length > prefix.length &&
        text.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase()
      ) {
        return { className: vocation, name: text.slice(prefix.length).trim() };
      }
    }
    return { className: '', name: text };
  }

  function parseLevelValue(value) {
    const s = String(value || '').trim();
    if (!s) return 0;
    const labeled = s.match(/(?:^|[^\w])(?:lv\.?|lvl|level)\s*[:.]?\s*(\d{1,5})(?:\b|$)/i);
    if (labeled) {
      const n = parseInt(labeled[1], 10);
      return Number.isFinite(n) && n > 0 && n < 100000 ? n : 0;
    }
    if (/\d+\s*\/\s*\d+/.test(s)) return 0;
    if (/^\d{1,5}$/.test(s)) {
      const n = parseInt(s, 10);
      return n > 0 ? n : 0;
    }
    if (s.length <= 12) {
      const digits = (s.match(/\d/g) || []).join('');
      const m = s.match(/(\d{1,5})/);
      if (m && digits === m[1]) {
        const n = parseInt(m[1], 10);
        return Number.isFinite(n) && n > 0 && n < 100000 ? n : 0;
      }
    }
    return 0;
  }

  function preferLevel(prev, next) {
    const a = Math.max(0, Number(prev) || 0);
    const b = Math.max(0, Number(next) || 0);
    if (!a) return b;
    if (!b) return a;
    const as = String(a);
    const bs = String(b);
    if (as.startsWith(bs) && as.length > bs.length) return b;
    if (bs.startsWith(as) && bs.length > as.length) return a;
    return b;
  }

  function readLevelNear(nameEl) {
    if (!nameEl) return 0;
    const member = nameEl.closest?.('.member') || null;
    if (member) {
      const lvlEl = member.querySelector('.m-lvl, .m-level, [data-level], [data-lvl]');
      if (lvlEl) {
        const n = parseLevelValue(
          lvlEl.getAttribute('data-level') ||
            lvlEl.getAttribute('data-lvl') ||
            lvlEl.textContent
        );
        if (n) return n;
      }
      const dataLvl =
        member.getAttribute('data-level') ||
        member.getAttribute('data-lvl') ||
        member.dataset?.level ||
        member.dataset?.lvl;
      const fromData = parseLevelValue(dataLvl);
      if (fromData) return fromData;

      const candidates = member.querySelectorAll('span, b, strong, small, em, i, div');
      for (const el of candidates) {
        if (el === nameEl || nameEl.contains?.(el)) continue;
        const t = String(el.textContent || '').trim();
        if (!t || t.length > 16) continue;
        if (!/(?:lv\.?|lvl|level|\d)/i.test(t)) continue;
        if (/\d+\s*\/\s*\d+/.test(t)) continue;
        const n = parseLevelValue(t);
        if (n) return n;
      }
    }
    if (nameEl.id === 'hud-nick' || nameEl.classList?.contains('hud-nick')) {
      const hudLvl = document.querySelector('#hud-level, #hud-lvl, .hud-level, .hud-lvl');
      const n = parseLevelValue(hudLvl?.textContent);
      if (n) return n;
    }
    return 0;
  }

  function readRawName(el) {
    if (!el) return '';
    const saved = String(el.getAttribute(ATTR_ORIGINAL_NAME) || '').trim();
    if (saved && saved !== NAME_REPLACEMENT) return saved;
    const current = String(el.textContent || '').trim();
    if (current && current !== NAME_REPLACEMENT) return current;
    return '';
  }

  function collectNameNodes() {
    const out = [];
    const seen = new Set();
    const push = (el) => {
      if (!el || seen.has(el)) return;
      seen.add(el);
      out.push(el);
    };
    const party =
      document.querySelector('#party-list') ||
      document.querySelector('.party') ||
      null;
    if (party) {
      party.querySelectorAll('.m-name').forEach(push);
    }
    if (!out.length) {
      document.querySelectorAll('#party-list .m-name, .party .m-name').forEach(push);
    }
    push(document.getElementById('hud-nick') || document.querySelector('.hud-nick'));
    document.querySelectorAll('[' + ATTR_ORIGINAL_NAME + ']').forEach(push);
    return out;
  }

  function parseMemberMeta(raw) {
    const text = String(raw || '')
      .trim()
      .replace(/\s+/g, ' ');
    if (!text || text === '— · lvl —' || text === NAME_REPLACEMENT) return null;
    const m = text.match(/^(.+?)\s*·\s*lvl\s*(\d{1,5})\b/i);
    if (!m) return null;
    return {
      className: String(m[1] || '').trim(),
      level: parseLevelValue(m[2])
    };
  }

  function scrapeCharactersFromDom() {
    const byKey = new Map();
    const ATTR_META = 'data-tb-original-meta';

    const upsert = (rawName, className, level) => {
      const parsed = parseClassAndName(rawName);
      if (!parsed || !parsed.name) return;
      const key = normalizeCharKey(parsed.name);
      if (!key) return;
      const prev = byKey.get(key) || { name: parsed.name, className: '', level: 0 };
      byKey.set(key, {
        name: parsed.name || prev.name,
        className: className || parsed.className || prev.className || '',
        level: preferLevel(prev.level, level)
      });
    };

    const members = document.querySelectorAll('#party-list .member, .party .member');
    if (members.length) {
      members.forEach((member) => {
        const nameEl = member.querySelector('.m-name');
        const raw = readRawName(nameEl);
        const metaEl = member.querySelector('.m-meta');
        let metaRaw = '';
        if (metaEl) {
          const saved = String(metaEl.getAttribute(ATTR_META) || '').trim();
          metaRaw = saved || String(metaEl.textContent || '').trim();
        }
        const meta = parseMemberMeta(metaRaw);
        upsert(raw, meta?.className || '', meta?.level || readLevelNear(nameEl));
      });
    } else {
      for (const el of collectNameNodes()) {
        const raw = readRawName(el);
        const parsed = parseClassAndName(raw);
        if (!parsed || !parsed.name) continue;
        upsert(raw, parsed.className || '', readLevelNear(el));
      }
    }

    return Array.from(byKey.values());
  }

  function normalizeCharactersList(list) {
    const byKey = new Map();
    for (const row of Array.isArray(list) ? list : []) {
      if (!row || typeof row !== 'object') continue;
      const name = String(row.name || '').trim();
      if (!name || name === NAME_REPLACEMENT) continue;
      const key = normalizeCharKey(name);
      if (!key) continue;
      const className = String(row.className || row.class || row.vocation || '').trim();
      // level numérico puro (já salvo) — não reparseia como texto composto
      let level = 0;
      if (Number.isFinite(Number(row.level))) {
        const n = Math.round(Number(row.level));
        if (n > 0 && n < 100000) level = n;
      } else {
        level = parseLevelValue(row.level);
      }
      const prev = byKey.get(key);
      byKey.set(key, {
        key,
        name,
        className: className || prev?.className || '',
        level: preferLevel(prev?.level, level),
        updatedAt: Number(row.updatedAt) || Date.now()
      });
    }
    return Array.from(byKey.values()).sort((a, b) =>
      String(a.name).localeCompare(String(b.name), 'pt-BR')
    );
  }

  async function mergeAndStoreCharacters(incoming, reason) {
    const list = normalizeCharactersList(incoming);
    if (!list.length) return null;
    const saveKey = list
      .map((c) => c.key + '|' + c.className + '|' + c.level)
      .join(';');
    const now = Date.now();
    if (saveKey === lastCharactersSaveKey && now - lastCharactersSaveAt < 1500) {
      return null;
    }
    try {
      const data = await chrome.storage.local.get(CHARACTERS_KEY);
      const prevList = normalizeCharactersList(data[CHARACTERS_KEY]?.list || []);
      const byKey = new Map(prevList.map((c) => [c.key, c]));
      for (const row of list) {
        const prev = byKey.get(row.key);
        byKey.set(row.key, {
          key: row.key,
          name: row.name,
          className: row.className || prev?.className || '',
          level: preferLevel(prev?.level, row.level),
          updatedAt: now
        });
      }
      const nextList = Array.from(byKey.values()).sort((a, b) =>
        String(a.name).localeCompare(String(b.name), 'pt-BR')
      );
      const payload = {
        list: nextList,
        updatedAt: now,
        reason: String(reason || '')
      };
      await chrome.storage.local.set({ [CHARACTERS_KEY]: payload });
      lastCharactersSaveKey = saveKey;
      lastCharactersSaveAt = now;
      return payload;
    } catch (_) {
      return null;
    }
  }

  async function captureAndStoreCharacters(reason) {
    return mergeAndStoreCharacters(scrapeCharactersFromDom(), reason || 'capture');
  }

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

  function cleanupIfLeftPlayPage() {
    if (isBaiakIdlePlayPage()) return;
    try {
      document.getElementById('tibia-bot-active-modules-overlay')?.remove();
      document.getElementById('baiakidle-auto-sell-countdown')?.remove();
    } catch (_) {}
  }

  function pushToPage(assignmentJs) {
    try {
      // MV3/CSP: inline script.textContent é bloqueado — usa blob URL.
      const blob = new Blob([String(assignmentJs || '')], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        try {
          URL.revokeObjectURL(url);
        } catch (_) {}
        try {
          script.remove();
        } catch (_) {}
      };
      script.onerror = () => {
        try {
          URL.revokeObjectURL(url);
        } catch (_) {}
      };
      (document.documentElement || document.head).appendChild(script);
    } catch (_) {}
  }

  function pushSelectedHuntToPage(hunt) {
    const payload = hunt && typeof hunt === 'object' ? hunt : null;
    pushToPage('window.__baiakIdleSelectedHunt=' + JSON.stringify(payload) + ';');
  }

  function pushMoverTiersToPage(tiers) {
    const payload =
      tiers && typeof tiers === 'object'
        ? tiers
        : { 0: false, 1: false, 2: false, 3: false, 4: false };
    pushToPage('window.__baiakIdleMoverItensTiers=' + JSON.stringify(payload) + ';');
  }

  function pushStaminaConfigToPage(cfg) {
    const payload =
      cfg && typeof cfg === 'object'
        ? cfg
        : { minPct: 15, maxPct: 30 };
    pushToPage('window.__baiakIdleStaminaConfig=' + JSON.stringify(payload) + ';');
  }

  function pushAutoSellConfigToPage(cfg) {
    const payload =
      cfg && typeof cfg === 'object' && Number.isFinite(Number(cfg.minPct))
        ? { minPct: Math.max(1, Math.min(100, Math.round(Number(cfg.minPct)))) }
        : { minPct: 70 };
    pushToPage('window.__baiakIdleAutoSellConfig=' + JSON.stringify(payload) + ';');
  }

  function pushAutoAnuncioConfigToPage(cfg) {
    const channels = ['geral', 'comunicados', 'help', 'market'];
    let channel = 'geral';
    let text = '';
    let intervalMin = 5;
    if (cfg && typeof cfg === 'object') {
      const ch = String(cfg.channel || '').trim().toLowerCase();
      if (channels.includes(ch)) channel = ch;
      text = String(cfg.text || '').trim().slice(0, 200);
      const n = Number(cfg.intervalMin);
      if (Number.isFinite(n)) intervalMin = Math.max(1, Math.min(120, Math.round(n)));
    }
    pushToPage(
      'window.__baiakIdleAutoAnuncioConfig=' +
        JSON.stringify({ channel, text, intervalMin }) +
        ';'
    );
  }

  function normalizeBossName(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function cleanToastText(text) {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function extractDefeatBossName(text) {
    const cleaned = cleanToastText(text);
    if (!cleaned || cleaned.length > 100) return '';
    const match = cleaned.match(DEFEAT_RE);
    return match ? String(match[1] || '').trim() : '';
  }

  function isBossDeathMessage(text) {
    const cleaned = cleanToastText(text);
    if (!cleaned || cleaned.length > 120) return false;
    return EXP_LOST_RE.test(cleaned) || FELL_TO_RE.test(cleaned);
  }

  function pruneBossTrackMap(map) {
    const now = Date.now();
    const next = {};
    const src = map && typeof map === 'object' ? map : {};
    for (const [id, row] of Object.entries(src)) {
      if (!row || typeof row !== 'object') continue;
      const expiresAt = Number(row.expiresAt) || 0;
      if (expiresAt && expiresAt <= now) continue;
      next[id] = row;
    }
    return next;
  }

  function isTrackFinished(row) {
    return !!(row && (row.finished || row.killed || row.died));
  }

  /**
   * @param {'kill'|'death'} outcome
   * @param {string} [bossName] só no kill ("X derrotado!"); morte usa sempre o pending
   */
  async function markBossFinished(outcome, bossName) {
    const kind = outcome === 'death' ? 'death' : 'kill';
    const name = String(bossName || '').trim();

    const dedupe =
      kind +
      '|' +
      normalizeBossName(name || 'pending') +
      '|' +
      Math.floor(Date.now() / 2000);
    if (dedupe === lastOutcomeKey && Date.now() - lastOutcomeAt < 4000) return;
    lastOutcomeKey = dedupe;
    lastOutcomeAt = Date.now();

    const data = await chrome.storage.local.get(BOSS_TRACK_KEY);
    const raw = data[BOSS_TRACK_KEY] || {};
    const byId = pruneBossTrackMap(raw.byId || {});
    const pendingId = raw.pendingId || null;
    const pendingName = String(raw.pendingName || '').trim();
    const now = Date.now();

    let targetId = null;

    if (kind === 'death') {
      // Morte: sempre o último boss iniciado (Enfrentar), ignora nome do toast.
      if (!pendingId || !byId[pendingId]) return;
      if (isTrackFinished(byId[pendingId])) {
        await chrome.storage.local.set({
          [BOSS_TRACK_KEY]: { byId, pendingId: null, pendingName: '' }
        });
        return;
      }
      targetId = pendingId;
    } else {
      const want = normalizeBossName(name);
      if (!want) return;

      if (pendingId && byId[pendingId]) {
        const pendingOk =
          !pendingName ||
          normalizeBossName(pendingName) === want ||
          normalizeBossName(byId[pendingId].name) === want;
        if (pendingOk) targetId = pendingId;
      }

      if (!targetId) {
        for (const [id, row] of Object.entries(byId)) {
          if (normalizeBossName(row.name) === want) {
            targetId = id;
            break;
          }
        }
      }

      if (!targetId) {
        targetId = want.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'boss';
        byId[targetId] = {
          id: targetId,
          name,
          startedAt: now,
          expiresAt: now + BOSS_COOLDOWN_MS,
          finished: false,
          killed: false,
          died: false,
          outcome: null,
          finishedAt: null
        };
      }
    }

    if (!targetId || !byId[targetId]) return;
    if (isTrackFinished(byId[targetId])) {
      await chrome.storage.local.set({
        [BOSS_TRACK_KEY]: { byId, pendingId: null, pendingName: '' }
      });
      return;
    }

    const prev = byId[targetId] || {};
    byId[targetId] = {
      ...prev,
      id: targetId,
      name: prev.name || name || pendingName || targetId,
      startedAt: prev.startedAt || now,
      expiresAt: prev.expiresAt || now + BOSS_COOLDOWN_MS,
      finished: true,
      finishedAt: now,
      outcome: kind,
      killed: kind === 'kill',
      died: kind === 'death',
      killedAt: kind === 'kill' ? now : prev.killedAt || null,
      diedAt: kind === 'death' ? now : prev.diedAt || null
    };

    await chrome.storage.local.set({
      [BOSS_TRACK_KEY]: {
        byId,
        pendingId: null,
        pendingName: ''
      }
    });
  }

  function scanTextForBossOutcome(text) {
    const cleaned = cleanToastText(text);
    if (!cleaned) return;

    if (isBossDeathMessage(cleaned)) {
      void markBossFinished('death');
      return;
    }

    const bossName = extractDefeatBossName(cleaned);
    if (bossName) void markBossFinished('kill', bossName);
  }

  function scanNodeForBossOutcome(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      scanTextForBossOutcome(node.textContent);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const text = cleanToastText(node.textContent);
    if (text && text.length <= 120) {
      scanTextForBossOutcome(text);
      return;
    }

    const kids = node.childNodes || [];
    for (const child of kids) {
      if (child.nodeType === Node.TEXT_NODE) {
        scanTextForBossOutcome(child.textContent);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childText = cleanToastText(child.textContent);
        if (childText && childText.length <= 120) {
          scanTextForBossOutcome(childText);
        }
      }
    }
  }

  function startBossOutcomeWatcher() {
    const root = document.body || document.documentElement;
    if (!root) return;

    const observer = new MutationObserver((mutations) => {
      for (const mut of mutations) {
        if (mut.type === 'childList') {
          mut.addedNodes.forEach((n) => scanNodeForBossOutcome(n));
        } else if (mut.type === 'characterData') {
          scanNodeForBossOutcome(mut.target);
        }
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  async function markBossConfrontStarted(bossId, bossName) {
    const id = String(bossId || '').trim();
    const name = String(bossName || '').trim();
    if (!id || !name) return;
    const now = Date.now();
    const data = await chrome.storage.local.get(BOSS_TRACK_KEY);
    const raw = data[BOSS_TRACK_KEY] || {};
    const byId = pruneBossTrackMap(raw.byId || {});
    const prev = byId[id] || {};
    byId[id] = {
      ...prev,
      id,
      name,
      startedAt: now,
      expiresAt: now + BOSS_COOLDOWN_MS,
      finished: false,
      finishedAt: null,
      outcome: null,
      killed: false,
      died: false,
      killedAt: null,
      diedAt: null
    };
    await chrome.storage.local.set({
      [BOSS_TRACK_KEY]: {
        byId,
        pendingId: id,
        pendingName: name
      }
    });
    void captureAndStoreCharacters('boss');
  }

  function startAutoBossBridge() {
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || data.source !== 'TIBIA_BOT_MAIN') return;

      if (data.type === 'AUTOBOSS_BOSS_STARTED') {
        const p = data.payload || {};
        void markBossConfrontStarted(p.bossId, p.bossName);
        return;
      }

      if (data.type === 'CHARACTERS_SNAPSHOT') {
        const chars = data.payload?.characters;
        if (Array.isArray(chars) && chars.length) {
          void mergeAndStoreCharacters(chars, data.payload?.reason || 'snapshot');
        } else {
          void captureAndStoreCharacters(data.payload?.reason || 'snapshot');
        }
        return;
      }

      if (data.type === 'AUTOBOSS_BOSS_FINISHED') {
        const p = data.payload || {};
        const outcome = String(p.outcome || '');
        if (outcome === 'kill' || outcome === 'death') {
          void markBossFinished(outcome, p.bossName || '');
          return;
        }
        // skipped/error: limpa pending sem aplicar cooldown de 24h
        void (async () => {
          try {
            const stored = await chrome.storage.local.get(BOSS_TRACK_KEY);
            const raw = stored[BOSS_TRACK_KEY] || {};
            const byId = pruneBossTrackMap(raw.byId || {});
            await chrome.storage.local.set({
              [BOSS_TRACK_KEY]: { byId, pendingId: null, pendingName: '' }
            });
          } catch (_) {}
        })();
        return;
      }

      if (data.type === 'AUTOBOSS_PROGRESS') {
        const p = data.payload || {};
        void chrome.storage.local.set({
          [AUTOBOSS_RUN_KEY]: {
            running: !!p.running,
            queue: Array.isArray(p.queue) ? p.queue : [],
            index: Number(p.index) || 0,
            currentId: String(p.currentId || ''),
            stopAfterCurrent: !!p.stopAfterCurrent
          }
        });
        return;
      }

      if (data.type === 'AUTOBOSS_COMPLETED' || data.type === 'AUTOBOSS_STOPPED') {
        const reason = String(data.payload?.reason || '');
        // Reinjeção do bundle não deve zerar a fila/overlay.
        if (data.type === 'AUTOBOSS_STOPPED' && reason === 'reload') return;
        void chrome.storage.local.set({
          [AUTOBOSS_RUN_KEY]: { running: false },
          baiakIdleAutoBossEnabled: false
        });
        return;
      }

      if (data.type === 'AUTOBOSS_ERROR') {
        const msg = String(data.payload?.message || 'Erro no AutoBoss');
        void chrome.storage.local.set({
          [AUTOBOSS_RUN_KEY]: { running: false, lastError: msg },
          baiakIdleAutoBossEnabled: false
        });
      }
    });
  }

  async function syncFromStorage() {
    try {
      const data = await chrome.storage.local.get([
        SELECTED_HUNT_KEY,
        MOVER_TIERS_KEY,
        STAMINA_CONFIG_KEY,
        AUTO_SELL_CONFIG_KEY,
        AUTO_ANUNCIO_CONFIG_KEY
      ]);
      pushSelectedHuntToPage(data[SELECTED_HUNT_KEY] || null);
      pushMoverTiersToPage(data[MOVER_TIERS_KEY] || null);
      pushStaminaConfigToPage(data[STAMINA_CONFIG_KEY] || null);
      pushAutoSellConfigToPage(data[AUTO_SELL_CONFIG_KEY] || null);
      pushAutoAnuncioConfigToPage(data[AUTO_ANUNCIO_CONFIG_KEY] || null);
    } catch (_) {}
  }

  if (!isBaiakIdlePlayPage()) {
    cleanupIfLeftPlayPage();
    return;
  }

  try {
    chrome.runtime.sendMessage({
      type: 'TIBIA_BOT_PAGE_READY',
      url: location.href
    });
  } catch (_) {
    // Extensão recarregada / contexto inválido
  }

  void syncFromStorage();
  startBossOutcomeWatcher();
  startAutoBossBridge();

  window.addEventListener('tibia-bot-capture-characters', () => {
    void captureAndStoreCharacters('ui');
  });

  try {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type !== 'TIBIA_BOT_CAPTURE_CHARACTERS') return;
      void (async () => {
        try {
          const result = await captureAndStoreCharacters(message.reason || 'message');
          sendResponse({ success: true, characters: result?.list || [] });
        } catch (error) {
          sendResponse({ success: false, error: error?.message || 'capture failed' });
        }
      })();
      return true;
    });
  } catch (_) {}

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes[SELECTED_HUNT_KEY]) {
        pushSelectedHuntToPage(changes[SELECTED_HUNT_KEY].newValue || null);
      }
      if (changes[MOVER_TIERS_KEY]) {
        pushMoverTiersToPage(changes[MOVER_TIERS_KEY].newValue || null);
      }
      if (changes[STAMINA_CONFIG_KEY]) {
        pushStaminaConfigToPage(changes[STAMINA_CONFIG_KEY].newValue || null);
      }
      if (changes[AUTO_SELL_CONFIG_KEY]) {
        pushAutoSellConfigToPage(changes[AUTO_SELL_CONFIG_KEY].newValue || null);
      }
      if (changes[AUTO_ANUNCIO_CONFIG_KEY]) {
        pushAutoAnuncioConfigToPage(changes[AUTO_ANUNCIO_CONFIG_KEY].newValue || null);
      }
    });
  } catch (_) {}

  window.addEventListener('popstate', cleanupIfLeftPlayPage);
  window.addEventListener('hashchange', cleanupIfLeftPlayPage);

  let lastHref = location.href;
  setInterval(() => {
    if (location.href === lastHref) return;
    lastHref = location.href;
    cleanupIfLeftPlayPage();
  }, 1000);
})();
