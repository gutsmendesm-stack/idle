// Popup - interface de controle dos modulos

const MODULES_META = [
  { id: 'pular_boss', label: 'Pular Boss', desc: 'Detecta o boss e reinicia a hunt.' },
  { id: 'member_dead', label: 'Membro Morto', desc: 'Detecta membro morto e reinicia a hunt.' },
  { id: 'retornar_hunt', label: 'Retornar Hunt', desc: 'Manutencao/Cidade → hunt ativa.' },
  { id: 'auto_sell', label: 'Auto Sell', desc: 'Vende quando a mochila atinge o %.' },
  { id: 'stamina', label: 'Stamina', desc: '% min → treino · % max → volta hunt.' },
  { id: 'xp_hora', label: 'XP/h', desc: 'XP/h real (XP Gain x tempo, a cada 10s).' },
  { id: 'gold_hora', label: 'Gold/h', desc: 'Gold/h real (Balance x tempo, a cada 10s).' },
  { id: 'mover_itens', label: 'Mover Itens', desc: 'Move itens do tier escolhido pro backpack.' },
  { id: 'auto_anuncio', label: 'Auto Anuncio', desc: 'Envia mensagem no canal em intervalo.' }
];

function renderModules(state) {
  const container = document.getElementById('modulesList');
  container.innerHTML = '';

  for (const meta of MODULES_META) {
    const enabled = state[meta.id]?.enabled || false;
    const div = document.createElement('div');
    div.className = 'module';
    div.innerHTML = `
      <div class="module-info">
        <div class="module-label">${meta.label}</div>
        <div class="module-desc">${meta.desc}</div>
      </div>
      <label class="switch">
        <input type="checkbox" data-module="${meta.id}" ${enabled ? 'checked' : ''}>
        <span></span>
      </label>
    `;
    container.appendChild(div);
  }

  // Bind toggle events
  container.querySelectorAll('input[data-module]').forEach(input => {
    input.addEventListener('change', (e) => {
      const moduleId = e.target.dataset.module;
      const enabled = e.target.checked;
      chrome.runtime.sendMessage({ type: 'TOGGLE_MODULE', moduleId, enabled });
      updateConfigVisibility();
      updateStatus();
    });
  });
}

function updateConfigVisibility() {
  const autoSellCheck = document.querySelector('[data-module="auto_sell"]');
  const moverCheck = document.querySelector('[data-module="mover_itens"]');
  const staminaCheck = document.querySelector('[data-module="stamina"]');
  const anuncioCheck = document.querySelector('[data-module="auto_anuncio"]');

  document.getElementById('autoSellConfig').style.display =
    autoSellCheck?.checked ? 'block' : 'none';
  document.getElementById('moverConfig').style.display =
    moverCheck?.checked ? 'block' : 'none';
  document.getElementById('staminaConfig').style.display =
    staminaCheck?.checked ? 'block' : 'none';
  document.getElementById('anuncioConfig').style.display =
    anuncioCheck?.checked ? 'block' : 'none';
}

function updateStatus() {
  const checks = document.querySelectorAll('input[data-module]:checked');
  const pill = document.getElementById('statusPill');
  if (checks.length > 0) {
    pill.textContent = checks.length + ' modulo' + (checks.length > 1 ? 's' : '') + ' ativo' + (checks.length > 1 ? 's' : '');
    pill.className = 'status-pill';
  } else {
    pill.textContent = 'Nenhum modulo ativo';
    pill.className = 'status-pill inactive';
  }
}

function loadConfig(data) {
  // Auto Sell
  const sellCfg = data.baiakBotAutoSellConfig || { minPct: 70 };
  document.getElementById('sellMinPct').value = sellCfg.minPct || 70;

  // Mover Tiers
  const tiers = data.baiakBotMoverTiers || { 0: false, 1: false, 2: true, 3: true, 4: true, 5: true };
  document.querySelectorAll('.tier-chip').forEach(chip => {
    const tier = chip.dataset.tier;
    if (tiers[tier]) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  // Stamina
  const stamCfg = data.baiakBotStaminaConfig || { minPct: 15, maxPct: 30 };
  document.getElementById('staminaMin').value = stamCfg.minPct || 15;
  document.getElementById('staminaMax').value = stamCfg.maxPct || 30;

  // Auto Anuncio
  const anCfg = data.baiakBotAutoAnuncioConfig || { channel: 'geral', text: '', intervalMin: 5 };
  document.getElementById('anuncioChannel').value = anCfg.channel || 'geral';
  document.getElementById('anuncioInterval').value = anCfg.intervalMin || 5;
  document.getElementById('anuncioText').value = anCfg.text || '';
}

function saveConfig() {
  const config = {};

  // Auto Sell
  config.baiakBotAutoSellConfig = {
    minPct: Math.max(1, Math.min(100, parseInt(document.getElementById('sellMinPct').value) || 70))
  };

  // Mover Tiers
  const tiers = {};
  document.querySelectorAll('.tier-chip').forEach(chip => {
    tiers[chip.dataset.tier] = chip.classList.contains('active');
  });
  config.baiakBotMoverTiers = tiers;

  // Stamina
  config.baiakBotStaminaConfig = {
    minPct: Math.max(0, Math.min(99, parseInt(document.getElementById('staminaMin').value) || 15)),
    maxPct: Math.max(1, Math.min(100, parseInt(document.getElementById('staminaMax').value) || 30))
  };

  // Auto Anuncio
  config.baiakBotAutoAnuncioConfig = {
    channel: document.getElementById('anuncioChannel').value || 'geral',
    text: (document.getElementById('anuncioText').value || '').trim().slice(0, 200),
    intervalMin: Math.max(1, Math.min(120, parseInt(document.getElementById('anuncioInterval').value) || 5))
  };

  chrome.runtime.sendMessage({ type: 'SAVE_CONFIG', config });
}

function bindConfigEvents() {
  // Tier chips toggle
  document.querySelectorAll('.tier-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      saveConfig();
    });
  });

  // Input changes
  const inputs = ['sellMinPct', 'staminaMin', 'staminaMax', 'anuncioChannel', 'anuncioInterval', 'anuncioText'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', saveConfig);
      el.addEventListener('input', debounce(saveConfig, 500));
    }
  });
}

function debounce(fn, ms) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // AutoBoss button
  document.getElementById('openAutoBoss').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('autoboss.html') });
  });

  chrome.runtime.sendMessage({ type: 'GET_MODULES_STATE' }, (response) => {
    if (!response?.success) return;
    renderModules(response.modules);
    loadConfig(response.config || {});
    updateConfigVisibility();
    updateStatus();
    bindConfigEvents();
  });
});
