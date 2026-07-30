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


// Módulo Baiak Idle (MAIN): AutoBoss
// - Orquestra a fila de bosses (Enfrentar → aguardar kill/morte → próximo)
// - Overlay próprio com status: esperando / fazendo / concluído (kill|morte)
// - Controle start()/stop() pela extensão

(function () {
    const OVERLAY_ID = 'tibiabot-autoboss-overlay';
    const STYLE_ID = 'tibiabot-autoboss-style';
    const DEFEAT_RE = /^(.+?)\s+derrotado!?$/i;
    const EXP_LOST_RE = /exp\s+acumulada\s+perdida/i;
    const FELL_TO_RE = /voc[eê]\s+caiu\s+para/i;
    const FINISH_TIMEOUT_MS = 45 * 60 * 1000;
    const BETWEEN_BOSSES_MS = 1200;
    const BOSSBAR_WAIT_MS = 5000;
    const BOSSBAR_POLL_MS = 250;
    const ENTER_MAX_ATTEMPTS = 2;

    function cleanText(text) {
        return String(text || '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function normalizeName(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    class BaiakIdleAutoBossModule {
        constructor() {
            this._running = false;
            this._busy = false;
            this._queue = [];
            this._index = 0;
            this._observer = null;
            this._finishWait = null;
            this._lastToastKey = '';
            this._lastToastAt = 0;
            this._stopAfterCurrent = false;
        }

        _log() {}

        _emit(type, payload) {
            try {
                window.postMessage(
                    {
                        source: 'TIBIA_BOT_MAIN',
                        type: type,
                        payload: payload || {}
                    },
                    '*'
                );
            } catch (_) {}
        }

        _emitModuleStatus(status) {
            this._emit('MODULE_STATUS', {
                botId: 'baiak_idle',
                moduleId: 'autoboss',
                moduleLabel: 'AutoBoss',
                status: status,
                remainingMs: 0,
                remainingText: '',
                running: this._running
            });
        }

        _readQueueFromWindow() {
            const raw = window.__baiakIdleAutoBossQueue;
            const list = Array.isArray(raw) ? raw : [];
            return list
                .map(function (b) {
                    return {
                        id: String(b && b.id ? b.id : '').trim(),
                        name: String(b && (b.name || b.id) ? b.name || b.id : '').trim(),
                        status: 'waiting',
                        outcome: null
                    };
                })
                .filter(function (b) {
                    return b.id && b.name;
                });
        }

        _overlayBoxCss() {
            return [
                'all:initial',
                'display:block',
                'position:fixed',
                'z-index:2147483646',
                'left:auto',
                'top:auto',
                'right:12px',
                'bottom:12px',
                'width:260px',
                'max-width:calc(100vw - 24px)',
                'height:auto',
                'max-height:min(40vh,360px)',
                'margin:0',
                'padding:10px 12px',
                'overflow:auto',
                'box-sizing:border-box',
                'border-radius:10px',
                'border:1px solid rgba(212,162,76,.45)',
                'background:rgba(18,14,10,.94)',
                'color:#f3e6c8',
                'font:12px/1.35 Segoe UI,Tahoma,sans-serif',
                'box-shadow:0 10px 28px rgba(0,0,0,.45)',
                'pointer-events:auto',
                'visibility:visible',
                'opacity:1',
                'transform:none',
                'inset:auto'
            ].join(' !important;') + ' !important;';
        }

        _ensureStyles() {
            let style = document.getElementById(STYLE_ID);
            if (!style) {
                style = document.createElement('style');
                style.id = STYLE_ID;
                (document.head || document.documentElement).appendChild(style);
            }
            const id = '#' + OVERLAY_ID;
            style.textContent =
                id +
                '{' +
                this._overlayBoxCss() +
                '}' +
                id +
                ' *{box-sizing:border-box;font:inherit;color:inherit;}' +
                id +
                ' .ab-h{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 8px;}' +
                id +
                ' .ab-h strong{font-size:13px;font-weight:700;color:#f0d9a8;}' +
                id +
                ' .ab-h-meta{display:flex;align-items:center;gap:8px;}' +
                id +
                ' .ab-h span{font-size:11px;color:#b8a888;}' +
                id +
                ' .ab-stop{appearance:none;border:1px solid rgba(248,113,113,.65);background:rgba(185,28,28,.28);' +
                'color:#fecaca;border-radius:6px;height:24px;padding:0 8px;cursor:pointer;' +
                'font:700 11px/1 Segoe UI,Tahoma,sans-serif;}' +
                id +
                ' .ab-stop:hover{filter:brightness(1.08);}' +
                id +
                ' .ab-stop:disabled{opacity:.6;cursor:default;filter:none;}' +
                id +
                ' .ab-list{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none;}' +
                id +
                ' .ab-item{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;' +
                'padding:7px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.22);}' +
                id +
                ' .ab-item.is-fighting{border-color:rgba(212,162,76,.65);background:rgba(154,111,28,.22);}' +
                id +
                ' .ab-item.is-done{opacity:.88;border-color:rgba(148,163,184,.35);}' +
                id +
                ' .ab-item.is-skipped{opacity:.55;}' +
                id +
                ' .ab-name{font-weight:650;color:#f6edd8;}' +
                id +
                ' .ab-st{font-size:11px;white-space:nowrap;color:#b8a888;}' +
                id +
                ' .ab-st.is-fighting{color:#fbbf24;}' +
                id +
                ' .ab-st.is-kill{color:#86efac;}' +
                id +
                ' .ab-st.is-death{color:#fca5a5;}' +
                id +
                ' .ab-st.is-skipped{color:#94a3b8;}' +
                id +
                ' .ab-foot{margin-top:8px;font-size:11px;color:#9a8b6e;}';
        }

        _applyOverlayBox(el) {
            if (!el) return;
            el.setAttribute('style', this._overlayBoxCss());
        }

        _statusLabel(item) {
            if (!item) return '';
            if (item.status === 'fighting') return 'Fazendo…';
            if (item.status === 'done') {
                if (item.outcome === 'death') return '💀 Morreu';
                if (item.outcome === 'kill') return '☠ Matou';
                if (item.outcome === 'skipped') return 'Cancelado';
                if (item.outcome === 'error') return 'Erro';
                return 'Concluído';
            }
            return 'Esperando';
        }

        _bindOverlayEvents(el) {
            if (!el || el.dataset.abBound === '1') return;
            el.dataset.abBound = '1';
            const self = this;
            el.addEventListener('click', function (ev) {
                const t = ev.target;
                if (!t || !t.closest) return;
                const btn = t.closest('[data-ab-stop]');
                if (!btn) return;
                ev.preventDefault();
                ev.stopPropagation();
                self.requestStopAfterCurrent();
            });
        }

        requestStopAfterCurrent() {
            if (!this._running || this._stopAfterCurrent) return;
            this._stopAfterCurrent = true;
            this._syncProgress();
        }

        _markRemainingSkipped() {
            for (let i = this._index; i < this._queue.length; i++) {
                const b = this._queue[i];
                if (!b || b.status === 'done') continue;
                b.status = 'done';
                b.outcome = 'skipped';
            }
        }

        _syncProgress() {
            const cur = this._queue[this._index] || null;
            this._emit('AUTOBOSS_PROGRESS', {
                running: this._running,
                index: this._index,
                currentId: cur ? cur.id : '',
                currentName: cur ? cur.name : '',
                stopAfterCurrent: !!this._stopAfterCurrent,
                queue: this._queue.map(function (b) {
                    return {
                        id: b.id,
                        name: b.name,
                        status: b.status,
                        outcome: b.outcome
                    };
                })
            });
            this._renderOverlay();
        }

        _renderOverlay() {
            // UI do status fica no overlay da extensão (overlay.js).
            try {
                document.getElementById(OVERLAY_ID)?.remove();
                document.getElementById(STYLE_ID)?.remove();
            } catch (_) {}
        }

        _stopFinishWait(result) {
            if (!this._finishWait) return;
            const wait = this._finishWait;
            this._finishWait = null;
            try {
                if (this._observer) {
                    this._observer.disconnect();
                    this._observer = null;
                }
            } catch (_) {}
            if (wait.timer) {
                try {
                    clearTimeout(wait.timer);
                } catch (_) {}
            }
            try {
                wait.resolve(result || null);
            } catch (_) {}
        }

        _isDeathToast(text) {
            const t = cleanText(text);
            if (!t || t.length > 120) return false;
            return EXP_LOST_RE.test(t) || FELL_TO_RE.test(t);
        }

        _extractKillName(text) {
            const t = cleanText(text);
            if (!t || t.length > 100) return '';
            const m = t.match(DEFEAT_RE);
            return m ? String(m[1] || '').trim() : '';
        }

        _onToastText(text) {
            if (!this._running || !this._finishWait) return;
            const t = cleanText(text);
            if (!t) return;

            const cur = this._queue[this._index];
            if (!cur || cur.status !== 'fighting') return;

            const key = t + '|' + Math.floor(Date.now() / 1500);
            if (key === this._lastToastKey && Date.now() - this._lastToastAt < 2500) return;

            if (this._isDeathToast(t)) {
                this._lastToastKey = key;
                this._lastToastAt = Date.now();
                this._stopFinishWait({ outcome: 'death', bossId: cur.id, bossName: cur.name });
                return;
            }

            const killName = this._extractKillName(t);
            if (!killName) return;
            const want = normalizeName(cur.name);
            const got = normalizeName(killName);
            if (want && got && want !== got && !want.includes(got) && !got.includes(want)) {
                // toast de outro boss — ignora
                return;
            }
            this._lastToastKey = key;
            this._lastToastAt = Date.now();
            this._stopFinishWait({ outcome: 'kill', bossId: cur.id, bossName: cur.name });
        }

        _scanNode(node) {
            if (!node) return;
            if (node.nodeType === Node.TEXT_NODE) {
                this._onToastText(node.textContent);
                return;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            const text = cleanText(node.textContent);
            if (text && text.length <= 120) {
                this._onToastText(text);
                return;
            }
            const kids = node.childNodes || [];
            for (let i = 0; i < kids.length; i++) {
                const child = kids[i];
                if (child.nodeType === Node.TEXT_NODE) {
                    this._onToastText(child.textContent);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    const ct = cleanText(child.textContent);
                    if (ct && ct.length <= 120) this._onToastText(ct);
                }
            }
        }

        _waitBossFinished() {
            const self = this;
            return new Promise(function (resolve) {
                self._stopFinishWait(null);
                const root = document.body || document.documentElement;
                self._finishWait = { resolve: resolve, timer: null };
                self._observer = new MutationObserver(function (mutations) {
                    for (let i = 0; i < mutations.length; i++) {
                        const mut = mutations[i];
                        if (mut.type === 'childList') {
                            mut.addedNodes.forEach(function (n) {
                                self._scanNode(n);
                            });
                        } else if (mut.type === 'characterData') {
                            self._scanNode(mut.target);
                        }
                    }
                });
                try {
                    self._observer.observe(root, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                } catch (_) {}
                self._finishWait.timer = setTimeout(function () {
                    self._stopFinishWait({
                        outcome: 'timeout',
                        bossId: self._queue[self._index] && self._queue[self._index].id,
                        bossName: self._queue[self._index] && self._queue[self._index].name
                    });
                }, FINISH_TIMEOUT_MS);
            });
        }

        _sleep(ms) {
            return new Promise(function (resolve) {
                setTimeout(resolve, ms);
            });
        }

        async _goToBoss(name) {
            const Teleporte = window.BaiakIdleTeleporte;
            if (!Teleporte || typeof Teleporte.goToBoss !== 'function') {
                throw new Error('BaiakIdleTeleporte.goToBoss indisponível');
            }
            const result = await Teleporte.goToBoss(name);
            if (result && result.success === false) {
                throw new Error(result.error || 'Falha ao abrir o boss');
            }
            return result;
        }

        _isBossFightActive() {
            try {
                const S = window.BaiakIdleSeletores;
                if (!S?.PULAR_BOSS?.BOSSBAR_FRAME) {
                    const el = document.querySelector('.bossbar-frame');
                    return !!el;
                }
                const frame = S.findElement(S.PULAR_BOSS.BOSSBAR_FRAME, 'BOSSBAR_FRAME');
                if (!frame) return false;
                if (S.PULAR_BOSS.BOSSBAR_HP) {
                    const hp = S.findElement(S.PULAR_BOSS.BOSSBAR_HP, 'BOSSBAR_HP', frame);
                    return !!hp;
                }
                return true;
            } catch (_) {
                return !!document.querySelector('.bossbar-frame');
            }
        }

        _waitBossFightActive(timeoutMs) {
            const self = this;
            const limit = Math.max(500, Number(timeoutMs) || BOSSBAR_WAIT_MS);
            return new Promise(function (resolve) {
                if (self._isBossFightActive()) {
                    resolve(true);
                    return;
                }
                const started = Date.now();
                const timer = setInterval(function () {
                    if (!self._running) {
                        clearInterval(timer);
                        resolve(false);
                        return;
                    }
                    if (self._isBossFightActive()) {
                        clearInterval(timer);
                        resolve(true);
                        return;
                    }
                    if (Date.now() - started >= limit) {
                        clearInterval(timer);
                        resolve(false);
                    }
                }, BOSSBAR_POLL_MS);
            });
        }

        /**
         * Entra no boss e confirma via bossbar.
         * 1ª falha (5s sem bossbar) → tenta de novo.
         * 2ª falha → retorna false (pula para o próximo).
         */
        async _enterBossWithRetry(name) {
            for (let attempt = 1; attempt <= ENTER_MAX_ATTEMPTS; attempt++) {
                if (!this._running) return false;
                try {
                    await this._goToBoss(name);
                } catch (err) {
                    if (attempt >= ENTER_MAX_ATTEMPTS) throw err;
                    await this._sleep(800);
                    continue;
                }
                const active = await this._waitBossFightActive(BOSSBAR_WAIT_MS);
                if (active) return true;
                if (attempt < ENTER_MAX_ATTEMPTS) {
                    await this._sleep(600);
                }
            }
            return false;
        }

        async _runQueue() {
            if (this._busy) return;
            this._busy = true;
            this._emitModuleStatus('running');
            try {
                while (this._running && this._index < this._queue.length) {
                    const item = this._queue[this._index];
                    item.status = 'fighting';
                    item.outcome = null;
                    this._syncProgress();
                    this._emit('AUTOBOSS_BOSS_STARTED', {
                        bossId: item.id,
                        bossName: item.name,
                        index: this._index
                    });

                    let entered = false;
                    try {
                        entered = await this._enterBossWithRetry(item.name);
                    } catch (err) {
                        item.status = 'done';
                        item.outcome = 'error';
                        this._syncProgress();
                        this._emit('AUTOBOSS_BOSS_FINISHED', {
                            bossId: item.id,
                            bossName: item.name,
                            outcome: 'error',
                            index: this._index,
                            message: (err && err.message) || 'Erro ao enfrentar boss'
                        });
                        this._index += 1;
                        if (this._stopAfterCurrent) {
                            this._markRemainingSkipped();
                            this._syncProgress();
                            this.stop('stop_after_current');
                            break;
                        }
                        if (this._index < this._queue.length && this._running) {
                            await this._sleep(BETWEEN_BOSSES_MS);
                        }
                        continue;
                    }

                    if (!entered) {
                        // 2 tentativas sem bossbar → pula para o próximo
                        item.status = 'done';
                        item.outcome = 'skipped';
                        this._syncProgress();
                        this._emit('AUTOBOSS_BOSS_FINISHED', {
                            bossId: item.id,
                            bossName: item.name,
                            outcome: 'skipped',
                            index: this._index,
                            message: 'Boss não ativou após 2 tentativas'
                        });
                        this._index += 1;
                        if (this._stopAfterCurrent) {
                            this._markRemainingSkipped();
                            this._syncProgress();
                            this.stop('stop_after_current');
                            break;
                        }
                        if (this._index < this._queue.length && this._running) {
                            await this._sleep(BETWEEN_BOSSES_MS);
                        }
                        continue;
                    }

                    const finished = await this._waitBossFinished();
                    if (!this._running) break;

                    const outcome =
                        finished && finished.outcome === 'death'
                            ? 'death'
                            : finished && finished.outcome === 'kill'
                              ? 'kill'
                              : finished && finished.outcome === 'timeout'
                                ? 'timeout'
                                : 'kill';

                    item.status = 'done';
                    item.outcome = outcome === 'timeout' ? 'kill' : outcome;
                    this._syncProgress();
                    this._emit('AUTOBOSS_BOSS_FINISHED', {
                        bossId: item.id,
                        bossName: item.name,
                        outcome: item.outcome,
                        index: this._index
                    });

                    this._index += 1;
                    if (this._stopAfterCurrent) {
                        this._markRemainingSkipped();
                        this._syncProgress();
                        this.stop('stop_after_current');
                        break;
                    }
                    if (this._index < this._queue.length && this._running) {
                        await this._sleep(BETWEEN_BOSSES_MS);
                    }
                }

                if (this._running && this._index >= this._queue.length) {
                    this._emit('AUTOBOSS_COMPLETED', {
                        queue: this._queue.map(function (b) {
                            return { id: b.id, name: b.name, outcome: b.outcome };
                        })
                    });
                    this.stop('completed');
                }
            } finally {
                this._busy = false;
            }
        }

        start(queueOverride) {
            if (this._running) return true;
            let queue = Array.isArray(queueOverride) ? queueOverride : null;
            if (!queue || !queue.length) {
                queue = this._readQueueFromWindow();
            }
            if (!queue.length) {
                this._emit('AUTOBOSS_ERROR', { message: 'Fila AutoBoss vazia.' });
                return false;
            }
            this._queue = queue.map(function (b) {
                return {
                    id: String(b && b.id ? b.id : '').trim(),
                    name: String(b && (b.name || b.id) ? b.name || b.id : '').trim(),
                    status: 'waiting',
                    outcome: null
                };
            }).filter(function (b) {
                return b.id && b.name;
            });
            if (!this._queue.length) {
                this._emit('AUTOBOSS_ERROR', { message: 'Fila AutoBoss vazia.' });
                return false;
            }
            this._index = Math.max(0, Number(window.__baiakIdleAutoBossRunIndex) || 0);
            if (this._index >= this._queue.length) this._index = 0;
            this._stopAfterCurrent = false;
            this._running = true;
            // Overlay com a lista imediatamente (antes do teleporte).
            this._syncProgress();
            this._emitModuleStatus('running');
            void this._runQueue();
            return true;
        }

        stop(reason) {
            this._running = false;
            this._stopAfterCurrent = false;
            this._stopFinishWait(null);
            try {
                document.getElementById(OVERLAY_ID)?.remove();
            } catch (_) {}
            // 'reload' = reinjeção do bundle; não notifica a extensão para não zerar a fila.
            if (reason !== 'reload') {
                this._emit('AUTOBOSS_STOPPED', { reason: reason || 'stopped' });
                this._emitModuleStatus('stopped');
            }
            return true;
        }

        isRunning() {
            return !!this._running;
        }
    }

    window.BaiakIdleAutoBossModule = BaiakIdleAutoBossModule;

    try {
        const prev = window.__baiakIdleAutoBoss;
        if (prev && typeof prev.stop === 'function') {
            try {
                prev.stop('reload');
            } catch (_) {}
        }
        window.__baiakIdleAutoBoss = new BaiakIdleAutoBossModule();
        // Start fica a cargo da extensão (onload), que passa a fila explicitamente.
        // Fallback se a flag já estiver ligada (reinjeção).
        if (window.__BAIAKIDLE_AUTO_START_AUTOBOSS__) {
            window.__baiakIdleAutoBoss.start(window.__baiakIdleAutoBossQueue);
        }
        window.addEventListener('message', function (event) {
            if (event.source !== window) return;
            const data = event.data;
            if (!data || data.source !== 'TIBIA_BOT_CONTENT') return;
            if (data.type === 'AUTOBOSS_REQUEST_STOP_AFTER') {
                try {
                    window.__baiakIdleAutoBoss &&
                        window.__baiakIdleAutoBoss.requestStopAfterCurrent &&
                        window.__baiakIdleAutoBoss.requestStopAfterCurrent();
                } catch (_) {}
            }
        });
    } catch (err) {
        try {
            console.error('[BaiakIdle AutoBoss] Falha no bootstrap', err);
        } catch (_) {}
    }
})();
