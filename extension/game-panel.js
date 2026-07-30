// Modal in-page do TibiaBot (Baiak Idle /jogar/) — mesma lógica/mensagens do popup

(function () {
  const ROOT_ID = 'tibia-bot-game-panel-root';
  const STYLE_ID = 'tibia-bot-game-panel-style';
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
  const STORAGE_KEY_CHARACTERS = 'baiakIdleCharacters';
  const STORAGE_KEY_OVERLAY_VISIBLE = 'tibiaBotOverlayVisible';
  const STORAGE_KEY_OCULTAR_NOMES = 'baiakIdleOcultarNomesEnabled';
  const STORAGE_KEY_BOSS_TRACK = 'baiakIdleBossTrack';
  const STORAGE_KEY_AUTOBOSS_PLAYLIST = 'baiakIdleAutoBossPlaylist';
  const STORAGE_KEY_AUTOBOSS_RUN = 'baiakIdleAutoBossRun';
  const BOSS_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const SITE_URL = 'https://tibiabot.online/';
  const CONTA_URL = 'https://tibiabot.online/conta.html';

  const MODULES = [
    {
      id: 'pular_boss',
      storageKey: 'baiakIdlePularBossEnabled',
      toggleId: 'gpPularBossToggle',
      startMsg: 'BAIAKIDLE_START_PULAR_BOSS',
      stopMsg: 'BAIAKIDLE_STOP_PULAR_BOSS',
      label: 'Pular Boss',
      desc: 'Detecta o boss e reinicia a hunt.'
    },
    {
      id: 'member_dead',
      storageKey: 'baiakIdleMemberDeadEnabled',
      toggleId: 'gpMemberDeadToggle',
      startMsg: 'BAIAKIDLE_START_MEMBER_DEAD',
      stopMsg: 'BAIAKIDLE_STOP_MEMBER_DEAD',
      label: 'Membro Morto',
      desc: 'Detecta membro morto e reinicia a hunt.'
    },
    {
      id: 'retornar_hunt',
      storageKey: STORAGE_KEY_RETORNAR_HUNT_ENABLED,
      toggleId: 'gpRetornarHuntToggle',
      startMsg: 'BAIAKIDLE_START_RETORNAR_HUNT',
      stopMsg: 'BAIAKIDLE_STOP_RETORNAR_HUNT',
      label: 'Retornar Hunt',
      desc: 'Manutenção → reconectar · Cidade → hunt ativa.'
    },
    {
      id: 'auto_sell',
      storageKey: 'baiakIdleAutoSellEnabled',
      toggleId: 'gpAutoSellToggle',
      startMsg: 'BAIAKIDLE_START_AUTO_SELL',
      stopMsg: 'BAIAKIDLE_STOP_AUTO_SELL',
      label: 'Auto Sell',
      desc: 'Vende quando a mochila atinge o % configurado.',
      kind: 'auto_sell'
    },
    {
      id: 'stamina',
      storageKey: STORAGE_KEY_STAMINA_ENABLED,
      toggleId: 'gpStaminaToggle',
      startMsg: 'BAIAKIDLE_START_STAMINA',
      stopMsg: 'BAIAKIDLE_STOP_STAMINA',
      label: 'Stamina',
      desc: '% mínima → treino online · % máxima → volta à hunt.',
      kind: 'stamina'
    },
    {
      id: 'xp_hora',
      storageKey: STORAGE_KEY_XP_HORA_ENABLED,
      toggleId: 'gpXpHoraToggle',
      startMsg: 'BAIAKIDLE_START_XP_HORA',
      stopMsg: 'BAIAKIDLE_STOP_XP_HORA',
      label: 'XP/h',
      desc: 'XP/h real pela extensão (XP Gain × tempo, a cada 10s).'
    },
    {
      id: 'gold_hora',
      storageKey: STORAGE_KEY_GOLD_HORA_ENABLED,
      toggleId: 'gpGoldHoraToggle',
      startMsg: 'BAIAKIDLE_START_GOLD_HORA',
      stopMsg: 'BAIAKIDLE_STOP_GOLD_HORA',
      label: 'Gold/h',
      desc: 'Gold/h real pela extensão (Balance × tempo, a cada 10s).'
    },
    {
      id: 'auto_anuncio',
      storageKey: STORAGE_KEY_AUTO_ANUNCIO_ENABLED,
      toggleId: 'gpAutoAnuncioToggle',
      startMsg: 'BAIAKIDLE_START_AUTO_ANUNCIO',
      stopMsg: 'BAIAKIDLE_STOP_AUTO_ANUNCIO',
      label: 'Auto Anúncio',
      desc: 'Envia sua mensagem no canal escolhido em intervalo.',
      kind: 'auto_anuncio'
    },
    {
      id: 'mover_itens',
      storageKey: STORAGE_KEY_MOVER_ENABLED,
      startMsg: 'BAIAKIDLE_START_MOVER_ITENS',
      stopMsg: 'BAIAKIDLE_STOP_MOVER_ITENS',
      label: 'Mover Itens',
      desc: 'Move os itens com tier escolhido para o backpack.',
      kind: 'tiers'
    }
  ];

  /** @type {{ loggedIn?: boolean, vip?: boolean, contaStatus?: any, user?: any, extensionOutdated?: boolean, requiredVersion?: string, installedVersion?: string, versionMessage?: string }} */
  let lastAuth = { loggedIn: true, vip: true, extensionOutdated: false, user: { nome: 'BaiakBot' }, contaStatus: { vip: true, data_final: 9999999999 } };
  let currentHuntRankId = 'todas';
  /** @type {{ name?: string, level?: number } | null} */
  let selectedHunt = null;
  let expandedHuntName = '';
  let bound = false;

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

  if (!isBaiakIdlePlayPage()) return;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function setStatus(message, type) {
    const node = $('#gpStatus');
    if (!node) return;
    node.textContent = message || '';
    node.className = 'gp-status' + (type ? ' ' + type : '');
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

  function isVipAuth(auth) {
    return true; // PATCHED: Always VIP
  }

  async function syncAuth() {
    // PATCHED: Always return VIP without asking background
    return { loggedIn: true, vip: true, user: { nome: 'BaiakBot' }, contaStatus: { vip: true, data_final: 9999999999 }, extensionOutdated: false };
  }

  function ensureStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = `
      #${ROOT_ID} {
        --gp-bg: #0c1219;
        --gp-panel: #141c27;
        --gp-line: #243041;
        --gp-text: #e8eef6;
        --gp-muted: #93a4b8;
        --gp-ok: #3dba7a;
        --gp-accent: #d4a24c;
        --gp-err: #f87171;
        position: fixed;
        inset: 0;
        z-index: 2147483000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        font-family: "Segoe UI", Tahoma, sans-serif;
        color: var(--gp-text);
      }
      #${ROOT_ID}.is-open { display: flex; }
      #${ROOT_ID} .gp-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(6, 10, 16, 0.72);
        backdrop-filter: blur(2px);
      }
      #${ROOT_ID} .gp-dialog {
        position: relative;
        z-index: 1;
        width: min(760px, calc(100vw - 24px));
        max-height: min(92vh, 860px);
        overflow: auto;
        border: 1px solid var(--gp-line);
        border-radius: 14px;
        background:
          radial-gradient(120% 90% at 100% 0%, rgba(212, 162, 76, 0.14) 0%, transparent 45%),
          radial-gradient(120% 100% at 0% 0%, #162033 0%, var(--gp-bg) 55%);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
        padding: 16px;
        transition: width 0.18s ease;
      }
      #${ROOT_ID}.is-autoboss-open .gp-dialog {
        width: min(840px, calc(100vw - 24px));
        overflow: hidden;
      }
      #${ROOT_ID} #gpModules {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        align-items: start;
      }
      #${ROOT_ID} #gpModules .gp-module {
        margin-bottom: 0;
        height: 100%;
      }
      #${ROOT_ID} #gpModules .gp-module[data-module="auto_anuncio"],
      #${ROOT_ID} #gpModules .gp-module[data-module="stamina"],
      #${ROOT_ID} #gpModules .gp-module[data-module="mover_itens"],
      #${ROOT_ID} #gpModules .gp-module[data-module="auto_sell"] {
        grid-column: 1 / -1;
      }
      @media (max-width: 640px) {
        #${ROOT_ID} #gpModules {
          grid-template-columns: 1fr;
        }
        #${ROOT_ID} #gpModules .gp-module[data-module="auto_anuncio"],
        #${ROOT_ID} #gpModules .gp-module[data-module="stamina"],
        #${ROOT_ID} #gpModules .gp-module[data-module="mover_itens"],
        #${ROOT_ID} #gpModules .gp-module[data-module="auto_sell"] {
          grid-column: auto;
        }
      }
      #${ROOT_ID} .gp-brand {
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--gp-muted);
        margin-bottom: 4px;
      }
      #${ROOT_ID} .gp-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
      }
      #${ROOT_ID} .gp-title {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
      }
      #${ROOT_ID} .gp-top-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
        position: relative;
      }
      #${ROOT_ID} .gp-close,
      #${ROOT_ID} .gp-gear {
        border: 1px solid var(--gp-line);
        background: var(--gp-panel);
        color: var(--gp-text);
        border-radius: 8px;
        width: 34px;
        height: 34px;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      #${ROOT_ID} .gp-gear {
        font-size: 16px;
        color: var(--gp-muted);
      }
      #${ROOT_ID} .gp-gear:hover,
      #${ROOT_ID} .gp-gear.is-open {
        color: var(--gp-accent);
        border-color: rgba(212, 162, 76, 0.55);
      }
      #${ROOT_ID} .gp-settings {
        display: none;
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        z-index: 5;
        min-width: 240px;
        max-width: 300px;
        max-height: min(70vh, 420px);
        overflow: auto;
        padding: 10px 12px;
        border: 1px solid var(--gp-line);
        border-radius: 10px;
        background: var(--gp-panel);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
      }
      #${ROOT_ID} .gp-settings.is-open { display: block; }
      #${ROOT_ID} .gp-settings-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      #${ROOT_ID} .gp-settings-row + .gp-settings-row {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--gp-line);
      }
      #${ROOT_ID} .gp-settings-label {
        font-size: 12px;
        color: var(--gp-text);
        line-height: 1.35;
      }
      #${ROOT_ID} .gp-settings-hint {
        margin: 2px 0 0;
        font-size: 11px;
        color: var(--gp-muted);
      }
      #${ROOT_ID} .gp-settings-chars {
        display: block;
      }
      #${ROOT_ID} .gp-settings-chars-head {
        font-size: 12px;
        font-weight: 700;
        color: var(--gp-text);
        margin: 0 0 6px;
      }
      #${ROOT_ID} .gp-settings-chars-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      #${ROOT_ID} .gp-settings-char {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 6px 8px;
        border: 1px solid rgba(212, 162, 76, 0.2);
        border-radius: 8px;
        background: rgba(18, 26, 39, 0.7);
      }
      #${ROOT_ID} .gp-settings-char-name {
        font-size: 12px;
        font-weight: 700;
        color: var(--gp-text);
        line-height: 1.3;
        word-break: break-word;
      }
      #${ROOT_ID} .gp-settings-char-meta {
        font-size: 11px;
        color: var(--gp-muted);
        line-height: 1.3;
      }
      #${ROOT_ID} .gp-settings-chars-empty {
        margin: 0;
        font-size: 11px;
        color: var(--gp-muted);
        line-height: 1.35;
      }
      #${ROOT_ID} .gp-userrow {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 10px;
        font-size: 12px;
        color: var(--gp-muted);
      }
      #${ROOT_ID} .gp-vip-pill {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        border: 1px solid transparent;
      }
      #${ROOT_ID} .gp-vip-pill.is-vip {
        color: #bbf7d0;
        background: rgba(22, 101, 52, 0.28);
        border-color: #166534;
      }
      #${ROOT_ID} .gp-vip-pill.is-free {
        color: #fecaca;
        background: rgba(127, 29, 29, 0.22);
        border-color: #7f1d1d;
      }
      #${ROOT_ID} .gp-banner {
        border: 1px solid;
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 12px;
        line-height: 1.45;
        margin-bottom: 10px;
      }
      #${ROOT_ID} .gp-banner a { color: inherit; font-weight: 700; }
      #${ROOT_ID} .gp-view { display: none; }
      #${ROOT_ID} .gp-view.is-active { display: block; }
      #${ROOT_ID} .gp-module {
        border: 1px solid var(--gp-line);
        border-radius: 12px;
        background: linear-gradient(180deg, #1a2433 0%, var(--gp-panel) 100%);
        padding: 12px;
        margin-bottom: 10px;
      }
      #${ROOT_ID} .gp-module.is-locked { opacity: 0.55; }
      #${ROOT_ID} .gp-module-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }
      #${ROOT_ID} .gp-module-title { font-size: 14px; font-weight: 700; color: var(--gp-accent); }
      #${ROOT_ID} .gp-module-desc { margin-top: 4px; font-size: 11px; color: var(--gp-muted); line-height: 1.4; }
      #${ROOT_ID} .gp-switch {
        position: relative;
        width: 42px;
        height: 24px;
        flex-shrink: 0;
      }
      #${ROOT_ID} .gp-switch input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }
      #${ROOT_ID} .gp-switch span {
        position: absolute;
        inset: 0;
        background: #334155;
        border-radius: 999px;
        cursor: pointer;
        transition: background 0.15s;
      }
      #${ROOT_ID} .gp-switch span::after {
        content: "";
        position: absolute;
        width: 18px;
        height: 18px;
        left: 3px;
        top: 3px;
        background: #e8eef6;
        border-radius: 50%;
        transition: transform 0.15s;
      }
      #${ROOT_ID} .gp-switch input:checked + span { background: var(--gp-ok); }
      #${ROOT_ID} .gp-switch input:checked + span::after { transform: translateX(18px); }
      #${ROOT_ID} .gp-switch input:disabled + span { opacity: 0.5; cursor: not-allowed; }
      #${ROOT_ID} .gp-tier-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
      #${ROOT_ID} .gp-tier-chip {
        min-width: 48px;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid var(--gp-line);
        background: #1a2433;
        color: var(--gp-text);
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
      }
      #${ROOT_ID} .gp-tier-chip:disabled { opacity: 0.5; cursor: not-allowed; }
      #${ROOT_ID} .gp-stamina-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 10px;
      }
      #${ROOT_ID} .gp-perm-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(148, 163, 184, 0.18);
      }
      #${ROOT_ID} .gp-perm-row-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--gp-text);
      }
      #${ROOT_ID} .gp-perm-row-hint {
        margin-top: 2px;
        font-size: 10px;
        color: var(--gp-muted);
        line-height: 1.35;
      }
      #${ROOT_ID} .gp-stamina-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      #${ROOT_ID} .gp-stamina-field label {
        font-size: 11px;
        color: var(--gp-muted);
        font-weight: 600;
      }
      #${ROOT_ID} .gp-stamina-input-wrap {
        display: flex;
        align-items: center;
        gap: 4px;
        border: 1px solid rgba(212, 162, 76, 0.28);
        border-radius: 8px;
        background: #121a27;
        padding-right: 10px;
      }
      #${ROOT_ID} .gp-stamina-input-wrap:focus-within {
        border-color: rgba(212, 162, 76, 0.55);
      }
      #${ROOT_ID} .gp-stamina-field input {
        width: 100%;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--gp-ink);
        padding: 8px 4px 8px 10px;
        font-size: 13px;
        font-weight: 600;
        outline: none;
        appearance: textfield;
        -moz-appearance: textfield;
      }
      #${ROOT_ID} .gp-stamina-field input::-webkit-outer-spin-button,
      #${ROOT_ID} .gp-stamina-field input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      #${ROOT_ID} .gp-stamina-pct-suffix {
        color: var(--gp-accent, #d4a24c);
        font-size: 13px;
        font-weight: 700;
        flex-shrink: 0;
        user-select: none;
      }
      #${ROOT_ID} .gp-stamina-field input:disabled { opacity: 0.5; }
      #${ROOT_ID} .gp-stamina-input-wrap:has(input:disabled) { opacity: 0.7; }
      #${ROOT_ID} .gp-stamina-warn {
        display: none;
        margin: 8px 0 0;
        font-size: 11px;
        line-height: 1.35;
        color: #f87171;
        font-weight: 600;
      }
      #${ROOT_ID} .gp-stamina-warn.is-on { display: block; }
      #${ROOT_ID} .gp-anuncio-fields {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
      }
      #${ROOT_ID} .gp-anuncio-fields .gp-stamina-field {
        width: 100%;
      }
      #${ROOT_ID} .gp-anuncio-row {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 8px;
      }
      #${ROOT_ID} .gp-anuncio-fields select,
      #${ROOT_ID} .gp-anuncio-fields textarea {
        width: 100%;
        border: 1px solid rgba(212, 162, 76, 0.28);
        border-radius: 8px;
        background: #121a27;
        color: var(--gp-text);
        padding: 8px 10px;
        font-size: 12px;
        font-weight: 600;
        outline: none;
        font-family: inherit;
        resize: vertical;
        min-height: 64px;
      }
      #${ROOT_ID} .gp-anuncio-fields select:focus,
      #${ROOT_ID} .gp-anuncio-fields textarea:focus {
        border-color: rgba(212, 162, 76, 0.55);
      }
      #${ROOT_ID} .gp-anuncio-fields select:disabled,
      #${ROOT_ID} .gp-anuncio-fields textarea:disabled {
        opacity: 0.5;
      }
      #${ROOT_ID} .gp-anuncio-hint {
        margin: 0;
        font-size: 10px;
        color: var(--gp-muted);
        text-align: right;
      }
      #${ROOT_ID} .gp-hunt-box {
        border: 1px solid var(--gp-line);
        border-radius: 12px;
        margin-bottom: 12px;
        overflow: hidden;
        background: var(--gp-panel);
      }
      #${ROOT_ID} .gp-hunt-toggle {
        width: 100%;
        text-align: left;
        border: 0;
        background: transparent;
        color: var(--gp-text);
        padding: 12px;
        cursor: pointer;
        font: inherit;
      }
      #${ROOT_ID} .gp-hunt-toggle strong { color: var(--gp-accent); }
      #${ROOT_ID} .gp-hunt-body { display: none; padding: 0 12px 12px; }
      #${ROOT_ID} .gp-hunt-box.is-open .gp-hunt-body { display: block; }
      #${ROOT_ID} .gp-hunt-ranks { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
      #${ROOT_ID} .gp-hunt-rank {
        border: 1px solid var(--gp-line);
        background: #1a2433;
        color: var(--gp-muted);
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 11px;
        cursor: pointer;
      }
      #${ROOT_ID} .gp-hunt-rank.is-on {
        color: #1a1205;
        background: var(--gp-accent);
        border-color: var(--gp-accent);
        font-weight: 700;
      }
      #${ROOT_ID} .gp-hunt-list { max-height: 220px; overflow: auto; }
      #${ROOT_ID} .gp-hunt-item {
        border: 1px solid var(--gp-line);
        border-radius: 10px;
        padding: 8px 10px;
        margin-bottom: 6px;
        cursor: pointer;
        background: #1a2433;
      }
      #${ROOT_ID} .gp-hunt-item.is-active { border-color: rgba(212, 162, 76, 0.7); }
      #${ROOT_ID} .gp-hunt-item.is-expanded { background: #1f2b3d; }
      #${ROOT_ID} .gp-hunt-item-top {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 12px;
      }
      #${ROOT_ID} .gp-hunt-item-lvl { color: var(--gp-muted); }
      #${ROOT_ID} .gp-btn-activate {
        margin-top: 8px;
        width: 100%;
        border: 0;
        border-radius: 8px;
        padding: 8px;
        font-weight: 700;
        cursor: pointer;
        background: var(--gp-accent);
        color: #1a1205;
      }
      #${ROOT_ID} .gp-btn-activate.btn-go-hunt {
        background: linear-gradient(180deg, #3dba7a, #2a9b62);
        color: #062014;
      }
      #${ROOT_ID} .gp-status {
        margin-top: 8px;
        font-size: 12px;
        color: var(--gp-muted);
        min-height: 1.2em;
        line-height: 1.4;
      }
      #${ROOT_ID} .gp-status.ok { color: #86efac; }
      #${ROOT_ID} .gp-status.err { color: var(--gp-err); }
      #${ROOT_ID} .gp-cta {
        display: inline-block;
        margin-top: 8px;
        padding: 10px 14px;
        border-radius: 8px;
        background: var(--gp-accent);
        color: #1a1205;
        font-weight: 700;
        text-decoration: none;
        font-size: 13px;
      }
      #${ROOT_ID} .gp-autoboss-btn {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin: 0 0 10px;
        padding: 12px 14px;
        border: 1px solid rgba(212, 162, 76, 0.45);
        border-radius: 10px;
        background: linear-gradient(135deg, rgba(212, 162, 76, 0.16), rgba(20, 28, 39, 0.9));
        color: var(--gp-text);
        cursor: pointer;
        font: inherit;
        text-align: left;
      }
      #${ROOT_ID} .gp-autoboss-btn:hover {
        border-color: var(--gp-accent);
        background: linear-gradient(135deg, rgba(212, 162, 76, 0.24), rgba(20, 28, 39, 0.95));
      }
      #${ROOT_ID} .gp-autoboss-btn strong {
        display: block;
        font-size: 14px;
      }
      #${ROOT_ID} .gp-autoboss-btn strong .gp-soon {
        margin-left: 6px;
        font-weight: 600;
        font-size: 12px;
        color: var(--gp-muted);
      }
      #${ROOT_ID} .gp-autoboss-btn span {
        display: block;
        margin-top: 2px;
        font-size: 11px;
        color: var(--gp-muted);
      }
      #${ROOT_ID} .gp-ab-modal {
        position: absolute;
        inset: 0;
        z-index: 5;
        display: none;
        flex-direction: column;
        border-radius: 14px;
        overflow: hidden;
        background: var(--gp-bg);
        border: 1px solid var(--gp-line);
        /* Não herda largura da viewport — fica só dentro do dialog */
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        box-sizing: border-box;
      }
      #${ROOT_ID} .gp-ab-modal.is-open { display: flex; }
      #${ROOT_ID} .gp-ab-top {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        border-bottom: 1px solid var(--gp-line);
        background: var(--gp-panel);
        flex-shrink: 0;
      }
      #${ROOT_ID} .gp-ab-tabs {
        display: flex;
        gap: 6px;
        padding: 8px 12px 0;
        background: var(--gp-bg);
        flex-shrink: 0;
        border-bottom: 1px solid var(--gp-line);
      }
      #${ROOT_ID} .gp-ab-tabs[hidden] { display: none !important; }
      #${ROOT_ID} .gp-ab-tab {
        flex: 1;
        height: 34px;
        border: 1px solid var(--gp-line);
        border-radius: 8px 8px 0 0;
        border-bottom: none;
        background: rgba(20, 28, 39, 0.65);
        color: var(--gp-muted);
        cursor: pointer;
        font: 600 12px/1 "Segoe UI", Tahoma, sans-serif;
      }
      #${ROOT_ID} .gp-ab-tab.is-on {
        background: var(--gp-panel);
        color: var(--gp-accent);
        border-color: rgba(212, 162, 76, 0.45);
      }
      #${ROOT_ID} .gp-ab-tab-n {
        margin-left: 4px;
        font-weight: 700;
        color: var(--gp-muted);
      }
      #${ROOT_ID} .gp-ab-pl-btn {
        position: absolute;
        top: 3px;
        right: 3px;
        z-index: 3;
        width: 18px;
        height: 18px;
        border-radius: 5px;
        border: 1px solid transparent;
        cursor: pointer;
        font: 700 12px/1 "Segoe UI", Tahoma, sans-serif;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      }
      #${ROOT_ID} .gp-ab-pl-btn.is-add {
        background: rgba(22, 163, 74, 0.2);
        border-color: rgba(34, 197, 94, 0.65);
        color: #4ade80;
      }
      #${ROOT_ID} .gp-ab-pl-btn.is-add:hover {
        background: rgba(22, 163, 74, 0.35);
      }
      #${ROOT_ID} .gp-ab-pl-btn.is-remove {
        background: rgba(185, 28, 28, 0.22);
        border-color: rgba(248, 113, 113, 0.65);
        color: #f87171;
      }
      #${ROOT_ID} .gp-ab-pl-btn.is-remove:hover {
        background: rgba(185, 28, 28, 0.38);
      }
      #${ROOT_ID} .gp-ab-playlist-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: 0 0 10px;
        height: 36px;
        border-radius: 8px;
        border: 1px solid var(--gp-line);
        cursor: pointer;
        font: 700 13px/1 "Segoe UI", Tahoma, sans-serif;
      }
      #${ROOT_ID} .gp-ab-playlist-btn.is-add {
        background: rgba(22, 163, 74, 0.18);
        border-color: rgba(34, 197, 94, 0.55);
        color: #86efac;
      }
      #${ROOT_ID} .gp-ab-playlist-btn.is-remove {
        background: rgba(185, 28, 28, 0.18);
        border-color: rgba(248, 113, 113, 0.55);
        color: #fca5a5;
      }
      #${ROOT_ID} .gp-ab-run {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        margin: 0;
        border-bottom: 1px solid rgba(212, 162, 76, 0.18);
        background: var(--gp-bg);
        flex-shrink: 0;
      }
      #${ROOT_ID} .gp-ab-run[hidden] {
        display: none !important;
      }
      #${ROOT_ID} .gp-ab-run-btn {
        flex: 0 0 auto;
        height: 34px;
        padding: 0 14px;
        border-radius: 8px;
        border: 1px solid rgba(212, 162, 76, 0.55);
        background: linear-gradient(180deg, #c4922f, #9a6f1c);
        color: #1a1208;
        font: 700 12px/1 "Segoe UI", Tahoma, sans-serif;
        cursor: pointer;
        white-space: nowrap;
      }
      #${ROOT_ID} .gp-ab-run-btn:hover:not(:disabled) {
        filter: brightness(1.06);
      }
      #${ROOT_ID} .gp-ab-run-btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
      #${ROOT_ID} .gp-ab-run-btn.is-stop {
        background: rgba(185, 28, 28, 0.28);
        border-color: rgba(248, 113, 113, 0.65);
        color: #fecaca;
      }
      #${ROOT_ID} .gp-ab-run-meta {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 11px;
        color: var(--gp-muted);
        line-height: 1.35;
      }
      #${ROOT_ID} .gp-ab-run-meta strong {
        color: #f0d9a8;
        font-weight: 700;
      }
      #${ROOT_ID} .gp-ab-reset-btn {
        flex: 0 0 auto;
        height: 32px;
        padding: 0 10px;
        border-radius: 8px;
        border: 1px solid var(--gp-line);
        background: rgba(20, 28, 39, 0.9);
        color: var(--gp-muted);
        font: 600 11px/1 "Segoe UI", Tahoma, sans-serif;
        cursor: pointer;
        white-space: nowrap;
      }
      #${ROOT_ID} .gp-ab-reset-btn:hover:not(:disabled) {
        border-color: rgba(248, 113, 113, 0.55);
        color: #fca5a5;
      }
      #${ROOT_ID} .gp-ab-reset-btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
      #${ROOT_ID} .gp-ab-top h3 {
        margin: 0;
        flex: 1;
        font-size: 15px;
        font-weight: 700;
        min-width: 0;
      }
      #${ROOT_ID} .gp-ab-top h3 .gp-soon {
        margin-left: 4px;
        font-weight: 600;
        font-size: 12px;
        color: var(--gp-muted);
      }
      #${ROOT_ID} .gp-ab-back,
      #${ROOT_ID} .gp-ab-close {
        border: 1px solid var(--gp-line);
        background: var(--gp-bg);
        color: var(--gp-text);
        border-radius: 8px;
        height: 32px;
        min-width: 32px;
        padding: 0 10px;
        cursor: pointer;
        font: 600 12px/1 "Segoe UI", Tahoma, sans-serif;
      }
      #${ROOT_ID} .gp-ab-back[hidden] { display: none !important; }
      #${ROOT_ID} .gp-ab-body {
        flex: 1;
        overflow: auto;
        padding: 12px;
      }
      #${ROOT_ID} .gp-ab-grid {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 8px;
      }
      #${ROOT_ID} .gp-ab-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 8px 4px;
        border: 1px solid var(--gp-line);
        border-radius: 10px;
        background: rgba(20, 28, 39, 0.85);
        cursor: pointer;
        color: inherit;
        font: inherit;
        min-width: 0;
        position: relative;
        overflow: visible;
        text-align: center;
        user-select: none;
      }
      #${ROOT_ID} .gp-ab-card:hover {
        border-color: rgba(212, 162, 76, 0.55);
      }
      #${ROOT_ID} .gp-ab-card.is-killed {
        border-color: rgba(148, 163, 184, 0.55);
      }
      #${ROOT_ID} .gp-ab-card-badges {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-height: 16px;
        width: 100%;
      }
      #${ROOT_ID} .gp-ab-skull {
        font-size: 14px;
        line-height: 1;
        filter: grayscale(0.15);
      }
      #${ROOT_ID} .gp-ab-cd {
        font-size: 10px;
        font-weight: 700;
        color: #fbbf24;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      #${ROOT_ID} .gp-ab-track-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin: 0 0 12px;
        padding: 8px 10px;
        border: 1px solid var(--gp-line);
        border-radius: 8px;
        background: rgba(20, 28, 39, 0.75);
        font-size: 12px;
      }
      #${ROOT_ID} .gp-ab-track-row .gp-ab-cd { font-size: 12px; }
      #${ROOT_ID} .gp-ab-sprite,
      #${ROOT_ID} .gp-ab-sprite-lg {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        background: #0a1018;
        border: 1px solid var(--gp-line);
        object-fit: contain;
        image-rendering: pixelated;
      }
      #${ROOT_ID} .gp-ab-sprite-lg { width: 72px; height: 72px; }
      #${ROOT_ID} .gp-ab-sprite-ph {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 700;
        color: var(--gp-muted);
        text-align: center;
        padding: 2px;
      }
      #${ROOT_ID} .gp-ab-card-name {
        font-size: 10px;
        font-weight: 600;
        text-align: center;
        line-height: 1.25;
        width: 100%;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      #${ROOT_ID} .gp-ab-empty {
        margin: 24px 8px;
        text-align: center;
        color: var(--gp-muted);
        font-size: 13px;
      }
      #${ROOT_ID} .gp-ab-search {
        position: sticky;
        top: 0;
        z-index: 2;
        margin: 0 0 12px;
        padding-bottom: 2px;
        background: linear-gradient(180deg, var(--gp-bg) 70%, transparent);
      }
      #${ROOT_ID} .gp-ab-search input {
        width: 100%;
        box-sizing: border-box;
        height: 36px;
        padding: 0 12px;
        border: 1px solid var(--gp-line);
        border-radius: 8px;
        background: var(--gp-panel);
        color: var(--gp-text);
        font: 600 13px/1.2 "Segoe UI", Tahoma, sans-serif;
        outline: none;
      }
      #${ROOT_ID} .gp-ab-search input::placeholder {
        color: var(--gp-muted);
        font-weight: 500;
      }
      #${ROOT_ID} .gp-ab-search input:focus {
        border-color: rgba(212, 162, 76, 0.65);
      }
      #${ROOT_ID} .gp-ab-search-meta {
        margin: 6px 2px 0;
        font-size: 11px;
        color: var(--gp-muted);
      }
      #${ROOT_ID} .gp-ab-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 0 0 12px;
      }
      #${ROOT_ID} .gp-ab-nav-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 32px;
        min-width: 32px;
        padding: 0 10px;
        border: 1px solid var(--gp-line);
        border-radius: 8px;
        background: var(--gp-bg);
        color: var(--gp-text);
        cursor: pointer;
        font: 600 12px/1 "Segoe UI", Tahoma, sans-serif;
      }
      #${ROOT_ID} .gp-ab-nav-btn:hover:not(:disabled) {
        border-color: rgba(212, 162, 76, 0.55);
        color: var(--gp-accent);
      }
      #${ROOT_ID} .gp-ab-nav-btn:disabled {
        opacity: 0.35;
        cursor: default;
      }
      #${ROOT_ID} .gp-ab-nav-pos {
        font-size: 11px;
        font-weight: 600;
        color: var(--gp-muted);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      #${ROOT_ID} .gp-ab-fight {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        margin: 0 0 14px;
        height: 40px;
        padding: 0 14px;
        border: 1px solid rgba(212, 162, 76, 0.55);
        border-radius: 10px;
        background: linear-gradient(135deg, rgba(212, 162, 76, 0.22), rgba(20, 28, 39, 0.95));
        color: var(--gp-text);
        cursor: pointer;
        font: 700 14px/1 "Segoe UI", Tahoma, sans-serif;
      }
      #${ROOT_ID} .gp-ab-fight:hover:not(:disabled) {
        border-color: var(--gp-accent);
        color: var(--gp-accent);
      }
      #${ROOT_ID} .gp-ab-fight:disabled {
        opacity: 0.55;
        cursor: default;
      }
      #${ROOT_ID} .gp-ab-fight-ico {
        font-size: 16px;
        line-height: 1;
      }
      #${ROOT_ID} .gp-ab-detail-head {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 14px;
      }
      #${ROOT_ID} .gp-ab-detail-meta { flex: 1; min-width: 0; }
      #${ROOT_ID} .gp-ab-detail-name {
        margin: 0 0 6px;
        font-size: 16px;
        font-weight: 700;
      }
      #${ROOT_ID} .gp-ab-rarity {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--gp-accent);
      }
      #${ROOT_ID} .gp-ab-rarity img { width: 14px; height: 14px; }
      #${ROOT_ID} .gp-ab-statrows { display: grid; gap: 6px; margin-bottom: 14px; }
      #${ROOT_ID} .gp-ab-statrow {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        font-size: 12px;
        padding: 6px 8px;
        border-radius: 8px;
        background: rgba(20, 28, 39, 0.75);
        border: 1px solid var(--gp-line);
      }
      #${ROOT_ID} .gp-ab-statrow span { color: var(--gp-muted); }
      #${ROOT_ID} .gp-ab-statrow b { font-weight: 600; text-align: right; }
      #${ROOT_ID} .gp-ab-section {
        margin-bottom: 14px;
      }
      #${ROOT_ID} .gp-ab-section-title {
        margin: 0 0 8px;
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--gp-muted);
      }
      #${ROOT_ID} .gp-ab-res-grid {
        display: grid;
        gap: 6px;
      }
      #${ROOT_ID} .gp-ab-res {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
      }
      #${ROOT_ID} .gp-ab-res img { width: 16px; height: 16px; flex-shrink: 0; }
      #${ROOT_ID} .gp-ab-res-val { margin-left: auto; font-variant-numeric: tabular-nums; }
      #${ROOT_ID} .gp-ab-res-val.is-weak { color: #4ade80; }
      #${ROOT_ID} .gp-ab-res-val.is-resist { color: #e4c00a; }
      #${ROOT_ID} .gp-ab-loot {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      #${ROOT_ID} .gp-ab-item {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid var(--gp-line);
        background: #0a1018;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      #${ROOT_ID} .gp-ab-item img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        image-rendering: pixelated;
      }
    `;
  }

  function ensureDom() {
    ensureStyles();
    let root = document.getElementById(ROOT_ID);
    if (root) {
      const dialog = root.querySelector('.gp-dialog');
      const modal = root.querySelector('#gpAutoBossModal');
      // HTML antigo quebrava o </div> do AutoBoss e jogava o modal no root (tela cheia).
      if (!dialog || !modal || !dialog.contains(modal)) {
        try {
          root.remove();
        } catch (_) {}
        root = null;
      }
    }
    if (root) {
      // Painel antigo sem abas do AutoBoss (hot-reload da extensão).
      if (!root.querySelector('#gpAbTabs')) {
        const modal = root.querySelector('#gpAutoBossModal');
        const body = root.querySelector('#gpAbBody');
        if (modal && body) {
          const tabs = document.createElement('div');
          tabs.className = 'gp-ab-tabs';
          tabs.id = 'gpAbTabs';
          tabs.innerHTML =
            '<button type="button" class="gp-ab-tab is-on" data-ab-tab="catalog">Catálogo</button>' +
            '<button type="button" class="gp-ab-tab" data-ab-tab="selected">Bosses Selecionados<span class="gp-ab-tab-n" id="gpAbSelectedCount"></span></button>';
          modal.insertBefore(tabs, body);
        }
      }
      if (!root.querySelector('#gpAbRunBar')) {
        const modal = root.querySelector('#gpAutoBossModal');
        const body = root.querySelector('#gpAbBody');
        if (modal && body) {
          const run = document.createElement('div');
          run.className = 'gp-ab-run';
          run.id = 'gpAbRunBar';
          run.hidden = true;
          run.innerHTML =
            '<button type="button" class="gp-ab-run-btn" id="gpAbRunBtn">Iniciar</button>' +
            '<div class="gp-ab-run-meta" id="gpAbRunMeta">Selecione bosses e inicie a fila.</div>';
          modal.insertBefore(run, body);
        }
      }
      if (!root.querySelector('#gpAbResetTrack')) {
        const top = root.querySelector('#gpAutoBossModal .gp-ab-top');
        const closeBtn = root.querySelector('#gpAbClose');
        if (top && closeBtn) {
          const reset = document.createElement('button');
          reset.type = 'button';
          reset.className = 'gp-ab-reset-btn';
          reset.id = 'gpAbResetTrack';
          reset.title = 'Zera cooldowns e status dos bosses';
          reset.textContent = 'Zerar contadores';
          top.insertBefore(reset, closeBtn);
        }
      }
      if (!root.querySelector('#gpSettingsChars')) {
        const settings = root.querySelector('#gpSettings');
        if (settings) {
          const box = document.createElement('div');
          box.className = 'gp-settings-row gp-settings-chars';
          box.id = 'gpSettingsChars';
          box.innerHTML =
            '<div class="gp-settings-chars-head">Personagens</div>' +
            '<div class="gp-settings-chars-list" id="gpCharactersList">' +
            '<p class="gp-settings-chars-empty">Nenhum personagem capturado ainda.</p>' +
            '</div>';
          settings.appendChild(box);
        }
      }
      return root;
    }

    root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('data-tibia-bot', 'game-panel');
    root.innerHTML =
      '<div class="gp-backdrop" data-gp-close="1"></div>' +
      '<div class="gp-dialog" role="dialog" aria-modal="true" aria-label="TibiaBot">' +
      '<div class="gp-top">' +
      '<div><div class="gp-brand">TibiaBot.Online</div><h2 class="gp-title">Baiak-Idle</h2></div>' +
      '<div class="gp-top-actions">' +
      '<button type="button" class="gp-gear" id="gpGearBtn" aria-label="Configurações" aria-expanded="false" title="Configurações">⚙</button>' +
      '<button type="button" class="gp-close" data-gp-close="1" aria-label="Fechar">×</button>' +
      '<div class="gp-settings" id="gpSettings" hidden>' +
      '<div class="gp-settings-row">' +
      '<div><div class="gp-settings-label">Overlay</div>' +
      '<p class="gp-settings-hint">Apenas exibe ou oculta o painel dos módulos.</p></div>' +
      '<label class="gp-switch" title="Mostrar/ocultar overlay">' +
      '<input type="checkbox" id="gpOverlayToggle" checked>' +
      '<span></span></label>' +
      '</div>' +
      '<div class="gp-settings-row">' +
      '<div><div class="gp-settings-label">Ocultar nomes</div>' +
      '<p class="gp-settings-hint">Oculta nome dos seus personagens.</p></div>' +
      '<label class="gp-switch" title="Ocultar nomes">' +
      '<input type="checkbox" id="gpOcultarNomesToggle">' +
      '<span></span></label>' +
      '</div>' +
      '<div class="gp-settings-row gp-settings-chars" id="gpSettingsChars">' +
      '<div class="gp-settings-chars-head">Personagens</div>' +
      '<div class="gp-settings-chars-list" id="gpCharactersList">' +
      '<p class="gp-settings-chars-empty">Nenhum personagem capturado ainda.</p>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="gp-userrow">' +
      '<span id="gpUserLabel"></span>' +
      '<span id="gpVipPill" class="gp-vip-pill is-free">Free</span>' +
      '</div>' +
      '<div id="gpVersionBanner" class="gp-banner" hidden></div>' +
      '<div id="gpVipBanner" class="gp-banner" hidden></div>' +
      '<div id="gpViewLocked" class="gp-view">' +
      '<p style="margin:0 0 8px;font-size:13px;line-height:1.45;color:var(--gp-muted)">Faça login em tibiabot.online para usar os módulos.</p>' +
      '<a class="gp-cta" href="' +
      SITE_URL +
      '?cadastro=1" target="_blank" rel="noopener">Abrir tibiabot.online</a>' +
      '</div>' +
      '<div id="gpViewOutdated" class="gp-view">' +
      '<p style="margin:0;font-size:13px;line-height:1.45;color:var(--gp-muted)">Atualize a extensão para usar os módulos do Baiak-Idle.</p>' +
      '</div>' +
      '<div id="gpViewMain" class="gp-view">' +
      '<button type="button" class="gp-autoboss-btn" id="gpAutoBossBtn">' +
      '<div><strong>AutoBoss</strong><span>Catálogo · playlist · fila automática</span></div>' +
      '<span aria-hidden="true">›</span>' +
      '</button>' +
      '<div class="gp-hunt-box" id="gpHuntBox">' +
      '<button type="button" class="gp-hunt-toggle" id="gpHuntToggle" aria-expanded="false">' +
      '<div>Hunt ativa</div>' +
      '<div id="gpHuntActiveLabel" style="margin-top:4px;font-size:12px;color:var(--gp-muted)">Nenhuma hunt selecionada.</div>' +
      '</button>' +
      '<div class="gp-hunt-body">' +
      '<div class="gp-hunt-ranks" id="gpHuntRanks"></div>' +
      '<div class="gp-hunt-list" id="gpHuntList"></div>' +
      '</div>' +
      '</div>' +
      '<div id="gpModules"></div>' +
      '</div>' +
      '<div class="gp-status" id="gpStatus"></div>' +
      '<div class="gp-ab-modal" id="gpAutoBossModal" hidden>' +
      '<div class="gp-ab-top">' +
      '<button type="button" class="gp-ab-back" id="gpAbBack" hidden>← Voltar</button>' +
      '<h3 id="gpAbTitle">AutoBoss</h3>' +
      '<button type="button" class="gp-ab-reset-btn" id="gpAbResetTrack" title="Zera cooldowns e status dos bosses">Zerar contadores</button>' +
      '<button type="button" class="gp-ab-close" id="gpAbClose" aria-label="Fechar AutoBoss">×</button>' +
      '</div>' +
      '<div class="gp-ab-tabs" id="gpAbTabs">' +
      '<button type="button" class="gp-ab-tab is-on" data-ab-tab="catalog">Catálogo</button>' +
      '<button type="button" class="gp-ab-tab" data-ab-tab="selected">Bosses Selecionados<span class="gp-ab-tab-n" id="gpAbSelectedCount"></span></button>' +
      '</div>' +
      '<div class="gp-ab-run" id="gpAbRunBar" hidden>' +
      '<button type="button" class="gp-ab-run-btn" id="gpAbRunBtn">Iniciar</button>' +
      '<div class="gp-ab-run-meta" id="gpAbRunMeta">Selecione bosses e inicie a fila.</div>' +
      '</div>' +
      '<div class="gp-ab-body" id="gpAbBody"></div>' +
      '</div>' +
      '</div>';

    const modulesBox = root.querySelector('#gpModules');
    for (const mod of MODULES) {
      if (mod.kind === 'tiers') {
        const el = document.createElement('div');
        el.className = 'gp-module';
        el.dataset.module = mod.id;
        el.innerHTML =
          '<div class="gp-module-title">' +
          mod.label +
          '</div>' +
          '<div class="gp-module-desc">' +
          mod.desc +
          '</div>' +
          '<div class="gp-tier-chips" id="gpMoverTiers">' +
          '<button type="button" class="gp-tier-chip" data-tier="0" data-color="#cfd2d8" title="Common">T0</button>' +
          '<button type="button" class="gp-tier-chip" data-tier="1" data-color="#57b85a" title="Uncommon">T1</button>' +
          '<button type="button" class="gp-tier-chip" data-tier="2" data-color="#4a90e8" title="Rare">T2</button>' +
          '<button type="button" class="gp-tier-chip" data-tier="3" data-color="#a05be0" title="Epic">T3</button>' +
          '<button type="button" class="gp-tier-chip" data-tier="4" data-color="#e0b35a" title="Dourado">T4</button>' +
          '</div>';
        modulesBox.appendChild(el);
        continue;
      }

      if (mod.kind === 'stamina') {
        const el = document.createElement('div');
        el.className = 'gp-module';
        el.dataset.module = mod.id;
        el.innerHTML =
          '<div class="gp-module-row">' +
          '<div><div class="gp-module-title"></div><div class="gp-module-desc"></div></div>' +
          '<label class="gp-switch"><input type="checkbox" id="' +
          mod.toggleId +
          '"><span></span></label>' +
          '</div>' +
          '<div class="gp-stamina-fields" id="gpStaminaFields">' +
          '<div class="gp-stamina-field">' +
          '<label for="gpStaminaMinPct">Mín. → Treino</label>' +
          '<div class="gp-stamina-input-wrap">' +
          '<input id="gpStaminaMinPct" type="number" min="0" max="99" step="1" value="15" inputmode="numeric" aria-label="Porcentagem mínima">' +
          '<span class="gp-stamina-pct-suffix" aria-hidden="true">%</span>' +
          '</div>' +
          '</div>' +
          '<div class="gp-stamina-field">' +
          '<label for="gpStaminaMaxPct">Máx. → Hunt</label>' +
          '<div class="gp-stamina-input-wrap">' +
          '<input id="gpStaminaMaxPct" type="number" min="1" max="100" step="1" value="30" inputmode="numeric" aria-label="Porcentagem máxima">' +
          '<span class="gp-stamina-pct-suffix" aria-hidden="true">%</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<p class="gp-stamina-warn" id="gpStaminaWarn" hidden>Stamina abaixo de 15% perde 50% de XP e loot.</p>';
        el.querySelector('.gp-module-title').textContent = mod.label;
        el.querySelector('.gp-module-desc').textContent = mod.desc;
        modulesBox.appendChild(el);
        continue;
      }

      if (mod.kind === 'auto_sell') {
        const el = document.createElement('div');
        el.className = 'gp-module';
        el.dataset.module = mod.id;
        el.innerHTML =
          '<div class="gp-module-row">' +
          '<div><div class="gp-module-title"></div><div class="gp-module-desc"></div></div>' +
          '<label class="gp-switch"><input type="checkbox" id="' +
          mod.toggleId +
          '"><span></span></label>' +
          '</div>' +
          '<div class="gp-perm-row">' +
          '<div>' +
          '<div class="gp-perm-row-label">VenderLootBoss</div>' +
          '<div class="gp-perm-row-hint">Antes de vender, libera a proteção do autosell.</div>' +
          '</div>' +
          '<label class="gp-switch" title="VenderLootBoss">' +
          '<input type="checkbox" id="gpVenderLootBossToggle"><span></span>' +
          '</label>' +
          '</div>' +
          '<div class="gp-stamina-fields" id="gpAutoSellFields">' +
          '<div class="gp-stamina-field">' +
          '<label for="gpAutoSellMinPct">Vender ao atingir</label>' +
          '<div class="gp-stamina-input-wrap">' +
          '<input id="gpAutoSellMinPct" type="number" min="1" max="100" step="1" value="70" inputmode="numeric" aria-label="Porcentagem da mochila">' +
          '<span class="gp-stamina-pct-suffix" aria-hidden="true">%</span>' +
          '</div>' +
          '</div>' +
          '</div>';
        el.querySelector('.gp-module-title').textContent = mod.label;
        el.querySelector('.gp-module-desc').textContent = mod.desc;
        modulesBox.appendChild(el);
        continue;
      }

      if (mod.kind === 'auto_anuncio') {
        const el = document.createElement('div');
        el.className = 'gp-module';
        el.dataset.module = mod.id;
        el.innerHTML =
          '<div class="gp-module-row">' +
          '<div><div class="gp-module-title"></div><div class="gp-module-desc"></div></div>' +
          '<label class="gp-switch"><input type="checkbox" id="' +
          mod.toggleId +
          '"><span></span></label>' +
          '</div>' +
          '<div class="gp-anuncio-fields" id="gpAutoAnuncioFields">' +
          '<div class="gp-anuncio-row">' +
          '<div class="gp-stamina-field">' +
          '<label for="gpAutoAnuncioChannel">Canal</label>' +
          '<select id="gpAutoAnuncioChannel" aria-label="Canal do chat">' +
          '<option value="geral">Geral</option>' +
          '<option value="comunicados">Comunicados</option>' +
          '<option value="help">Help</option>' +
          '<option value="market">Market</option>' +
          '</select>' +
          '</div>' +
          '<div class="gp-stamina-field">' +
          '<label for="gpAutoAnuncioInterval">Intervalo (min)</label>' +
          '<div class="gp-stamina-input-wrap">' +
          '<input id="gpAutoAnuncioInterval" type="number" min="1" max="120" step="1" value="5" inputmode="numeric" aria-label="Intervalo em minutos">' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="gp-stamina-field">' +
          '<label for="gpAutoAnuncioText">Mensagem</label>' +
          '<textarea id="gpAutoAnuncioText" maxlength="200" rows="3" placeholder="Texto do anúncio (máx. 200)"></textarea>' +
          '<p class="gp-anuncio-hint" id="gpAutoAnuncioCount">0 / 200</p>' +
          '</div>' +
          '</div>';
        el.querySelector('.gp-module-title').textContent = mod.label;
        el.querySelector('.gp-module-desc').textContent = mod.desc;
        modulesBox.appendChild(el);
        continue;
      }

      const el = document.createElement('div');
      el.className = 'gp-module';
      el.dataset.module = mod.id;
      el.innerHTML =
        '<div class="gp-module-row">' +
        '<div><div class="gp-module-title"></div><div class="gp-module-desc"></div></div>' +
        '<label class="gp-switch"><input type="checkbox" id="' +
        mod.toggleId +
        '"><span></span></label>' +
        '</div>';
      el.querySelector('.gp-module-title').textContent = mod.label;
      el.querySelector('.gp-module-desc').textContent = mod.desc;
      modulesBox.appendChild(el);
    }

    (document.body || document.documentElement).appendChild(root);
    return root;
  }

  function showView(viewId) {
    const root = ensureDom();
    root.querySelectorAll('.gp-view').forEach((el) => {
      el.classList.toggle('is-active', el.id === viewId);
    });
  }

  function applyModulesLock(locked) {
    const root = ensureDom();
    root.querySelectorAll('.gp-module').forEach((el) => {
      el.classList.toggle('is-locked', !!locked);
    });
    for (const mod of MODULES) {
      if (!mod.toggleId) continue;
      const toggle = document.getElementById(mod.toggleId);
      if (toggle) toggle.disabled = !!locked;
    }
    root.querySelectorAll('#gpMoverTiers .gp-tier-chip').forEach((btn) => {
      btn.disabled = !!locked;
    });
    root.querySelectorAll(
      '#gpStaminaMinPct, #gpStaminaMaxPct, #gpAutoSellMinPct, #gpAutoAnuncioChannel, #gpAutoAnuncioInterval, #gpAutoAnuncioText'
    ).forEach((input) => {
      input.disabled = !!locked;
    });
    const venderLootBoss = document.getElementById('gpVenderLootBossToggle');
    if (venderLootBoss) venderLootBoss.disabled = !!locked;
  }

  function setVipPill(vip) {
    const el = $('#gpVipPill');
    if (!el) return;
    el.textContent = vip ? 'VIP' : 'Free';
    el.className = 'gp-vip-pill ' + (vip ? 'is-vip' : 'is-free');
  }

  function setVipBanner(auth) {
    const el = $('#gpVipBanner');
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
    const el = $('#gpVersionBanner');
    if (!el) return;
    if (!auth?.extensionOutdated) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    const required = auth.requiredVersion || '?';
    const installed = auth.installedVersion || '?';
    el.hidden = false;
    el.style.borderColor = '#92400e';
    el.style.background = 'rgba(146, 64, 14, 0.28)';
    el.style.color = '#fde68a';
    el.innerHTML =
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
  }

  function applyAuthUi(auth) {
    lastAuth = auth || { loggedIn: false, vip: false, extensionOutdated: false };
    const loggedIn = !!auth?.loggedIn;
    const userLabel = $('#gpUserLabel');

    if (false && !loggedIn) { // PATCHED: always logged in
      if (userLabel) userLabel.textContent = '';
      setVipPill(false);
      setVersionBanner(auth);
      setVipBanner(auth);
      showView('gpViewMain'); // PATCHED
      applyModulesLock(true);
      return false;
    }

    const nome = auth.user?.nome || auth.user?.email || '';
    const first = nome ? String(nome).split(' ')[0] : 'Conta conectada';
    if (userLabel) userLabel.textContent = nome ? 'Olá, ' + first : 'Conta conectada';

    const vip = isVipAuth(auth);
    setVipPill(vip);
    setVersionBanner(auth);
    setVipBanner(auth);

    if (auth.extensionOutdated) {
      showView('gpViewOutdated');
      applyModulesLock(true);
      return true;
    }

    showView('gpViewMain');
    applyModulesLock(false); // PATCHED: never locked
    return true;
  }

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
    const el = $('#gpHuntActiveLabel');
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

  function setHuntMenuOpen(open) {
    const box = $('#gpHuntBox');
    const btn = $('#gpHuntToggle');
    if (!box || !btn) return;
    box.classList.toggle('is-open', !!open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function renderHuntRanks() {
    const box = $('#gpHuntRanks');
    if (!box) return;
    box.innerHTML = '';
    for (const rank of getHuntRanks()) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gp-hunt-rank' + (rank.id === currentHuntRankId ? ' is-on' : '');
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
    const box = $('#gpHuntList');
    if (!box) return;
    const hunts = huntsForRank(currentHuntRankId);
    box.innerHTML = '';

    if (!hunts.length) {
      box.innerHTML = '<div style="font-size:12px;color:var(--gp-muted)">Nenhuma hunt neste rank.</div>';
      return;
    }

    for (const hunt of hunts) {
      const isSaved = !!(selectedHunt && selectedHunt.name === hunt.name);
      const isExpanded = expandedHuntName === hunt.name;
      const item = document.createElement('div');
      item.className =
        'gp-hunt-item' +
        (isSaved ? ' is-active' : '') +
        (isExpanded ? ' is-expanded' : '');
      item.innerHTML =
        '<div class="gp-hunt-item-top">' +
        '<span class="gp-hunt-item-name"></span>' +
        '<span class="gp-hunt-item-lvl"></span>' +
        '</div>';
      item.querySelector('.gp-hunt-item-name').textContent = hunt.name;
      item.querySelector('.gp-hunt-item-lvl').textContent = 'lvl ' + hunt.level;

      item.addEventListener('click', (ev) => {
        if (ev.target.closest('.gp-btn-activate')) return;
        expandedHuntName = expandedHuntName === hunt.name ? '' : hunt.name;
        renderHuntList();
      });

      if (isExpanded) {
        const btn = document.createElement('button');
        btn.type = 'button';
        if (isSaved) {
          btn.className = 'gp-btn-activate btn-go-hunt';
          btn.textContent = 'Ir para a hunt';
          btn.addEventListener('click', async (ev) => {
            ev.stopPropagation();
            try {
              const auth = await syncAuth();
              if (!applyAuthUi(auth)) throw new Error('Faça login em tibiabot.online.');
              if (auth.extensionOutdated) {
                throw new Error(auth.versionMessage || 'Atualize a extensão.');
              }
              setStatus('Indo para ' + hunt.name + '…', 'ok');
              const response = await chrome.runtime.sendMessage({
                type: 'BAIAKIDLE_GO_HUNT',
                huntName: hunt.name
              });
              if (!response?.success) {
                throw new Error(response?.error || 'Falha ao ir para a hunt.');
              }
              setStatus('Navegando até ' + hunt.name + ' no jogo.', 'ok');
            } catch (error) {
              console.error('[Tibia Bot game-panel]', error);
              setStatus(error.message || 'Erro ao ir para a hunt.', 'err');
            }
          });
        } else {
          btn.className = 'gp-btn-activate';
          btn.textContent = 'Ativar';
          btn.addEventListener('click', async (ev) => {
            ev.stopPropagation();
            selectedHunt = { name: hunt.name, level: hunt.level };
            expandedHuntName = hunt.name;
            await chrome.storage.local.set({ [STORAGE_KEY_SELECTED_HUNT]: selectedHunt });
            updateHuntActiveLabel();
            renderHuntList();
            setStatus('Hunt salva: ' + hunt.name + ' (lvl ' + hunt.level + ').', 'ok');
          });
        }
        item.appendChild(btn);
      }

      box.appendChild(item);
    }
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
    const root = $('#gpMoverTiers');
    if (!root) return;
    root.querySelectorAll('.gp-tier-chip').forEach((btn) => {
      const tier = String(btn.getAttribute('data-tier') || '');
      const on = !!tiers[tier] || !!tiers[Number(tier)];
      const color = btn.getAttribute('data-color') || '#cfd2d8';
      btn.classList.toggle('is-on', on);
      btn.disabled = !vip || !!lastAuth.extensionOutdated;
      btn.style.background = on ? color : '';
      btn.style.color = on ? '#0c1219' : '';
      btn.style.borderColor = on ? color : '';
    });
  }

  async function refreshModules() {
    const keys = MODULES.map((m) => m.storageKey).concat([
      STORAGE_KEY_AUTO_SELL_VENDER_LOOT_BOSS
    ]);
    const data = await chrome.storage.local.get(keys);
    const vip = isVipAuth(lastAuth);
    const active = [];

    for (const mod of MODULES) {
      const enabled = !!data[mod.storageKey];
      if (mod.toggleId) {
        const toggle = document.getElementById(mod.toggleId);
        if (toggle) {
          toggle.checked = enabled && vip && !lastAuth.extensionOutdated;
          toggle.disabled = !vip || !!lastAuth.extensionOutdated;
        }
      }
      if (enabled && vip && !lastAuth.extensionOutdated) active.push(mod.label);
    }

    const venderLootBoss = document.getElementById('gpVenderLootBossToggle');
    if (venderLootBoss) {
      venderLootBoss.checked = !!data[STORAGE_KEY_AUTO_SELL_VENDER_LOOT_BOSS];
      venderLootBoss.disabled = !vip || !!lastAuth.extensionOutdated;
    }

    await renderMoverTierChips(vip && !lastAuth.extensionOutdated);
    await renderStaminaFields(vip && !lastAuth.extensionOutdated);
    await renderAutoSellFields(vip && !lastAuth.extensionOutdated);
    await renderAutoAnuncioFields(vip && !lastAuth.extensionOutdated);
    applyModulesLock(!vip || !!lastAuth.extensionOutdated);

    if (!vip) {
      setStatus('VIP necessária para ativar módulos.', 'err');
      return;
    }
    if (active.length) {
      setStatus('Ativos: ' + active.join(', ') + '.', 'ok');
    } else {
      setStatus('Nenhum módulo ativo.');
    }
  }

  async function applyVenderLootBossToggle(enabled) {
    const toggle = document.getElementById('gpVenderLootBossToggle');
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
        enabled
          ? 'VenderLootBoss ativo (libera proteção antes de vender).'
          : 'VenderLootBoss desligado.',
        'ok'
      );
    } catch (error) {
      if (toggle) toggle.checked = !enabled;
      setStatus(error.message || 'Erro ao alterar VenderLootBoss.', 'err');
    } finally {
      if (toggle) {
        toggle.disabled = !isVipAuth(lastAuth) || !!lastAuth.extensionOutdated;
      }
    }
  }

  async function applyToggle(mod, enabled) {
    const toggle = mod.toggleId ? document.getElementById(mod.toggleId) : null;
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

      await chrome.storage.local.set({ [mod.storageKey]: !!enabled });
      const response = await chrome.runtime.sendMessage({
        type: enabled ? mod.startMsg : mod.stopMsg
      });
      if (!response?.success) {
        throw new Error(response?.error || 'Falha ao aplicar ' + mod.label + '.');
      }
      if (enabled) requestCaptureCharacters('module:' + mod.id);
      await refreshModules();
      setStatus(
        enabled ? mod.label + ' ativo nesta aba.' : mod.label + ' desligado nesta aba.',
        'ok'
      );
    } catch (error) {
      console.error('[Tibia Bot game-panel]', error);
      if (toggle) toggle.checked = !enabled;
      await chrome.storage.local.set({ [mod.storageKey]: !enabled });
      setStatus(error.message || 'Erro ao alternar ' + mod.label + '.', 'err');
    } finally {
      if (toggle) toggle.disabled = !isVipAuth(lastAuth) || !!lastAuth.extensionOutdated;
    }
  }

  async function toggleMoverTier(tier) {
    const mod = MODULES.find((m) => m.id === 'mover_itens');
    if (!mod) return;
    const key = String(tier);

    try {
      const auth = await syncAuth();
      if (!applyAuthUi(auth)) throw new Error('Faça login em tibiabot.online.');
      if (!isVipAuth(auth)) {
        throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
      }
      if (auth.extensionOutdated) {
        throw new Error(auth.versionMessage || 'Atualize a extensão.');
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

      const response = await chrome.runtime.sendMessage({
        type: enabled ? mod.startMsg : mod.stopMsg
      });
      if (!response?.success) {
        throw new Error(response?.error || 'Falha ao aplicar Mover Itens.');
      }

      await refreshModules();
      const labels = ['T0', 'T1', 'T2', 'T3', 'T4'].filter(
        (_, i) => tiers[i] || tiers[String(i)]
      );
      setStatus(
        enabled ? 'Mover Itens ativo: ' + labels.join(', ') + '.' : 'Mover Itens desligado.',
        'ok'
      );
    } catch (error) {
      console.error('[Tibia Bot game-panel]', error);
      setStatus(error.message || 'Erro ao alternar tier.', 'err');
      await renderMoverTierChips();
    }
  }

  function defaultStaminaConfig() {
    return { minPct: 15, maxPct: 30 };
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
    const el = $('#gpAutoSellMinPct');
    const locked = !vip || !!lastAuth.extensionOutdated;
    if (el) {
      el.value = String(cfg.minPct);
      el.disabled = locked;
    }
  }

  async function saveAutoSellConfigFromInputs() {
    const el = $('#gpAutoSellMinPct');
    if (!el) return;
    try {
      const auth = await syncAuth();
      if (!applyAuthUi(auth)) throw new Error('Faça login em tibiabot.online.');
      if (!isVipAuth(auth)) {
        throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
      }
      if (auth.extensionOutdated) {
        throw new Error(auth.versionMessage || 'Atualize a extensão.');
      }
      const cfg = normalizeAutoSellConfig({ minPct: el.value });
      el.value = String(cfg.minPct);
      await chrome.storage.local.set({ [STORAGE_KEY_AUTO_SELL_CONFIG]: cfg });
      setStatus('Auto Sell: vende ao atingir ' + cfg.minPct + '% da mochila.', 'ok');
    } catch (error) {
      console.error('[Tibia Bot game-panel]', error);
      setStatus(error.message || 'Erro ao salvar Auto Sell.', 'err');
      await renderAutoSellFields();
    }
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
    const count = $('#gpAutoAnuncioCount');
    if (!count) return;
    count.textContent = String(text || '').length + ' / 200';
  }

  async function renderAutoAnuncioFields(vip = isVipAuth(lastAuth)) {
    const data = await chrome.storage.local.get(STORAGE_KEY_AUTO_ANUNCIO_CONFIG);
    const cfg = normalizeAutoAnuncioConfig(data[STORAGE_KEY_AUTO_ANUNCIO_CONFIG]);
    const locked = !vip || !!lastAuth.extensionOutdated;
    const channel = $('#gpAutoAnuncioChannel');
    const interval = $('#gpAutoAnuncioInterval');
    const text = $('#gpAutoAnuncioText');
    if (channel) {
      channel.value = cfg.channel;
      channel.disabled = locked;
    }
    if (interval) {
      interval.value = String(cfg.intervalMin);
      interval.disabled = locked;
    }
    if (text) {
      text.value = cfg.text;
      text.disabled = locked;
    }
    updateAutoAnuncioCount(cfg.text);
  }

  async function saveAutoAnuncioConfigFromInputs() {
    const channel = $('#gpAutoAnuncioChannel');
    const interval = $('#gpAutoAnuncioInterval');
    const text = $('#gpAutoAnuncioText');
    if (!channel || !interval || !text) return;
    try {
      const auth = await syncAuth();
      if (!applyAuthUi(auth)) throw new Error('Faça login em tibiabot.online.');
      if (!isVipAuth(auth)) {
        throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
      }
      if (auth.extensionOutdated) {
        throw new Error(auth.versionMessage || 'Atualize a extensão.');
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
        'Auto Anúncio: ' + cfg.channel + ' · a cada ' + cfg.intervalMin + ' min.',
        'ok'
      );
    } catch (error) {
      console.error('[Tibia Bot game-panel]', error);
      setStatus(error.message || 'Erro ao salvar Auto Anúncio.', 'err');
      await renderAutoAnuncioFields();
    }
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
    const minEl = $('#gpStaminaMinPct');
    const maxEl = $('#gpStaminaMaxPct');
    const locked = !vip || !!lastAuth.extensionOutdated;
    if (minEl) {
      minEl.value = String(cfg.minPct);
      minEl.disabled = locked;
    }
    if (maxEl) {
      maxEl.value = String(cfg.maxPct);
      maxEl.disabled = locked;
    }
    updateStaminaWarn(cfg.minPct);
  }

  function updateStaminaWarn(minPct) {
    const warn = $('#gpStaminaWarn');
    if (!warn) return;
    const n = Number(minPct);
    const show = Number.isFinite(n) && n < 15;
    warn.hidden = !show;
    warn.classList.toggle('is-on', show);
  }

  async function saveStaminaConfigFromInputs() {
    const minEl = $('#gpStaminaMinPct');
    const maxEl = $('#gpStaminaMaxPct');
    if (!minEl || !maxEl) return;

    try {
      const auth = await syncAuth();
      if (!applyAuthUi(auth)) throw new Error('Faça login em tibiabot.online.');
      if (!isVipAuth(auth)) {
        throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
      }
      if (auth.extensionOutdated) {
        throw new Error(auth.versionMessage || 'Atualize a extensão.');
      }

      const cfg = normalizeStaminaConfig({
        minPct: minEl.value,
        maxPct: maxEl.value
      });
      minEl.value = String(cfg.minPct);
      maxEl.value = String(cfg.maxPct);
      updateStaminaWarn(cfg.minPct);
      await chrome.storage.local.set({ [STORAGE_KEY_STAMINA_CONFIG]: cfg });
      setStatus('Stamina: ≤' + cfg.minPct + '% treino · ≥' + cfg.maxPct + '% hunt.', 'ok');
    } catch (error) {
      console.error('[Tibia Bot game-panel]', error);
      setStatus(error.message || 'Erro ao salvar stamina.', 'err');
      await renderStaminaFields();
    }
  }

  let autoBossView = 'list'; // list | detail
  let autoBossTab = 'catalog'; // catalog | selected
  let autoBossSelectedId = '';
  let autoBossSearchQuery = '';
  /** @type {Record<string, any>} */
  let bossTrackById = {};
  let bossTrackTimer = null;
  /** @type {Array<{id:string,name:string}>} */
  let autoBossPlaylist = [];
  /** @type {{ running?: boolean, queue?: Array<{id:string,name:string}>, index?: number, currentId?: string }|null} */
  let autoBossRun = null;
  let autoBossRunAdvancing = false;

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatBossHp(n) {
    const v = Math.max(0, Math.round(Number(n) || 0));
    try {
      return v.toLocaleString('pt-BR');
    } catch (_) {
      return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  }

  function formatResistValue(r) {
    const n = Number(r?.value) || 0;
    const sign = n > 0 ? '+' : '';
    return sign + n + '%';
  }

  function bossSpriteHtml(boss, large) {
    const cls = large ? 'gp-ab-sprite-lg' : 'gp-ab-sprite';
    if (boss?.sprite) {
      return (
        '<img class="' +
        cls +
        '" src="' +
        escapeHtml(boss.sprite) +
        '" alt="' +
        escapeHtml(boss.name) +
        '" loading="lazy">'
      );
    }
    const initials = String(boss?.name || '?')
      .split(/\s+/)
      .map((w) => w.charAt(0))
      .join('')
      .slice(0, 3)
      .toUpperCase();
    return (
      '<div class="' +
      cls +
      ' gp-ab-sprite-ph" aria-hidden="true">' +
      escapeHtml(initials || '?') +
      '</div>'
    );
  }

  function getBossCatalog() {
    return Array.isArray(window.BAIAK_IDLE_BOSSES) ? window.BAIAK_IDLE_BOSSES : [];
  }

  function normalizeBossSearch(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function filterBossCatalog(query) {
    const bosses = getBossCatalog();
    const q = normalizeBossSearch(query);
    if (!q) return bosses;
    return bosses.filter((boss) => {
      if (!boss) return false;
      const name = normalizeBossSearch(boss.name);
      const id = normalizeBossSearch(String(boss.id || '').replace(/_/g, ' '));
      return name.includes(q) || id.includes(q);
    });
  }

  function normalizePlaylist(list) {
    const out = [];
    const seen = new Set();
    (Array.isArray(list) ? list : []).forEach((item) => {
      let id = '';
      let name = '';
      if (typeof item === 'string') {
        id = item.trim();
        name = id;
      } else if (item && typeof item === 'object') {
        id = String(item.id || '').trim();
        name = String(item.name || id).trim();
      }
      if (!id || seen.has(id)) return;
      seen.add(id);
      out.push({ id, name });
    });
    return out;
  }

  function isBossInPlaylist(bossId) {
    const id = String(bossId || '');
    return autoBossPlaylist.some((b) => b && b.id === id);
  }

  function syncAutoBossTabsUi() {
    const tabs = $('#gpAbTabs');
    if (!tabs) return;
    const inDetail = autoBossView === 'detail';
    tabs.hidden = !!inDetail;
    tabs.querySelectorAll('.gp-ab-tab[data-ab-tab]').forEach((btn) => {
      const tab = btn.getAttribute('data-ab-tab');
      btn.classList.toggle('is-on', tab === autoBossTab);
    });
    const countEl = $('#gpAbSelectedCount');
    if (countEl) {
      const n = autoBossPlaylist.length;
      countEl.textContent = n ? ' (' + n + ')' : '';
    }
  }

  async function loadAutoBossPlaylist() {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEY_AUTOBOSS_PLAYLIST);
      autoBossPlaylist = normalizePlaylist(data[STORAGE_KEY_AUTOBOSS_PLAYLIST]);
    } catch (_) {
      autoBossPlaylist = [];
    }
    syncAutoBossTabsUi();
    return autoBossPlaylist;
  }

  function normalizeAutoBossRun(raw) {
    if (!raw || typeof raw !== 'object' || !raw.running) {
      return { running: false, queue: [], index: 0, currentId: '' };
    }
    const queue = Array.isArray(raw.queue)
      ? raw.queue
          .map((b) => ({
            id: String(b?.id || '').trim(),
            name: String(b?.name || b?.id || '').trim()
          }))
          .filter((b) => b.id && b.name)
      : [];
    const index = Math.max(0, Number(raw.index) || 0);
    return {
      running: true,
      queue,
      index,
      currentId: String(raw.currentId || queue[index]?.id || '')
    };
  }

  async function loadAutoBossRun() {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEY_AUTOBOSS_RUN);
      autoBossRun = normalizeAutoBossRun(data[STORAGE_KEY_AUTOBOSS_RUN]);
    } catch (_) {
      autoBossRun = { running: false, queue: [], index: 0, currentId: '' };
    }
    syncAutoBossRunUi();
    return autoBossRun;
  }

  async function saveAutoBossRun(run) {
    autoBossRun = normalizeAutoBossRun(run);
    await chrome.storage.local.set({
      [STORAGE_KEY_AUTOBOSS_RUN]: autoBossRun.running
        ? {
            running: true,
            queue: autoBossRun.queue.map((b, i) => ({
              id: b.id,
              name: b.name,
              status: i === autoBossRun.index ? 'fighting' : 'waiting',
              outcome: null
            })),
            index: autoBossRun.index,
            currentId: autoBossRun.currentId,
            stopAfterCurrent: false
          }
        : { running: false }
    });
    syncAutoBossRunUi();
    return autoBossRun;
  }

  function getEligibleAutoBossQueue() {
    return autoBossPlaylist
      .map((entry) => {
        const id = String(entry?.id || '').trim();
        const name = String(entry?.name || id).trim();
        if (!id || !name) return null;
        const track = getBossTrack(id);
        if (isBossOnCooldown(track)) return null;
        return { id, name };
      })
      .filter(Boolean);
  }

  function syncAutoBossRunUi() {
    const bar = $('#gpAbRunBar');
    const btn = $('#gpAbRunBtn');
    const meta = $('#gpAbRunMeta');
    const resetBtn = $('#gpAbResetTrack');
    const run = autoBossRun || { running: false, queue: [], index: 0 };
    if (resetBtn) resetBtn.disabled = !!run.running;
    if (!bar || !btn || !meta) return;

    const show = isAutoBossOpen() && autoBossView === 'list' && autoBossTab === 'selected';
    bar.hidden = !show;
    if (!show) return;

    const eligible = getEligibleAutoBossQueue();

    if (run.running) {
      btn.textContent = 'Parar';
      btn.classList.add('is-stop');
      btn.disabled = false;
      const total = run.queue.length;
      const pos = Math.min((run.index || 0) + 1, Math.max(total, 1));
      const cur = run.queue[run.index] || run.queue.find((b) => b.id === run.currentId);
      meta.innerHTML = cur
        ? 'Fila <strong>' +
          pos +
          '/' +
          total +
          '</strong> · enfrentando <strong>' +
          escapeHtml(cur.name) +
          '</strong>'
        : 'Fila ativa · ' + total + ' boss(es)';
      return;
    }

    btn.textContent = 'Iniciar';
    btn.classList.remove('is-stop');
    btn.disabled = eligible.length === 0;
    meta.textContent =
      eligible.length > 0
        ? eligible.length +
          ' boss' +
          (eligible.length === 1 ? '' : 'es') +
          ' sem cooldown prontos para iniciar'
        : autoBossPlaylist.length
          ? 'Todos os selecionados estão em cooldown.'
          : 'Adicione bosses na playlist para iniciar.';
  }

  async function disablePularBossForBossFight() {
    const mod = MODULES.find((m) => m.id === 'pular_boss');
    if (!mod) return;
    try {
      const data = await chrome.storage.local.get(mod.storageKey);
      if (!data[mod.storageKey]) {
        const toggle = mod.toggleId ? document.getElementById(mod.toggleId) : null;
        if (toggle) toggle.checked = false;
        return;
      }
      await chrome.storage.local.set({ [mod.storageKey]: false });
      const toggle = mod.toggleId ? document.getElementById(mod.toggleId) : null;
      if (toggle) toggle.checked = false;
      const response = await chrome.runtime.sendMessage({ type: mod.stopMsg });
      if (!response?.success) {
        throw new Error(response?.error || 'Falha ao desligar Pular Boss.');
      }
      await refreshModules();
      setStatus('Pular Boss desligado (modo boss).', 'ok');
    } catch (error) {
      setStatus(error?.message || 'Não foi possível desligar Pular Boss.', 'err');
    }
  }

  async function stopAutoBossRun(reason) {
    autoBossRunAdvancing = false;
    try {
      await chrome.storage.local.set({
        [STORAGE_KEY_AUTOBOSS_RUN]: { running: false },
        baiakIdleAutoBossEnabled: false
      });
      await chrome.runtime.sendMessage({ type: 'BAIAKIDLE_STOP_AUTOBOSS' });
    } catch (_) {}
    autoBossRun = { running: false, queue: [], index: 0, currentId: '' };
    syncAutoBossRunUi();
    if (reason) setStatus(reason, 'ok');
  }

  async function startAutoBossRun() {
    const auth = await syncAuth();
    if (!applyAuthUi(auth)) throw new Error('Faça login em tibiabot.online.');
    if (!isVipAuth(auth)) {
      throw new Error('VIP necessária. Ative um voucher ou compre o plano em Minha conta.');
    }
    if (auth.extensionOutdated) {
      throw new Error(auth.versionMessage || 'Atualize a extensão.');
    }

    await loadBossTrack();
    await loadAutoBossPlaylist();
    const queue = getEligibleAutoBossQueue();
    if (!queue.length) {
      throw new Error('Nenhum boss sem cooldown na playlist.');
    }

    await disablePularBossForBossFight();
    await saveAutoBossRun({
      running: true,
      queue,
      index: 0,
      currentId: queue[0].id
    });
    await chrome.storage.local.set({ baiakIdleAutoBossEnabled: true });

    const response = await chrome.runtime.sendMessage({
      type: 'BAIAKIDLE_START_AUTOBOSS'
    });
    if (!response?.success) {
      await saveAutoBossRun({ running: false });
      await chrome.storage.local.set({ baiakIdleAutoBossEnabled: false });
      throw new Error(response?.error || 'Falha ao iniciar módulo AutoBoss.');
    }

    closeAutoBoss();
    close();
    requestCaptureCharacters('autoboss');
    setStatus('AutoBoss iniciado · ' + queue.length + ' boss(es) na fila.', 'ok');
  }

  async function advanceAutoBossRunIfNeeded() {
    // Orquestração ficou no módulo MAIN (autoboss.js).
  }

  async function saveAutoBossPlaylist(list) {
    autoBossPlaylist = normalizePlaylist(list);
    await chrome.storage.local.set({
      [STORAGE_KEY_AUTOBOSS_PLAYLIST]: autoBossPlaylist
    });
    syncAutoBossTabsUi();
    return autoBossPlaylist;
  }

  async function toggleBossInPlaylist(bossId, bossName) {
    const id = String(bossId || '').trim();
    const name = String(bossName || id).trim();
    if (!id) return false;
    const exists = isBossInPlaylist(id);
    let next;
    if (exists) {
      next = autoBossPlaylist.filter((b) => b.id !== id);
    } else {
      next = autoBossPlaylist.concat([{ id, name }]);
    }
    await saveAutoBossPlaylist(next);
    return !exists;
  }

  function playlistToggleBtnHtml(boss, compact) {
    const on = isBossInPlaylist(boss?.id);
    if (compact) {
      return (
        '<button type="button" class="gp-ab-pl-btn ' +
        (on ? 'is-remove' : 'is-add') +
        '" data-boss-playlist="' +
        escapeHtml(boss.id) +
        '" data-boss-name="' +
        escapeHtml(boss.name) +
        '" title="' +
        (on ? 'Remover do AutoBoss' : 'Adicionar ao AutoBoss') +
        '">' +
        (on ? '−' : '+') +
        '</button>'
      );
    }
    return (
      '<button type="button" class="gp-ab-playlist-btn ' +
      (on ? 'is-remove' : 'is-add') +
      '" data-boss-playlist="' +
      escapeHtml(boss.id) +
      '" data-boss-name="' +
      escapeHtml(boss.name) +
      '">' +
      (on ? 'Remover AutoBoss' : 'Adicionar AutoBoss') +
      '</button>'
    );
  }

  function getBossIndex(bossId) {
    return getBossCatalog().findIndex((b) => b && b.id === bossId);
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

  function getBossTrack(bossId) {
    const id = String(bossId || '');
    if (!id) return null;
    const row = bossTrackById[id];
    if (!row) return null;
    if (Number(row.expiresAt) && Number(row.expiresAt) <= Date.now()) return null;
    return row;
  }

  function formatMsCountdown(expiresAt) {
    const left = Math.max(0, (Number(expiresAt) || 0) - Date.now());
    if (left <= 0) return '';
    const totalSec = Math.floor(left / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return h + 'h ' + String(m).padStart(2, '0') + 'm';
    return m + 'm ' + String(s).padStart(2, '0') + 's';
  }

  function isBossTrackFinished(track) {
    return !!(track && (track.finished || track.killed || track.died));
  }

  /** Em cooldown de 24h só após kill/morte (não conta só o Enfrentar). */
  function isBossOnCooldown(track) {
    if (!isBossTrackFinished(track)) return false;
    const expiresAt = Number(track.expiresAt) || 0;
    return expiresAt > Date.now();
  }

  function bossFinishedLabel(track) {
    if (!isBossTrackFinished(track)) return '';
    if (track.outcome === 'death' || track.died) {
      return '<span class="gp-ab-skull" title="Morreu no boss">💀</span> Finalizado';
    }
    return '<span class="gp-ab-skull" title="Boss derrotado">☠</span> Finalizado';
  }

  function bossCardBadgesHtml(boss) {
    const track = getBossTrack(boss?.id);
    if (!track) return '<div class="gp-ab-card-badges"></div>';
    const parts = [];
    if (isBossTrackFinished(track)) {
      parts.push(
        track.outcome === 'death' || track.died
          ? '<span class="gp-ab-skull" title="Morreu no boss — finalizado">💀</span>'
          : '<span class="gp-ab-skull" title="Boss derrotado — finalizado">☠</span>'
      );
    }
    // Contador só quando realmente está em recarga pós kill/morte
    if (isBossOnCooldown(track)) {
      const cd = formatMsCountdown(track.expiresAt);
      if (cd) {
        parts.push(
          '<span class="gp-ab-cd" data-boss-cd="' +
            escapeHtml(boss.id) +
            '" title="Recarga de 24h">' +
            escapeHtml(cd) +
            '</span>'
        );
      }
    }
    return '<div class="gp-ab-card-badges">' + parts.join('') + '</div>';
  }

  async function clearBossTrackCounters() {
    bossTrackById = {};
    await chrome.storage.local.set({
      [STORAGE_KEY_BOSS_TRACK]: {
        byId: {},
        pendingId: null,
        pendingName: ''
      }
    });
    if (isAutoBossOpen()) {
      renderAutoBoss();
      syncAutoBossRunUi();
    }
    setStatus('Contadores de boss zerados.', 'ok');
  }

  async function loadBossTrack() {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEY_BOSS_TRACK);
      const raw = data[STORAGE_KEY_BOSS_TRACK] || {};
      const byId = pruneBossTrackMap(raw.byId || {});
      bossTrackById = byId;
      return { byId, pendingId: raw.pendingId || null, pendingName: raw.pendingName || '' };
    } catch (_) {
      bossTrackById = {};
      return { byId: {}, pendingId: null, pendingName: '' };
    }
  }

  async function markBossConfrontStarted(bossId, bossName) {
    const id = String(bossId || '').trim();
    const name = String(bossName || '').trim();
    if (!id || !name) return;
    const now = Date.now();
    const row = {
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
    const current = await loadBossTrack();
    const byId = pruneBossTrackMap({ ...current.byId, [id]: row });
    bossTrackById = byId;
    await chrome.storage.local.set({
      [STORAGE_KEY_BOSS_TRACK]: {
        byId,
        pendingId: id,
        pendingName: name
      }
    });
  }

  function refreshBossCountdownsInDom() {
    const body = $('#gpAbBody');
    if (!body || !isAutoBossOpen()) return;
    let expired = false;
    body.querySelectorAll('[data-boss-cd]').forEach((el) => {
      const id = el.getAttribute('data-boss-cd');
      const track = getBossTrack(id);
      if (!isBossOnCooldown(track)) {
        el.textContent = '';
        expired = true;
        return;
      }
      const text = formatMsCountdown(track.expiresAt);
      el.textContent = text;
      if (!text) expired = true;
    });
    if (expired) {
      syncAutoBossRunUi();
    }
  }

  function syncBossTrackTimer() {
    if (bossTrackTimer) {
      clearInterval(bossTrackTimer);
      bossTrackTimer = null;
    }
    if (!isAutoBossOpen()) return;
    bossTrackTimer = setInterval(() => {
      if (!isAutoBossOpen()) {
        clearInterval(bossTrackTimer);
        bossTrackTimer = null;
        return;
      }
      // expira entradas e atualiza textos
      const before = Object.keys(bossTrackById).length;
      bossTrackById = pruneBossTrackMap(bossTrackById);
      if (Object.keys(bossTrackById).length !== before && autoBossView === 'list') {
        renderAutoBoss();
        return;
      }
      refreshBossCountdownsInDom();
    }, 1000);
  }

  async function confrontBoss(bossId, bossName, opts = {}) {
    const id = String(bossId || '').trim();
    const name = String(bossName || '').trim();
    if (!name) {
      setStatus('Boss inválido.', 'err');
      return;
    }
    setStatus('Abrindo Chefes → ' + name + '…', 'ok');
    try {
      await disablePularBossForBossFight();
      // Enfrentar manual cancela a fila automática do módulo.
      if (autoBossRun?.running && !opts.fromAutoRun) {
        await stopAutoBossRun('');
      }
      if (id) await markBossConfrontStarted(id, name);
      requestCaptureCharacters('boss');
      closeAutoBoss();
      const response = await chrome.runtime.sendMessage({
        type: 'BAIAKIDLE_GO_BOSS',
        bossName: name
      });
      if (!response?.success) {
        throw new Error(response?.error || 'Falha ao localizar o boss no jogo.');
      }
      setStatus('Localizando ' + name + ' no menu de Chefes…', 'ok');
    } catch (error) {
      setStatus(error?.message || 'Erro ao enfrentar o boss.', 'err');
    }
  }

  function navigateAutoBoss(delta) {
    const bosses = getBossCatalog();
    if (!bosses.length || !autoBossSelectedId) return;
    const idx = getBossIndex(autoBossSelectedId);
    if (idx < 0) return;
    const next = idx + delta;
    if (next < 0 || next >= bosses.length) return;
    autoBossSelectedId = bosses[next].id;
    autoBossView = 'detail';
    renderAutoBoss();
    const body = $('#gpAbBody');
    if (body) body.scrollTop = 0;
  }

  let bossesEnsurePromise = null;

  function setAutoBossExpanded(open) {
    const root = document.getElementById(ROOT_ID);
    root?.classList.toggle('is-autoboss-open', !!open);
  }

  function isAutoBossOpen() {
    const modal = $('#gpAutoBossModal');
    return !!(modal && modal.classList.contains('is-open'));
  }

  function closeAutoBoss() {
    const modal = $('#gpAutoBossModal');
    const dialog = rootQueryDialog();
    if (dialog) dialog.style.overflow = '';
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.hidden = true;
    autoBossView = 'list';
    autoBossTab = 'catalog';
    autoBossSelectedId = '';
    autoBossSearchQuery = '';
    setAutoBossExpanded(false);
    syncBossTrackTimer();
    syncAutoBossTabsUi();
    syncAutoBossRunUi();
  }

  function rootQueryDialog() {
    return document.querySelector('#' + ROOT_ID + ' .gp-dialog');
  }

  async function ensureBossCatalogLoaded() {
    if (getBossCatalog().length) return true;
    if (bossesEnsurePromise) return bossesEnsurePromise;

    bossesEnsurePromise = (async () => {
      const response = await chrome.runtime.sendMessage({
        type: 'BAIAKIDLE_ENSURE_BOSSES'
      });
      if (!response?.success) {
        throw new Error(response?.error || 'Falha ao carregar catálogo de bosses.');
      }
      if (!getBossCatalog().length) {
        throw new Error('Catálogo de bosses vazio.');
      }
      return true;
    })().finally(() => {
      bossesEnsurePromise = null;
    });

    return bossesEnsurePromise;
  }

  async function openAutoBoss() {
    const modal = $('#gpAutoBossModal');
    const body = $('#gpAbBody');
    const title = $('#gpAbTitle');
    const back = $('#gpAbBack');
    if (!modal) return;
    setSettingsOpen(false);
    const dialog = rootQueryDialog();
    if (dialog) dialog.style.overflow = 'hidden';
    modal.hidden = false;
    modal.classList.add('is-open');
    setAutoBossExpanded(true);
    autoBossView = 'list';
    autoBossTab = 'catalog';
    autoBossSelectedId = '';
    autoBossSearchQuery = '';
    if (title) title.textContent = 'AutoBoss';
    if (back) back.hidden = true;
    syncAutoBossTabsUi();
    if (body) {
      body.innerHTML = '<p class="gp-ab-empty">Carregando catálogo de bosses…</p>';
    }

    try {
      await ensureBossCatalogLoaded();
      await loadBossTrack();
      await loadAutoBossPlaylist();
      await loadAutoBossRun();
      if (!isAutoBossOpen()) return;
      renderAutoBoss();
      syncBossTrackTimer();
      syncAutoBossRunUi();
    } catch (error) {
      if (!isAutoBossOpen() || !body) return;
      body.innerHTML =
        '<p class="gp-ab-empty">' +
        escapeHtml(error?.message || 'Não foi possível carregar os bosses.') +
        '</p>';
      syncAutoBossRunUi();
    }
  }

  function renderAutoBoss() {
    const body = $('#gpAbBody');
    const title = $('#gpAbTitle');
    const back = $('#gpAbBack');
    if (!body || !title || !back) return;

    if (autoBossView === 'detail' && autoBossSelectedId) {
      const boss =
        (typeof window.BAIAK_IDLE_GET_BOSS === 'function'
          ? window.BAIAK_IDLE_GET_BOSS(autoBossSelectedId)
          : null) || getBossCatalog().find((b) => b.id === autoBossSelectedId);
      if (!boss) {
        autoBossView = 'list';
        autoBossSelectedId = '';
        renderAutoBoss();
        return;
      }

      title.textContent = boss.name;
      back.hidden = false;
      syncAutoBossTabsUi();

      const catalog = getBossCatalog();
      const bossIndex = getBossIndex(boss.id);
      const bossPos = bossIndex >= 0 ? bossIndex + 1 : 0;
      const canPrev = bossIndex > 0;
      const canNext = bossIndex >= 0 && bossIndex < catalog.length - 1;

      const resists = (boss.resistances || [])
        .map((r) => {
          const kindClass =
            r.kind === 'fraco' ? ' is-weak' : r.kind === 'resistente' ? ' is-resist' : '';
          return (
            '<div class="gp-ab-res" title="' +
            escapeHtml(r.element + ': ' + formatResistValue(r) + ' (' + r.kind + ')') +
            '">' +
            '<img src="' +
            escapeHtml(r.icon) +
            '" alt="' +
            escapeHtml(r.element) +
            '">' +
            '<span>' +
            escapeHtml(r.element) +
            '</span>' +
            '<b class="gp-ab-res-val' +
            kindClass +
            '">' +
            escapeHtml(formatResistValue(r)) +
            '</b>' +
            '</div>'
          );
        })
        .join('');

      const lootBlock = (label, items) => {
        if (!items || !items.length) return '';
        const thumbs = items
          .map((it) => {
            const title = escapeHtml(it.name);
            const media = it.image
              ? '<img alt="' + title + '" src="' + escapeHtml(it.image) + '" loading="lazy">'
              : '<span class="gp-ab-item-name">' + title + '</span>';
            return '<div class="gp-ab-item" title="' + title + '">' + media + '</div>';
          })
          .join('');
        return (
          '<div class="gp-ab-section">' +
          '<h4 class="gp-ab-section-title">DROP ' +
          escapeHtml(label) +
          '</h4>' +
          '<div class="gp-ab-loot">' +
          thumbs +
          '</div></div>'
        );
      };

      body.innerHTML =
        '<div class="gp-ab-nav">' +
        '<button type="button" class="gp-ab-nav-btn" data-boss-nav="prev"' +
        (canPrev ? '' : ' disabled') +
        ' aria-label="Boss anterior">‹ Anterior</button>' +
        '<span class="gp-ab-nav-pos">' +
        escapeHtml(String(bossPos)) +
        ' / ' +
        escapeHtml(String(catalog.length)) +
        '</span>' +
        '<button type="button" class="gp-ab-nav-btn" data-boss-nav="next"' +
        (canNext ? '' : ' disabled') +
        ' aria-label="Próximo boss">Próximo ›</button>' +
        '</div>' +
        '<div class="gp-ab-detail-head">' +
        bossSpriteHtml(boss, true) +
        '<div class="gp-ab-detail-meta">' +
        '<h4 class="gp-ab-detail-name">' +
        escapeHtml(boss.name) +
        '</h4>' +
        '<div class="gp-ab-rarity">' +
        (boss.rarityIcon
          ? '<img src="' + escapeHtml(boss.rarityIcon) + '" alt="">'
          : '') +
        escapeHtml(boss.rarityLabel || boss.rarity) +
        '</div>' +
        '</div></div>' +
        (function () {
          const track = getBossTrack(boss.id);
          if (!track || !isBossOnCooldown(track)) return '';
          const cd = formatMsCountdown(track.expiresAt);
          return (
            '<div class="gp-ab-track-row">' +
            '<span>' +
            bossFinishedLabel(track) +
            '</span>' +
            (cd
              ? '<span class="gp-ab-cd" data-boss-cd="' +
                escapeHtml(boss.id) +
                '">' +
                escapeHtml(cd) +
                '</span>'
              : '') +
            '</div>'
          );
        })() +
        playlistToggleBtnHtml(boss, false) +
        '<button type="button" class="gp-ab-fight" data-boss-fight="' +
        escapeHtml(boss.id) +
        '" data-boss-name="' +
        escapeHtml(boss.name) +
        '">' +
        '<span class="gp-ab-fight-ico" aria-hidden="true">⚔</span>' +
        'Enfrentar' +
        '</button>' +
        '<div class="gp-ab-statrows">' +
        '<div class="gp-ab-statrow"><span>HP</span><b>' +
        escapeHtml(formatBossHp(boss.hp)) +
        '</b></div>' +
        '<div class="gp-ab-statrow"><span>Summons</span><b>' +
        escapeHtml((boss.summons || []).join(', ') || '—') +
        '</b></div>' +
        '</div>' +
        (resists
          ? '<div class="gp-ab-section"><h4 class="gp-ab-section-title">Resistências</h4><div class="gp-ab-res-grid">' +
            resists +
            '</div></div>'
          : '') +
        lootBlock('Common', boss.drops?.common) +
        lootBlock('Uncommon', boss.drops?.uncommon) +
        lootBlock('Semi-Rare', boss.drops?.semiRare) +
        lootBlock('Rare', boss.drops?.rare) +
        lootBlock('Very Rare', boss.drops?.veryRare);
      syncBossTrackTimer();
      syncAutoBossRunUi();
      return;
    }

    title.textContent = 'AutoBoss';
    back.hidden = true;
    syncAutoBossTabsUi();
    const bosses = getBossCatalog();
    if (!bosses.length) {
      body.innerHTML =
        '<p class="gp-ab-empty">Nenhum boss catalogado ainda. Envie o HTML da cyclopedia para adicionarmos.</p>';
      syncAutoBossRunUi();
      return;
    }

    if (autoBossTab === 'selected') {
      const selectedBosses = autoBossPlaylist
        .map((entry) => {
          const full =
            (typeof window.BAIAK_IDLE_GET_BOSS === 'function'
              ? window.BAIAK_IDLE_GET_BOSS(entry.id)
              : null) || bosses.find((b) => b.id === entry.id);
          return (
            full || {
              id: entry.id,
              name: entry.name || entry.id,
              sprite: '',
              rarity: '',
              rarityLabel: ''
            }
          );
        })
        .filter(Boolean);

      const freeBosses = selectedBosses.filter((boss) => !isBossOnCooldown(getBossTrack(boss.id)));
      const onCd = selectedBosses.length - freeBosses.length;

      if (!selectedBosses.length) {
        body.innerHTML =
          '<p class="gp-ab-empty">Nenhum boss selecionado. Use o [+] no catálogo ou “Adicionar AutoBoss” no detalhe.</p>';
        syncBossTrackTimer();
        syncAutoBossRunUi();
        return;
      }

      body.innerHTML =
        '<div class="gp-ab-search-meta" style="margin:0 0 10px">Playlist · ' +
        escapeHtml(String(freeBosses.length)) +
        ' livre' +
        (freeBosses.length === 1 ? '' : 's') +
        ' sem cooldown' +
        (onCd > 0 ? ' · ' + escapeHtml(String(onCd)) + ' em recarga' : '') +
        '</div>' +
        '<div class="gp-ab-grid">' +
        selectedBosses
          .map((boss) => {
            const track = getBossTrack(boss.id);
            return (
              '<div class="gp-ab-card' +
              (isBossOnCooldown(track) ? ' is-killed' : '') +
              '" role="button" tabindex="0" data-boss-id="' +
              escapeHtml(boss.id) +
              '">' +
              playlistToggleBtnHtml(boss, true) +
              bossSpriteHtml(boss, false) +
              bossCardBadgesHtml(boss) +
              '<span class="gp-ab-card-name">' +
              escapeHtml(boss.name) +
              '</span></div>'
            );
          })
          .join('') +
        '</div>';
      syncBossTrackTimer();
      syncAutoBossRunUi();
      return;
    }

    const filtered = filterBossCatalog(autoBossSearchQuery);
    const q = String(autoBossSearchQuery || '');
    const meta = q
      ? filtered.length +
        ' de ' +
        bosses.length +
        ' boss' +
        (bosses.length === 1 ? '' : 'es')
      : bosses.length + ' boss' + (bosses.length === 1 ? '' : 'es');

    const cards = filtered.length
      ? '<div class="gp-ab-grid">' +
        filtered
          .map((boss) => {
            const track = getBossTrack(boss.id);
            return (
              '<div class="gp-ab-card' +
              (isBossOnCooldown(track) ? ' is-killed' : '') +
              '" role="button" tabindex="0" data-boss-id="' +
              escapeHtml(boss.id) +
              '">' +
              playlistToggleBtnHtml(boss, true) +
              bossSpriteHtml(boss, false) +
              bossCardBadgesHtml(boss) +
              '<span class="gp-ab-card-name">' +
              escapeHtml(boss.name) +
              '</span></div>'
            );
          })
          .join('') +
        '</div>'
      : '<p class="gp-ab-empty">Nenhum boss encontrado para "' +
        escapeHtml(q) +
        '".</p>';

    body.innerHTML =
      '<div class="gp-ab-search">' +
      '<input type="search" id="gpAbSearch" placeholder="Pesquisar boss pelo nome…" value="' +
      escapeHtml(q) +
      '" autocomplete="off" spellcheck="false">' +
      '<div class="gp-ab-search-meta">' +
      escapeHtml(meta) +
      '</div></div>' +
      cards;

    const search = body.querySelector('#gpAbSearch');
    if (search) {
      const len = search.value.length;
      search.focus();
      try {
        search.setSelectionRange(len, len);
      } catch (_) {}
    }
    syncBossTrackTimer();
    syncAutoBossRunUi();
  }

  function setSettingsOpen(open) {
    const menu = $('#gpSettings');
    const gear = $('#gpGearBtn');
    if (!menu || !gear) return;
    menu.hidden = !open;
    menu.classList.toggle('is-open', !!open);
    gear.classList.toggle('is-open', !!open);
    gear.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      requestCaptureCharacters('settings');
      void renderCharactersList();
    }
  }

  function requestCaptureCharacters(reason) {
    try {
      window.dispatchEvent(
        new CustomEvent('tibia-bot-capture-characters', {
          detail: { reason: String(reason || 'ui') }
        })
      );
    } catch (_) {}
    try {
      void chrome.runtime.sendMessage({
        type: 'TIBIA_BOT_CAPTURE_CHARACTERS',
        reason: String(reason || 'ui')
      });
    } catch (_) {}
  }

  function normalizeCharactersForUi(raw) {
    const list = Array.isArray(raw?.list) ? raw.list : Array.isArray(raw) ? raw : [];
    return list
      .map((row) => {
        if (!row || typeof row !== 'object') return null;
        const name = String(row.name || '').trim();
        if (!name) return null;
        return {
          name,
          className: String(row.className || row.class || row.vocation || '').trim(),
          level: Math.max(0, parseInt(String(row.level || '0').replace(/[^\d]/g, ''), 10) || 0)
        };
      })
      .filter(Boolean)
      .sort((a, b) => String(a.name).localeCompare(String(b.name), 'pt-BR'));
  }

  async function renderCharactersList() {
    const box = $('#gpCharactersList');
    if (!box) return;
    try {
      const data = await chrome.storage.local.get(STORAGE_KEY_CHARACTERS);
      const list = normalizeCharactersForUi(data[STORAGE_KEY_CHARACTERS]);
      if (!list.length) {
        box.innerHTML =
          '<p class="gp-settings-chars-empty">Nenhum personagem capturado ainda.</p>';
        return;
      }
      box.innerHTML = list
        .map((c) => {
          const metaParts = [];
          if (c.className) metaParts.push(escapeHtml(c.className));
          metaParts.push(c.level > 0 ? 'lvl ' + c.level : 'lvl —');
          return (
            '<div class="gp-settings-char">' +
            '<div class="gp-settings-char-name">' +
            escapeHtml(c.name) +
            '</div>' +
            '<div class="gp-settings-char-meta">' +
            metaParts.join(' · ') +
            '</div>' +
            '</div>'
          );
        })
        .join('');
    } catch (_) {
      box.innerHTML =
        '<p class="gp-settings-chars-empty">Não foi possível carregar personagens.</p>';
    }
  }

  async function syncOverlayToggleUi() {
    const toggle = $('#gpOverlayToggle');
    if (!toggle) return;
    try {
      const data = await chrome.storage.local.get(STORAGE_KEY_OVERLAY_VISIBLE);
      const visible =
        data[STORAGE_KEY_OVERLAY_VISIBLE] === undefined
          ? true
          : !!data[STORAGE_KEY_OVERLAY_VISIBLE];
      toggle.checked = visible;
    } catch (_) {
      toggle.checked = true;
    }
  }

  async function syncOcultarNomesToggleUi() {
    const toggle = $('#gpOcultarNomesToggle');
    if (!toggle) return;
    try {
      const data = await chrome.storage.local.get(STORAGE_KEY_OCULTAR_NOMES);
      toggle.checked = !!data[STORAGE_KEY_OCULTAR_NOMES];
      toggle.disabled = !isVipAuth(lastAuth) || !!lastAuth.extensionOutdated;
    } catch (_) {
      toggle.checked = false;
    }
  }

  async function applyOcultarNomesToggle(enabled) {
    const toggle = $('#gpOcultarNomesToggle');
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

      await chrome.storage.local.set({ [STORAGE_KEY_OCULTAR_NOMES]: !!enabled });
      const response = await chrome.runtime.sendMessage({
        type: enabled ? 'BAIAKIDLE_START_OCULTAR_NOMES' : 'BAIAKIDLE_STOP_OCULTAR_NOMES'
      });
      if (!response?.success) {
        throw new Error(response?.error || 'Falha ao aplicar Ocultar nomes.');
      }
      if (enabled) requestCaptureCharacters('ocultar_nomes');
      void renderCharactersList();
      setStatus(enabled ? 'Nomes ocultos.' : 'Nomes restaurados.', 'ok');
    } catch (error) {
      console.error('[Tibia Bot game-panel]', error);
      if (toggle) toggle.checked = !enabled;
      await chrome.storage.local.set({ [STORAGE_KEY_OCULTAR_NOMES]: !enabled });
      setStatus(error.message || 'Erro ao alterar ocultar nomes.', 'err');
    } finally {
      if (toggle) toggle.disabled = !isVipAuth(lastAuth) || !!lastAuth.extensionOutdated;
    }
  }

  function bindOnce() {
    if (bound) return;
    bound = true;
    void loadAutoBossRun();
    const root = ensureDom();

    root.addEventListener('click', (ev) => {
      if (ev.target?.closest?.('[data-gp-close]')) {
        setSettingsOpen(false);
        close();
        return;
      }

      const gear = ev.target?.closest?.('#gpGearBtn');
      if (gear) {
        ev.preventDefault();
        ev.stopPropagation();
        const menu = $('#gpSettings');
        setSettingsOpen(!!menu?.hidden);
        return;
      }

      if (!ev.target?.closest?.('#gpSettings') && !ev.target?.closest?.('#gpGearBtn')) {
        setSettingsOpen(false);
      }
    });

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && root.classList.contains('is-open')) {
        if (isAutoBossOpen()) {
          if (autoBossView === 'detail') {
            autoBossView = 'list';
            autoBossSelectedId = '';
            renderAutoBoss();
            return;
          }
          closeAutoBoss();
          return;
        }
        const menu = $('#gpSettings');
        if (menu && !menu.hidden) {
          setSettingsOpen(false);
          return;
        }
        close();
      }
    });

    $('#gpAutoBossBtn')?.addEventListener('click', () => {
      openAutoBoss();
    });

    $('#gpAbClose')?.addEventListener('click', () => {
      closeAutoBoss();
    });

    $('#gpAbBack')?.addEventListener('click', () => {
      autoBossView = 'list';
      autoBossSelectedId = '';
      renderAutoBoss();
    });

    // Delegação no modal: abas + Iniciar/Parar + zerar contadores (hot-reload safe).
    $('#gpAutoBossModal')?.addEventListener('click', (ev) => {
      const resetBtn = ev.target?.closest?.('#gpAbResetTrack');
      if (resetBtn) {
        ev.preventDefault();
        if (autoBossRun?.running) {
          setStatus('Pare o AutoBoss antes de zerar os contadores.', 'err');
          return;
        }
        void clearBossTrackCounters();
        return;
      }
      const runBtn = ev.target?.closest?.('#gpAbRunBtn');
      if (runBtn) {
        ev.preventDefault();
        void (async () => {
          try {
            runBtn.disabled = true;
            if (autoBossRun?.running) {
              await stopAutoBossRun('AutoBoss parado.');
              return;
            }
            autoBossTab = 'selected';
            autoBossView = 'list';
            syncAutoBossTabsUi();
            renderAutoBoss();
            await startAutoBossRun();
          } catch (error) {
            setStatus(error?.message || 'Erro ao iniciar AutoBoss.', 'err');
          } finally {
            syncAutoBossRunUi();
          }
        })();
        return;
      }
      const tabBtn = ev.target?.closest?.('#gpAbTabs .gp-ab-tab[data-ab-tab]');
      if (!tabBtn) return;
      const tab = tabBtn.getAttribute('data-ab-tab') || 'catalog';
      if (tab !== 'catalog' && tab !== 'selected') return;
      autoBossTab = tab;
      autoBossView = 'list';
      autoBossSelectedId = '';
      void (async () => {
        if (tab === 'selected') {
          await loadBossTrack();
          await loadAutoBossPlaylist();
        }
        if (!isAutoBossOpen()) return;
        renderAutoBoss();
        syncAutoBossRunUi();
      })();
    });

    $('#gpAbBody')?.addEventListener('input', (ev) => {
      const input = ev.target?.closest?.('#gpAbSearch');
      if (!input || autoBossView !== 'list') return;
      autoBossSearchQuery = String(input.value || '');
      renderAutoBoss();
    });

    $('#gpAbBody')?.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Escape') return;
      const input = ev.target?.closest?.('#gpAbSearch');
      if (!input || autoBossView !== 'list') return;
      if (!autoBossSearchQuery) return;
      ev.stopPropagation();
      autoBossSearchQuery = '';
      renderAutoBoss();
    });

    $('#gpAbBody')?.addEventListener('click', (ev) => {
      const playlistBtn = ev.target?.closest?.('[data-boss-playlist]');
      if (playlistBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        const bossId = playlistBtn.getAttribute('data-boss-playlist') || '';
        const bossName = playlistBtn.getAttribute('data-boss-name') || bossId;
        void (async () => {
          const added = await toggleBossInPlaylist(bossId, bossName);
          setStatus(
            added
              ? bossName + ' adicionado ao AutoBoss.'
              : bossName + ' removido do AutoBoss.',
            'ok'
          );
          if (isAutoBossOpen()) renderAutoBoss();
        })();
        return;
      }
      const fightBtn = ev.target?.closest?.('.gp-ab-fight[data-boss-name]');
      if (fightBtn && !fightBtn.disabled) {
        ev.preventDefault();
        const bossName = fightBtn.getAttribute('data-boss-name') || '';
        const bossId = fightBtn.getAttribute('data-boss-fight') || '';
        fightBtn.disabled = true;
        void confrontBoss(bossId, bossName).finally(() => {
          try {
            fightBtn.disabled = false;
          } catch (_) {}
        });
        return;
      }
      const navBtn = ev.target?.closest?.('.gp-ab-nav-btn[data-boss-nav]');
      if (navBtn && !navBtn.disabled) {
        const dir = navBtn.getAttribute('data-boss-nav');
        if (dir === 'prev') navigateAutoBoss(-1);
        else if (dir === 'next') navigateAutoBoss(1);
        return;
      }
      const card = ev.target?.closest?.('.gp-ab-card[data-boss-id]');
      if (!card) return;
      autoBossSelectedId = card.getAttribute('data-boss-id') || '';
      if (!autoBossSelectedId) return;
      autoBossView = 'detail';
      renderAutoBoss();
    });

    $('#gpOverlayToggle')?.addEventListener('change', async (ev) => {
      const visible = !!ev.target.checked;
      try {
        await chrome.storage.local.set({ [STORAGE_KEY_OVERLAY_VISIBLE]: visible });
        setStatus(visible ? 'Overlay visível.' : 'Overlay oculto.', 'ok');
      } catch (error) {
        ev.target.checked = !visible;
        setStatus(error.message || 'Erro ao alterar overlay.', 'err');
      }
    });

    $('#gpOcultarNomesToggle')?.addEventListener('change', (ev) => {
      void applyOcultarNomesToggle(!!ev.target.checked);
    });

    $('#gpHuntToggle')?.addEventListener('click', async () => {
      const box = $('#gpHuntBox');
      const next = !box?.classList.contains('is-open');
      setHuntMenuOpen(next);
      await chrome.storage.local.set({ [STORAGE_KEY_HUNT_OPEN]: next });
    });

    for (const mod of MODULES) {
      if (!mod.toggleId) continue;
      const toggle = document.getElementById(mod.toggleId);
      toggle?.addEventListener('change', () => {
        applyToggle(mod, !!toggle.checked);
      });
    }

    $('#gpVenderLootBossToggle')?.addEventListener('change', (ev) => {
      void applyVenderLootBossToggle(!!ev.target.checked);
    });

    $('#gpMoverTiers')?.addEventListener('click', (ev) => {
      const btn = ev.target?.closest?.('.gp-tier-chip');
      if (!btn || btn.disabled) return;
      const tier = Number(btn.getAttribute('data-tier'));
      if (!Number.isFinite(tier)) return;
      void toggleMoverTier(tier);
    });

    const staminaMin = $('#gpStaminaMinPct');
    const staminaMax = $('#gpStaminaMaxPct');
    if (staminaMin && !staminaMin.dataset.bound) {
      staminaMin.dataset.bound = '1';
      staminaMax.dataset.bound = '1';
      const onStaminaChange = () => {
        void saveStaminaConfigFromInputs();
      };
      staminaMin.addEventListener('input', () => {
        updateStaminaWarn(staminaMin.value);
      });
      staminaMin.addEventListener('change', onStaminaChange);
      staminaMax.addEventListener('change', onStaminaChange);
    }

    const autoSellMin = $('#gpAutoSellMinPct');
    if (autoSellMin && !autoSellMin.dataset.bound) {
      autoSellMin.dataset.bound = '1';
      autoSellMin.addEventListener('change', () => {
        void saveAutoSellConfigFromInputs();
      });
    }

    const anuncioChannel = $('#gpAutoAnuncioChannel');
    const anuncioInterval = $('#gpAutoAnuncioInterval');
    const anuncioText = $('#gpAutoAnuncioText');
    if (anuncioChannel && !anuncioChannel.dataset.bound) {
      anuncioChannel.dataset.bound = '1';
      if (anuncioInterval) anuncioInterval.dataset.bound = '1';
      if (anuncioText) anuncioText.dataset.bound = '1';
      const saveAnuncio = () => {
        void saveAutoAnuncioConfigFromInputs();
      };
      anuncioChannel.addEventListener('change', saveAnuncio);
      anuncioInterval?.addEventListener('change', saveAnuncio);
      anuncioText?.addEventListener('input', () => {
        updateAutoAnuncioCount(anuncioText.value);
      });
      anuncioText?.addEventListener('change', saveAnuncio);
    }

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes[STORAGE_KEY_OVERLAY_VISIBLE]) {
        const toggle = $('#gpOverlayToggle');
        if (toggle) {
          const visible =
            changes[STORAGE_KEY_OVERLAY_VISIBLE].newValue === undefined
              ? true
              : !!changes[STORAGE_KEY_OVERLAY_VISIBLE].newValue;
          toggle.checked = visible;
        }
      }
      if (changes[STORAGE_KEY_OCULTAR_NOMES]) {
        const toggle = $('#gpOcultarNomesToggle');
        if (toggle) toggle.checked = !!changes[STORAGE_KEY_OCULTAR_NOMES].newValue;
      }
      if (changes[STORAGE_KEY_CHARACTERS]) {
        void renderCharactersList();
      }
      if (changes[STORAGE_KEY_BOSS_TRACK]) {
        const raw = changes[STORAGE_KEY_BOSS_TRACK].newValue || {};
        bossTrackById = pruneBossTrackMap(raw.byId || {});
        if (isAutoBossOpen()) {
          renderAutoBoss();
          syncBossTrackTimer();
        } else {
          syncAutoBossRunUi();
        }
      }
      if (changes[STORAGE_KEY_AUTOBOSS_RUN]) {
        autoBossRun = normalizeAutoBossRun(changes[STORAGE_KEY_AUTOBOSS_RUN].newValue);
        syncAutoBossRunUi();
        if (isAutoBossOpen() && autoBossView === 'list' && autoBossTab === 'selected') {
          renderAutoBoss();
        }
      }
      if (changes[STORAGE_KEY_AUTOBOSS_PLAYLIST]) {
        autoBossPlaylist = normalizePlaylist(
          changes[STORAGE_KEY_AUTOBOSS_PLAYLIST].newValue
        );
        syncAutoBossTabsUi();
        syncAutoBossRunUi();
        if (isAutoBossOpen() && autoBossView === 'list') {
          renderAutoBoss();
        }
      }
      if (
        changes.tibiaBotLoggedIn ||
        changes.tibiaBotVip ||
        changes.tibiaBotContaStatus ||
        changes.tibiaBotUser ||
        changes.tibiaBotExtensionOutdated
      ) {
        void refreshOpenUi();
      }
      if (
        changes[STORAGE_KEY_SELECTED_HUNT] ||
        changes[STORAGE_KEY_HUNT_RANK] ||
        changes.baiakIdlePularBossEnabled ||
        changes.baiakIdleMemberDeadEnabled ||
        changes.baiakIdleRetornarHuntEnabled ||
        changes.baiakIdleAutoSellEnabled ||
        changes[STORAGE_KEY_AUTO_SELL_VENDER_LOOT_BOSS] ||
        changes[STORAGE_KEY_AUTO_ANUNCIO_ENABLED] ||
        changes[STORAGE_KEY_AUTO_ANUNCIO_CONFIG] ||
        changes[STORAGE_KEY_STAMINA_ENABLED] ||
        changes[STORAGE_KEY_STAMINA_CONFIG] ||
        changes[STORAGE_KEY_MOVER_ENABLED] ||
        changes[STORAGE_KEY_MOVER_TIERS]
      ) {
        const rootEl = document.getElementById(ROOT_ID);
        if (rootEl?.classList.contains('is-open')) {
          void refreshModules();
          if (changes[STORAGE_KEY_SELECTED_HUNT]) {
            selectedHunt = changes[STORAGE_KEY_SELECTED_HUNT].newValue || null;
            updateHuntActiveLabel();
            renderHuntList();
          }
        }
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;
      const panelOpen = !!document.getElementById(ROOT_ID)?.classList.contains('is-open');
      // Revalida ao voltar à aba: Free (pode ter ativado VIP) ou painel aberto
      if (!isVipAuth(lastAuth) || panelOpen) {
        void refreshOpenUi();
      }
    });
  }

  async function refreshOpenUi() {
    const auth = await syncAuth();
    applyAuthUi(auth);
    await syncOverlayToggleUi();
    await syncOcultarNomesToggleUi();
    if (auth.loggedIn && !auth.extensionOutdated) {
      await initHuntPicker();
      await refreshModules();
    }
  }

  async function open() {
    ensureDom();
    bindOnce();
    const root = document.getElementById(ROOT_ID);
    root?.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    setSettingsOpen(false);
    setStatus('');
    await refreshOpenUi();
  }

  function close() {
    closeAutoBoss();
    setSettingsOpen(false);
    const root = document.getElementById(ROOT_ID);
    root?.classList.remove('is-open');
    document.documentElement.style.overflow = '';
  }

  window.TibiaBotGamePanel = { open, close };

  window.addEventListener('tibiabot:open-panel', () => {
    void open();
  });
})();
