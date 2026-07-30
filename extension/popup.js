const STORAGE_KEY_LAST_BOT = 'tibiaBotLastScreen';
const STORAGE_KEY_SELECTED_HUNT = 'baiakIdleSelectedHunt';
const STORAGE_KEY_HUNT_RANK = 'baiakIdleHuntRank';
const STORAGE_KEY_HUNT_OPEN = 'baiakIdleHuntMenuOpen';
const STORAGE_KEY_MOVER_TIERS = 'baiakIdleMoverItensTiers';
const STORAGE_KEY_MOVER_ENABLED = 'baiakIdleMoverItensEnabled';
const STORAGE_KEY_STAMINA_CONFIG = 'baiakIdleStaminaConfig';
const STORAGE_KEY_STAMINA_ENABLED = 'baiakIdleStaminaEnabled';
const STORAGE_KEY_XP_HORA_ENABLED = 'baiakIdleXpHoraEnabled';
const STORAGE_KEY_GOLD_HORA_ENABLED = 'baiakIdleGoldHoraEnabled';
const STORAGE_KEY_RETORNAR_HUNT_ENABLED = 'baiakIdleRetornarHuntEnabled';
const STORAGE_KEY_AUTO_SELL_VENDER_LOOT_BOSS = 'baiakIdleAutoSellVenderLootBoss';
const STORAGE_KEY_AUTO_SELL_CONFIG = 'baiakIdleAutoSellConfig';
const STORAGE_KEY_AUTO_ANUNCIO_CONFIG = 'baiakIdleAutoAnuncioConfig';
const STORAGE_KEY_AUTO_ANUNCIO_ENABLED = 'baiakIdleAutoAnuncioEnabled';
const PLAY_URL = 'https://baiakidle.com/jogar/';
const SITE_URL = 'https://tibiabot.online/';
const CONTA_URL = 'https://tibiabot.online/conta.html';
const AUTH_STORAGE = {
  loggedIn: 'tibiaBotLoggedIn',
  user: 'tibiaBotUser',
  vip: 'tibiaBotVip',
  contaStatus: 'tibiaBotContaStatus'
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

const BOTS = {
  baiak_idle: {
    id: 'baiak_idle',
    label: 'Baiak-Idle',
    productId: 1,
    screenId: 'screenBaiakIdle',
    statusId: 'statusBaiak',
    modules: [
      {
        id: 'pular_boss',
        storageKey: 'baiakIdlePularBossEnabled',
        toggleId: 'pularBossToggle',
        startMsg: 'BAIAKIDLE_START_PULAR_BOSS',
        stopMsg: 'BAIAKIDLE_STOP_PULAR_BOSS',
        label: 'Pular Boss'
      },
      {
        id: 'member_dead',
        storageKey: 'baiakIdleMemberDeadEnabled',
        toggleId: 'memberDeadToggle',
        startMsg: 'BAIAKIDLE_START_MEMBER_DEAD',
        stopMsg: 'BAIAKIDLE_STOP_MEMBER_DEAD',
        label: 'Membro Morto'
      },
      {
        id: 'retornar_hunt',
        storageKey: STORAGE_KEY_RETORNAR_HUNT_ENABLED,
        toggleId: 'retornarHuntToggle',
        startMsg: 'BAIAKIDLE_START_RETORNAR_HUNT',
        stopMsg: 'BAIAKIDLE_STOP_RETORNAR_HUNT',
        label: 'Retornar Hunt'
      },
      {
        id: 'auto_sell',
        storageKey: 'baiakIdleAutoSellEnabled',
        toggleId: 'autoSellToggle',
        startMsg: 'BAIAKIDLE_START_AUTO_SELL',
        stopMsg: 'BAIAKIDLE_STOP_AUTO_SELL',
        label: 'Auto Sell'
      },
      {
        id: 'stamina',
        storageKey: STORAGE_KEY_STAMINA_ENABLED,
        toggleId: 'staminaToggle',
        startMsg: 'BAIAKIDLE_START_STAMINA',
        stopMsg: 'BAIAKIDLE_STOP_STAMINA',
        label: 'Stamina'
      },
      {
        id: 'xp_hora',
        storageKey: STORAGE_KEY_XP_HORA_ENABLED,
        toggleId: 'xpHoraToggle',
        startMsg: 'BAIAKIDLE_START_XP_HORA',
        stopMsg: 'BAIAKIDLE_STOP_XP_HORA',
        label: 'XP/h'
      },
      {
        id: 'gold_hora',
        storageKey: STORAGE_KEY_GOLD_HORA_ENABLED,
        toggleId: 'goldHoraToggle',
        startMsg: 'BAIAKIDLE_START_GOLD_HORA',
        stopMsg: 'BAIAKIDLE_STOP_GOLD_HORA',
        label: 'Gold/h'
      },
      {
        id: 'auto_anuncio',
        storageKey: STORAGE_KEY_AUTO_ANUNCIO_ENABLED,
        toggleId: 'autoAnuncioToggle',
        startMsg: 'BAIAKIDLE_START_AUTO_ANUNCIO',
        stopMsg: 'BAIAKIDLE_STOP_AUTO_ANUNCIO',
        label: 'Auto Anúncio'
      },
      {
        id: 'mover_itens',
        storageKey: STORAGE_KEY_MOVER_ENABLED,
        startMsg: 'BAIAKIDLE_START_MOVER_ITENS',
        stopMsg: 'BAIAKIDLE_STOP_MOVER_ITENS',
        label: 'Mover Itens',
        kind: 'tiers'
      }
    ]
  }
};

const statusHome = document.getElementById('statusHome');
const screenLocked = document.getElementById('screenLocked');
const screenHome = document.getElementById('screenHome');
const screenBaiak = document.getElementById('screenBaiakIdle');
const authUserLabel = document.getElementById('authUserLabel');
const authUserLabelBaiak = document.getElementById('authUserLabelBaiak');
const authVipPill = document.getElementById('authVipPill');
const authVipPillBaiak = document.getElementById('authVipPillBaiak');
const vipBannerHome = document.getElementById('vipBannerHome');
const vipBannerBaiak = document.getElementById('vipBannerBaiak');
const versionBannerHome = document.getElementById('versionBannerHome');
const btnBaiakIdle = document.getElementById('btnBaiakIdle');

/** @type {{ loggedIn?: boolean, vip?: boolean, contaStatus?: any, user?: any, extensionOutdated?: boolean, requiredVersion?: string, installedVersion?: string, versionMessage?: string }} */
let lastAuth = { loggedIn: false, vip: false, extensionOutdated: false };

function setStatus(node, message, type) {
  if (!node) return;
  node.textContent = message;
  node.className = 'status' + (type ? ' ' + type : '');
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach((el) => {
    el.classList.toggle('is-active', el.id === screenId);
  });
}

function formatVipEnd(ts) {
  const n = Number(ts) || 0;
  if (!n) return '';
  const d = new Date(n * 1000);
  const pad = (x) => (x < 10 ? '0' + x : String(x));
  return (
    pad(d.getDate()) +
    '/' +
    pad(d.getMonth() + 1) +
    '/' +
    d.getFullYear() +
    ' ' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes())
  );
}

