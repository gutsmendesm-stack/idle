const API_BASE_URL = 'https://tibiabot.online/api';
const SITE_URL = 'https://tibiabot.online/';
const SITE_URLS = ['https://tibiabot.online/', 'https://www.tibiabot.online/'];
const SESSION_COOKIE = 'TIBIAPASS';
const AUTH_STORAGE = {
  loggedIn: 'tibiaBotLoggedIn',
  user: 'tibiaBotUser',
  checkedAt: 'tibiaBotAuthCheckedAt',
  vip: 'tibiaBotVip',
  contaStatus: 'tibiaBotContaStatus'
};
const VERSION_STORAGE = {
  required: 'tibiaBotRequiredVersion',
  installed: 'tibiaBotInstalledVersion',
  outdated: 'tibiaBotExtensionOutdated',
  checkedAt: 'tibiaBotVersionCheckedAt',
  message: 'tibiaBotVersionMessage'
};
const VIP_ALARM_EXPIRE = 'tibiaBotVipExpire';
const VIP_ALARM_POLL = 'tibiaBotVipPoll';
const PLAY_URL_HINT = 'https://baiakidle.com/jogar/';

function getInstalledExtensionVersion() {
  try {
    const manifest = chrome.runtime.getManifest?.() || {};
    return String(manifest.version || '').trim();
  } catch (_) {
    return '';
  }
}

