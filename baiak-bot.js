// ====================================================================
// BAIAK-IDLE BOT - Baseado na extensao TibiaBot.Online
// Cola no Console (F12) do jogo em https://baiakidle.com/jogar
// Para parar: BaiakBot.stop()
// ====================================================================

(function() {
'use strict';
if (window.BaiakBot) { try { window.BaiakBot.stop(); } catch(_){} }

// ======================== CONFIGURACAO ========================
const CONFIG = {
  // Auto Sell
  autoSell: true,
  sellMinPct: 70,             // Vende quando loot >= X% (padrao 70%)
  sellSettleMs: 4000,         // Cooldown apos vender (ms)
  sellPollMs: 700,            // Intervalo de checagem (ms)
  sellConfirmTimeoutMs: 8000, // Timeout pra confirmar

  // Protecao de raros (nao vende itens desses tiers)
  protectTiers: [2, 3, 4, 5], // 2=Rare(azul), 3=Epic(roxo), 4=Dourado, 5=Mitico(vermelho)

  // Mover Itens (move itens raros pro backpack automaticamente)
  moverItens: true,
  moverTiers: [2, 3, 4, 5],  // Tiers pra mover pro backpack
  moverDelayMs: 300,          // Delay entre cada move

  // Pular Boss
  skipBoss: true,

  // Membro Morto
  memberDead: true,

  // Retornar Hunt
  retornarHunt: true,
  huntName: null,             // Nome da hunt (null = volta pra mesma)

  // Stamina
  stamina: false,
  staminaMinPct: 15,          // Abaixo disso -> treino
  staminaMaxPct: 30,          // Acima disso -> volta pra hunt

  // Overlay
  overlay: true,

  // Geral
  mainLoopMs: 1000            // Loop principal (ms)
};


// ======================== TIERS / RARIDADES ========================
const TIERS = {
  0: { key: 'common',    label: 'Common',    color: '#cfd2d8' },
  1: { key: 'uncommon',  label: 'Uncommon',  color: '#57b85a' },
  2: { key: 'rare',      label: 'Rare',      color: '#4a90e8' },
  3: { key: 'epic',      label: 'Epic',      color: '#a05be0' },
  4: { key: 'legendary', label: 'Dourado',   color: '#e0b35a' },
  5: { key: 'mythic',    label: 'Mitico',    color: '#e53935' }
};

// ======================== SELETORES ========================
const SEL = {
  // Inventario / Loot
  INV_GRID: '#inv-grid',
  BACKPACK_GRID: '#backpack-grid',
  INV_COUNT: '#inv-count',
  CELL_ITEM: '.cell[data-cmpitem]',

  // Auto Sell
  SELL_ALL: 'button#sell-all',
  CONFIRM_YES: 'button#confirm-yes',

  // Boss
  BOSSBAR_FRAME: '.bossbar-frame',

  // Membro morto
  MEMBER_DEAD: '.member.dead',

  // Hunts / Teleporte
  WAVE_TITLE: '#wave-title',
  TP_MENU: '#teleport-menu',
  TP_HUNTS: 'button.tp-opt[data-tp="hunts"]',
  TP_EXERCISE: 'button.tp-opt[data-tp="exercise"]',
  TP_CITY: 'button.tp-opt[data-tp="city"]',

  // Stamina
  STAMINA_PCT: '#stamina-pct',

  // Hunt buttons
  HUNT_RANK_ALL: '.sp-cat',
  STAGE_GO: 'button.stage-go'
};


// ======================== UTILIDADES ========================
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function isClickable(el) {
  if (!el) return false;
  try {
    if (el.disabled || el.getAttribute('disabled') != null) return false;
    var style = window.getComputedStyle(el);
    if (!style) return true;
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    var rect = el.getBoundingClientRect();
    if (rect && rect.width <= 0 && rect.height <= 0) return false;
    return true;
  } catch(_) { return true; }
}

function parseCmpItem(cell) {
  if (!cell) return null;
  var raw = cell.getAttribute('data-cmpitem');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch(_) { return null; }
}

function getItemTier(cell) {
  var data = parseCmpItem(cell);
  if (!data || typeof data.tier !== 'number') return null;
  var tier = data.tier | 0;
  return (tier >= 0 && tier <= 5) ? tier : null;
}

function shiftClick(el) {
  if (!el) return false;
  try {
    var opts = { bubbles: true, cancelable: true, view: window, shiftKey: true, button: 0, buttons: 1 };
    el.dispatchEvent(new MouseEvent('pointerdown', opts));
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
    return true;
  } catch(_) { return false; }
}

function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

function log(module, msg) {
  var time = new Date().toLocaleTimeString();
  console.log('[' + time + '] [' + module + '] ' + msg);
}


// ======================== AUTO SELL ========================
var autoSellState = {
  busy: false,
  awaitingConfirm: false,
  confirmDeadline: 0,
  nextReadyAt: 0
};

function readInventoryFill() {
  var el = $(SEL.INV_COUNT);
  if (!el) return null;
  var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
  var m = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (!m) return null;
  var used = parseInt(m[1], 10);
  var total = parseInt(m[2], 10);
  if (!total) return null;
  return { used: used, total: total, pct: (used / total) * 100 };
}

function hasProtectedItems() {
  var grid = $(SEL.INV_GRID);
  if (!grid) return false;
  var cells = grid.querySelectorAll(SEL.CELL_ITEM);
  for (var i = 0; i < cells.length; i++) {
    var tier = getItemTier(cells[i]);
    if (tier !== null && CONFIG.protectTiers.indexOf(tier) !== -1) {
      var data = parseCmpItem(cells[i]);
      var name = data ? data.name : 'item';
      var info = TIERS[tier] || {};
      log('AutoSell', 'ITEM PROTEGIDO: ' + name + ' (Tier ' + tier + ' ' + (info.label || '') + ')');
      return true;
    }
  }
  return false;
}

function tickAutoSell() {
  if (!CONFIG.autoSell) return;
  if (autoSellState.busy) return;

  // Cooldown ativo
  if (autoSellState.nextReadyAt && Date.now() < autoSellState.nextReadyAt) return;
  autoSellState.nextReadyAt = 0;

  // Aguardando confirmacao
  if (autoSellState.awaitingConfirm) {
    if (Date.now() > autoSellState.confirmDeadline) {
      autoSellState.awaitingConfirm = false;
      return;
    }
    var confirmBtn = $(SEL.CONFIRM_YES);
    if (confirmBtn && isClickable(confirmBtn)) {
      var txt = (confirmBtn.textContent || '').trim().toLowerCase();
      if (!txt.includes('liberar')) {
        log('AutoSell', 'Confirmando venda...');
        confirmBtn.click();
        autoSellState.awaitingConfirm = false;
        autoSellState.nextReadyAt = Date.now() + CONFIG.sellSettleMs;
        window.BaiakBot.stats.vendas++;
        log('AutoSell', 'Venda #' + window.BaiakBot.stats.vendas + ' confirmada! Cooldown ' + (CONFIG.sellSettleMs/1000) + 's');
      }
    }
    return;
  }

  // Verifica fill
  var fill = readInventoryFill();
  if (!fill || fill.pct < CONFIG.sellMinPct) return;

  // Verifica itens protegidos
  if (CONFIG.protectTiers.length && hasProtectedItems()) {
    log('AutoSell', 'Loot cheio mas tem item RARO! Nao vendendo.');
    return;
  }

  // Clica vender
  var sellBtn = $(SEL.SELL_ALL);
  if (!sellBtn || !isClickable(sellBtn)) return;

  autoSellState.busy = true;
  log('AutoSell', 'Loot em ' + Math.floor(fill.pct) + '% (>=' + CONFIG.sellMinPct + '%). Vendendo...');
  sellBtn.click();
  autoSellState.awaitingConfirm = true;
  autoSellState.confirmDeadline = Date.now() + CONFIG.sellConfirmTimeoutMs;

  setTimeout(function() { autoSellState.busy = false; }, 400);
}


// ======================== MOVER ITENS ========================
var moverState = { busy: false };

async function tickMoverItens() {
  if (!CONFIG.moverItens) return;
  if (moverState.busy) return;

  var grid = $(SEL.INV_GRID);
  if (!grid) return;

  var cells = grid.querySelectorAll(SEL.CELL_ITEM);
  var toMove = [];
  for (var i = 0; i < cells.length; i++) {
    var tier = getItemTier(cells[i]);
    if (tier !== null && CONFIG.moverTiers.indexOf(tier) !== -1) {
      toMove.push(cells[i]);
    }
  }

  if (!toMove.length) return;

  moverState.busy = true;
  for (var j = 0; j < toMove.length; j++) {
    var cell = toMove[j];
    var data = parseCmpItem(cell);
    var name = data ? data.name : 'item';
    var ok = shiftClick(cell);
    log('MoverItens', (ok ? 'Moveu' : 'Falha') + ': ' + name + ' (T' + getItemTier(cell) + ')');
    await sleep(CONFIG.moverDelayMs);
  }
  moverState.busy = false;
}

// ======================== PULAR BOSS ========================
function tickSkipBoss() {
  if (!CONFIG.skipBoss) return;
  var bossbar = $(SEL.BOSSBAR_FRAME);
  if (bossbar && isClickable(bossbar)) {
    window.BaiakBot.stats.bossesSkipped++;
    log('PularBoss', 'Boss detectado! Recarregando pagina... (#' + window.BaiakBot.stats.bossesSkipped + ')');
    setTimeout(function() { location.reload(); }, 800);
  }
}

// ======================== MEMBRO MORTO ========================
function tickMemberDead() {
  if (!CONFIG.memberDead) return;
  var dead = $(SEL.MEMBER_DEAD);
  if (dead) {
    window.BaiakBot.stats.membrosRevividos++;
    log('MembroMorto', 'Membro morto detectado! Recarregando...');
    setTimeout(function() { location.reload(); }, 800);
  }
}


// ======================== RETORNAR HUNT ========================
var huntState = { busy: false, lastAction: 0, cooldownMs: 5000 };

function tickRetornarHunt() {
  if (!CONFIG.retornarHunt) return;
  if (huntState.busy) return;
  if (Date.now() - huntState.lastAction < huntState.cooldownMs) return;

  // Verifica se nao esta em hunt (wave-title mostra "Cidade" ou "Manutencao")
  var waveTitle = $(SEL.WAVE_TITLE);
  if (!waveTitle) return;
  var text = (waveTitle.textContent || '').trim().toLowerCase();

  // Se esta em cidade ou manutencao, precisa voltar
  if (text.includes('cidade') || text.includes('manuten')) {
    huntState.busy = true;
    huntState.lastAction = Date.now();
    log('RetornarHunt', 'Detectado: "' + text + '". Voltando pra hunt...');

    // Clica no wave-title pra abrir menu de teleporte
    waveTitle.click();

    setTimeout(function() {
      var huntBtn = $(SEL.TP_HUNTS);
      if (huntBtn && isClickable(huntBtn)) {
        huntBtn.click();
        log('RetornarHunt', 'Clicou em Hunts no teleporte');

        // Espera a lista carregar e clica em "Cacar" na hunt ativa
        setTimeout(function() {
          // Procura o botao "Atual" ou o primeiro "Cacar"
          var btns = $$(SEL.STAGE_GO);
          var clicked = false;
          for (var i = 0; i < btns.length; i++) {
            var btnText = (btns[i].textContent || '').trim();
            if (btnText === 'Atual') {
              btns[i].click();
              clicked = true;
              log('RetornarHunt', 'Clicou em "Atual"');
              break;
            }
          }
          if (!clicked) {
            // Tenta o primeiro "Cacar"
            for (var j = 0; j < btns.length; j++) {
              var btnText2 = (btns[j].textContent || '').trim();
              if (btnText2 === 'Cacar' || btnText2 === 'Caçar') {
                btns[j].click();
                log('RetornarHunt', 'Clicou em "Cacar"');
                break;
              }
            }
          }
          window.BaiakBot.stats.huntsRetornadas++;
          huntState.busy = false;
        }, 1500);
      } else {
        huntState.busy = false;
      }
    }, 800);
  }
}


// ======================== STAMINA ========================
var staminaState = { busy: false, lastAction: 0, cooldownMs: 10000, mode: '' };

function readStaminaPct() {
  var el = $(SEL.STAMINA_PCT);
  if (!el) return null;
  var m = (el.textContent || '').trim().match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  var n = parseFloat(m[1].replace(',', '.'));
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
}

function tickStamina() {
  if (!CONFIG.stamina) return;
  if (staminaState.busy) return;
  if (Date.now() - staminaState.lastAction < staminaState.cooldownMs) return;

  var pct = readStaminaPct();
  if (pct === null) return;

  // Abaixo do minimo -> vai pro treino
  if (pct <= CONFIG.staminaMinPct && staminaState.mode !== 'exercise') {
    staminaState.busy = true;
    staminaState.lastAction = Date.now();
    log('Stamina', 'Stamina em ' + pct + '% (<= ' + CONFIG.staminaMinPct + '%). Indo pro treino...');

    var waveTitle = $(SEL.WAVE_TITLE);
    if (waveTitle) {
      waveTitle.click();
      setTimeout(function() {
        var exerciseBtn = $(SEL.TP_EXERCISE);
        if (exerciseBtn && isClickable(exerciseBtn)) {
          exerciseBtn.click();
          staminaState.mode = 'exercise';
          log('Stamina', 'Teleportou pro treino online');
        }
        staminaState.busy = false;
      }, 800);
    } else {
      staminaState.busy = false;
    }
    return;
  }

  // Acima do maximo -> volta pra hunt
  if (pct >= CONFIG.staminaMaxPct && staminaState.mode === 'exercise') {
    staminaState.busy = true;
    staminaState.lastAction = Date.now();
    log('Stamina', 'Stamina em ' + pct + '% (>= ' + CONFIG.staminaMaxPct + '%). Voltando pra hunt...');
    staminaState.mode = 'hunt';
    // Retornar Hunt vai cuidar de voltar
    staminaState.busy = false;
  }
}


// ======================== OVERLAY ========================
function createOverlay() {
  var old = document.getElementById('baiak-bot-overlay');
  if (old) old.remove();

  var el = document.createElement('div');
  el.id = 'baiak-bot-overlay';
  el.style.cssText = [
    'position:fixed', 'top:16px', 'left:16px', 'z-index:2147483647',
    'min-width:220px', 'max-width:320px', 'padding:12px 14px',
    'border-radius:12px', 'background:rgba(12,18,25,0.94)',
    'border:1px solid rgba(212,162,76,0.55)',
    'box-shadow:0 12px 28px rgba(0,0,0,0.4)',
    'color:#e8eef6', 'font:600 12px/1.4 Segoe UI,Tahoma,sans-serif',
    'user-select:none', 'cursor:grab'
  ].join(';');
  document.body.appendChild(el);

  // Drag
  var dragging = false, startX = 0, startY = 0, origLeft = 0, origTop = 0;
  el.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    dragging = true; startX = e.clientX; startY = e.clientY;
    origLeft = el.offsetLeft; origTop = el.offsetTop;
    el.style.opacity = '0.9';
  });
  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    el.style.left = (origLeft + e.clientX - startX) + 'px';
    el.style.top = (origTop + e.clientY - startY) + 'px';
  });
  document.addEventListener('mouseup', function() {
    dragging = false; el.style.opacity = '1';
  });

  return el;
}