function isVipAuth(auth) { return true; }

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

async function syncAuth() {
  try {
    const res = await chrome.runtime.sendMessage({ type: 'TIBIA_BOT_AUTH_SYNC', reason: 'popup' });
    return res || { loggedIn: false, vip: false };
  } catch (_) {
    return { loggedIn: false, vip: false };
  }
}

function setVipPill(el, vip) {
  if (!el) return;
  el.textContent = vip ? 'VIP' : 'Free';
  el.className = 'vip-pill ' + (vip ? 'is-vip' : 'is-free');
}

function setVipBanner(el, auth) {
  if (!el) return;
  if (auth?.extensionOutdated) {
    el.hidden = true;
    return;
  }
  const vip = isVipAuth(auth);
  if (vip) {
    const fim = formatVipEnd(auth.contaStatus?.data_final);
    el.hidden = false;
    el.style.borderColor = '#166534';
    el.style.background = 'rgba(22, 101, 52, 0.22)';
    el.style.color = '#bbf7d0';
    el.innerHTML = fim
      ? 'VIP ativa · termina em <strong>' + fim + '</strong>'
      : 'VIP ativa.';
    return;
  }
  el.hidden = false;
  el.style.borderColor = '#7f1d1d';
  el.style.background = 'rgba(127, 29, 29, 0.22)';
  el.style.color = '#fecaca';
  el.innerHTML =
    'Conta Free. <a href="' +
    CONTA_URL +
    '" target="_blank" rel="noopener">Compre VIP ou recrute</a> para liberar os módulos.';
}

function setVersionBanner(auth) {
  if (!versionBannerHome) return;
  if (!auth?.extensionOutdated) {
    versionBannerHome.hidden = true;
    versionBannerHome.innerHTML = '';
    if (btnBaiakIdle) btnBaiakIdle.disabled = false;
    return;
  }

  const required = auth.requiredVersion || '?';
  const installed = auth.installedVersion || '?';
  versionBannerHome.hidden = false;
  versionBannerHome.style.borderColor = '#92400e';
  versionBannerHome.style.background = 'rgba(146, 64, 14, 0.28)';
  versionBannerHome.style.color = '#fde68a';
  versionBannerHome.innerHTML =
    '<strong>Atualização obrigatória</strong><br>' +
    (auth.versionMessage ||
      'Sua extensão está desatualizada. Atualize para usar o Baiak-Idle.') +
    '<br><span style="opacity:.9">Mínima: ' +
    required +
    ' · Instalada: ' +
    installed +
    '</span><br><a href="' +
    SITE_URL +
    '" target="_blank" rel="noopener">Abrir tibiabot.online</a>';

  if (btnBaiakIdle) btnBaiakIdle.disabled = true;
}

function applyModulesLock(locked) {
  document.querySelectorAll('#screenBaiakIdle .module').forEach((el) => {
    el.classList.toggle('is-locked', !!locked);
  });
  for (const bot of Object.values(BOTS)) {
    for (const mod of bot.modules) {
      if (!mod.toggleId) continue;
      const toggle = document.getElementById(mod.toggleId);
      if (toggle) toggle.disabled = !!locked;
    }
  }
  document.querySelectorAll('#moverItensTiers .tier-chip').forEach((btn) => {
    btn.disabled = !!locked;
  });
  document.querySelectorAll(
    '#staminaMinPct, #staminaMaxPct, #autoSellMinPct, #autoAnuncioChannel, #autoAnuncioInterval, #autoAnuncioText'
  ).forEach((input) => {
    input.disabled = !!locked;
  });
  const venderLootBoss = document.getElementById('venderLootBossToggle');
  if (venderLootBoss) venderLootBoss.disabled = !!locked;
}