/** client >= required → true */
function isExtensionVersionAllowed(clientVersion, requiredVersion) {
  const client = String(clientVersion || '').trim();
  const required = String(requiredVersion || '').trim();
  if (!client || !required) return false;

  const pa = client.split('.').map((p) => Number(p) || 0);
  const pb = required.split('.').map((p) => Number(p) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const a = pa[i] || 0;
    const b = pb[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return true;
}

async function persistVersionState({ required, outdated, message }) {
  const installed = getInstalledExtensionVersion();
  await chrome.storage.local.set({
    [VERSION_STORAGE.required]: required || '',
    [VERSION_STORAGE.installed]: installed,
    [VERSION_STORAGE.outdated]: !!outdated,
    [VERSION_STORAGE.checkedAt]: Date.now(),
    [VERSION_STORAGE.message]: message || ''
  });
  return {
    installed,
    required: required || '',
    outdated: !!outdated,
    message: message || ''
  };
}

async function fetchRequiredVersionFromApi() {
  const installed = getInstalledExtensionVersion();
  const urls = [
    `${API_BASE_URL}/version.php`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(`${url}?v=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-Extension-Version': installed
        }
      });
      const data = await res.json().catch(() => null);
      if (data && data.requiredVersion) {
        const required = String(data.requiredVersion).trim();
        const outdated = data.allowed === false || !isExtensionVersionAllowed(installed, required);
        return persistVersionState({
          required,
          outdated,
          message: outdated
            ? data.message ||
              `Atualize a extensão. Mínima: ${required} (você tem ${installed || '?'}).`
            : ''
        });
      }
    } catch (_) {}
  }
  return null;
}

async function applyExtensionPayload(extension) {
  if (!extension || typeof extension !== 'object') return null;
  const required = String(extension.requiredVersion || '').trim();
  if (!required) return null;
  const installed = getInstalledExtensionVersion();
  const outdated =
    extension.allowed === false || !isExtensionVersionAllowed(installed, required);
  return persistVersionState({
    required,
    outdated,
    message: outdated
      ? extension.message ||
        `Atualize a extensão. Mínima: ${required} (você tem ${installed || '?'}).`
      : ''
  });
}

async function getVersionGate() {
  const data = await chrome.storage.local.get([
    VERSION_STORAGE.required,
    VERSION_STORAGE.outdated,
    VERSION_STORAGE.message,
    VERSION_STORAGE.checkedAt
  ]);
  const age = Date.now() - (Number(data[VERSION_STORAGE.checkedAt]) || 0);
  if (!data[VERSION_STORAGE.required] || age > 5 * 60 * 1000) {
    const fresh = await fetchRequiredVersionFromApi();
    if (fresh) return fresh;
  }
  const installed = getInstalledExtensionVersion();
  const required = String(data[VERSION_STORAGE.required] || '').trim();
  const outdated =
    !!data[VERSION_STORAGE.outdated] ||
    (required ? !isExtensionVersionAllowed(installed, required) : false);
  return {
    installed,
    required,
    outdated,
    message: data[VERSION_STORAGE.message] || ''
  };
}

async function assertExtensionUpToDate() {
  const gate = await getVersionGate();
  if (gate.outdated) {
    await stopAllModulesOnPlayTabs();
    throw new Error(
      gate.message ||
        `Extensão desatualizada. Mínima: ${gate.required} (você tem ${gate.installed || '?'}).`
    );
  }
  return gate;
}

/** produto_id no banco → bot da extensão */
const BOT_PRODUCT_ID = {
  baiak_idle: 1
};

function isBaiakIdlePlayUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    const host = String(u.hostname || '').toLowerCase();
    if (host !== 'baiakidle.com' && host !== 'www.baiakidle.com') return false;
    const path = String(u.pathname || '');
    return path === '/jogar' || path === '/jogar/' || path.startsWith('/jogar/');
  } catch (_) {
    return false;
  }
}

const MODULES = {
  pular_boss: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdlePularBossEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_PULAR_BOSS__',
    instanceKey: '__baiakIdlePularBoss',
    className: 'BaiakIdlePularBossModule',
    startMsg: 'BAIAKIDLE_START_PULAR_BOSS',
    stopMsg: 'BAIAKIDLE_STOP_PULAR_BOSS',
    label: 'Pular Boss'
  },
  member_dead: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleMemberDeadEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_MEMBER_DEAD__',
    instanceKey: '__baiakIdleMemberDead',
    className: 'BaiakIdleMemberDeadModule',
    startMsg: 'BAIAKIDLE_START_MEMBER_DEAD',
    stopMsg: 'BAIAKIDLE_STOP_MEMBER_DEAD',
    label: 'Membro Morto'
  },
  retornar_hunt: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleRetornarHuntEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_RETORNAR_HUNT__',
    instanceKey: '__baiakIdleRetornarHunt',
    className: 'BaiakIdleRetornarHuntModule',
    startMsg: 'BAIAKIDLE_START_RETORNAR_HUNT',
    stopMsg: 'BAIAKIDLE_STOP_RETORNAR_HUNT',
    label: 'Retornar Hunt'
  },
  auto_sell: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleAutoSellEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_AUTO_SELL__',
    instanceKey: '__baiakIdleAutoSell',
    className: 'BaiakIdleAutoSellModule',
    startMsg: 'BAIAKIDLE_START_AUTO_SELL',
    stopMsg: 'BAIAKIDLE_STOP_AUTO_SELL',
    label: 'Auto Sell'
  },
  mover_itens: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleMoverItensEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_MOVER_ITENS__',
    instanceKey: '__baiakIdleMoverItens',
    className: 'BaiakIdleMoverItensModule',
    startMsg: 'BAIAKIDLE_START_MOVER_ITENS',
    stopMsg: 'BAIAKIDLE_STOP_MOVER_ITENS',
    label: 'Mover Itens'
  },
  stamina: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleStaminaEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_STAMINA__',
    instanceKey: '__baiakIdleStamina',
    className: 'BaiakIdleStaminaModule',
    startMsg: 'BAIAKIDLE_START_STAMINA',
    stopMsg: 'BAIAKIDLE_STOP_STAMINA',
    label: 'Stamina'
  },
  xp_hora: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleXpHoraEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_XP_HORA__',
    instanceKey: '__baiakIdleXpHora',
    className: 'BaiakIdleXpHoraModule',
    startMsg: 'BAIAKIDLE_START_XP_HORA',
    stopMsg: 'BAIAKIDLE_STOP_XP_HORA',
    label: 'XP/h'
  },
  gold_hora: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleGoldHoraEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_GOLD_HORA__',
    instanceKey: '__baiakIdleGoldHora',
    className: 'BaiakIdleGoldHoraModule',
    startMsg: 'BAIAKIDLE_START_GOLD_HORA',
    stopMsg: 'BAIAKIDLE_STOP_GOLD_HORA',
    label: 'Gold/h'
  },
  auto_anuncio: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleAutoAnuncioEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_AUTO_ANUNCIO__',
    instanceKey: '__baiakIdleAutoAnuncio',
    className: 'BaiakIdleAutoAnuncioModule',
    startMsg: 'BAIAKIDLE_START_AUTO_ANUNCIO',
    stopMsg: 'BAIAKIDLE_STOP_AUTO_ANUNCIO',
    label: 'Auto Anúncio'
  },
  ocultar_nomes: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleOcultarNomesEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_OCULTAR_NOMES__',
    instanceKey: '__baiakIdleOcultarNomes',
    className: 'BaiakIdleOcultarNomesModule',
    startMsg: 'BAIAKIDLE_START_OCULTAR_NOMES',
    stopMsg: 'BAIAKIDLE_STOP_OCULTAR_NOMES',
    label: 'Ocultar Nomes',
    hideFromOverlay: true
  },
  autoboss: {
    botId: 'baiak_idle',
    botLabel: 'Baiak-Idle',
    productId: 1,
    storageKey: 'baiakIdleAutoBossEnabled',
    autoStartFlag: '__BAIAKIDLE_AUTO_START_AUTOBOSS__',
    instanceKey: '__baiakIdleAutoBoss',
    className: 'BaiakIdleAutoBossModule',
    startMsg: 'BAIAKIDLE_START_AUTOBOSS',
    stopMsg: 'BAIAKIDLE_STOP_AUTOBOSS',
    label: 'AutoBoss',
    hideFromOverlay: true
  }
};

/* —— Auth exclusiva do Tibia Bot (cookie TIBIAPASS — não usa RAVISPASS) —— */

let authSyncTimer = null;
let authSyncInFlight = null;

function normalizeContaStatus(cs) {
  if (!cs || typeof cs !== 'object') {
    return {
      vip: false,
      label: 'Free',
      data_final: null,
      produto_id: null,
      produto_nome: null,
      mensagem: 'Compre sua VIP ou recrute um usuário.'
    };
  }
  let vip = !!cs.vip;
  const dataFinal = cs.data_final != null ? Number(cs.data_final) : null;
  if (vip && dataFinal && dataFinal * 1000 <= Date.now()) {
    vip = false;
  }
  return {
    vip,
    label: vip ? 'VIP' : 'Free',
    data_final: dataFinal && dataFinal > 0 ? dataFinal : null,
    produto_id: cs.produto_id != null ? Number(cs.produto_id) : null,
    produto_nome: cs.produto_nome || null,
    mensagem: vip
      ? null
      : (cs.mensagem || 'Compre sua VIP ou recrute um usuário.')
  };
}

function isVipForProduct(contaStatus, productId) {
  const cs = normalizeContaStatus(contaStatus);
  if (!cs.vip) return false;
  if (!productId) return true;
  if (cs.produto_id == null) return true;
  return Number(cs.produto_id) === Number(productId);
}

async function readSiteSessionCookieValue() {
  for (const url of SITE_URLS) {
    try {
      const c = await chrome.cookies.get({ url, name: SESSION_COOKIE });
      if (c && c.value) return String(c.value);
    } catch (_) {}
  }
  try {
    const all = await chrome.cookies.getAll({ name: SESSION_COOKIE });
    for (const c of all || []) {
      const host = String(c.domain || '').replace(/^\./, '');
      if ((host === 'tibiabot.online' || host.endsWith('.tibiabot.online')) && c.value) {
        return String(c.value);
      }
    }
  } catch (_) {}
  return '';
}

async function hasSiteSessionCookie() {
  return !!(await readSiteSessionCookieValue());
}

async function fetchSiteSession() {
  const sessionId = await readSiteSessionCookieValue();
  const installed = getInstalledExtensionVersion();
  const urls = [
    `${SITE_URL}api/auth/me.php`
  ];
  let lastErr = null;

  for (const url of urls) {
    try {
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Extension-Version': installed
      };
      if (sessionId) {
        headers['X-TibiaBot-Session'] = sessionId;
      }

      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers
      });
      const data = await res.json().catch(() => null);
      if (data?.extension) {
        await applyExtensionPayload(data.extension);
      }
      if (data && data.authenticated && data.user) {
        return {
          ok: true,
          user: data.user,
          conta_status: normalizeContaStatus(data.conta_status),
          extension: data.extension || null
        };
      }
      if (data && data.authenticated === false) {
        return {
          ok: false,
          user: null,
          conta_status: null,
          definite: true,
          extension: data.extension || null
        };
      }
    } catch (err) {
      lastErr = err;
    }
  }
  return { ok: false, user: null, conta_status: null, definite: false, error: lastErr?.message || null };
}

async function persistAuthState(loggedIn, user, contaStatus = null) {
  const cs = loggedIn ? normalizeContaStatus(contaStatus) : normalizeContaStatus(null);
  await chrome.storage.local.set({
    [AUTH_STORAGE.loggedIn]: !!loggedIn,
    [AUTH_STORAGE.user]: loggedIn && user ? user : null,
    [AUTH_STORAGE.checkedAt]: Date.now(),
    [AUTH_STORAGE.vip]: !!(loggedIn && cs.vip),
    [AUTH_STORAGE.contaStatus]: loggedIn ? cs : null
  });
  return cs;
}

async function stopAllModulesOnPlayTabs() {
  const tabs = await chrome.tabs.query({
    url: [
      'https://baiakidle.com/jogar',
      'https://baiakidle.com/jogar/*',
      'https://www.baiakidle.com/jogar',
      'https://www.baiakidle.com/jogar/*'
    ]
  });
  for (const tab of tabs) {
    if (!tab.id || !isBaiakIdlePlayUrl(tab.url)) continue;
    for (const name of Object.keys(MODULES)) {
      try {
        await stopModule(tab.id, name);
      } catch (_) {}
    }
    try {
      await broadcastOverlay(tab.id);
    } catch (_) {}
  }
}

async function pauseModulesKeepLogin(reason = 'vip_expired') {
  const keys = Object.values(MODULES).map((m) => m.storageKey);
  const clear = {};
  for (const key of keys) clear[key] = false;
  await chrome.storage.local.set(clear);
  await stopAllModulesOnPlayTabs();
  moduleAccessTokenCache = { token: '', expiresAtMs: 0 };
  bossesModuleCodeCache = '';
  console.info('[Tibia Bot] Módulos pausados:', reason);
}

async function clearAuthAndStopModules() {
  const keys = Object.values(MODULES).map((m) => m.storageKey);
  const clear = {
    [AUTH_STORAGE.loggedIn]: false,
    [AUTH_STORAGE.user]: null,
    [AUTH_STORAGE.vip]: false,
    [AUTH_STORAGE.contaStatus]: null
  };
  for (const key of keys) clear[key] = false;
  await chrome.storage.local.set(clear);
  await stopAllModulesOnPlayTabs();
  moduleAccessTokenCache = { token: '', expiresAtMs: 0 };
  bossesModuleCodeCache = '';
  try {
    await chrome.alarms.clear(VIP_ALARM_EXPIRE);
    await chrome.alarms.clear(VIP_ALARM_POLL);
  } catch (_) {}
}

async function scheduleVipMonitoring(contaStatus) {
  try {
    await chrome.alarms.clear(VIP_ALARM_EXPIRE);
    await chrome.alarms.clear(VIP_ALARM_POLL);
  } catch (_) {}

  const cs = normalizeContaStatus(contaStatus);
  try {
    await chrome.alarms.create(VIP_ALARM_POLL, {
      periodInMinutes: cs.vip ? 2 : 1
    });
  } catch (_) {}

  if (!cs.vip || !cs.data_final) return;

  const whenMs = cs.data_final * 1000;
  const delay = whenMs - Date.now();
  if (delay <= 0) {
    const prevUser = (await chrome.storage.local.get(AUTH_STORAGE.user))[AUTH_STORAGE.user];
    await pauseModulesKeepLogin('vip_expired_local');
    await persistAuthState(true, prevUser, { ...cs, vip: false, label: 'Free' });
    return;
  }

  try {
    await chrome.alarms.create(VIP_ALARM_EXPIRE, {
      when: Math.max(Date.now() + 1500, whenMs)
    });
  } catch (_) {}
}

async function syncAuthFromSite(reason = 'manual') {
  const versionGate = (await fetchRequiredVersionFromApi()) || (await getVersionGate());

  const hasCookie = await hasSiteSessionCookie();
  if (!hasCookie) {
    if (reason === 'cookie_removed') {
      await new Promise((r) => setTimeout(r, 400));
      if (await hasSiteSessionCookie()) {
        return syncAuthFromSite('cookie_removed_retry');
      }
    }
    const prev = await chrome.storage.local.get(AUTH_STORAGE.loggedIn);
    if (prev[AUTH_STORAGE.loggedIn]) {
      await clearAuthAndStopModules();
    } else {
      await persistAuthState(false, null, null);
    }
    return {
      loggedIn: false,
      user: null,
      vip: false,
      contaStatus: null,
      reason,
      extensionOutdated: !!versionGate?.outdated,
      requiredVersion: versionGate?.required || '',
      installedVersion: versionGate?.installed || getInstalledExtensionVersion(),
      versionMessage: versionGate?.message || ''
    };
  }

  const session = await fetchSiteSession();
  const gate = (await getVersionGate()) || versionGate;
  if (gate?.outdated) {
    await stopAllModulesOnPlayTabs();
  }

  if (session.ok && session.user) {
    const prevAuth = await chrome.storage.local.get([AUTH_STORAGE.vip, AUTH_STORAGE.loggedIn]);
    const wasVip = !!prevAuth[AUTH_STORAGE.vip];
    const cs = await persistAuthState(true, session.user, session.conta_status);
    if (!cs.vip || gate?.outdated) {
      await pauseModulesKeepLogin(reason + (gate?.outdated ? '_outdated' : '_no_vip'));
    } else if (!wasVip && cs.vip) {
      // VIP acabou de liberar: atualiza overlay nas abas do jogo
      try {
        await broadcastOverlay();
      } catch (_) {}
    }
    await scheduleVipMonitoring(cs);
    return {
      loggedIn: true,
      user: session.user,
      vip: !!cs.vip,
      contaStatus: cs,
      reason,
      extensionOutdated: !!gate?.outdated,
      requiredVersion: gate?.required || '',
      installedVersion: gate?.installed || getInstalledExtensionVersion(),
      versionMessage: gate?.message || ''
    };
  }

  if (!session.definite) {
    const prev = await chrome.storage.local.get([
      AUTH_STORAGE.loggedIn,
      AUTH_STORAGE.user,
      AUTH_STORAGE.vip,
      AUTH_STORAGE.contaStatus
    ]);
    if (prev[AUTH_STORAGE.loggedIn]) {
      const cs = normalizeContaStatus(prev[AUTH_STORAGE.contaStatus]);
      if (!cs.vip && prev[AUTH_STORAGE.vip]) {
        await pauseModulesKeepLogin(reason + '_expired_cache');
        await persistAuthState(true, prev[AUTH_STORAGE.user], cs);
      } else if (cs.vip) {
        await scheduleVipMonitoring(cs);
      }
      if (gate?.outdated) {
        await stopAllModulesOnPlayTabs();
      }
      return {
        loggedIn: true,
        user: prev[AUTH_STORAGE.user] || null,
        vip: !!cs.vip,
        contaStatus: cs,
        reason: reason + '_keep',
        extensionOutdated: !!gate?.outdated,
        requiredVersion: gate?.required || '',
        installedVersion: gate?.installed || getInstalledExtensionVersion(),
        versionMessage: gate?.message || ''
      };
    }
  }

  const prev = await chrome.storage.local.get(AUTH_STORAGE.loggedIn);
  if (prev[AUTH_STORAGE.loggedIn]) {
    await clearAuthAndStopModules();
  } else {
    await persistAuthState(false, null, null);
  }
  return {
    loggedIn: false,
    user: null,
    vip: false,
    contaStatus: null,
    reason,
    extensionOutdated: !!gate?.outdated,
    requiredVersion: gate?.required || '',
    installedVersion: gate?.installed || getInstalledExtensionVersion(),
    versionMessage: gate?.message || ''
  };
}

function scheduleAuthSync(reason = 'manual') {
  clearTimeout(authSyncTimer);
  authSyncTimer = setTimeout(() => {
    authSyncInFlight = syncAuthFromSite(reason)
      .catch(() => ({ loggedIn: false, user: null, vip: false, contaStatus: null, reason: 'error' }))
      .finally(() => {
        authSyncInFlight = null;
      });
  }, 250);
  return authSyncInFlight;
}

async function requireAuth() {
  const data = await chrome.storage.local.get([
    AUTH_STORAGE.loggedIn,
    AUTH_STORAGE.checkedAt,
    AUTH_STORAGE.user,
    AUTH_STORAGE.vip,
    AUTH_STORAGE.contaStatus
  ]);
  const age = Date.now() - (Number(data[AUTH_STORAGE.checkedAt]) || 0);
  const cs = normalizeContaStatus(data[AUTH_STORAGE.contaStatus]);

  if (data[AUTH_STORAGE.loggedIn] && data[AUTH_STORAGE.vip] && !cs.vip) {
    return syncAuthFromSite('require_expired');
  }

  if (!data[AUTH_STORAGE.loggedIn] || age > 60_000) {
    return syncAuthFromSite('require');
  }

  return {
    loggedIn: true,
    user: data[AUTH_STORAGE.user] || null,
    vip: !!cs.vip,
    contaStatus: cs,
    reason: 'cache'
  };
}

async function requireVipForModule(moduleName) {
  await assertExtensionUpToDate();
  const auth = await requireAuth();
  if (!auth.loggedIn) {
    throw new Error('Faça login em tibiabot.online para usar os módulos.');
  }
  const meta = MODULES[moduleName];
  const productId = meta?.productId || BOT_PRODUCT_ID[meta?.botId] || 1;
  if (!isVipForProduct(auth.contaStatus, productId)) {
    throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
  }
  return auth;
}

chrome.cookies.onChanged.addListener((changeInfo) => {
  const c = changeInfo?.cookie;
  if (!c || c.name !== SESSION_COOKIE) return;
  const host = String(c.domain || '').replace(/^\./, '');
  if (host !== 'tibiabot.online' && !host.endsWith('.tibiabot.online')) return;
  scheduleAuthSync(changeInfo.removed ? 'cookie_removed' : 'cookie_changed');
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (!alarm?.name) return;
  if (alarm.name === VIP_ALARM_EXPIRE || alarm.name === VIP_ALARM_POLL) {
    syncAuthFromSite(alarm.name).catch(() => {});
  }
});

syncAuthFromSite('startup').catch(() => {});

/** Cache em memória do catálogo de bosses (módulo de dados, sem auto-start). */
let bossesModuleCodeCache = '';

/** Token de curta duração para download de módulos (API). */
let moduleAccessTokenCache = { token: '', expiresAtMs: 0 };

function parseModuleApiError(text, fallback) {
  const raw = String(text || '').trim();
  if (!raw) return fallback;
  try {
    const data = JSON.parse(raw);
    if (data && typeof data.message === 'string' && data.message.trim()) {
      return data.message.trim();
    }
  } catch (_) {}
  const m = raw.match(/\/\/\s*Error:\s*(.+)/i);
  if (m && m[1]) return m[1].trim();
  // HTML 500 do nginx/PHP: devolve um trecho legível
  if (/<html|internal server error|fatal error/i.test(raw)) {
    return fallback + ' (erro no servidor)';
  }
  return fallback;
}

async function fetchModuleAccessToken({ force = false } = {}) {
  const now = Date.now();
  if (
    !force &&
    moduleAccessTokenCache.token &&
    moduleAccessTokenCache.expiresAtMs > now + 30_000
  ) {
    return moduleAccessTokenCache.token;
  }

  await assertExtensionUpToDate();
  const auth = await requireAuth();
  if (!auth.loggedIn) {
    throw new Error('Faça login em tibiabot.online para usar os módulos.');
  }
  if (!auth.vip) {
    throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
  }

  const sessionId = await readSiteSessionCookieValue();
  if (!sessionId) {
    throw new Error('Sessão não encontrada. Abra tibiabot.online e faça login de novo.');
  }
  const installed = getInstalledExtensionVersion();
  // Não usar www: certificado SSL do www está inválido e mascara o erro real.
  const url = `${API_BASE_URL}/auth/module_token.php?v=${Date.now()}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'omit',
      cache: 'no-store',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Extension-ID': chrome.runtime.id,
        'X-Extension-Version': installed,
        'X-TibiaBot-Session': sessionId
      }
    });
    const data = await res.json().catch(() => null);
    if (data?.success && data.token) {
      const ttlSec = Number(data.ttl) || 300;
      const expSec = Number(data.expires_at) || Math.floor(now / 1000) + ttlSec;
      moduleAccessTokenCache = {
        token: String(data.token),
        expiresAtMs: expSec * 1000
      };
      return moduleAccessTokenCache.token;
    }
    throw new Error(
      data?.message ||
        (res.status === 401
          ? 'Faça login em tibiabot.online.'
          : res.status === 403
            ? 'VIP ou Extension ID sem permissão.'
            : `Falha ao obter token (HTTP ${res.status})`)
    );
  } catch (err) {
    const base = err instanceof Error ? err.message : String(err);
    if (base === 'Failed to fetch') {
      throw new Error(
        'Falha de rede ao obter token de módulo. Verifique se a API está no ar e recarregue a extensão.'
      );
    }
    throw err instanceof Error ? err : new Error(base);
  }
}

