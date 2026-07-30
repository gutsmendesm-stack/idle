// Injeta painel TibiaBot como primeira seção de aside.col (Baiak Idle /jogar/)

(function () {
  const PANEL_ID = 'panel-tibiabot';
  const STYLE_ID = 'tibia-bot-sidebar-style';
  const BRAND_TITLE = 'TibiaBot.Online';

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

  let applying = false;
  let scheduled = false;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #panel-tibiabot .tb-open-wrap {
        position: relative;
        display: block;
        border-radius: 10px;
        padding: 2px;
        overflow: hidden;
        isolation: isolate;
      }
      #panel-tibiabot .tb-open-wrap::before {
        content: "";
        position: absolute;
        inset: -60%;
        z-index: 0;
        background: conic-gradient(
          from var(--tb-angle, 0deg),
          transparent 0%,
          transparent 35%,
          #f5e6b8 48%,
          #d4a24c 52%,
          #f5e6b8 56%,
          transparent 65%,
          transparent 100%
        );
        animation: tb-open-orbit 2.4s linear infinite;
      }
      #panel-tibiabot .tb-open-wrap::after {
        content: "";
        position: absolute;
        inset: 2px;
        z-index: 0;
        border-radius: 8px;
        background: rgba(12, 14, 18, 0.55);
        pointer-events: none;
      }
      #panel-tibiabot .tb-open-btn {
        position: relative;
        z-index: 1;
        width: 100%;
        min-height: 34px;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        font: inherit;
        font-size: 12px;
        font-weight: 700;
        color: #1a1205;
        background: linear-gradient(180deg, #ecc874, #d4a24c);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
      }
      #panel-tibiabot .tb-open-btn:hover {
        filter: brightness(1.06);
      }
      #panel-tibiabot .tb-open-wrap:hover::before {
        animation-duration: 1.4s;
      }
      #panel-tibiabot .tb-open-hint {
        margin: 8px 0 0;
        font-size: 11px;
        opacity: 0.75;
        line-height: 1.35;
      }
      @property --tb-angle {
        syntax: "<angle>";
        inherits: false;
        initial-value: 0deg;
      }
      @keyframes tb-open-orbit {
        to { --tb-angle: 360deg; }
      }
      @keyframes tb-open-orbit-fallback {
        to { transform: rotate(360deg); }
      }
      @supports not (background: conic-gradient(from var(--tb-angle), red, blue)) {
        #panel-tibiabot .tb-open-wrap::before {
          inset: -80%;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            transparent 35%,
            #f5e6b8 48%,
            #d4a24c 52%,
            #f5e6b8 56%,
            transparent 65%,
            transparent 100%
          );
          animation: tb-open-orbit-fallback 2.4s linear infinite;
        }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function findAsideCol() {
    return (
      document.querySelector('aside.col') ||
      document.querySelector('aside.col .panel')?.parentElement ||
      null
    );
  }

  function buildPanel() {
    const section = document.createElement('section');
    section.className = 'panel';
    section.id = PANEL_ID;
    section.setAttribute('data-tibia-bot', 'sidebar');
    section.innerHTML =
      '<h3 class="tb-brand-title">' +
      BRAND_TITLE +
      '</h3>' +
      '<div class="body">' +
      '<div class="tb-open-wrap">' +
      '<button type="button" class="tb-open-btn" id="tibiabot-open-btn">Abrir TibiaBot</button>' +
      '</div>' +
      '<p class="tb-open-hint">Módulos, hunt ativa e mover itens.</p>' +
      '</div>';

    const btn = section.querySelector('#tibiabot-open-btn');
    btn?.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      try {
        window.dispatchEvent(new CustomEvent('tibiabot:open-panel'));
      } catch (_) {}
      try {
        window.TibiaBotGamePanel?.open?.();
      } catch (_) {}
    });

    return section;
  }

  function ensurePanel() {
    if (applying) return !!document.getElementById(PANEL_ID);
    applying = true;
    try {
      ensureStyles();
      const aside = findAsideCol();
      if (!aside) return false;

      let panel = document.getElementById(PANEL_ID);
      if (!panel) {
        panel = buildPanel();
      } else {
        const title = panel.querySelector('h3');
        if (title) {
          if (!title.classList.contains('tb-brand-title')) {
            title.classList.add('tb-brand-title');
          }
          if (title.textContent !== BRAND_TITLE) {
            title.textContent = BRAND_TITLE;
          }
        }
      }

      if (aside.firstElementChild !== panel) {
        aside.insertBefore(panel, aside.firstChild);
      }
      return true;
    } finally {
      applying = false;
    }
  }

  function scheduleEnsurePanel() {
    if (scheduled || applying) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensurePanel();
    });
  }

  let tries = 0;
  const boot = setInterval(() => {
    tries += 1;
    if (ensurePanel() || tries > 40) clearInterval(boot);
  }, 500);

  const observer = new MutationObserver(() => {
    if (applying) return;
    const aside = findAsideCol();
    const panel = document.getElementById(PANEL_ID);
    if (!aside) return;
    if (!panel || !aside.contains(panel) || aside.firstElementChild !== panel) {
      scheduleEnsurePanel();
    }
  });

  function watch() {
    const root = document.body || document.documentElement;
    if (!root) return;
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch, { once: true });
  } else {
    watch();
  }

  window.addEventListener('popstate', () => scheduleEnsurePanel());
  window.addEventListener('hashchange', () => scheduleEnsurePanel());
})();