function applyAuthUi(auth) {
  lastAuth = auth || { loggedIn: false, vip: false, extensionOutdated: false };
  const loggedIn = !!auth?.loggedIn;
  if (!loggedIn) {
    showScreen('screenLocked');
    if (authUserLabel) authUserLabel.textContent = '';
    if (authUserLabelBaiak) authUserLabelBaiak.textContent = '';
    return false;
  }

  const nome = auth.user?.nome || auth.user?.email || '';
  const first = nome ? String(nome).split(' ')[0] : 'Conta conectada';
  if (authUserLabel) authUserLabel.textContent = nome ? `Olá, ${first}` : 'Conta conectada';
  if (authUserLabelBaiak) authUserLabelBaiak.textContent = first;

  const vip = isVipAuth(auth);
  setVipPill(authVipPill, vip);
  setVipPill(authVipPillBaiak, vip);
  setVersionBanner(auth);
  setVipBanner(vipBannerHome, auth);
  setVipBanner(vipBannerBaiak, auth);
  applyModulesLock(!vip || !!auth.extensionOutdated);
  return true;
}

async function refreshBotModules(botId) {
  const bot = BOTS[botId];
  if (!bot) return;

  const statusNode = document.getElementById(bot.statusId);
  const keys = bot.modules.map((m) => m.storageKey).concat([
    STORAGE_KEY_AUTO_SELL_VENDER_LOOT_BOSS
  ]);
  const data = await chrome.storage.local.get(keys);
  const vip = isVipAuth(lastAuth);
  const canUse = vip && !lastAuth.extensionOutdated;

  const active = [];
  for (const mod of bot.modules) {
    const enabled = !!data[mod.storageKey];
    if (mod.toggleId) {
      const toggle = document.getElementById(mod.toggleId);
      if (toggle) {
        toggle.checked = enabled && canUse;
        toggle.disabled = !canUse;
      }
    }
    if (enabled && canUse) active.push(mod.label);
  }

  if (botId === 'baiak_idle') {
    const venderLootBoss = document.getElementById('venderLootBossToggle');
    if (venderLootBoss) {
      venderLootBoss.checked = !!data[STORAGE_KEY_AUTO_SELL_VENDER_LOOT_BOSS];
      venderLootBoss.disabled = !canUse;
    }
    await renderMoverTierChips(canUse);
    await renderStaminaFields(canUse);
    await renderAutoSellFields(canUse);
    await renderAutoAnuncioFields(canUse);
  }

  applyModulesLock(!canUse);

  if (!vip) {
    setStatus(statusNode, 'VIP necessária para ativar módulos.', 'err');
    return;
  }

  if (active.length) {
    setStatus(
      statusNode,
      `Ativos: ${active.join(', ')}. Overlay visível na página.`,
      'ok'
    );
  } else {
    setStatus(statusNode, 'Nenhum módulo ativo neste bot.');
  }
}

async function openBot(botId) {
  const bot = BOTS[botId];
  if (!bot) return;

  if (lastAuth?.extensionOutdated) {
    showScreen('screenHome');
    setStatus(
      statusHome,
      lastAuth.versionMessage ||
        'Atualize a extensão para abrir o Baiak-Idle.',
      'err'
    );
    setVersionBanner(lastAuth);
    return;
  }

  await chrome.storage.local.set({ [STORAGE_KEY_LAST_BOT]: botId });
  showScreen(bot.screenId);
  setStatus(statusHome, `Bot ${bot.label} carregado.`);
  await refreshBotModules(botId);
  if (botId === 'baiak_idle') {
    await initHuntPicker();
    await initMoverItensTiers();
    await initStaminaFields();
    await initAutoSellFields();
    await initAutoAnuncioFields();
  }
}

/** @type {string} */
let currentHuntRankId = 'todas';
/** @type {{ name?: string, level?: number } | null} */
let selectedHunt = null;
/** @type {string} */
let expandedHuntName = '';

function getHuntRanks() {
  return window.BAIAK_IDLE_HUNT_RANKS || [];
}

function getHuntList() {
  return window.BAIAK_IDLE_HUNTS || [];
}

function huntsForRank(rankId) {
  const ranks = getHuntRanks();
  const rank = ranks.find((r) => r.id === rankId) || ranks[0];
  const list = getHuntList();
  if (!rank || rank.id === 'todas') return list.slice();
  return list.filter((h) => h.level >= rank.min && h.level <= rank.max);
}

function updateHuntActiveLabel() {
  const el = document.getElementById('huntActiveLabel');
  if (!el) return;
  if (selectedHunt && selectedHunt.name) {
    el.innerHTML =
      'Selecionada: <strong>' +
      selectedHunt.name +
      '</strong> · lvl ' +
      (selectedHunt.level || '—');
  } else {
    el.textContent = 'Nenhuma hunt selecionada.';
  }
}