async function fetchModuleCode(moduleName) {
  const token = await fetchModuleAccessToken();
  const sessionId = await readSiteSessionCookieValue();
  if (!sessionId) {
    throw new Error('Sessão não encontrada. Abra tibiabot.online e faça login de novo.');
  }
  const installed = getInstalledExtensionVersion();
  const url = `${API_BASE_URL}/${moduleName}.php?v=${Date.now()}`;

  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Extension-ID': chrome.runtime.id,
    'X-Extension-Version': installed,
    'X-Module-Token': token,
    'X-TibiaBot-Session': sessionId
  };

  async function downloadOnce(moduleToken) {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'omit',
      cache: 'no-store',
      headers: { ...headers, 'X-Module-Token': moduleToken }
    });
    const raw = await response.text();
    return { response, raw };
  }

  try {
    let { response, raw } = await downloadOnce(token);

    if (!response.ok && response.status === 401 && /token/i.test(raw)) {
      const fresh = await fetchModuleAccessToken({ force: true });
      ({ response, raw } = await downloadOnce(fresh));
    }

    if (!response.ok) {
      throw new Error(parseModuleApiError(raw, `HTTP ${response.status} ao carregar ${moduleName}`));
    }

    let code = '';
    try {
      const data = JSON.parse(raw);
      if (data && data.success && typeof data.code === 'string') {
        code =
          data.encoding === 'base64'
            ? (() => {
                const bin = atob(data.code);
                const bytes = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
                return new TextDecoder('utf-8').decode(bytes);
              })()
            : data.code;
      } else if (data && data.message) {
        throw new Error(String(data.message));
      }
    } catch (err) {
      if (err instanceof Error && err.message && !/JSON|Unexpected|atob|URIMalformed/i.test(err.message)) {
        throw err;
      }
      // Compat: resposta antiga em JS puro
      code = raw;
    }

    if (!code || !code.trim() || code.trim().startsWith('// Error:')) {
      throw new Error(parseModuleApiError(raw || code, `Módulo ${moduleName} inválido ou vazio`));
    }
    return code;
  } catch (err) {
    const baseMsg = err instanceof Error ? err.message : String(err);
    if (baseMsg === 'Failed to fetch') {
      throw new Error(
        `Falha de rede ao carregar ${moduleName} em tibiabot.online. Recarregue a extensão e tente de novo.`
      );
    }
    throw err instanceof Error ? err : new Error(baseMsg);
  }
}