function updateOverlay() {
  if (!CONFIG.overlay) return;
  var el = document.getElementById('baiak-bot-overlay');
  if (!el) el = createOverlay();

  var stats = window.BaiakBot.stats;
  var uptime = Math.floor((Date.now() - stats.inicio) / 60000);
  var fill = readInventoryFill();
  var fillText = fill ? Math.floor(fill.pct) + '%' : '?';
  var staminaPct = readStaminaPct();
  var staminaText = staminaPct !== null ? staminaPct + '%' : '?';

  var dot = function(on) { return '<span style="color:' + (on ? '#3dba7a' : '#f87171') + '">●</span> '; };

  el.innerHTML = [
    '<div style="font-size:13px;font-weight:700;margin-bottom:8px;color:#d4a24c;">BaiakBot</div>',
    dot(CONFIG.autoSell) + 'Auto Sell (' + fillText + ' / ' + CONFIG.sellMinPct + '%) — Vendas: ' + stats.vendas,
    dot(CONFIG.moverItens) + 'Mover Itens (T' + CONFIG.moverTiers.join(',T') + ')',
    dot(CONFIG.skipBoss) + 'Pular Boss — Skips: ' + stats.bossesSkipped,
    dot(CONFIG.memberDead) + 'Membro Morto',
    dot(CONFIG.retornarHunt) + 'Retornar Hunt — Retornos: ' + stats.huntsRetornadas,
    dot(CONFIG.stamina) + 'Stamina (' + staminaText + ') [' + CONFIG.staminaMinPct + '-' + CONFIG.staminaMaxPct + '%]',
    '<div style="margin-top:6px;font-size:11px;color:#93a4b8;">Protegendo: T' + CONFIG.protectTiers.join(', T') + ' | Uptime: ' + uptime + 'min</div>'
  ].join('<br>');
}