function renderHuntRanks() {
  const box = document.getElementById('huntRanks');
  if (!box) return;
  const ranks = getHuntRanks();
  box.innerHTML = '';
  for (const rank of ranks) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hunt-rank' + (rank.id === currentHuntRankId ? ' is-on' : '');
    btn.textContent = rank.label;
    btn.addEventListener('click', async () => {
      currentHuntRankId = rank.id;
      expandedHuntName = '';
      await chrome.storage.local.set({ [STORAGE_KEY_HUNT_RANK]: rank.id });
      renderHuntRanks();
      renderHuntList();
    });
    box.appendChild(btn);
  }
}

function renderHuntList() {
  const box = document.getElementById('huntList');
  if (!box) return;
  const hunts = huntsForRank(currentHuntRankId);
  box.innerHTML = '';

  if (!hunts.length) {
    box.innerHTML = '<div class="hunt-active">Nenhuma hunt neste rank.</div>';
    return;
  }

  for (const hunt of hunts) {
    const isSaved = !!(selectedHunt && selectedHunt.name === hunt.name);
    const isExpanded = expandedHuntName === hunt.name;
    const item = document.createElement('div');
    item.className =
      'hunt-item' +
      (isSaved ? ' is-active' : '') +
      (isExpanded ? ' is-expanded' : '');
    item.innerHTML =
      '<div class="hunt-item-top">' +
        '<span class="hunt-item-name"></span>' +
        '<span class="hunt-item-lvl"></span>' +
      '</div>';
    item.querySelector('.hunt-item-name').textContent = hunt.name;
    item.querySelector('.hunt-item-lvl').textContent = 'lvl ' + hunt.level;

    item.addEventListener('click', (ev) => {
      if (ev.target.closest('.btn-activate')) return;
      expandedHuntName = expandedHuntName === hunt.name ? '' : hunt.name;
      renderHuntList();
    });

    if (isExpanded) {
      const btn = document.createElement('button');
      btn.type = 'button';
      if (isSaved) {
        btn.className = 'btn-activate btn-go-hunt';
        btn.textContent = 'Ir para a hunt';
        btn.addEventListener('click', async (ev) => {
          ev.stopPropagation();
          const statusNode = document.getElementById('statusBaiak');
          try {
            const auth = await syncAuth();
            if (!applyAuthUi(auth)) {
              throw new Error('Faça login em tibiabot.online.');
            }
            if (auth.extensionOutdated) {
              throw new Error(auth.versionMessage || 'Atualize a extensão.');
            }
            const tab = await getActiveTab();
            if (!tab?.id || !isBaiakIdlePlayUrl(tab.url)) {
              throw new Error(`Abra a página do jogo: ${PLAY_URL}`);
            }
            setStatus(statusNode, 'Indo para ' + hunt.name + '…', 'ok');
            const response = await chrome.runtime.sendMessage({
              type: 'BAIAKIDLE_GO_HUNT',
              tabId: tab.id,
              huntName: hunt.name
            });
            if (!response?.success) {
              throw new Error(response?.error || 'Falha ao ir para a hunt.');
            }
            setStatus(statusNode, 'Navegando até ' + hunt.name + ' no jogo.', 'ok');
          } catch (error) {
            console.error('[Tibia Bot popup]', error);
            setStatus(statusNode, error.message || 'Erro ao ir para a hunt.', 'err');
          }
        });
      } else {
        btn.className = 'btn-activate';
        btn.textContent = 'Ativar';
        btn.addEventListener('click', async (ev) => {
          ev.stopPropagation();
          selectedHunt = { name: hunt.name, level: hunt.level };
          expandedHuntName = hunt.name;
          await chrome.storage.local.set({ [STORAGE_KEY_SELECTED_HUNT]: selectedHunt });
          updateHuntActiveLabel();
          renderHuntList();
          setStatus(
            document.getElementById('statusBaiak'),
            'Hunt salva: ' + hunt.name + ' (lvl ' + hunt.level + ').',
            'ok'
          );
        });
      }
      item.appendChild(btn);
    }

    box.appendChild(item);
  }
}

function setHuntMenuOpen(open) {
  const box = document.getElementById('huntBox');
  const btn = document.getElementById('huntBoxToggle');
  if (!box || !btn) return;
  box.classList.toggle('is-open', !!open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

async function initHuntPicker() {
  const data = await chrome.storage.local.get([
    STORAGE_KEY_SELECTED_HUNT,
    STORAGE_KEY_HUNT_RANK,
    STORAGE_KEY_HUNT_OPEN
  ]);
  selectedHunt = data[STORAGE_KEY_SELECTED_HUNT] || null;
  currentHuntRankId = data[STORAGE_KEY_HUNT_RANK] || 'todas';
  expandedHuntName = '';
  if (!getHuntRanks().some((r) => r.id === currentHuntRankId)) {
    currentHuntRankId = 'todas';
  }
  updateHuntActiveLabel();
  renderHuntRanks();
  renderHuntList();
  setHuntMenuOpen(!!data[STORAGE_KEY_HUNT_OPEN]);

  const toggle = document.getElementById('huntBoxToggle');
  if (toggle && !toggle.dataset.bound) {
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', async () => {
      const box = document.getElementById('huntBox');
      const next = !box?.classList.contains('is-open');
      setHuntMenuOpen(next);
      await chrome.storage.local.set({ [STORAGE_KEY_HUNT_OPEN]: next });
    });
  }
}

