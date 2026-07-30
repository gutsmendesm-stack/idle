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


// Módulo Baiak Idle (MAIN): Retornar Hunt
// 1) Se localizar Cidade (#wave-title) → está online → goToHunt()
// 2) Se NÃO estiver na cidade → procura popup de manutenção (#conn-retry)
// Bundle: seletores + teleporte + este módulo

(function () {
    if (typeof window.BaiakIdleRetornarHuntModule !== 'undefined') return;

    const POLL_MS = 10000;
    const STATUS_UI_MS = 2000;
    const RETRY_COOLDOWN_MS = 10000;
    const HUNT_COOLDOWN_MS = 20000;
    const STORAGE_KEY_LAST_RETRY = '__baiakIdleRetornarHuntLastRetryAt';
    const STORAGE_KEY_LAST_HUNT = '__baiakIdleRetornarHuntLastHuntAt';

    class BaiakIdleRetornarHuntModule {
        constructor() {
            this._running = false;
            this._busy = false;
            this._pollTimer = null;
            this._statusTimer = null;
            this._lastStatusKey = '';
        }

        _log() {}

        _sel() {
            return window.BaiakIdleSeletores || null;
        }

        _sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms | 0)));
        }

        _getTs(key) {
            try {
                const raw = sessionStorage.getItem(key);
                const n = raw ? parseInt(raw, 10) : 0;
                return Number.isFinite(n) ? n : 0;
            } catch (_) {
                return 0;
            }
        }

        _setTs(key, ts) {
            try {
                sessionStorage.setItem(key, String(ts));
            } catch (_) {}
        }

        _canRetryNow() {
            const last = this._getTs(STORAGE_KEY_LAST_RETRY);
            return !last || Date.now() - last >= RETRY_COOLDOWN_MS;
        }

        _canHuntNow() {
            const last = this._getTs(STORAGE_KEY_LAST_HUNT);
            return !last || Date.now() - last >= HUNT_COOLDOWN_MS;
        }

        _autoBossRunning() {
            try {
                return !!window.__baiakIdleAutoBoss?.isRunning?.();
            } catch (_) {
                return false;
            }
        }

        _emitStatus(status, remainingText) {
            const key = status + '|' + String(remainingText || '');
            if (key === this._lastStatusKey) return;
            this._lastStatusKey = key;
            try {
                window.postMessage(
                    {
                        source: 'TIBIA_BOT_MAIN',
                        type: 'MODULE_STATUS',
                        payload: {
                            botId: 'baiak_idle',
                            botLabel: 'Baiak-Idle',
                            moduleId: 'retornar_hunt',
                            moduleLabel: 'Retornar Hunt',
                            status,
                            remainingText: remainingText || '',
                            running: !!this._running
                        }
                    },
                    '*'
                );
            } catch (_) {}
        }

        _findRetryBtn() {
            const S = this._sel();
            if (S?.findElement && S.MAINTENANCE?.RETRY) {
                const el = S.findElement(S.MAINTENANCE.RETRY, 'CONN_RETRY');
                if (el) return el;
            }
            return (
                document.getElementById('conn-retry') ||
                document.querySelector('button#conn-retry') ||
                null
            );
        }

        _isMaintenanceVisible() {
            const btn = this._findRetryBtn();
            if (!btn) return false;
            try {
                const style = window.getComputedStyle(btn);
                if (style && (style.display === 'none' || style.visibility === 'hidden')) {
                    return false;
                }
            } catch (_) {}
            const card =
                btn.closest?.('.auth-card') ||
                document.querySelector('.auth-card .auth-title');
            if (card) {
                const title = String(
                    (card.classList?.contains('auth-title')
                        ? card.textContent
                        : card.querySelector?.('.auth-title')?.textContent) || ''
                )
                    .trim()
                    .toUpperCase();
                if (title.includes('MANUTEN') || title.includes('MANUTENÇÃO') || title.includes('MANUTENCAO')) {
                    return true;
                }
            }
            // Botão presente já basta (tela de conexão/manutenção)
            return true;
        }

        _isInCity() {
            const S = this._sel();
            if (typeof S?.isInCity === 'function') return !!S.isInCity();
            const el =
                document.getElementById('wave-title') ||
                document.querySelector('#wave-title');
            return String(el?.textContent || '').trim().toLowerCase() === 'cidade';
        }

        _click(el) {
            if (!el) return false;
            try {
                el.click();
                return true;
            } catch (_) {
                return false;
            }
        }

        async _clickRetry() {
            const btn = this._findRetryBtn();
            if (!btn) return false;
            this._busy = true;
            this._setTs(STORAGE_KEY_LAST_RETRY, Date.now());
            this._emitStatus('retry', 'reconectar…');
            try {
                this._click(btn);
                await this._sleep(500);
                return true;
            } catch (_) {
                return false;
            } finally {
                this._busy = false;
            }
        }

        async _goHunt() {
            this._busy = true;
            this._setTs(STORAGE_KEY_LAST_HUNT, Date.now());
            this._emitStatus('hunt', 'indo…');
            try {
                const Teleporte = window.BaiakIdleTeleporte;
                if (!Teleporte?.goToHunt) {
                    this._emitStatus('no_hunt', 'teleporte?');
                    return false;
                }
                const result = await Teleporte.goToHunt();
                if (!result?.success) {
                    this._emitStatus(
                        result?.reason === 'no_hunt' ? 'no_hunt' : 'watching',
                        result?.reason === 'no_hunt' ? 'sem hunt' : 'falhou'
                    );
                    return false;
                }
                this._emitStatus('watching', 'hunt');
                return true;
            } catch (_) {
                this._emitStatus('watching', 'erro');
                return false;
            } finally {
                this._busy = false;
            }
        }

        async _tick() {
            if (!this._running || this._busy) return;
            if (window.BaiakIdleTeleporte?.busy) return;

            try {
                // 1) Cidade = online → retornar para a hunt
                if (this._isInCity()) {
                    if (this._autoBossRunning()) {
                        this._emitStatus('watching', 'autoboss');
                        return;
                    }
                    if (!this._canHuntNow()) {
                        this._emitStatus('city', 'cooldown');
                        return;
                    }
                    await this._goHunt();
                    return;
                }

                // 2) Sem cidade → tenta popup de manutenção
                if (this._isMaintenanceVisible()) {
                    if (!this._canRetryNow()) {
                        this._emitStatus('maintenance', 'aguardando…');
                        return;
                    }
                    await this._clickRetry();
                    return;
                }

                this._emitStatus('watching', 'ok');
            } catch (_) {}
        }

        _startPoll() {
            this._stopPoll();
            this._pollTimer = setInterval(() => {
                void this._tick();
            }, POLL_MS);
        }

        _stopPoll() {
            if (this._pollTimer) {
                clearInterval(this._pollTimer);
                this._pollTimer = null;
            }
        }

        _startStatusTicker() {
            this._stopStatusTicker();
            this._statusTimer = setInterval(() => {
                if (!this._running || this._busy) return;
                if (this._isInCity()) {
                    this._emitStatus('city', 'cidade');
                    return;
                }
                if (this._isMaintenanceVisible()) {
                    this._emitStatus('maintenance', 'manutenção');
                    return;
                }
                this._emitStatus('watching', 'ok');
            }, STATUS_UI_MS);
        }

        _stopStatusTicker() {
            if (this._statusTimer) {
                clearInterval(this._statusTimer);
                this._statusTimer = null;
            }
        }

        start() {
            if (this._running) {
                return { success: true, alreadyRunning: true };
            }

            this._running = true;
            this._busy = false;
            this._lastStatusKey = '';
            this._emitStatus('watching', 'ok');

            this._startPoll();
            this._startStatusTicker();
            return { success: true };
        }

        stop() {
            this._stopPoll();
            this._stopStatusTicker();
            this._running = false;
            this._busy = false;
            this._lastStatusKey = '';
            this._emitStatus('stopped', '');
            return { success: true };
        }

        isRunning() {
            return !!this._running;
        }
    }

    window.BaiakIdleRetornarHuntModule = BaiakIdleRetornarHuntModule;

    try {
        if (!window.__baiakIdleRetornarHunt) {
            window.__baiakIdleRetornarHunt = new BaiakIdleRetornarHuntModule();
        }
        if (window.__BAIAKIDLE_AUTO_START_RETORNAR_HUNT__) {
            window.__baiakIdleRetornarHunt.start();
        }
    } catch (err) {
        console.error('[BaiakIdle Retornar Hunt] Falha no bootstrap', err);
    }
})();