// ======================== CONTROLE PRINCIPAL ========================
window.BaiakBot = {
  config: CONFIG,
  stats: { vendas: 0, bossesSkipped: 0, huntsRetornadas: 0, membrosRevividos: 0, itensMovidos: 0, inicio: Date.now() },
  _intervals: [],

  start: function() {
    var self = this;

    if (CONFIG.overlay) createOverlay();

    // Auto Sell loop
    var sellLoop = setInterval(function() { tickAutoSell(); }, CONFIG.sellPollMs);
    this._intervals.push(sellLoop);

    // Main loop (boss, member, hunt, stamina, overlay, mover)
    var mainLoop = setInterval(function() {
      tickSkipBoss();
      tickMemberDead();
      tickRetornarHunt();
      tickStamina();
      tickMoverItens();
      updateOverlay();
    }, CONFIG.mainLoopMs);
    this._intervals.push(mainLoop);

    console.log('%c BaiakBot Iniciado! ', 'background:#d4a24c;color:#1a1205;font-weight:bold;font-size:14px;padding:4px 8px;border-radius:4px;');
    console.log('');
    console.log('%c Modulos ativos:', 'font-weight:bold;');
    console.log('  ' + (CONFIG.autoSell ? '✅' : '❌') + ' Auto Sell (vende em ' + CONFIG.sellMinPct + '%)');
    console.log('  ' + (CONFIG.moverItens ? '✅' : '❌') + ' Mover Itens (T' + CONFIG.moverTiers.join(',T') + ' -> backpack)');
    console.log('  ' + (CONFIG.skipBoss ? '✅' : '❌') + ' Pular Boss');
    console.log('  ' + (CONFIG.memberDead ? '✅' : '❌') + ' Membro Morto');
    console.log('  ' + (CONFIG.retornarHunt ? '✅' : '❌') + ' Retornar Hunt');
    console.log('  ' + (CONFIG.stamina ? '✅' : '❌') + ' Stamina (' + CONFIG.staminaMinPct + '-' + CONFIG.staminaMaxPct + '%)');
    console.log('');
    console.log('%c Protegendo tiers:', 'font-weight:bold;', CONFIG.protectTiers.map(function(t) { return 'T' + t + '(' + (TIERS[t]||{}).label + ')'; }).join(', '));
    console.log('');
    console.log('%c Comandos:', 'font-weight:bold;');
    console.log('  BaiakBot.stop()                    — Para tudo');
    console.log('  BaiakBot.status()                  — Ver stats');
    console.log('  BaiakBot.config.autoSell = false   — Desliga Auto Sell');
    console.log('  BaiakBot.config.skipBoss = false   — Desliga Pular Boss');
    console.log('  BaiakBot.config.moverItens = false — Desliga Mover Itens');
    console.log('  BaiakBot.config.sellMinPct = 90    — Muda % pra vender');
    console.log('  BaiakBot.config.protectTiers = [3,4,5] — Muda tiers protegidos');
  },

  stop: function() {
    this._intervals.forEach(function(i) { clearInterval(i); });
    this._intervals = [];
    var overlay = document.getElementById('baiak-bot-overlay');
    if (overlay) overlay.remove();
    console.log('%c BaiakBot Parado! ', 'background:#f87171;color:#1a1205;font-weight:bold;font-size:14px;padding:4px 8px;border-radius:4px;');
  },

  status: function() {
    var uptime = Math.floor((Date.now() - this.stats.inicio) / 60000);
    console.log('%c Status BaiakBot:', 'font-weight:bold;color:#d4a24c;');
    console.log('  Vendas: ' + this.stats.vendas);
    console.log('  Bosses pulados: ' + this.stats.bossesSkipped);
    console.log('  Hunts retornadas: ' + this.stats.huntsRetornadas);
    console.log('  Membros mortos: ' + this.stats.membrosRevividos);
    console.log('  Uptime: ' + uptime + ' min');
    var fill = readInventoryFill();
    if (fill) console.log('  Loot: ' + fill.used + '/' + fill.total + ' (' + Math.floor(fill.pct) + '%)');
    var stam = readStaminaPct();
    if (stam !== null) console.log('  Stamina: ' + stam + '%');
  }
};

// Inicia automaticamente
window.BaiakBot.start();

})();