async function applyToggle(botId, mod, enabled) {
  const bot = BOTS[botId];
  const toggle = document.getElementById(mod.toggleId);
  const statusNode = document.getElementById(bot.statusId);

  try {
    if (toggle) toggle.disabled = true;

    const auth = await syncAuth();
    if (!applyAuthUi(auth)) {
      throw new Error('Faça login em tibiabot.online.');
    }
    if (!isVipAuth(auth)) {
      throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
    }

    await chrome.storage.local.set({ [mod.storageKey]: !!enabled });

    const tab = await getActiveTab();
    if (!tab?.id) {
      setStatus(
        statusNode,
        enabled
          ? `${mod.label} ativado. Abra ${PLAY_URL} para aplicar.`
          : `${mod.label} desativado.`,
        enabled ? 'ok' : ''
      );
      await chrome.runtime.sendMessage({ type: 'TIBIA_BOT_SYNC_OVERLAY' });
      return;
    }

    if (enabled && !isBaiakIdlePlayUrl(tab.url)) {
      throw new Error(`Abra a página do jogo: ${PLAY_URL}`);
    }

    const response = await chrome.runtime.sendMessage({
      type: enabled ? mod.startMsg : mod.stopMsg,
      tabId: tab.id
    });

    if (!response?.success) {
      throw new Error(response?.error || `Falha ao aplicar ${mod.label}.`);
    }

    if (enabled && tab?.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'TIBIA_BOT_CAPTURE_CHARACTERS',
          reason: 'module:' + mod.id
        });
      } catch (_) {}
    }

    await refreshBotModules(botId);
    setStatus(
      statusNode,
      enabled ? `${mod.label} ativo nesta aba.` : `${mod.label} desligado nesta aba.`,
      'ok'
    );
  } catch (error) {
    console.error('[Tibia Bot popup]', error);
    if (toggle) toggle.checked = !enabled;
    await chrome.storage.local.set({ [mod.storageKey]: !enabled });
    setStatus(statusNode, error.message || `Erro ao alternar ${mod.label}.`, 'err');
  } finally {
    if (toggle) toggle.disabled = !isVipAuth(lastAuth);
  }
}

function bindModules() {
  for (const [botId, bot] of Object.entries(BOTS)) {
    for (const mod of bot.modules) {
      if (!mod.toggleId) continue;
      const toggle = document.getElementById(mod.toggleId);
      if (!toggle) continue;
      toggle.addEventListener('change', () => {
        applyToggle(botId, mod, !!toggle.checked);
      });
    }
  }

  document.getElementById('venderLootBossToggle')?.addEventListener('change', (ev) => {
    void applyVenderLootBossToggle(!!ev.target.checked);
  });
}

async function applyVenderLootBossToggle(enabled) {
  const toggle = document.getElementById('venderLootBossToggle');
  const statusNode = document.getElementById('statusBaiak');
  try {
    if (toggle) toggle.disabled = true;
    const auth = await syncAuth();
    if (!applyAuthUi(auth)) throw new Error('Faça login em tibiabot.online.');
    if (!isVipAuth(auth)) {
      throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
    }
    if (auth.extensionOutdated) {
      throw new Error(auth.versionMessage || 'Atualize a extensão.');
    }
    await chrome.storage.local.set({
      [STORAGE_KEY_AUTO_SELL_VENDER_LOOT_BOSS]: !!enabled
    });
    setStatus(
      statusNode,
      enabled
        ? 'VenderLootBoss ativo (libera proteção antes de vender).'
        : 'VenderLootBoss desligado.',
      'ok'
    );
  } catch (error) {
    if (toggle) toggle.checked = !enabled;
    setStatus(statusNode, error.message || 'Erro ao alterar VenderLootBoss.', 'err');
  } finally {
    if (toggle) {
      toggle.disabled = !isVipAuth(lastAuth) || !!lastAuth.extensionOutdated;
    }
  }
}

function defaultMoverTiers() {
  return { 0: false, 1: false, 2: false, 3: false, 4: false };
}

function anyMoverTierOn(tiers) {
  return !!(
    tiers &&
    (tiers[0] || tiers[1] || tiers[2] || tiers[3] || tiers[4])
  );
}

async function renderMoverTierChips(vip = isVipAuth(lastAuth)) {
  const data = await chrome.storage.local.get(STORAGE_KEY_MOVER_TIERS);
  const tiers = data[STORAGE_KEY_MOVER_TIERS] || defaultMoverTiers();
  const root = document.getElementById('moverItensTiers');
  if (!root) return;
  root.querySelectorAll('.tier-chip').forEach((btn) => {
    const tier = String(btn.getAttribute('data-tier') || '');
    const on = !!tiers[tier] || !!tiers[Number(tier)];
    const color = btn.getAttribute('data-color') || '#cfd2d8';
    btn.classList.toggle('is-on', on);
    btn.disabled = !vip;
    btn.style.background = on ? color : '';
    btn.style.color = on ? '#0c1219' : '';
    btn.style.borderColor = on ? color : '';
  });
}

