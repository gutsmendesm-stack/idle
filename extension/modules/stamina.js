// Baiak Idle: teleporte Cidade → (confirma no DOM) → Hunt ativa
// Depende de BaiakIdleSeletores e de window.__baiakIdleSelectedHunt (sync da extensão)
// Sempre sobrescreve para aplicar updates sem precisar F5 da página.

(function () {
    const VERSION = 6;
    const AFTER_CITY_MS = 1000;
    const STEP_MS = 450;
    const FIND_TIMEOUT_MS = 10000;
    const CITY_ARRIVE_TIMEOUT_MS = 30000;
    const FIND_POLL_MS = 200;

    class BaiakIdleTeleporte {
        static get VERSION() {
            return VERSION;
        }

        static _log(msg, extra) {}

        static get busy() {
            return !!window.__baiakIdleTeleporteBusy;
        }

        static _sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        static getSelectedHuntName() {
            const h = window.__baiakIdleSelectedHunt;
            if (h && typeof h === 'object' && h.name) {
                return String(h.name).trim();
            }
            if (typeof h === 'string') return h.trim();
            return '';
        }

        static async _waitClick(selectorArray, name, root = null) {
            const S = window.BaiakIdleSeletores;
            if (!S) throw new Error('BaiakIdleSeletores indisponível');

            const started = Date.now();
            while (Date.now() - started < FIND_TIMEOUT_MS) {
                const el = S.findElement(selectorArray, name, root);
                if (el && S.isClickable(el)) {
                    el.click();
                    return el;
                }
                await this._sleep(FIND_POLL_MS);
            }
            throw new Error(`Timeout ao clicar: ${name}`);
        }

        static async _waitSpCat(label) {
            const S = window.BaiakIdleSeletores;
            if (!S) throw new Error('BaiakIdleSeletores indisponível');

            const started = Date.now();
            while (Date.now() - started < FIND_TIMEOUT_MS) {
                const el = S.findSpCatByLabel(label);
                if (el && S.isClickable(el)) {
                    el.click();
                    return el;
                }
                await this._sleep(FIND_POLL_MS);
            }
            throw new Error(`Timeout: rank "${label}"`);
        }

        /** Espera o #wave-title mostrar "Cidade" (chegou na cidade). */
        static async _waitUntilInCity() {
            const S = window.BaiakIdleSeletores;
            if (!S) throw new Error('BaiakIdleSeletores indisponível');

            const started = Date.now();
            while (Date.now() - started < CITY_ARRIVE_TIMEOUT_MS) {
                if (typeof S.isInCity === 'function' ? S.isInCity() : String(S.getWaveTitleText?.() || '').toLowerCase() === 'cidade') {
                    this._log('Confirmado no DOM: wave-title = Cidade');
                    return true;
                }
                await this._sleep(FIND_POLL_MS);
            }
            throw new Error('Timeout aguardando wave-title = Cidade');
        }

        /**
         * Encontra o monstro na lista, clica nele e depois em Caçar.
         * @param {string} huntName
         */
        static async _selectHuntAndGo(huntName) {
            const S = window.BaiakIdleSeletores;
            if (!S) throw new Error('BaiakIdleSeletores indisponível');

            const started = Date.now();
            let row = null;
            while (Date.now() - started < FIND_TIMEOUT_MS) {
                row = S.findStageRowByName(huntName);
                if (row) break;
                await this._sleep(FIND_POLL_MS);
            }
            if (!row) throw new Error(`Hunt não encontrada: ${huntName}`);

            const nameEl = row.querySelector('.stage-name-line b') || row.querySelector('.stage-name-line') || row;
            if (!S.isClickable(nameEl) && !S.isClickable(row)) {
                throw new Error(`Monstro não clicável: ${huntName}`);
            }
            (S.isClickable(nameEl) ? nameEl : row).click();
            this._log(`Monstro selecionado: ${huntName}`);
            await this._sleep(STEP_MS);

            const goStarted = Date.now();
            while (Date.now() - goStarted < FIND_TIMEOUT_MS) {
                const go =
                    S.findElement(S.HUNTS.STAGE_GO, 'STAGE_GO', row) ||
                    S.findElement(S.HUNTS.STAGE_GO, 'STAGE_GO');
                if (go && S.isClickable(go)) {
                    go.click();
                    return go;
                }
                await this._sleep(FIND_POLL_MS);
            }
            throw new Error(`Timeout: botão Caçar para "${huntName}"`);
        }

        /**
         * Abre teleportes → Hunts → Todas → monstro → Caçar.
         * @param {string} huntName
         */
        static async _openHuntsAndGo(huntName) {
            const S = window.BaiakIdleSeletores;
            await this._waitClick(S.HUNTS.WAVE_TITLE, 'WAVE_TITLE');
            await this._sleep(STEP_MS);
            await this._waitClick(S.HUNTS.TP_HUNTS, 'TP_HUNTS');
            await this._sleep(STEP_MS);
            await this._waitSpCat('Todas');
            await this._sleep(STEP_MS);
            await this._selectHuntAndGo(huntName);
        }

        /**
         * True se o menu de teleporte (#teleport-menu) está aberto com opções.
         */
        static _isTeleportMenuOpen() {
            const S = window.BaiakIdleSeletores;
            if (!S) return false;
            const menu = typeof S.findTeleportMenu === 'function'
                ? S.findTeleportMenu()
                : S.findElement(S.HUNTS.TP_MENU, 'TP_MENU');
            if (!menu || !S.isClickable(menu)) return false;
            const opts = menu.querySelectorAll('button.tp-opt');
            if (!opts.length) return false;
            for (const opt of opts) {
                if (S.isClickable(opt)) return true;
            }
            return false;
        }

        /**
         * True se o modal de Chefes está visível com lista de bosses.
         */
        static _isBossModalReady() {
            const S = window.BaiakIdleSeletores;
            if (!S?.BOSS) return false;
            const body = S.findElement(S.BOSS.MODAL_BODY, 'BOSS_MODAL_BODY');
            if (!body || !S.isClickable(body)) return false;
            const card = body.closest?.('.im-card') || body.parentElement;
            if (card && !S.isClickable(card)) return false;
            const list = body.querySelector('.boss-pane-list');
            if (!list || list.classList.contains('hidden')) return false;
            if (!S.isClickable(list)) return false;
            const cell = body.querySelector('.boss-pane-list .boss-cell, .sp-list.boss-cardgrid .boss-cell');
            return !!(cell && S.isClickable(cell));
        }

        /**
         * Clica no #wave-title e espera o menu com opções aparecer.
         * Se já estiver aberto, não fecha (não reclica).
         */
        static async _openTeleportMenu() {
            const S = window.BaiakIdleSeletores;
            if (this._isTeleportMenuOpen()) {
                this._log('Menu de teleporte já aberto');
                return true;
            }

            const started = Date.now();
            let attempts = 0;
            while (Date.now() - started < FIND_TIMEOUT_MS) {
                attempts += 1;
                await this._waitClick(S.HUNTS.WAVE_TITLE, 'WAVE_TITLE');
                this._log(`Clicou WAVE_TITLE (tentativa ${attempts}), aguardando menu…`);
                await this._sleep(STEP_MS);

                const waitMenu = Date.now();
                while (Date.now() - waitMenu < 2500) {
                    if (this._isTeleportMenuOpen()) {
                        this._log('Menu de teleporte aberto com opções');
                        return true;
                    }
                    await this._sleep(FIND_POLL_MS);
                }

                // Clique pode ter fechado um menu residual — tenta de novo.
                this._log('Menu não abriu após WAVE_TITLE; tentando novamente');
            }
            throw new Error('Timeout: menu de teleporte não abriu com opções');
        }

        /**
         * Garante o modal Chefes aberto na aba Bosses.
         */
        static async _ensureBossModalOpen() {
            const S = window.BaiakIdleSeletores;
            if (!S?.BOSS) throw new Error('Seletores de boss indisponíveis');

            if (this._isBossModalReady()) {
                this._log('Modal de bosses já visível');
            } else {
                await this._openTeleportMenu();

                const bossBtn =
                    (typeof S.findTpOpt === 'function' ? S.findTpOpt('boss') : null) ||
                    S.findElement(S.HUNTS.TP_BOSS, 'TP_BOSS');
                if (!bossBtn || !S.isClickable(bossBtn)) {
                    throw new Error('Opção Chefes não encontrada no menu aberto');
                }
                bossBtn.click();
                this._log('Clicou em Chefes (data-tp=boss)');
                await this._sleep(STEP_MS);

                const started = Date.now();
                while (Date.now() - started < FIND_TIMEOUT_MS) {
                    if (this._isBossModalReady()) break;
                    await this._sleep(FIND_POLL_MS);
                }
                if (!this._isBossModalReady()) {
                    throw new Error('Timeout aguardando lista de bosses visível');
                }
                this._log('Lista de bosses visível');
            }

            const tab = S.findBossTabBosses?.();
            if (tab && !tab.classList.contains('on') && S.isClickable(tab)) {
                tab.click();
                this._log('Aba Bosses ativada');
                await this._sleep(STEP_MS);
            }
        }

        /**
         * Filtra pelo pick-search e clica na .boss-cell do boss.
         * @param {string} bossName
         */
        static async _selectBossInModal(bossName) {
            const S = window.BaiakIdleSeletores;
            const name = String(bossName || '').trim();
            if (!name) throw new Error('Nome do boss vazio');

            if (!this._isBossModalReady()) {
                throw new Error('Modal de bosses não está visível');
            }

            const search = S.findBossSearchInput?.();
            if (search && S.isClickable(search)) {
                try {
                    search.focus();
                    // limpa filtro residual antes de buscar
                    search.value = '';
                    search.dispatchEvent(new Event('input', { bubbles: true }));
                    await this._sleep(120);
                    search.value = name;
                    search.dispatchEvent(new Event('input', { bubbles: true }));
                    search.dispatchEvent(new Event('keyup', { bubbles: true }));
                    search.dispatchEvent(new Event('change', { bubbles: true }));
                    this._log(`Filtrou busca de boss: ${name}`);
                    await this._sleep(STEP_MS);
                } catch (_) {}
            }

            const started = Date.now();
            let cell = null;
            while (Date.now() - started < FIND_TIMEOUT_MS) {
                cell = S.findBossCellByName(name);
                if (cell && S.isClickable(cell)) break;
                cell = null;
                await this._sleep(FIND_POLL_MS);
            }
            if (!cell) throw new Error(`Boss não encontrado na lista: ${name}`);

            const target =
                cell.querySelector('.boss-cell-mon') ||
                cell.querySelector('canvas') ||
                cell;
            if (!S.isClickable(target) && !S.isClickable(cell)) {
                throw new Error(`Boss não clicável: ${name}`);
            }
            (S.isClickable(target) ? target : cell).click();
            this._log(`Boss selecionado: ${name}`);
            return cell;
        }

        /**
         * Abre menu → Chefes → localiza o boss e clica nele.
         * @param {string} bossName
         * @returns {Promise<{success:boolean, boss?:string, reason?:string, error?:string}>}
         */
        static async goToBoss(bossName) {
            if (this.busy) {
                return { success: false, reason: 'busy' };
            }

            const name = String(bossName || '').trim();
            if (!name) {
                this._log('Nenhum boss informado');
                return { success: false, reason: 'no_boss' };
            }

            const S = window.BaiakIdleSeletores;
            if (!S?.HUNTS?.WAVE_TITLE || !S?.HUNTS?.TP_BOSS || !S?.BOSS) {
                this._log('Seletores incompletos (precisa TP_BOSS/BOSS). Versão:', S?.VERSION);
                return { success: false, reason: 'no_selectors' };
            }

            window.__baiakIdleTeleporteBusy = true;
            this._log(`Indo enfrentar boss: ${name}`);

            try {
                await this._ensureBossModalOpen();
                await this._selectBossInModal(name);
                this._log(`Boss aberto: ${name}`);
                return { success: true, boss: name };
            } catch (err) {
                const message = err?.message || String(err);
                this._log('Falha ao abrir boss', message);
                return { success: false, reason: 'error', error: message };
            } finally {
                window.__baiakIdleTeleporteBusy = false;
            }
        }

        /**
         * Vai direto para a hunt (sem passar pela cidade).
         * @param {string} [huntName]
         * @returns {Promise<{success:boolean, hunt?:string, reason?:string, error?:string}>}
         */
        static async goToHunt(huntName) {
            if (this.busy) {
                return { success: false, reason: 'busy' };
            }

            const name = String(huntName || this.getSelectedHuntName() || '').trim();
            if (!name) {
                this._log('Nenhuma hunt ativa selecionada na extensão');
                return { success: false, reason: 'no_hunt' };
            }

            const S = window.BaiakIdleSeletores;
            if (!S?.HUNTS?.WAVE_TITLE || !S?.HUNTS?.TP_HUNTS) {
                this._log('Seletores incompletos (precisa HUNTS). Versão:', S?.VERSION);
                return { success: false, reason: 'no_selectors' };
            }

            window.__baiakIdleTeleporteBusy = true;
            this._log(`Indo para a hunt: ${name}`);

            try {
                await this._openHuntsAndGo(name);
                this._log(`Hunt ativada: ${name}`);
                return { success: true, hunt: name };
            } catch (err) {
                const message = err?.message || String(err);
                this._log('Falha ao ir para a hunt', message);
                return { success: false, reason: 'error', error: message };
            } finally {
                window.__baiakIdleTeleporteBusy = false;
            }
        }

        /**
         * Abre teleportes → Treino online.
         * @returns {Promise<{success:boolean, reason?:string, error?:string}>}
         */
        static async goToExercise() {
            if (this.busy) {
                return { success: false, reason: 'busy' };
            }

            const S = window.BaiakIdleSeletores;
            if (!S?.HUNTS?.WAVE_TITLE || !S?.HUNTS?.TP_EXERCISE) {
                this._log('Seletores incompletos (precisa TP_EXERCISE). Versão:', S?.VERSION);
                return { success: false, reason: 'no_selectors' };
            }

            window.__baiakIdleTeleporteBusy = true;
            this._log('Indo para Treino online');

            try {
                await this._waitClick(S.HUNTS.WAVE_TITLE, 'WAVE_TITLE');
                await this._sleep(STEP_MS);
                await this._waitClick(S.HUNTS.TP_EXERCISE, 'TP_EXERCISE');
                this._log('Treino online selecionado');
                return { success: true };
            } catch (err) {
                const message = err?.message || String(err);
                this._log('Falha ao ir para o treino', message);
                return { success: false, reason: 'error', error: message };
            } finally {
                window.__baiakIdleTeleporteBusy = false;
            }
        }

        /**
         * Viaja para a cidade, confirma no DOM, espera 1s e navega até a hunt ativa.
         * @param {string} [huntName]
         * @returns {Promise<{success:boolean, hunt?:string, reason?:string, error?:string}>}
         */
        static async goCityThenHunt(huntName) {
            if (this.busy) {
                return { success: false, reason: 'busy' };
            }

            const name = String(huntName || this.getSelectedHuntName() || '').trim();
            if (!name) {
                this._log('Nenhuma hunt ativa selecionada na extensão');
                return { success: false, reason: 'no_hunt' };
            }

            const S = window.BaiakIdleSeletores;
            if (!S?.HUNTS?.WAVE_TITLE || !S?.HUNTS?.TP_CITY) {
                this._log('Seletores incompletos (precisa HUNTS/TP_CITY). Versão:', S?.VERSION);
                return { success: false, reason: 'no_selectors' };
            }

            window.__baiakIdleTeleporteBusy = true;
            this._log(`Iniciando: Cidade → (DOM) → ${name}`);

            try {
                await this._waitClick(S.HUNTS.WAVE_TITLE, 'WAVE_TITLE');
                await this._sleep(STEP_MS);
                await this._waitClick(S.HUNTS.TP_CITY, 'TP_CITY');
                this._log('Clicou em Cidade. Aguardando wave-title = Cidade...');
                await this._waitUntilInCity();
                await this._sleep(AFTER_CITY_MS);

                await this._openHuntsAndGo(name);

                this._log(`Hunt ativada: ${name}`);
                return { success: true, hunt: name };
            } catch (err) {
                const message = err?.message || String(err);
                this._log('Falha no teleporte', message);
                return { success: false, reason: 'error', error: message };
            } finally {
                window.__baiakIdleTeleporteBusy = false;
            }
        }
    }

    window.BaiakIdleTeleporte = BaiakIdleTeleporte;
})();


