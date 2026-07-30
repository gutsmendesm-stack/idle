// Content script - injeta os modulos na pagina do jogo
// Roda automaticamente em https://baiakidle.com/jogar/*

(function() {
  'use strict';

  const MODULES_ORDER = [
    'seletores',
    'pular_boss',
    'member_dead',
    'retornar_hunt',
    'auto_sell',
    'stamina',
    'xp_hora',
    'gold_hora',
    'mover_itens',
    'auto_anuncio',
    'auto_boss'
  ];

  const STORAGE_KEYS = {
    pular_boss: 'baiakBotPularBossEnabled',
    member_dead: 'baiakBotMemberDeadEnabled',
    retornar_hunt: 'baiakBotRetornarHuntEnabled',
    auto_sell: 'baiakBotAutoSellEnabled',
    stamina: 'baiakBotStaminaEnabled',
    xp_hora: 'baiakBotXpHoraEnabled',
    gold_hora: 'baiakBotGoldHoraEnabled',
    mover_itens: 'baiakBotMoverItensEnabled',
    auto_anuncio: 'baiakBotAutoAnuncioEnabled',
    auto_boss: 'baiakBotAutoBossEnabled'
  };

  const MODULE_CLASSES = {
    pular_boss: 'BaiakIdlePularBossModule',
    member_dead: 'BaiakIdleMemberDeadModule',
    retornar_hunt: 'BaiakIdleRetornarHuntModule',
    auto_sell: 'BaiakIdleAutoSellModule',
    stamina: 'BaiakIdleStaminaModule',
    xp_hora: 'BaiakIdleXpHoraModule',
    gold_hora: 'BaiakIdleGoldHoraModule',
    mover_itens: 'BaiakIdleMoverItensModule',
    auto_anuncio: 'BaiakIdleAutoAnuncioModule',
    auto_boss: 'BaiakIdleAutoBossModule'
  };

  const MODULE_INSTANCES = {
    pular_boss: '__baiakBotPularBoss',
    member_dead: '__baiakBotMemberDead',
    retornar_hunt: '__baiakBotRetornarHunt',
    auto_sell: '__baiakBotAutoSell',
    stamina: '__baiakBotStamina',
    xp_hora: '__baiakBotXpHora',
    gold_hora: '__baiakBotGoldHora',
    mover_itens: '__baiakBotMoverItens',
    auto_anuncio: '__baiakBotAutoAnuncio',
    auto_boss: '__baiakBotAutoBoss'
  };

  function injectScript(code) {
    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob([code], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
          URL.revokeObjectURL(url);
          script.remove();
          resolve();
        };
        script.onerror = (err) => {
          URL.revokeObjectURL(url);
          script.remove();
          reject(err);
        };
        (document.head || document.documentElement).appendChild(script);
      } catch (err) {
        reject(err);
      }
    });
  }

  function injectConfig() {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (data) => {
        const config = {
          selectedHunt: data.baiakBotSelectedHunt || null,
          moverTiers: data.baiakBotMoverTiers || { 0: false, 1: false, 2: true, 3: true, 4: true, 5: true },
          staminaConfig: data.baiakBotStaminaConfig || { minPct: 15, maxPct: 30 },
          autoSellConfig: data.baiakBotAutoSellConfig || { minPct: 70 },
          autoAnuncioConfig: data.baiakBotAutoAnuncioConfig || { channel: 'geral', text: '', intervalMin: 5 }
        };

        const code = `
          window.__baiakIdleSelectedHunt = ${JSON.stringify(config.selectedHunt)};
          window.__baiakIdleMoverItensTiers = ${JSON.stringify(config.moverTiers)};
          window.__baiakIdleStaminaConfig = ${JSON.stringify(config.staminaConfig)};
          window.__baiakIdleAutoSellConfig = ${JSON.stringify(config.autoSellConfig)};
          window.__baiakIdleAutoSellVenderLootBoss = false;
          window.__baiakIdleAutoAnuncioConfig = ${JSON.stringify(config.autoAnuncioConfig)};
          window.__baiakIdleAutoBossQueue = [];
          window.__baiakIdleAutoBossRunIndex = 0;
        `;
        injectScript(code).then(resolve).catch(resolve);
      });
    });
  }

  async function injectModule(name) {
    try {
      const url = chrome.runtime.getURL('modules/' + name + '.js');
      const response = await fetch(url);
      const code = await response.text();
      await injectScript(code);
      console.log('[BaiakBot] Modulo injetado: ' + name);
    } catch (err) {
      console.error('[BaiakBot] Erro ao injetar ' + name + ':', err);
    }
  }

  async function startModule(name) {
    const className = MODULE_CLASSES[name];
    const instanceKey = MODULE_INSTANCES[name];
    if (!className || !instanceKey) return;

    const code = `
      (function() {
        try {
          if (!window['${className}']) return;
          if (!window['${instanceKey}']) {
            window['${instanceKey}'] = new window['${className}']();
          }
          window['${instanceKey}'].start();
          console.log('[BaiakBot] Modulo iniciado: ${name}');
        } catch(err) {
          console.error('[BaiakBot] Erro ao iniciar ${name}:', err);
        }
      })();
    `;
    await injectScript(code);
  }

  async function stopModule(name) {
    const instanceKey = MODULE_INSTANCES[name];
    if (!instanceKey) return;

    const code = `
      (function() {
        try {
          if (window['${instanceKey}'] && window['${instanceKey}'].stop) {
            window['${instanceKey}'].stop();
            console.log('[BaiakBot] Modulo parado: ${name}');
          }
        } catch(err) {}
      })();
    `;
    await injectScript(code);
  }

  async function init() {
    console.log('[BaiakBot] Inicializando...');

    // Injeta configs primeiro
    await injectConfig();

    // Injeta seletores (base obrigatoria)
    await injectModule('seletores');

    // Carrega estado dos modulos e injeta/inicia os ativos
    chrome.storage.local.get(null, async (data) => {
      for (const name of MODULES_ORDER) {
        if (name === 'seletores') continue;
        const key = STORAGE_KEYS[name];
        if (!key) continue;

        // Injeta o modulo sempre (pra ficar disponivel)
        await injectModule(name);

        // Inicia se estiver ligado
        if (data[key]) {
          await startModule(name);
        }
      }
      console.log('[BaiakBot] Todos os modulos carregados!');
    });
  }

  // Escuta mudancas de config (toggle via popup)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;

    for (const [key, change] of Object.entries(changes)) {
      // Encontra qual modulo corresponde a essa key
      for (const [name, storageKey] of Object.entries(STORAGE_KEYS)) {
        if (key === storageKey) {
          if (change.newValue) {
            startModule(name);
          } else {
            stopModule(name);
          }
          break;
        }
      }

      // Atualiza configs
      if (key === 'baiakBotMoverTiers') {
        injectScript('window.__baiakIdleMoverItensTiers = ' + JSON.stringify(change.newValue) + ';');
      }
      if (key === 'baiakBotStaminaConfig') {
        injectScript('window.__baiakIdleStaminaConfig = ' + JSON.stringify(change.newValue) + ';');
      }
      if (key === 'baiakBotAutoSellConfig') {
        injectScript('window.__baiakIdleAutoSellConfig = ' + JSON.stringify(change.newValue) + ';');
      }
      if (key === 'baiakBotAutoAnuncioConfig') {
        injectScript('window.__baiakIdleAutoAnuncioConfig = ' + JSON.stringify(change.newValue) + ';');
      }
      if (key === 'baiakBotSelectedHunt') {
        injectScript('window.__baiakIdleSelectedHunt = ' + JSON.stringify(change.newValue) + ';');
      }
    }
  });

  // Inicia quando a pagina estiver pronta
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