async function fetchBossesModuleCode({ force = false } = {}) {
  if (!force && bossesModuleCodeCache) return bossesModuleCodeCache;
  const code = await fetchModuleCode('bosses');
  bossesModuleCodeCache = code;
  return code;
}

/**
 * Carrega o catálogo via API e disponibiliza no isolated world do content script.
 * MV3 bloqueia eval no isolated world — injeta como os outros módulos (blob no MAIN)
 * e copia só os dados serializáveis para o painel.
 */
async function ensureBossesCatalog(tabId, { force = false } = {}) {
  await assertExtensionUpToDate();
  await assertPlayTab(tabId);

  if (!force) {
    const [probe] = await chrome.scripting.executeScript({
      target: { tabId },
      world: 'ISOLATED',
      func: () =>
        Array.isArray(window.BAIAK_IDLE_BOSSES) ? window.BAIAK_IDLE_BOSSES.length : 0
    });
    const cachedCount = Number(probe?.result) || 0;
    if (cachedCount > 0) {
      return { success: true, cached: true, count: cachedCount };
    }
  }

  const code = await fetchBossesModuleCode({ force });

  async function injectAndRead(moduleCode, reload) {
    const [mainInject] = await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: (src, shouldReload) =>
        new Promise((resolve, reject) => {
          try {
            if (
              !shouldReload &&
              Array.isArray(window.BAIAK_IDLE_BOSSES) &&
              window.BAIAK_IDLE_BOSSES.length > 0
            ) {
              resolve(window.BAIAK_IDLE_BOSSES);
              return;
            }

            // Limpa catálogo anterior para detectar falha de parse do módulo.
            try {
              delete window.BAIAK_IDLE_BOSSES;
            } catch (_) {
              window.BAIAK_IDLE_BOSSES = undefined;
            }

            const blob = new Blob([src], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
              URL.revokeObjectURL(url);
              const catalog = Array.isArray(window.BAIAK_IDLE_BOSSES)
                ? window.BAIAK_IDLE_BOSSES
                : [];
              resolve(catalog);
            };
            script.onerror = () => {
              URL.revokeObjectURL(url);
              reject(new Error('Falha ao injetar catálogo de bosses.'));
            };
            (document.head || document.documentElement).appendChild(script);
          } catch (err) {
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        }),
      args: [moduleCode, !!reload]
    });
    return Array.isArray(mainInject?.result) ? mainInject.result : [];
  }

  let bosses = await injectAndRead(code, force);
  if (!bosses.length && !force) {
    // Cache/SW pode ter módulo antigo inválido — força redownload.
    bossesModuleCodeCache = '';
    const fresh = await fetchBossesModuleCode({ force: true });
    bosses = await injectAndRead(fresh, true);
  }

  if (!bosses.length) {
    throw new Error('Catálogo de bosses vazio ou inválido.');
  }

  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'ISOLATED',
    func: (catalog) => {
      window.BAIAK_IDLE_BOSSES = catalog;
      window.BAIAK_IDLE_GET_BOSS = function (idOrName) {
        const key = String(idOrName || '')
          .trim()
          .toLowerCase();
        if (!key) return null;
        return (
          catalog.find((b) => b && b.id === key) ||
          catalog.find((b) => b && String(b.name || '').toLowerCase() === key) ||
          null
        );
      };
    },
    args: [bosses]
  });

  return { success: true, cached: false, count: bosses.length };
}

