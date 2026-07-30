// Background service worker - gerencia estado dos modulos
// Sem autenticacao, sem VIP, tudo liberado

const MODULES = {
  pular_boss: { label: 'Pular Boss', storageKey: 'baiakBotPularBossEnabled' },
  member_dead: { label: 'Membro Morto', storageKey: 'baiakBotMemberDeadEnabled' },
  retornar_hunt: { label: 'Retornar Hunt', storageKey: 'baiakBotRetornarHuntEnabled' },
  auto_sell: { label: 'Auto Sell', storageKey: 'baiakBotAutoSellEnabled' },
  stamina: { label: 'Stamina', storageKey: 'baiakBotStaminaEnabled' },
  xp_hora: { label: 'XP/h', storageKey: 'baiakBotXpHoraEnabled' },
  gold_hora: { label: 'Gold/h', storageKey: 'baiakBotGoldHoraEnabled' },
  mover_itens: { label: 'Mover Itens', storageKey: 'baiakBotMoverItensEnabled' },
  auto_anuncio: { label: 'Auto Anuncio', storageKey: 'baiakBotAutoAnuncioEnabled' },
  auto_boss: { label: 'AutoBoss', storageKey: 'baiakBotAutoBossEnabled' }
};

// Responde mensagens do popup e content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  if (message.type === 'GET_MODULES_STATE') {
    chrome.storage.local.get(null, (data) => {
      const state = {};
      for (const [id, meta] of Object.entries(MODULES)) {
        state[id] = {
          label: meta.label,
          enabled: !!data[meta.storageKey]
        };
      }
      sendResponse({ success: true, modules: state, config: data });
    });
    return true;
  }

  if (message.type === 'TOGGLE_MODULE') {
    const { moduleId, enabled } = message;
    const meta = MODULES[moduleId];
    if (!meta) {
      sendResponse({ success: false, error: 'Modulo desconhecido' });
      return;
    }
    chrome.storage.local.set({ [meta.storageKey]: !!enabled }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'SAVE_CONFIG') {
    chrome.storage.local.set(message.config, () => {
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
          bots: active.length > 0 ? {
            baiak_bot: { botLabel: 'BaiakBot', modules: active }
          } : {}
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
      baiakBotAutoAnuncioConfig: data.baiakBotAutoAnuncioConfig || { channel: 'geral', text: '', intervalMin: 5 },
      baiakBotSelectedHunt: data.baiakBotSelectedHunt || null
    };
    chrome.storage.local.set(defaults);
  });
  console.log('[BaiakBot] Extensao instalada!');
});
