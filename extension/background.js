// Background service worker - gerencia estado e injeta modulos
// Usa chrome.scripting.executeScript com world:'MAIN' para bypass CSP

const MODULES = {
  pular_boss: { label: 'Pular Boss', storageKey: 'baiakBotPularBossEnabled', className: 'BaiakIdlePularBossModule', instanceKey: '__baiakBotPularBoss' },
  member_dead: { label: 'Membro Morto', storageKey: 'baiakBotMemberDeadEnabled', className: 'BaiakIdleMemberDeadModule', instanceKey: '__baiakBotMemberDead' },
  retornar_hunt: { label: 'Retornar Hunt', storageKey: 'baiakBotRetornarHuntEnabled', className: 'BaiakIdleRetornarHuntModule', instanceKey: '__baiakBotRetornarHunt' },
  auto_sell: { label: 'Auto Sell', storageKey: 'baiakBotAutoSellEnabled', className: 'BaiakIdleAutoSellModule', instanceKey: '__baiakBotAutoSell' },
  stamina: { label: 'Stamina', storageKey: 'baiakBotStaminaEnabled', className: 'BaiakIdleStaminaModule', instanceKey: '__baiakBotStamina' },
  xp_hora: { label: 'XP/h', storageKey: 'baiakBotXpHoraEnabled', className: 'BaiakIdleXpHoraModule', instanceKey: '__baiakBotXpHora' },
  gold_hora: { label: 'Gold/h', storageKey: 'baiakBotGoldHoraEnabled', className: 'BaiakIdleGoldHoraModule', instanceKey: '__baiakBotGoldHora' },
  mover_itens: { label: 'Mover Itens', storageKey: 'baiakBotMoverItensEnabled', className: 'BaiakIdleMoverItensModule', instanceKey: '__baiakBotMoverItens' },
  auto_anuncio: { label: 'Auto Anuncio', storageKey: 'baiakBotAutoAnuncioEnabled', className: 'BaiakIdleAutoAnuncioModule', instanceKey: '__baiakBotAutoAnuncio' },
  auto_boss: { label: 'AutoBoss', storageKey: 'baiakBotAutoBossEnabled', className: 'BaiakIdleAutoBossModule', instanceKey: '__baiakBotAutoBoss' }
};

const MODULES_ORDER = [
  'pular_boss', 'member_dead', 'retornar_hunt', 'auto_sell',
  'stamina', 'xp_hora', 'gold_hora', 'mover_itens', 'auto_anuncio', 'auto_boss'
];

function isPlayTab(url) {
  if (!url) return false;
  return url.includes('baiakidle.com/jogar');
}

async function getPlayTabId() {
  const tabs = await chrome.tabs.query({ url: ['https://baiakidle.com/jogar*', 'https://www.baiakidle.com/jogar*'] });
  return tabs.length > 0 ? tabs[0].id : null;
}

async function injectConfig(tabId) {
  const data = await chrome.storage.local.get(null);
  const config = {
    selectedHunt: data.baiakBotSelectedHunt || null,
    moverTiers: data.baiakBotMoverTiers || { 0: false, 1: false, 2: true, 3: true, 4: true, 5: true },
    staminaConfig: data.baiakBotStaminaConfig || { minPct: 15, maxPct: 30 },
    autoSellConfig: data.baiakBotAutoSellConfig || { minPct: 70 },
    autoAnuncioConfig: data.baiakBotAutoAnuncioConfig || { channel: 'geral', text: '', intervalMin: 5 }
  };

  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: (cfg) => {
      window.__baiakIdleSelectedHunt = cfg.selectedHunt;
      window.__baiakIdleMoverItensTiers = cfg.moverTiers;
      window.__baiakIdleStaminaConfig = cfg.staminaConfig;
      window.__baiakIdleAutoSellConfig = cfg.autoSellConfig;
      window.__baiakIdleAutoSellVenderLootBoss = false;
      window.__baiakIdleAutoAnuncioConfig = cfg.autoAnuncioConfig;
      window.__baiakIdleAutoBossQueue = [];
      window.__baiakIdleAutoBossRunIndex = 0;
    },
    args: [config]
  });
}

async function injectModuleFile(tabId, fileName) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      files: ['modules/' + fileName + '.js']
    });
    console.log('[BaiakBot] Injetado: ' + fileName);
  } catch(err) {
    console.error('[BaiakBot] Erro ao injetar ' + fileName + ':', err);
  }
}