async function assertPlayTab(tabId) {
  const tab = await chrome.tabs.get(tabId);
  if (!isBaiakIdlePlayUrl(tab?.url)) {
    throw new Error(`Abra a página do jogo: ${PLAY_URL_HINT}`);
  }
  return tab;
}

async function injectGoToHunt(tabId, huntName) {
  await assertExtensionUpToDate();
  await assertPlayTab(tabId);

  const name = String(huntName || '').trim();
  if (!name) {
    throw new Error('Nenhuma hunt ativa selecionada.');
  }

  const moduleCode = await fetchModuleCode('teleporte');
  const huntData = await chrome.storage.local.get('baiakIdleSelectedHunt');
  const selectedHunt = huntData.baiakIdleSelectedHunt || { name };

  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: (code, hunt, selected) => {
      window.__baiakIdleSelectedHunt = selected || hunt || null;

      const run = () => {
        const Teleporte = window.BaiakIdleTeleporte;
        if (!Teleporte?.goToHunt) {
          console.error('[Tibia Bot] BaiakIdleTeleporte.goToHunt indisponível');
          return;
        }
        void Teleporte.goToHunt(hunt);
      };

      const blob = new Blob([code], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        URL.revokeObjectURL(url);
        try {
          run();
        } catch (err) {
          console.error('[Tibia Bot] Erro ao ir para a hunt', err);
        }
      };
      script.onerror = (error) => {
        URL.revokeObjectURL(url);
        console.error('[Tibia Bot] Erro ao injetar teleporte', error);
      };
      (document.head || document.documentElement).appendChild(script);
    },
    args: [moduleCode, name, selectedHunt]
  });

  return { success: true, hunt: name };
}