async function toggleMoverTier(tier) {
  const botId = 'baiak_idle';
  const bot = BOTS[botId];
  const mod = bot.modules.find((m) => m.id === 'mover_itens');
  if (!mod) return;

  const statusNode = document.getElementById(bot.statusId);
  const key = String(tier);

  try {
    const auth = await syncAuth();
    if (!applyAuthUi(auth)) {
      throw new Error('Faça login em tibiabot.online.');
    }
    if (!isVipAuth(auth)) {
      throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
    }

    const data = await chrome.storage.local.get(STORAGE_KEY_MOVER_TIERS);
    const tiers = { ...defaultMoverTiers(), ...(data[STORAGE_KEY_MOVER_TIERS] || {}) };
    tiers[key] = !tiers[key];
    tiers[Number(key)] = tiers[key];

    const enabled = anyMoverTierOn(tiers);
    await chrome.storage.local.set({
      [STORAGE_KEY_MOVER_TIERS]: tiers,
      [STORAGE_KEY_MOVER_ENABLED]: enabled
    });
    await renderMoverTierChips(true);

    const tab = await getActiveTab();
    if (!tab?.id) {
      setStatus(
        statusNode,
        enabled
          ? `Mover Itens configurado. Abra ${PLAY_URL} para aplicar.`
          : 'Mover Itens desativado.',
        enabled ? 'ok' : ''
      );
      await chrome.runtime.sendMessage({ type: 'TIBIA_BOT_SYNC_OVERLAY' });
      return;
    }

    if (enabled && !isBaiakIdlePlayUrl(tab.url)) {
      throw new Error(`Abra a página do jogo: ${PLAY_URL}`);
    }

    const response = await chrome.runtime.sendMessage({
      type: enabled ? mod.startMsg : mod.stopMsg,
      tabId: tab.id
    });

    if (!response?.success) {
      throw new Error(response?.error || 'Falha ao aplicar Mover Itens.');
    }

    await refreshBotModules(botId);
    const labels = ['T0', 'T1', 'T2', 'T3', 'T4'].filter(
      (_, i) => tiers[i] || tiers[String(i)]
    );
    setStatus(
      statusNode,
      enabled ? `Mover Itens ativo: ${labels.join(', ')}.` : 'Mover Itens desligado.',
      'ok'
    );
  } catch (error) {
    console.error('[Tibia Bot popup]', error);
    setStatus(statusNode, error.message || 'Erro ao alternar tier.', 'err');
    await renderMoverTierChips();
  }
}

async function initMoverItensTiers() {
  await renderMoverTierChips();
  const root = document.getElementById('moverItensTiers');
  if (!root || root.dataset.bound) return;
  root.dataset.bound = '1';
  root.addEventListener('click', (ev) => {
    const btn = ev.target?.closest?.('.tier-chip');
    if (!btn || btn.disabled) return;
    const tier = Number(btn.getAttribute('data-tier'));
    if (!Number.isFinite(tier)) return;
    void toggleMoverTier(tier);
  });
}

function defaultStaminaConfig() {
  return { minPct: 15, maxPct: 30 };
}

function normalizeStaminaConfig(raw) {
  const base = defaultStaminaConfig();
  let minPct = Number(raw?.minPct);
  let maxPct = Number(raw?.maxPct);
  if (!Number.isFinite(minPct)) minPct = base.minPct;
  if (!Number.isFinite(maxPct)) maxPct = base.maxPct;
  minPct = Math.max(0, Math.min(99, Math.round(minPct)));
  maxPct = Math.max(1, Math.min(100, Math.round(maxPct)));
  if (minPct >= maxPct) {
    maxPct = Math.min(100, minPct + 1);
  }
  return { minPct, maxPct };
}

async function renderStaminaFields(vip = isVipAuth(lastAuth)) {
  const data = await chrome.storage.local.get(STORAGE_KEY_STAMINA_CONFIG);
  const cfg = normalizeStaminaConfig(data[STORAGE_KEY_STAMINA_CONFIG]);
  const minEl = document.getElementById('staminaMinPct');
  const maxEl = document.getElementById('staminaMaxPct');
  if (minEl) {
    minEl.value = String(cfg.minPct);
    minEl.disabled = !vip;
  }
  if (maxEl) {
    maxEl.value = String(cfg.maxPct);
    maxEl.disabled = !vip;
  }
  updateStaminaWarn(cfg.minPct);
}

function updateStaminaWarn(minPct) {
  const warn = document.getElementById('staminaWarn');
  if (!warn) return;
  const n = Number(minPct);
  const show = Number.isFinite(n) && n < 15;
  warn.hidden = !show;
  warn.classList.toggle('is-on', show);
}

async function saveStaminaConfigFromInputs() {
  const statusNode = document.getElementById('statusBaiak');
  const minEl = document.getElementById('staminaMinPct');
  const maxEl = document.getElementById('staminaMaxPct');
  if (!minEl || !maxEl) return;

  try {
    const auth = await syncAuth();
    if (!applyAuthUi(auth)) {
      throw new Error('Faça login em tibiabot.online.');
    }
    if (!isVipAuth(auth)) {
      throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
    }

    const cfg = normalizeStaminaConfig({
      minPct: minEl.value,
      maxPct: maxEl.value
    });
    minEl.value = String(cfg.minPct);
    maxEl.value = String(cfg.maxPct);
    updateStaminaWarn(cfg.minPct);

    await chrome.storage.local.set({ [STORAGE_KEY_STAMINA_CONFIG]: cfg });
    setStatus(
      statusNode,
      `Stamina: ≤${cfg.minPct}% treino · ≥${cfg.maxPct}% hunt.`,
      'ok'
    );
  } catch (error) {
    console.error('[Tibia Bot popup]', error);
    setStatus(statusNode, error.message || 'Erro ao salvar stamina.', 'err');
    await renderStaminaFields();
  }
}