async function startModule(tabId, name) {
  const meta = MODULES[name];
  if (!meta) return;

  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: (className, instanceKey) => {
      try {
        if (!window[className]) {
          console.error('[BaiakBot] Classe nao encontrada: ' + className);
          return;
        }
        if (!window[instanceKey]) {
          window[instanceKey] = new window[className]();
        }
        window[instanceKey].start();
        console.log('[BaiakBot] Modulo iniciado: ' + className);
      } catch(err) {
        console.error('[BaiakBot] Erro ao iniciar ' + className + ':', err);
      }
    },
    args: [meta.className, meta.instanceKey]
  });
}

async function stopModule(tabId, name) {
  const meta = MODULES[name];
  if (!meta) return;

  await chrome.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: (instanceKey) => {
      try {
        if (window[instanceKey] && window[instanceKey].stop) {
          window[instanceKey].stop();
          console.log('[BaiakBot] Modulo parado: ' + instanceKey);
        }
      } catch(err) {}
    },
    args: [meta.instanceKey]
  });
}

async function initPage(tabId) {
  console.log('[BaiakBot] Inicializando na tab ' + tabId);

  // 1. Injeta configs
  await injectConfig(tabId);

  // 2. Injeta seletores (base)
  await injectModuleFile(tabId, 'seletores');

  // 3. Injeta e inicia modulos ativos
  const data = await chrome.storage.local.get(null);

  for (const name of MODULES_ORDER) {
    await injectModuleFile(tabId, name);
    const meta = MODULES[name];
    if (data[meta.storageKey]) {
      await startModule(tabId, name);
    }
  }

  console.log('[BaiakBot] Todos os modulos carregados!');
}

// Responde mensagens
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  if (message.type === 'PAGE_READY') {
    const tabId = sender.tab?.id;
    if (tabId) {
      initPage(tabId);
    }
    return;
  }

  if (message.type === 'MODULE_TOGGLED') {
    (async () => {
      const tabId = await getPlayTabId();
      if (!tabId) return;
      const name = Object.keys(MODULES).find(n => MODULES[n].storageKey === message.key);
      if (!name) return;
      if (message.enabled) {
        await startModule(tabId, name);
      } else {
        await stopModule(tabId, name);
      }
    })();
    return;
  }

  if (message.type === 'GET_MODULES_STATE') {
    chrome.storage.local.get(null, (data) => {
      const state = {};
      for (const [id, meta] of Object.entries(MODULES)) {
        state[id] = { label: meta.label, enabled: !!data[meta.storageKey] };
      }
      sendResponse({ success: true, modules: state, config: data });
    });
    return true;
  }

  if (message.type === 'TOGGLE_MODULE') {
    const { moduleId, enabled } = message;
    const meta = MODULES[moduleId];
    if (!meta) { sendResponse({ success: false }); return; }
    chrome.storage.local.set({ [meta.storageKey]: !!enabled }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'SAVE_CONFIG') {
    chrome.storage.local.set(message.config, async () => {
      // Re-injeta configs na pagina
      const tabId = await getPlayTabId();
      if (tabId) await injectConfig(tabId);
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'GET_ACTIVE_MODULES') {
    chrome.storage.local.get(null, (data) => {
      const active = [];
      for (const [id, meta] of Object.entries(MODULES)) {
        if (data[meta.storageKey]) active.push(meta.label);
      }
      sendResponse({
        success: true,
        payload: {
          hasActive: active.length > 0,
          bots: active.length > 0 ? { baiak_bot: { botLabel: 'BaiakBot', modules: active } } : {}
        }
      });
    });
    return true;
  }
});

// Ao instalar, define configs padrao
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(null, (data) => {
    const defaults = {
      baiakBotMoverTiers: data.baiakBotMoverTiers || { 0: false, 1: false, 2: true, 3: true, 4: true, 5: true },
      baiakBotStaminaConfig: data.baiakBotStaminaConfig || { minPct: 15, maxPct: 30 },
      baiakBotAutoSellConfig: data.baiakBotAutoSellConfig || { minPct: 70 },
      baiakBotAutoAnuncioConfig: data.baiakBotAutoAnuncioConfig || { channel: 'geral', text: '', intervalMin: 5 }
    };
    chrome.storage.local.set(defaults);
  });
  console.log('[BaiakBot] Extensao instalada!');
});

// Quando tab do jogo carrega, injeta tudo
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isPlayTab(tab.url)) {
    setTimeout(() => initPage(tabId), 1500);
  }
});