async function injectGoToBoss(tabId, bossName) {
  await assertExtensionUpToDate();
  await assertPlayTab(tabId);

  const name = String(bossName || '').trim();
  if (!name) {
    throw new Error('Nenhum boss informado.');
  }

  const moduleCode = await fetchModuleCode('teleporte');

  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: (code, boss) => {
      const run = () => {
        const Teleporte = window.BaiakIdleTeleporte;
        if (!Teleporte?.goToBoss) {
          console.error('[Tibia Bot] BaiakIdleTeleporte.goToBoss indisponível');
          return;
        }
        void Teleporte.goToBoss(boss);
      };

      const blob = new Blob([code], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        URL.revokeObjectURL(url);
        try {
          run();
        } catch (err) {
          console.error('[Tibia Bot] Erro ao ir para o boss', err);
        }
      };
      script.onerror = (error) => {
        URL.revokeObjectURL(url);
        console.error('[Tibia Bot] Erro ao injetar teleporte (boss)', error);
      };
      (document.head || document.documentElement).appendChild(script);
    },
    args: [moduleCode, name]
  });

  return { success: true, boss: name };
}

async function injectModule(tabId, moduleName, { autoStart = true } = {}) {
  await assertExtensionUpToDate();
  const meta = MODULES[moduleName];
  if (!meta) throw new Error(`Módulo desconhecido: ${moduleName}`);

  await assertPlayTab(tabId);
  const moduleCode = await fetchModuleCode(moduleName);
  const extra = await chrome.storage.local.get([
    'baiakIdleSelectedHunt',
    'baiakIdleMoverItensTiers',
    'baiakIdleStaminaConfig',
    'baiakIdleAutoSellVenderLootBoss',
    'baiakIdleAutoSellConfig',
    'baiakIdleAutoAnuncioConfig',
    'baiakIdleAutoBossRun'
  ]);
  const selectedHunt = extra.baiakIdleSelectedHunt || null;
  const moveTiers = extra.baiakIdleMoverItensTiers || {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  };
  const staminaCfg = extra.baiakIdleStaminaConfig || { minPct: 15, maxPct: 30 };
  const venderLootBoss = !!extra.baiakIdleAutoSellVenderLootBoss;
  const autoSellCfg = extra.baiakIdleAutoSellConfig || { minPct: 70 };
  const autoAnuncioCfg = extra.baiakIdleAutoAnuncioConfig || {
    channel: 'geral',
    text: '',
    intervalMin: 5
  };
  const run = extra.baiakIdleAutoBossRun || null;
  const autoBossQueue =
    run && run.running && Array.isArray(run.queue)
      ? run.queue
          .map((b) => ({
            id: String(b?.id || '').trim(),
            name: String(b?.name || b?.id || '').trim()
          }))
          .filter((b) => b.id && b.name)
      : [];
  const autoBossIndex = Math.max(0, Number(run?.index) || 0);

  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: (
      code,
      shouldAutoStart,
      autoStartFlag,
      instanceKey,
      className,
      label,
      hunt,
      tiers,
      staminaConfig,
      venderLootBossFlag,
      autoSellConfig,
      autoAnuncioConfig,
      autoBossQueueArg,
      autoBossIndexArg
    ) => {
      window.__baiakIdleSelectedHunt = hunt || null;
      window.__baiakIdleMoverItensTiers = tiers || {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false
      };
      window.__baiakIdleStaminaConfig = staminaConfig || { minPct: 15, maxPct: 30 };
      window.__baiakIdleAutoSellVenderLootBoss = !!venderLootBossFlag;
      window.__baiakIdleAutoSellConfig = autoSellConfig || { minPct: 70 };
      window.__baiakIdleAutoAnuncioConfig = autoAnuncioConfig || {
        channel: 'geral',
        text: '',
        intervalMin: 5
      };
      window.__baiakIdleAutoBossQueue = Array.isArray(autoBossQueueArg) ? autoBossQueueArg : [];
      window.__baiakIdleAutoBossRunIndex = Number(autoBossIndexArg) || 0;
      window[autoStartFlag] = !!shouldAutoStart;

      const blob = new Blob([code], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        URL.revokeObjectURL(url);
        try {
          if (shouldAutoStart) {
            if (!window[className]) {
              console.error(`[Tibia Bot] Classe ${className} não encontrada após injetar ${label}`);
              return;
            }
            if (!window[instanceKey]) {
              window[instanceKey] = new window[className]();
            }
            const started = window[instanceKey]?.start?.(
              Array.isArray(autoBossQueueArg) ? autoBossQueueArg : undefined
            );
            if (instanceKey === '__baiakIdleAutoBoss' && started === false) {
              console.error('[Tibia Bot] AutoBoss não iniciou (fila vazia ou erro).');
            }
          }
        } catch (err) {
          console.error(`[Tibia Bot] Erro ao iniciar ${label}`, err);
        }
      };
      script.onerror = (error) => {
        URL.revokeObjectURL(url);
        console.error(`[Tibia Bot] Erro ao injetar ${label}`, error);
      };
      (document.head || document.documentElement).appendChild(script);
    },
    args: [
      moduleCode,
      autoStart,
      meta.autoStartFlag,
      meta.instanceKey,
      meta.className,
      meta.label,
      selectedHunt,
      moveTiers,
      staminaCfg,
      venderLootBoss,
      autoSellCfg,
      autoAnuncioCfg,
      autoBossQueue,
      autoBossIndex
    ]
  });

  if (autoStart) {
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: 'TIBIA_BOT_CAPTURE_CHARACTERS',
        reason: 'module:' + moduleName
      });
    } catch (_) {}
  }

  return { success: true };
}

async function stopModule(tabId, moduleName) {
  const meta = MODULES[moduleName];
  if (!meta) throw new Error(`Módulo desconhecido: ${moduleName}`);

  try {
    await assertPlayTab(tabId);
  } catch (_) {
    return { success: true, skipped: true };
  }

  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: (autoStartFlag, instanceKey, label) => {
      try {
        window[autoStartFlag] = false;
        window[instanceKey]?.stop?.();
      } catch (err) {
        console.error(`[Tibia Bot] Erro ao parar ${label}`, err);
      }
    },
    args: [meta.autoStartFlag, meta.instanceKey, meta.label]
  });

  return { success: true };
}

