// Módulo Baiak Idle (MAIN): Gold/h real
// - Lê #an-balance (Balance = loot − supplies) a cada 10s
// - Calcula gold/h por delta Balance ÷ delta tempo
// - Reseta ao mudar #wave-title ou ao reiniciar a Session (#an-session)
// - Emite MODULE_STATUS para o overlay (sem API)

(function () {
    const POLL_MS = 10000;
    const SAMPLE_MAX = 90;
    const RATE_HISTORY_MAX = 60;
    const WINDOW_MS = 5 * 60 * 1000;
    const MIN_DELTA_MS = 9000;

    class BaiakIdleGoldHoraModule {
        constructor() {
            this._timer = null;
            this._running = false;
            /** @type {{ t: number, gold: number, hunt: string, sessionSec: number }[]} */
            this._samples = [];
            /** @type {{ t: number, gph: number, hunt: string }[]} */
            this._rateHistory = [];
            this._huntKey = '';
            this._lastStatusKey = '';
            this._currentGph = null;
        }

        _log(msg, extra) {}

        _sel() {
            return window.BaiakIdleSeletores || null;
        }

        _parseBrNumber(text) {
            const S = this._sel();
            if (typeof S?.parseBrNumber === 'function') {
                return S.parseBrNumber(text);
            }
            const raw = String(text || '')
                .trim()
                .replace(/\./g, '')
                .replace(/,/g, '.')
                .replace(/[^\d.-]/g, '');
            if (!raw || raw === '-' || raw === '.') return null;
            const n = Number(raw);
            return Number.isFinite(n) ? n : null;
        }

        _readBalance() {
            const S = this._sel();
            if (typeof S?.getBalance === 'function') {
                const n = S.getBalance();
                if (n != null) return n;
            }
            try {
                const el =
                    document.querySelector('#an-balance') ||
                    document.querySelector('b#an-balance');
                if (!el) return null;
                return this._parseBrNumber(el.textContent);
            } catch (_) {
                return null;
            }
        }

        _readSessionSec() {
            try {
                const el =
                    document.querySelector('#an-session') ||
                    document.querySelector('b#an-session');
                if (!el) return null;
                const text = String(el.textContent || '').trim();
                const m = text.match(/^(\d+):(\d{2}):(\d{2})$/);
                if (!m) return null;
                const h = parseInt(m[1], 10);
                const min = parseInt(m[2], 10);
                const sec = parseInt(m[3], 10);
                if (![h, min, sec].every((n) => Number.isFinite(n))) return null;
                return h * 3600 + min * 60 + sec;
            } catch (_) {
                return null;
            }
        }

        _readHuntKey() {
            const S = this._sel();
            if (typeof S?.getWaveTitleText === 'function') {
                return String(S.getWaveTitleText() || '').trim();
            }
            try {
                const el = document.querySelector('#wave-title');
                return String(el?.textContent || '').trim();
            } catch (_) {
                return '';
            }
        }

        _formatGold(n) {
            const v = Math.round(Number(n) || 0);
            const abs = Math.abs(v);
            let formatted;
            try {
                formatted = abs.toLocaleString('pt-BR');
            } catch (_) {
                formatted = String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
            return (v < 0 ? '-' : '') + formatted;
        }

        _resetHistory(reason) {
            if (this._samples.length || this._rateHistory.length) {
                this._log('Histórico resetado', reason || '');
            }
            this._samples = [];
            this._rateHistory = [];
            this._currentGph = null;
        }

        _computeGph() {
            const samples = this._samples;
            if (samples.length < 2) return null;

            const last = samples[samples.length - 1];
            const cutoff = last.t - WINDOW_MS;
            let first = samples[0];
            for (let i = 0; i < samples.length - 1; i++) {
                if (samples[i].t >= cutoff) {
                    first = samples[i];
                    break;
                }
                first = samples[i];
            }

            const dt = last.t - first.t;
            const dg = last.gold - first.gold;
            if (dt < MIN_DELTA_MS) return null;
            return (dg / dt) * 3600000;
        }

        _emitStatus(status, remainingText) {
            const text = remainingText || '';
            const key = `${status}|${text}|${this._running ? 1 : 0}`;
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
                            moduleId: 'gold_hora',
                            moduleLabel: 'Gold/h',
                            status,
                            remainingMs: 0,
                            remainingText: text,
                            running: !!this._running,
                            gph: this._currentGph
                        }
                    },
                    '*'
                );
            } catch (_) {}
        }

        _tick() {
            if (!this._running) return;

            try {
                const gold = this._readBalance();
                const hunt = this._readHuntKey();
                const sessionSec = this._readSessionSec();
                const now = Date.now();

                if (gold == null) {
                    this._emitStatus('waiting', '…');
                    return;
                }

                if (hunt && hunt !== this._huntKey) {
                    this._huntKey = hunt;
                    this._resetHistory('hunt:' + hunt);
                }

                const prev = this._samples.length
                    ? this._samples[this._samples.length - 1]
                    : null;

                // Session do jogo reiniciou (timer voltou)
                if (
                    prev &&
                    sessionSec != null &&
                    prev.sessionSec != null &&
                    sessionSec + 5 < prev.sessionSec
                ) {
                    this._resetHistory('session_reset');
                }

                if (!prev || now - prev.t >= POLL_MS * 0.7 || gold !== prev.gold) {
                    this._samples.push({
                        t: now,
                        gold,
                        hunt,
                        sessionSec: sessionSec != null ? sessionSec : prev?.sessionSec ?? 0
                    });
                    if (this._samples.length > SAMPLE_MAX) {
                        this._samples.splice(0, this._samples.length - SAMPLE_MAX);
                    }
                }

                const gph = this._computeGph();
                if (gph == null) {
                    this._currentGph = null;
                    this._emitStatus('warming', '…');
                    return;
                }

                this._currentGph = gph;
                this._rateHistory.push({ t: now, gph, hunt });
                if (this._rateHistory.length > RATE_HISTORY_MAX) {
                    this._rateHistory.splice(
                        0,
                        this._rateHistory.length - RATE_HISTORY_MAX
                    );
                }

                this._emitStatus('gph', this._formatGold(gph) + '/h');
            } catch (err) {
                this._log('Erro no tick', err);
            }
        }

        getHistory() {
            return this._rateHistory.slice();
        }

        getCurrentGph() {
            return this._currentGph;
        }

        start() {
            if (this._running) {
                this._tick();
                return { success: true, alreadyRunning: true };
            }

            this._running = true;
            this._lastStatusKey = '';
            this._huntKey = this._readHuntKey();
            this._log(`Módulo iniciado (amostra a cada ${POLL_MS / 1000}s)`);
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
            this._emitStatus('stopped', '');
            this._lastStatusKey = '';
            this._log('Módulo parado');
            return { success: true };
        }

        isRunning() {
            return !!this._running;
        }
    }

    window.BaiakIdleGoldHoraModule = BaiakIdleGoldHoraModule;

    try {
        const prev = window.__baiakIdleGoldHora;
        const wasRunning = !!prev?.isRunning?.();
        try {
            prev?.stop?.();
        } catch (_) {}
        window.__baiakIdleGoldHora = new BaiakIdleGoldHoraModule();
        if (wasRunning || window.__BAIAKIDLE_AUTO_START_GOLD_HORA__) {
            window.__baiakIdleGoldHora.start();
        }
    } catch (err) {
        console.error('[BaiakIdle Gold/h] Falha no bootstrap', err);
    }
})();