// Módulo Baiak Idle (MAIN): Stamina
// - % mínima → Treino online
// - % máxima → volta para a hunt ativa
// - Poll a cada 30s (sem MutationObserver — o texto da stamina muda demais)
// Config: window.__baiakIdleStaminaConfig = { minPct, maxPct }

(function () {
    const POLL_MS = 30000;
    const ACTION_COOLDOWN_MS = 25000;
    const DEFAULT_MIN = 15;
    const DEFAULT_MAX = 30;
    const STORAGE_KEY_LAST_ACTION = '__baiakIdleStaminaLastActionAt';
    const STORAGE_KEY_MODE = '__baiakIdleStaminaMode';

    class BaiakIdleStaminaModule {
        constructor() {
            this._timer = null;
            this._running = false;
            this._busy = false;
        }

        _log(msg, extra) {}

        _sel() {
            return window.BaiakIdleSeletores || null;
        }

        /** Lê #stamina-pct (helper do seletor ou fallback direto). */
        _readStaminaPct() {
            const S = this._sel();
            if (typeof S?.getStaminaPct === 'function') {
                const pct = S.getStaminaPct();
                if (pct != null) return pct;
            }
            try {
                const el =
                    (S?.STAMINA?.PCT && S.findElement?.(S.STAMINA.PCT, 'STAMINA_PCT')) ||
                    document.querySelector('#stamina-pct') ||
                    document.querySelector('b#stamina-pct');
                if (!el) return null;
                const m = String(el.textContent || '').trim().match(/(\d+(?:[.,]\d+)?)/);
                if (!m) return null;
                const n = parseFloat(String(m[1]).replace(',', '.'));
                if (!Number.isFinite(n)) return null;
                return Math.max(0, Math.min(100, n));
            } catch (_) {
                return null;
            }
        }

        _readConfig() {
            const raw = window.__baiakIdleStaminaConfig;
            let minPct = DEFAULT_MIN;
            let maxPct = DEFAULT_MAX;
            if (raw && typeof raw === 'object') {
                if (Number.isFinite(Number(raw.minPct))) minPct = Number(raw.minPct);
                if (Number.isFinite(Number(raw.maxPct))) maxPct = Number(raw.maxPct);
            }
            minPct = Math.max(0, Math.min(100, Math.round(minPct)));
            maxPct = Math.max(0, Math.min(100, Math.round(maxPct)));
            if (minPct >= maxPct) {
                return { minPct: DEFAULT_MIN, maxPct: DEFAULT_MAX, invalid: true };
            }
            return { minPct, maxPct, invalid: false };
        }

        _canActNow() {
            try {
                const raw = sessionStorage.getItem(STORAGE_KEY_LAST_ACTION);
                const last = raw ? parseInt(raw, 10) : 0;
                if (!last) return true;
                return Date.now() - last >= ACTION_COOLDOWN_MS;
            } catch (_) {
                return true;
            }
        }

        _markAction(mode) {
            try {
                sessionStorage.setItem(STORAGE_KEY_LAST_ACTION, String(Date.now()));
                if (mode) sessionStorage.setItem(STORAGE_KEY_MODE, String(mode));
            } catch (_) {}
        }

        _getMode() {
            try {
                return String(sessionStorage.getItem(STORAGE_KEY_MODE) || '');
            } catch (_) {
                return '';
            }
        }

        async _goExercise() {
            this._busy = true;
            this._markAction('exercise');
            try {
                const Teleporte = window.BaiakIdleTeleporte;
                if (!Teleporte?.goToExercise) {
                    this._log('BaiakIdleTeleporte.goToExercise indisponível');
                    return;
                }
                const result = await Teleporte.goToExercise();
                if (!result?.success) {
                    this._log('Não foi para o treino', result);
                }
            } catch (err) {
                this._log('Erro ao ir para treino', err);
            } finally {
                this._busy = false;
            }
        }

        async _goHunt() {
            this._busy = true;
            this._markAction('hunt');
            try {
                const Teleporte = window.BaiakIdleTeleporte;
                if (!Teleporte?.goToHunt) {
                    this._log('BaiakIdleTeleporte.goToHunt indisponível');
                    return;
                }
                const result = await Teleporte.goToHunt();
                if (!result?.success) {
                    this._log('Não voltou para a hunt', result);
                }
            } catch (err) {
                this._log('Erro ao voltar para a hunt', err);
            } finally {
                this._busy = false;
            }
        }

        _tick() {
            if (!this._running || this._busy) return;
            if (window.BaiakIdleTeleporte?.busy) return;

            try {
                const pct = this._readStaminaPct();
                if (pct == null) return;

                const cfg = this._readConfig();
                if (cfg.invalid) {
                    this._log('Config inválida (mín >= máx). Usando padrão.', cfg);
                }

                const mode = this._getMode();

                if (pct <= cfg.minPct) {
                    if (mode === 'exercise') return;
                    if (!this._canActNow()) {
                        this._log(`Stamina ${pct}% ≤ ${cfg.minPct}% (cooldown)`);
                        return;
                    }
                    this._log(`Stamina ${pct}% ≤ ${cfg.minPct}% → Treino online`);
                    void this._goExercise();
                    return;
                }

                if (pct >= cfg.maxPct) {
                    if (mode === 'hunt') return;
                    if (!this._canActNow()) {
                        this._log(`Stamina ${pct}% ≥ ${cfg.maxPct}% (cooldown)`);
                        return;
                    }
                    this._log(`Stamina ${pct}% ≥ ${cfg.maxPct}% → Hunt`);
                    void this._goHunt();
                }
            } catch (err) {
                this._log('Erro no tick de stamina', err);
            }
        }

        start() {
            if (this._running) {
                this._tick();
                return { success: true, alreadyRunning: true };
            }

            this._running = true;
            this._busy = false;
            const cfg = this._readConfig();
            this._log(
                `Módulo iniciado (mín ${cfg.minPct}% → treino, máx ${cfg.maxPct}% → hunt, poll ${POLL_MS / 1000}s)`
            );

            this._tick();
            this._timer = setInterval(() => this._tick(), POLL_MS);

            return { success: true };
        }

        stop() {
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null;
            }
            this._running = false;
            this._busy = false;
            this._log('Módulo parado');
            return { success: true };
        }

        isRunning() {
            return !!this._running;
        }
    }

    window.BaiakIdleStaminaModule = BaiakIdleStaminaModule;

    try {
        const prev = window.__baiakIdleStamina;
        const wasRunning = !!prev?.isRunning?.();
        try {
            prev?.stop?.();
        } catch (_) {}
        window.__baiakIdleStamina = new BaiakIdleStaminaModule();
        if (wasRunning || window.__BAIAKIDLE_AUTO_START_STAMINA__) {
            window.__baiakIdleStamina.start();
        }
    } catch (err) {
        console.error('[BaiakIdle Stamina] Falha no bootstrap', err);
    }
})();
