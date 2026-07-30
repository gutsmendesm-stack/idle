// Módulo Baiak Idle (MAIN): Auto Sell
// - Usa BaiakIdleSeletores (#sell-all → #confirm-yes)
// - Gatilho por % da mochila (#inv-count, ex.: "28 / 40")
// - Config: window.__baiakIdleAutoSellConfig = { minPct: 70 }
// - Permissão VenderLootBoss: antes da venda libera proteção
// - UI de status no overlay do Tibia Bot (postMessage)

(function () {
    if (typeof window.BaiakIdleAutoSellModule !== 'undefined') return;

    const SETTLE_MS = 4000;
    const CONFIRM_TIMEOUT_MS = 8000;
    const UNLOCK_STEP_TIMEOUT_MS = 10000;
    const UNLOCK_PAUSE_MS = 350;
    const POLL_MS = 700;
    const STATUS_UI_MS = 1000;
    const DEFAULT_MIN_PCT = 70;
    const STORAGE_KEY_NEXT_READY = '__baiakIdleAutoSellNextReadyAt';
    const LEGACY_OVERLAY_ID = 'baiakidle-auto-sell-countdown';

    const UNLOCK_STEPS = ['cfg', 'protecao', 'desligado', 'confirm_liberar', 'close'];

    class BaiakIdleAutoSellModule {
        constructor() {
            this._running = false;
            this._busy = false;
            this._awaitingConfirm = false;
            this._confirmClicked = false;
            this._confirmDeadline = 0;
            this._pollTimer = null;
            this._statusTimer = null;
            this._lastStatusKey = '';

            this._unlocking = false;
            this._unlockReady = false;
            this._unlockStepIndex = 0;
            this._unlockStepStartedAt = 0;
            this._unlockPauseUntil = 0;
        }

        _log(msg, extra) {}

        _sel() {
            return window.BaiakIdleSeletores || null;
        }

        _venderLootBossEnabled() {
            return !!window.__baiakIdleAutoSellVenderLootBoss;
        }

        _config() {
            const raw = window.__baiakIdleAutoSellConfig;
            let minPct = DEFAULT_MIN_PCT;
            if (raw && typeof raw === 'object') {
                const n = Number(raw.minPct);
                if (Number.isFinite(n)) minPct = n;
            }
            minPct = Math.max(1, Math.min(100, Math.round(minPct)));
            return { minPct };
        }

        _removeLegacyOverlay() {
            try {
                document.getElementById(LEGACY_OVERLAY_ID)?.remove();
            } catch (_) {}
        }

        _getNextReadyAt() {
            try {
                const raw = sessionStorage.getItem(STORAGE_KEY_NEXT_READY);
                const value = raw ? parseInt(raw, 10) : 0;
                return Number.isFinite(value) ? value : 0;
            } catch (_) {
                return 0;
            }
        }

        _setNextReadyAt(ts) {
            try {
                sessionStorage.setItem(STORAGE_KEY_NEXT_READY, String(ts));
            } catch (_) {}
        }

        _clearNextReadyAt() {
            try {
                sessionStorage.removeItem(STORAGE_KEY_NEXT_READY);
            } catch (_) {}
        }

        _remainingMs() {
            const next = this._getNextReadyAt();
            if (!next) return 0;
            return Math.max(0, next - Date.now());
        }

        _readInventoryFill() {
            const S = this._sel();
            let el = null;
            try {
                el = document.getElementById('inv-count');
            } catch (_) {}
            if (!el && S?.ITEMS?.INV_COUNT) {
                el = S.findElement(S.ITEMS.INV_COUNT, 'INV_COUNT');
            }
            if (!el) return null;
            const text = String(el.textContent || '').replace(/\s+/g, ' ').trim();
            const m = text.match(/(\d+)\s*\/\s*(\d+)/);
            if (!m) return null;
            const used = parseInt(m[1], 10);
            const total = parseInt(m[2], 10);
            if (!Number.isFinite(used) || !Number.isFinite(total) || total <= 0) return null;
            const pct = (used / total) * 100;
            return { used, total, pct };
        }

        _fillStatusText() {
            const fill = this._readInventoryFill();
            const cfg = this._config();
            const atual = fill ? Math.floor(fill.pct) : '?';
            return '(' + atual + '%) - Vende: ' + cfg.minPct + '%';
        }

        _isFillReady() {
            const fill = this._readInventoryFill();
            if (!fill) return false;
            return fill.pct + 1e-9 >= this._config().minPct;
        }

        _emitStatus(status, remainingMs = 0, extraText) {
            const remaining = Math.max(0, remainingMs | 0);
            let remainingText = '';
            if (remaining > 0) {
                const totalSec = Math.max(0, Math.ceil(remaining / 1000));
                remainingText = String(totalSec) + 's';
            } else if (extraText) {
                remainingText = String(extraText);
            } else if (status === 'watching' || status === 'waiting_fill') {
                remainingText = this._fillStatusText();
            }
            const key = `${status}|${remainingText}|${this._running ? 1 : 0}`;
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
                            moduleId: 'auto_sell',
                            moduleLabel: 'Auto Sell',
                            status,
                            remainingMs: remaining,
                            remainingText,
                            running: !!this._running
                        }
                    },
                    '*'
                );
            } catch (_) {}
        }

        _stopStatusTicker() {
            if (this._statusTimer) {
                clearInterval(this._statusTimer);
                this._statusTimer = null;
            }
        }

        _stopPoll() {
            if (this._pollTimer) {
                clearInterval(this._pollTimer);
                this._pollTimer = null;
            }
        }

        _startStatusTicker() {
            if (this._statusTimer) return;
            const tickUi = () => {
                if (!this._running) {
                    this._stopStatusTicker();
                    this._emitStatus('stopped', 0);
                    return;
                }

                const remaining = this._remainingMs();
                if (remaining > 0) {
                    this._emitStatus('settle', remaining);
                    return;
                }

                this._clearNextReadyAt();
                if (this._awaitingConfirm) {
                    this._emitStatus('confirm', 0);
                    return;
                }
                if (this._unlocking) {
                    this._emitStatus('unlock', 0);
                    return;
                }
                if (!this._isFillReady()) {
                    this._emitStatus('waiting_fill', 0);
                    return;
                }
                this._emitStatus('watching', 0);
            };
            tickUi();
            this._statusTimer = setInterval(tickUi, STATUS_UI_MS);
        }

        _resetUnlockState() {
            this._unlocking = false;
            this._unlockReady = false;
            this._unlockStepIndex = 0;
            this._unlockStepStartedAt = 0;
            this._unlockPauseUntil = 0;
        }

        _beginSettle() {
            this._awaitingConfirm = false;
            this._confirmClicked = false;
            this._confirmDeadline = 0;
            this._busy = false;
            this._resetUnlockState();
            this._setNextReadyAt(Date.now() + SETTLE_MS);
            this._lastStatusKey = '';
            this._emitStatus('settle', SETTLE_MS);
        }

        _findSellButton() {
            const S = this._sel();
            if (!S?.AUTO_SELL) return null;
            return S.findElement(S.AUTO_SELL.SELL_ALL, 'SELL_ALL');
        }

        _findConfirmButton() {
            const S = this._sel();
            if (!S?.AUTO_SELL) return null;
            return S.findElement(S.AUTO_SELL.CONFIRM_YES, 'CONFIRM_YES');
        }

        _findUnlockConfirmLiberar() {
            const btn = this._findConfirmButton();
            if (!btn) return null;
            const text = String(btn.textContent || '').trim().toLowerCase();
            if (!text.includes('liberar')) return null;
            return btn;
        }

        _clickSafe(el, label) {
            const S = this._sel();
            if (!el) return false;
            if (S && !S.isClickable(el)) return false;
            this._log(`Clicando: ${label}`);
            try {
                el.click();
                return true;
            } catch (err) {
                this._log(`Erro ao clicar ${label}`, err);
                return false;
            }
        }

        _beginUnlock() {
            this._unlocking = true;
            this._unlockReady = false;
            this._unlockStepIndex = 0;
            this._unlockStepStartedAt = Date.now();
            this._unlockPauseUntil = 0;
            this._emitStatus('unlock', 0);
            this._log('VenderLootBoss ativo — liberando proteção antes da venda...');
        }

        _advanceUnlockAfterClick() {
            this._unlockStepIndex += 1;
            this._unlockStepStartedAt = Date.now();
            this._unlockPauseUntil = Date.now() + UNLOCK_PAUSE_MS;
            if (this._unlockStepIndex >= UNLOCK_STEPS.length) {
                this._unlocking = false;
                this._unlockReady = true;
                this._log('Proteção liberada. Seguindo para a venda do loot...');
                this._emitStatus('watching', 0);
            }
        }

        _tickUnlock() {
            if (Date.now() < this._unlockPauseUntil) return;

            if (
                this._unlockStepStartedAt &&
                Date.now() - this._unlockStepStartedAt > UNLOCK_STEP_TIMEOUT_MS
            ) {
                this._log('Timeout no fluxo VenderLootBoss. Reiniciando liberação...');
                this._beginUnlock();
                return;
            }

            const S = this._sel();
            if (!S?.AUTO_SELL) return;

            const step = UNLOCK_STEPS[this._unlockStepIndex];
            if (!step) {
                this._unlocking = false;
                this._unlockReady = true;
                return;
            }

            let clicked = false;

            if (step === 'cfg') {
                const btn = S.findElement(S.AUTO_SELL.CFG, 'AUTO_SELL.CFG');
                clicked = this._clickSafe(btn, 'Config (autosell-cfg)');
            } else if (step === 'protecao') {
                const btn = S.findElement(S.AUTO_SELL.NAV_PROTECAO, 'AUTO_SELL.NAV_PROTECAO');
                clicked = this._clickSafe(btn, 'Proteção');
            } else if (step === 'desligado') {
                const btn =
                    typeof S.findButtonByText === 'function'
                        ? S.findButtonByText('Desligado')
                        : null;
                clicked = this._clickSafe(btn, 'Desligado');
            } else if (step === 'confirm_liberar') {
                const btn = this._findUnlockConfirmLiberar();
                clicked = this._clickSafe(btn, 'Liberar até a venda');
            } else if (step === 'close') {
                const btn = S.findElement(S.AUTO_SELL.MODAL_CLOSE, 'AUTO_SELL.MODAL_CLOSE');
                clicked = this._clickSafe(btn, 'Fechar modal');
            }

            if (clicked) {
                this._advanceUnlockAfterClick();
            }
        }

        _clickSell() {
            const S = this._sel();
            const btn = this._findSellButton();
            if (!btn) return false;
            if (S && !S.isClickable(btn)) return false;

            this._log('Botão de venda detectado. Clicando...');
            this._awaitingConfirm = true;
            this._confirmDeadline = Date.now() + CONFIRM_TIMEOUT_MS;
            this._emitStatus('confirm', 0);

            setTimeout(() => {
                try {
                    btn.click();
                } catch (err) {
                    this._log('Erro ao clicar venda', err);
                    this._awaitingConfirm = false;
                    this._confirmDeadline = 0;
                    this._busy = false;
                    this._emitStatus('watching', 0);
                }
            }, 0);

            return true;
        }

        _clickConfirm() {
            if (this._confirmClicked) return false;

            const S = this._sel();
            const btn = this._findConfirmButton();
            if (!btn) return false;
            if (S && !S.isClickable(btn)) return false;

            const text = String(btn.textContent || '').trim().toLowerCase();
            if (text.includes('liberar')) return false;

            this._confirmClicked = true;
            this._log('Confirmação detectada. Clicando em "Vender tudo"...');
            this._emitStatus('confirm', 0);

            setTimeout(() => {
                try {
                    btn.click();
                    this._beginSettle();
                } catch (err) {
                    this._log('Erro ao clicar confirmação', err);
                    this._awaitingConfirm = false;
                    this._confirmClicked = false;
                    this._confirmDeadline = 0;
                    this._busy = false;
                    this._emitStatus('watching', 0);
                }
            }, 50);

            return true;
        }

        _tick() {
            if (!this._running || this._busy) return;

            if (this._remainingMs() > 0) {
                return;
            }
            this._clearNextReadyAt();

            this._busy = true;
            try {
                if (this._unlocking) {
                    this._tickUnlock();
                    return;
                }

                if (this._awaitingConfirm) {
                    if (Date.now() > this._confirmDeadline) {
                        this._log('Timeout aguardando confirmação. Reiniciando ciclo.');
                        this._awaitingConfirm = false;
                        this._confirmClicked = false;
                        this._confirmDeadline = 0;
                        this._busy = false;
                        this._emitStatus('watching', 0);
                        return;
                    }

                    if (!this._confirmClicked && this._findConfirmButton()) {
                        this._clickConfirm();
                    }
                    return;
                }

                if (!this._isFillReady()) {
                    this._resetUnlockState();
                    this._emitStatus('waiting_fill', 0);
                    return;
                }

                const sellBtn = this._findSellButton();
                const S = this._sel();
                if (!sellBtn || (S && !S.isClickable(sellBtn))) {
                    this._emitStatus('watching', 0);
                    return;
                }

                if (this._venderLootBossEnabled() && !this._unlockReady) {
                    this._beginUnlock();
                    this._tickUnlock();
                    return;
                }

                this._clickSell();
            } catch (err) {
                this._log('Erro no ciclo Auto Sell', err);
            } finally {
                if (!this._awaitingConfirm && !this._unlocking && this._remainingMs() <= 0) {
                    this._busy = false;
                } else if (this._awaitingConfirm || this._unlocking) {
                    setTimeout(() => {
                        this._busy = false;
                    }, 400);
                } else {
                    this._busy = false;
                }
            }
        }

        _startPoll() {
            if (this._pollTimer) return;
            this._pollTimer = setInterval(() => {
                this._tick();
            }, POLL_MS);
        }

        start() {
            this._removeLegacyOverlay();

            if (this._running) {
                this._startStatusTicker();
                this._startPoll();
                this._tick();
                return { success: true, alreadyRunning: true };
            }

            this._running = true;
            this._busy = false;
            this._awaitingConfirm = false;
            this._confirmClicked = false;
            this._confirmDeadline = 0;
            this._resetUnlockState();
            this._lastStatusKey = '';
            this._log(
                'Módulo iniciado (gatilho por % da mochila)' +
                    (this._venderLootBossEnabled() ? ' · VenderLootBoss ON' : '') +
                    ' · limiar ' +
                    this._config().minPct +
                    '%'
            );

            this._startStatusTicker();
            this._startPoll();
            this._tick();

            return { success: true };
        }

        stop() {
            this._running = false;
            this._busy = false;
            this._awaitingConfirm = false;
            this._confirmClicked = false;
            this._confirmDeadline = 0;
            this._resetUnlockState();
            this._stopPoll();
            this._stopStatusTicker();
            this._removeLegacyOverlay();
            this._lastStatusKey = '';
            this._emitStatus('stopped', 0);
            this._log('Módulo parado');
            return { success: true };
        }

        isRunning() {
            return !!this._running;
        }
    }

    window.BaiakIdleAutoSellModule = BaiakIdleAutoSellModule;

    try {
        document.getElementById(LEGACY_OVERLAY_ID)?.remove();
        if (!window.__baiakIdleAutoSell) {
            window.__baiakIdleAutoSell = new BaiakIdleAutoSellModule();
        }
        if (window.__BAIAKIDLE_AUTO_START_AUTO_SELL__) {
            window.__baiakIdleAutoSell.start();
        }
    } catch (err) {
        console.error('[BaiakIdle Auto Sell] Falha no bootstrap', err);
    }
})();
