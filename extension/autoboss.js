// AutoBoss page logic

(function () {
  const RARITY_COLORS = {
    archfoe: '#e0b35a',
    bane: '#a05be0',
    nemesis: '#e53935'
  };

  let bosses = [];
  let selectedIds = [];

  // --- DOM refs ---
  const bossGrid = document.getElementById('bossGrid');
  const queueList = document.getElementById('queueList');
  const queueCount = document.getElementById('queueCount');
  const catalogPanel = document.getElementById('catalogPanel');
  const queuePanel = document.getElementById('queuePanel');
  const btnStart = document.getElementById('btnStart');
  const btnStop = document.getElementById('btnStop');

  // --- Init ---
  function init() {
    bosses = window.BAIAK_IDLE_BOSSES || [];
    loadPlaylist(() => {
      renderGrid();
      renderQueue();
      bindTabs();
      bindControls();
    });
  }

  // --- Storage ---
  function loadPlaylist(cb) {
    chrome.storage.local.get('baiakBotAutoBossPlaylist', (data) => {
      selectedIds = data.baiakBotAutoBossPlaylist || [];
      cb();
    });
  }

  function savePlaylist() {
    chrome.storage.local.set({ baiakBotAutoBossPlaylist: selectedIds });
  }

  // --- Render Grid ---
  function renderGrid() {
    bossGrid.innerHTML = '';
    for (const boss of bosses) {
      const card = document.createElement('div');
      card.className = 'boss-card' + (selectedIds.includes(boss.id) ? ' selected' : '');
      card.dataset.id = boss.id;

      const img = document.createElement('img');
      img.className = 'sprite';
      img.src = boss.sprite || '';
      img.alt = boss.name;
      img.loading = 'lazy';

      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = boss.name;
      name.title = boss.name;

      const badge = document.createElement('div');
      badge.className = 'rarity-badge ' + (boss.rarity || '');
      badge.textContent = boss.rarityLabel || boss.rarity || '';

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(badge);

      card.addEventListener('click', () => toggleBoss(boss.id));
      bossGrid.appendChild(card);
    }
  }

  // --- Toggle boss selection ---
  function toggleBoss(id) {
    const idx = selectedIds.indexOf(id);
    if (idx === -1) {
      selectedIds.push(id);
    } else {
      selectedIds.splice(idx, 1);
    }
    savePlaylist();
    updateCardSelection(id);
    renderQueue();
  }

  function updateCardSelection(id) {
    const card = bossGrid.querySelector(`[data-id="${id}"]`);
    if (card) {
      card.classList.toggle('selected', selectedIds.includes(id));
    }
    queueCount.textContent = selectedIds.length;
  }

  // --- Render Queue ---
  function renderQueue() {
    queueCount.textContent = selectedIds.length;
    queueList.innerHTML = '';

    if (selectedIds.length === 0) {
      queueList.innerHTML = '<div class="empty-queue">Nenhum boss selecionado. Clique em bosses no catalogo para adicionar.</div>';
      return;
    }

    for (const id of selectedIds) {
      const boss = bosses.find(b => b.id === id);
      if (!boss) continue;

      const item = document.createElement('div');
      item.className = 'queue-item';

      const img = document.createElement('img');
      img.className = 'sprite';
      img.src = boss.sprite || '';
      img.alt = boss.name;

      const info = document.createElement('div');
      info.className = 'info';

      const nameEl = document.createElement('div');
      nameEl.className = 'name';
      nameEl.textContent = boss.name;

      const rarityEl = document.createElement('div');
      rarityEl.className = 'rarity';
      rarityEl.textContent = boss.rarityLabel || boss.rarity || '';
      rarityEl.style.color = RARITY_COLORS[boss.rarity] || '#93a4b8';

      info.appendChild(nameEl);
      info.appendChild(rarityEl);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '\u00D7';
      removeBtn.title = 'Remover';
      removeBtn.addEventListener('click', () => toggleBoss(id));

      item.appendChild(img);
      item.appendChild(info);
      item.appendChild(removeBtn);
      queueList.appendChild(item);
    }
  }

  // --- Tabs ---
  function bindTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;
        catalogPanel.classList.toggle('active', tab === 'catalog');
        queuePanel.classList.toggle('active', tab === 'queue');
      });
    });
  }

  // --- Controls ---
  function bindControls() {
    btnStart.addEventListener('click', () => {
      if (selectedIds.length === 0) return;
      const queue = selectedIds.map(id => {
        const boss = bosses.find(b => b.id === id);
        return boss ? { id: boss.id, name: boss.name } : null;
      }).filter(Boolean);

      chrome.runtime.sendMessage({ type: 'START_AUTOBOSS', queue });
      btnStart.disabled = true;
      btnStop.disabled = false;
    });

    btnStop.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'STOP_AUTOBOSS' });
      btnStart.disabled = false;
      btnStop.disabled = true;
    });

    btnStop.disabled = true;
  }

  // --- Boot ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