async function getActiveModulesSnapshot() {
  const keys = Object.values(MODULES).map((m) => m.storageKey);
  const data = await chrome.storage.local.get(keys);

  /** @type {Record<string, { botLabel: string, modules: string[] }>} */
  const byBot = {};

  for (const meta of Object.values(MODULES)) {
    if (!data[meta.storageKey]) continue;
    if (meta.hideFromOverlay) continue;
    if (!byBot[meta.botId]) {
      byBot[meta.botId] = { botLabel: meta.botLabel, modules: [] };
    }
    byBot[meta.botId].modules.push(meta.label);
  }

  return {
    hasActive: Object.keys(byBot).length > 0,
    bots: byBot
  };
}

async function getEnabledModuleNames() {
  const keys = Object.values(MODULES).map((m) => m.storageKey);
  const data = await chrome.storage.local.get(keys);
  return Object.entries(MODULES)
    .filter(([, meta]) => !!data[meta.storageKey])
    .map(([name]) => name);
}

async function broadcastOverlay(tabId = null) {
  const snapshot = await getActiveModulesSnapshot();
  const message = {
    type: 'TIBIA_BOT_OVERLAY_UPDATE',
    payload: snapshot
  };

  if (tabId) {
    try {
      const tab = await chrome.tabs.get(tabId);
      if (!isBaiakIdlePlayUrl(tab?.url)) return snapshot;
      await chrome.tabs.sendMessage(tabId, message);
    } catch (_) {}
    return snapshot;
  }

  const tabs = await chrome.tabs.query({
    url: [
      'https://baiakidle.com/jogar',
      'https://baiakidle.com/jogar/*',
      'https://www.baiakidle.com/jogar',
      'https://www.baiakidle.com/jogar/*'
    ]
  });
  await Promise.all(
    tabs.map(async (tab) => {
      if (!tab.id || !isBaiakIdlePlayUrl(tab.url)) return;
      try {
        await chrome.tabs.sendMessage(tab.id, message);
      } catch (_) {}
    })
  );

  return snapshot;
}

async function maybeReinjectOnTab(tabId, url) {
  if (!tabId || !isBaiakIdlePlayUrl(url)) return;

  try {
    await assertExtensionUpToDate();
  } catch (_) {
    return;
  }

  const auth = await requireAuth();
  if (!auth.loggedIn || !auth.vip) return;

  const enabledModules = await getEnabledModuleNames();
  for (const moduleName of enabledModules) {
    const meta = MODULES[moduleName];
    if (!isVipForProduct(auth.contaStatus, meta?.productId)) continue;
    try {
      await injectModule(tabId, moduleName, { autoStart: true });
    } catch (error) {
      console.warn(`[Tibia Bot] Re-injeção de ${moduleName} falhou:`, error?.message || error);
    }
  }

  await broadcastOverlay(tabId);
}