async function initStaminaFields() {
  await renderStaminaFields();
  const minEl = document.getElementById('staminaMinPct');
  const maxEl = document.getElementById('staminaMaxPct');
  if (!minEl || !maxEl || minEl.dataset.bound) return;
  minEl.dataset.bound = '1';
  maxEl.dataset.bound = '1';
  const onChange = () => {
    void saveStaminaConfigFromInputs();
  };
  const onMinInput = () => {
    updateStaminaWarn(minEl.value);
  };
  minEl.addEventListener('input', onMinInput);
  minEl.addEventListener('change', onChange);
  maxEl.addEventListener('change', onChange);
}

function normalizeAutoSellConfig(raw) {
  let minPct = 70;
  if (raw && typeof raw === 'object') {
    const n = Number(raw.minPct);
    if (Number.isFinite(n)) minPct = n;
  } else if (Number.isFinite(Number(raw))) {
    minPct = Number(raw);
  }
  minPct = Math.max(1, Math.min(100, Math.round(minPct)));
  return { minPct };
}

async function renderAutoSellFields(vip = isVipAuth(lastAuth)) {
  const data = await chrome.storage.local.get(STORAGE_KEY_AUTO_SELL_CONFIG);
  const cfg = normalizeAutoSellConfig(data[STORAGE_KEY_AUTO_SELL_CONFIG]);
  const el = document.getElementById('autoSellMinPct');
  if (el) {
    el.value = String(cfg.minPct);
    el.disabled = !vip;
  }
}

async function saveAutoSellConfigFromInputs() {
  const statusNode = document.getElementById('statusBaiak');
  const el = document.getElementById('autoSellMinPct');
  if (!el) return;
  try {
    const auth = await syncAuth();
    if (!applyAuthUi(auth)) {
      throw new Error('Faça login em tibiabot.online.');
    }
    if (!isVipAuth(auth)) {
      throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
    }
    const cfg = normalizeAutoSellConfig({ minPct: el.value });
    el.value = String(cfg.minPct);
    await chrome.storage.local.set({ [STORAGE_KEY_AUTO_SELL_CONFIG]: cfg });
    setStatus(statusNode, `Auto Sell: vende ao atingir ${cfg.minPct}% da mochila.`, 'ok');
  } catch (error) {
    console.error('[Tibia Bot popup]', error);
    setStatus(statusNode, error.message || 'Erro ao salvar Auto Sell.', 'err');
    await renderAutoSellFields();
  }
}

async function initAutoSellFields() {
  await renderAutoSellFields();
  const el = document.getElementById('autoSellMinPct');
  if (!el || el.dataset.bound) return;
  el.dataset.bound = '1';
  el.addEventListener('change', () => {
    void saveAutoSellConfigFromInputs();
  });
}

function defaultAutoAnuncioConfig() {
  return { channel: 'geral', text: '', intervalMin: 5 };
}

function normalizeAutoAnuncioConfig(raw) {
  const base = defaultAutoAnuncioConfig();
  const channels = ['geral', 'comunicados', 'help', 'market'];
  if (!raw || typeof raw !== 'object') return base;
  const ch = String(raw.channel || '').trim().toLowerCase();
  if (channels.includes(ch)) base.channel = ch;
  base.text = String(raw.text || '').trim().slice(0, 200);
  const n = Number(raw.intervalMin);
  if (Number.isFinite(n)) {
    base.intervalMin = Math.max(1, Math.min(120, Math.round(n)));
  }
  return base;
}

function updateAutoAnuncioCount(text) {
  const count = document.getElementById('autoAnuncioCount');
  if (!count) return;
  count.textContent = String(text || '').length + ' / 200';
}

async function renderAutoAnuncioFields(vip = isVipAuth(lastAuth)) {
  const data = await chrome.storage.local.get(STORAGE_KEY_AUTO_ANUNCIO_CONFIG);
  const cfg = normalizeAutoAnuncioConfig(data[STORAGE_KEY_AUTO_ANUNCIO_CONFIG]);
  const channel = document.getElementById('autoAnuncioChannel');
  const interval = document.getElementById('autoAnuncioInterval');
  const text = document.getElementById('autoAnuncioText');
  if (channel) {
    channel.value = cfg.channel;
    channel.disabled = !vip;
  }
  if (interval) {
    interval.value = String(cfg.intervalMin);
    interval.disabled = !vip;
  }
  if (text) {
    text.value = cfg.text;
    text.disabled = !vip;
  }
  updateAutoAnuncioCount(cfg.text);
}

async function saveAutoAnuncioConfigFromInputs() {
  const statusNode = document.getElementById('statusBaiak');
  const channel = document.getElementById('autoAnuncioChannel');
  const interval = document.getElementById('autoAnuncioInterval');
  const text = document.getElementById('autoAnuncioText');
  if (!channel || !interval || !text) return;
  try {
    const auth = await syncAuth();
    if (!applyAuthUi(auth)) {
      throw new Error('Faça login em tibiabot.online.');
    }
    if (!isVipAuth(auth)) {
      throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
    }
    const cfg = normalizeAutoAnuncioConfig({
      channel: channel.value,
      text: text.value,
      intervalMin: interval.value
    });
    channel.value = cfg.channel;
    interval.value = String(cfg.intervalMin);
    text.value = cfg.text;
    updateAutoAnuncioCount(cfg.text);
    await chrome.storage.local.set({ [STORAGE_KEY_AUTO_ANUNCIO_CONFIG]: cfg });
    setStatus(
      statusNode,
      `Auto Anúncio: ${cfg.channel} · a cada ${cfg.intervalMin} min.`,
      'ok'
    );
  } catch (error) {
    console.error('[Tibia Bot popup]', error);
    setStatus(statusNode, error.message || 'Erro ao salvar Auto Anúncio.', 'err');
    await renderAutoAnuncioFields();
  }
}

async function initAutoAnuncioFields() {
  await renderAutoAnuncioFields();
  const channel = document.getElementById('autoAnuncioChannel');
  const interval = document.getElementById('autoAnuncioInterval');
  const text = document.getElementById('autoAnuncioText');
  if (!channel || channel.dataset.bound) return;
  channel.dataset.bound = '1';
  if (interval) interval.dataset.bound = '1';
  if (text) text.dataset.bound = '1';
  const save = () => {
    void saveAutoAnuncioConfigFromInputs();
  };
  channel.addEventListener('change', save);
  interval?.addEventListener('change', save);
  text?.addEventListener('input', () => {
    updateAutoAnuncioCount(text.value);
  });
  text?.addEventListener('change', save);
}

document.getElementById('btnBaiakIdle')?.addEventListener('click', () => {
  openBot('baiak_idle');
});

document.getElementById('btnBackHome')?.addEventListener('click', async () => {
  await chrome.storage.local.set({ [STORAGE_KEY_LAST_BOT]: 'home' });
  showScreen('screenHome');
  setStatus(statusHome, 'Selecione um bot.');
});

document.getElementById('btnOpenSite')?.addEventListener('click', () => {
  chrome.tabs.create({ url: SITE_URL + '?cadastro=1' });
});

document.getElementById('btnOpenSiteSplash')?.addEventListener('click', () => {
  chrome.tabs.create({ url: SITE_URL });
});

async function resumeLoggedInUi() {
  const data = await chrome.storage.local.get(STORAGE_KEY_LAST_BOT);
  const last = data[STORAGE_KEY_LAST_BOT];

  if (lastAuth?.extensionOutdated) {
    showScreen('screenHome');
    setVersionBanner(lastAuth);
    setStatus(
      statusHome,
      lastAuth.versionMessage ||
        'Atualize a extensão para usar o Baiak-Idle.',
      'err'
    );
    return;
  }

  if (last && BOTS[last]) {
    await openBot(last);
  } else {
    showScreen('screenHome');
    const allKeys = Object.values(BOTS).flatMap((b) => b.modules.map((m) => m.storageKey));
    const states = await chrome.storage.local.get(allKeys);
    const activeCount = allKeys.filter((k) => !!states[k]).length;
    if (!isVipAuth(lastAuth)) {
      setStatus(statusHome, 'Conta Free — ative a VIP para usar os módulos.', 'err');
    } else {
      setStatus(
        statusHome,
        activeCount
          ? `${activeCount} módulo(s) ativo(s). Abra um bot para gerenciar.`
          : 'Selecione um bot.'
      );
    }
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes[AUTH_STORAGE.loggedIn]) {
    const loggedIn = !!changes[AUTH_STORAGE.loggedIn].newValue;
    if (!loggedIn) {
      showScreen('screenLocked');
      return;
    }
  }
  if (changes[STORAGE_KEY_AUTO_SELL_VENDER_LOOT_BOSS]) {
    const active = document.querySelector('.screen.is-active');
    if (active?.id === 'screenBaiakIdle') {
      refreshBotModules('baiak_idle');
    }
  }
  if (
    changes[AUTH_STORAGE.vip] ||
    changes[AUTH_STORAGE.contaStatus] ||
    changes.tibiaBotExtensionOutdated ||
    changes.tibiaBotRequiredVersion
  ) {
    const vip = changes[AUTH_STORAGE.vip]
      ? !!changes[AUTH_STORAGE.vip].newValue
      : isVipAuth(lastAuth);
    const cs = changes[AUTH_STORAGE.contaStatus]
      ? changes[AUTH_STORAGE.contaStatus].newValue
      : lastAuth.contaStatus;
    const outdated = changes.tibiaBotExtensionOutdated
      ? !!changes.tibiaBotExtensionOutdated.newValue
      : !!lastAuth.extensionOutdated;
    const requiredVersion = changes.tibiaBotRequiredVersion
      ? String(changes.tibiaBotRequiredVersion.newValue || '')
      : lastAuth.requiredVersion;
    lastAuth = {
      ...lastAuth,
      loggedIn: true,
      vip,
      contaStatus: cs,
      extensionOutdated: outdated,
      requiredVersion
    };
    applyAuthUi(lastAuth);
    if (outdated) {
      showScreen('screenHome');
      setStatus(
        statusHome,
        lastAuth.versionMessage || 'Atualize a extensão para usar o Baiak-Idle.',
        'err'
      );
      return;
    }
    const active = document.querySelector('.screen.is-active');
    if (active?.id === 'screenBaiakIdle') {
      refreshBotModules('baiak_idle');
    }
  }
});

async function init() {
  bindModules();
  const auth = await syncAuth();
  if (!applyAuthUi(auth)) return;
  await resumeLoggedInUi();
}

init();