function moduleNameFromMessage(type) {
  for (const [name, meta] of Object.entries(MODULES)) {
    if (type === meta.startMsg) return { name, action: 'start' };
    if (type === meta.stopMsg) return { name, action: 'stop' };
  }
  return null;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      if (message?.type === 'TIBIA_BOT_CAPTURE_CHARACTERS') {
        const tabId = message.tabId || _sender?.tab?.id;
        if (tabId) {
          try {
            await chrome.tabs.sendMessage(tabId, {
              type: 'TIBIA_BOT_CAPTURE_CHARACTERS',
              reason: message.reason || 'message'
            });
          } catch (_) {}
        }
        sendResponse({ success: true });
        return;
      }

      if (message?.type === 'TIBIA_BOT_AUTH_SYNC' || message?.type === 'TIBIA_BOT_AUTH_GET') {
        const result = await syncAuthFromSite(message.reason || message.type);
        sendResponse({ success: true, ...result });
        return;
      }

      if (message?.type === 'TIBIA_BOT_VERSION_CHECK') {
        const gate = (await fetchRequiredVersionFromApi()) || (await getVersionGate());
        sendResponse({ success: true, ...(gate || {}) });
        return;
      }

      if (message?.type === 'TIBIA_BOT_AUTH_REQUIRE') {
        const result = await requireAuth();
        sendResponse({ success: true, ...result });
        return;
      }

      if (message?.type === 'BAIAKIDLE_GO_HUNT') {
        const tabId = message.tabId || _sender?.tab?.id;
        if (!tabId) throw new Error('tabId ausente');
        await requireAuth();
        const gate = await getVersionGate();
        if (gate?.outdated) {
          throw new Error(gate.message || 'Atualize a extensão.');
        }
        const huntName =
          message.huntName ||
          (await chrome.storage.local.get('baiakIdleSelectedHunt')).baiakIdleSelectedHunt?.name;
        const result = await injectGoToHunt(tabId, huntName);
        sendResponse(result);
        return;
      }

      if (message?.type === 'BAIAKIDLE_GO_BOSS') {
        const tabId = message.tabId || _sender?.tab?.id;
        if (!tabId) throw new Error('tabId ausente');
        await requireAuth();
        const gate = await getVersionGate();
        if (gate?.outdated) {
          throw new Error(gate.message || 'Atualize a extensão.');
        }
        const bossName = String(message.bossName || '').trim();
        if (!bossName) throw new Error('Nome do boss ausente.');
        const result = await injectGoToBoss(tabId, bossName);
        sendResponse(result);
        return;
      }

      if (message?.type === 'BAIAKIDLE_ENSURE_BOSSES') {
        const tabId = message.tabId || _sender?.tab?.id;
        if (!tabId) throw new Error('tabId ausente');
        await requireAuth();
        const result = await ensureBossesCatalog(tabId, {
          force: !!message.force
        });
        sendResponse(result);
        return;
      }

      const parsed = moduleNameFromMessage(message?.type);
      if (parsed) {
        const tabId = message.tabId || _sender?.tab?.id;
        if (!tabId) throw new Error('tabId ausente');

        const meta = MODULES[parsed.name];
        if (parsed.action === 'start') {
          await requireVipForModule(parsed.name);
          await chrome.storage.local.set({ [meta.storageKey]: true });
          const result = await injectModule(tabId, parsed.name, { autoStart: true });
          await broadcastOverlay(tabId);
          sendResponse(result);
        } else {
          const auth = await requireAuth();
          if (!auth.loggedIn) {
            throw new Error('Faça login em tibiabot.online para usar os módulos.');
          }
          await chrome.storage.local.set({ [meta.storageKey]: false });
          const result = await stopModule(tabId, parsed.name);
          await broadcastOverlay(tabId);
          sendResponse(result);
        }
        return;
      }

      if (message?.type === 'BAIAKIDLE_PAGE_READY' || message?.type === 'TIBIA_BOT_PAGE_READY') {
        const tabId = message.tabId || _sender?.tab?.id;
        const url = message.url || _sender?.tab?.url;
        if (!isBaiakIdlePlayUrl(url)) {
          sendResponse({ success: true, skipped: true });
          return;
        }
        const auth = await requireAuth();
        if (!auth.loggedIn || !auth.vip) {
          sendResponse({
            success: true,
            skipped: true,
            reason: !auth.loggedIn ? 'not_logged_in' : 'no_vip'
          });
          return;
        }
        await maybeReinjectOnTab(tabId, url);
        sendResponse({ success: true });
        return;
      }

      if (message?.type === 'TIBIA_BOT_SYNC_OVERLAY') {
        if (message.tabId) {
          const tab = await chrome.tabs.get(message.tabId);
          if (!isBaiakIdlePlayUrl(tab?.url)) {
            sendResponse({ success: true, skipped: true });
            return;
          }
        }
        await broadcastOverlay(message.tabId || null);
        sendResponse({ success: true });
        return;
      }

      if (message?.type === 'TIBIA_BOT_GET_ACTIVE_MODULES') {
        const senderUrl = _sender?.tab?.url || '';
        if (_sender?.tab?.id && !isBaiakIdlePlayUrl(senderUrl)) {
          sendResponse({ success: false, error: 'Fora da página do jogo' });
          return;
        }
        sendResponse({ success: true, payload: await getActiveModulesSnapshot() });
        return;
      }

      sendResponse({ success: false, error: 'Mensagem desconhecida' });
    } catch (error) {
      sendResponse({ success: false, error: error?.message || String(error) });
    }
  })();

  return true;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  const touched = Object.keys(changes).some((key) =>
    Object.values(MODULES).some((m) => m.storageKey === key)
  );
  if (touched) {
    broadcastOverlay();
  }

  if (changes.baiakIdleSelectedHunt) {
    const hunt = changes.baiakIdleSelectedHunt.newValue || null;
    (async () => {
      try {
        const tabs = await chrome.tabs.query({
          url: [
            'https://baiakidle.com/jogar',
            'https://baiakidle.com/jogar/*',
            'https://www.baiakidle.com/jogar',
            'https://www.baiakidle.com/jogar/*'
          ]
        });
        await Promise.all(
          (tabs || []).map(async (tab) => {
            if (!tab?.id) return;
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (value) => {
                  window.__baiakIdleSelectedHunt = value || null;
                },
                args: [hunt]
              });
            } catch (_) {}
          })
        );
      } catch (_) {}
    })();
  }

  if (changes.baiakIdleMoverItensTiers) {
    const tiers = changes.baiakIdleMoverItensTiers.newValue || {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false
    };
    (async () => {
      try {
        const tabs = await chrome.tabs.query({
          url: [
            'https://baiakidle.com/jogar',
            'https://baiakidle.com/jogar/*',
            'https://www.baiakidle.com/jogar',
            'https://www.baiakidle.com/jogar/*'
          ]
        });
        await Promise.all(
          (tabs || []).map(async (tab) => {
            if (!tab?.id) return;
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (value) => {
                  window.__baiakIdleMoverItensTiers = value || {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false
                  };
                },
                args: [tiers]
              });
            } catch (_) {}
          })
        );
      } catch (_) {}
    })();
  }

  if (changes.baiakIdleStaminaConfig) {
    const staminaCfg = changes.baiakIdleStaminaConfig.newValue || {
      minPct: 15,
      maxPct: 30
    };
    (async () => {
      try {
        const tabs = await chrome.tabs.query({
          url: [
            'https://baiakidle.com/jogar',
            'https://baiakidle.com/jogar/*',
            'https://www.baiakidle.com/jogar',
            'https://www.baiakidle.com/jogar/*'
          ]
        });
        await Promise.all(
          (tabs || []).map(async (tab) => {
            if (!tab?.id) return;
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (value) => {
                  window.__baiakIdleStaminaConfig = value || { minPct: 15, maxPct: 30 };
                },
                args: [staminaCfg]
              });
            } catch (_) {}
          })
        );
      } catch (_) {}
    })();
  }

  if (changes.baiakIdleAutoSellVenderLootBoss) {
    const venderLootBoss = !!changes.baiakIdleAutoSellVenderLootBoss.newValue;
    (async () => {
      try {
        const tabs = await chrome.tabs.query({
          url: [
            'https://baiakidle.com/jogar',
            'https://baiakidle.com/jogar/*',
            'https://www.baiakidle.com/jogar',
            'https://www.baiakidle.com/jogar/*'
          ]
        });
        await Promise.all(
          (tabs || []).map(async (tab) => {
            if (!tab?.id) return;
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (value) => {
                  window.__baiakIdleAutoSellVenderLootBoss = !!value;
                },
                args: [venderLootBoss]
              });
            } catch (_) {}
          })
        );
      } catch (_) {}
    })();
  }

  if (changes.baiakIdleAutoSellConfig) {
    const autoSellCfg = changes.baiakIdleAutoSellConfig.newValue || { minPct: 70 };
    (async () => {
      try {
        const tabs = await chrome.tabs.query({
          url: [
            'https://baiakidle.com/jogar',
            'https://baiakidle.com/jogar/*',
            'https://www.baiakidle.com/jogar',
            'https://www.baiakidle.com/jogar/*'
          ]
        });
        await Promise.all(
          (tabs || []).map(async (tab) => {
            if (!tab?.id) return;
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (value) => {
                  window.__baiakIdleAutoSellConfig = value || { minPct: 70 };
                },
                args: [autoSellCfg]
              });
            } catch (_) {}
          })
        );
      } catch (_) {}
    })();
  }

  if (changes.baiakIdleAutoAnuncioConfig) {
    const autoAnuncioCfg = changes.baiakIdleAutoAnuncioConfig.newValue || {
      channel: 'geral',
      text: '',
      intervalMin: 5
    };
    (async () => {
      try {
        const tabs = await chrome.tabs.query({
          url: [
            'https://baiakidle.com/jogar',
            'https://baiakidle.com/jogar/*',
            'https://www.baiakidle.com/jogar',
            'https://www.baiakidle.com/jogar/*'
          ]
        });
        await Promise.all(
          (tabs || []).map(async (tab) => {
            if (!tab?.id) return;
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (value) => {
                  window.__baiakIdleAutoAnuncioConfig = value || {
                    channel: 'geral',
                    text: '',
                    intervalMin: 5
                  };
                },
                args: [autoAnuncioCfg]
              });
            } catch (_) {}
          })
        );
      } catch (_) {}
    })();
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;
  maybeReinjectOnTab(tabId, tab?.url);
});
