// Módulo Baiak Idle (MAIN): XP/h real
// - Lê #an-raw (XP Gain) a cada 10s
// - Calcula XP/h por delta XP ÷ delta tempo (histórico local)
// - Reseta ao mudar #wave-title ou ao cair o XP Gain (nova sessão)
// - Emite MODULE_STATUS para o overlay (sem API)

(function () {
    const POLL_MS = 10000;
    const SAMPLE_MAX = 90; // ~15 min a 10s
    const RATE_HISTORY_MAX = 60;
    /** Janela preferencial para a taxa (quanto maior, mais estável). */
    const WINDOW_MS = 5 * 60 * 1000;
    const MIN_DELTA_MS = 9000;

    class BaiakIdleXpHoraModule {
        constructor() {
            this._timer = null;
            this._running = false;
            /** @type {{ t: number, xp: number, hunt: string }[]} */
            this._samples = [];
            /** @type {{ t: number, xph: number, hunt: string }[]} */
            this._rateHistory = [];
            this._huntKey = '';
            this._lastStatusKey = '';
            this._currentXph = null;
        }

        _log(msg, extra) {}

        _sel() {
            return window.BaiakIdleSeletores || null;
        }

        _readXpGain() {
            const S = this._sel();
            if (typeof S?.getXpGain === 'function') {
                const n = S.getXpGain();
                if (n != null) return n;
            }
            try {
                const el =
                    document.querySelector('#an-raw') ||
                    document.querySelector('b#an-raw');
                if (!el) return null;
                if (typeof S?.parseBrNumber === 'function') {
                    return S.parseBrNumber(el.textContent);
                }
                const raw = String(el.textContent || '')
                    .trim()
                    .replace(/[^\d]/g, '');
                if (!raw) return null;
                const n = Number(raw);
                return Number.isFinite(n) ? n : null;
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

        _formatXp(n) {
            const v = Math.max(0, Math.round(Number(n) || 0));
            try {
                return v.toLocaleString('pt-BR');
            } catch (_) {
                return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
        }

        _resetHistory(reason) {
            if (this._samples.length || this._rateHistory.length) {
                this._log('Histórico resetado', reason || '');
            }
            this._samples = [];
            this._rateHistory = [];
            this._currentXph = null;
        }

        /**
         * XP/h a partir do histórico de amostras (janela recente).
         * @returns {number|null}
         */
        _computeXph() {
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
            const dx = last.xp - first.xp;
            if (dt < MIN_DELTA_MS || dx < 0) return null;
            return (dx / dt) * 3600000;
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
                            moduleId: 'xp_hora',
                            moduleLabel: 'XP/h',
                            status,
                            remainingMs: 0,
                            remainingText: text,
                            running: !!this._running,
                            xph: this._currentXph
                        }
                    },
                    '*'
                );
            } catch (_) {}
        }

        _tick() {
            if (!this._running) return;

            try {
                const xp = this._readXpGain();
                const hunt = this._readHuntKey();
                const now = Date.now();

                if (xp == null) {
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

                if (prev && xp < prev.xp) {
                    this._resetHistory('xp_gain_reset');
                }

                // Evita amostra duplicada no mesmo segundo (reinjeção)
                if (!prev || now - prev.t >= POLL_MS * 0.7 || xp !== prev.xp) {
                    this._samples.push({ t: now, xp, hunt });
                    if (this._samples.length > SAMPLE_MAX) {
                        this._samples.splice(0, this._samples.length - SAMPLE_MAX);
                    }
                }

                const xph = this._computeXph();
                if (xph == null) {
                    this._currentXph = null;
                    this._emitStatus('warming', '…');
                    return;
                }

                this._currentXph = xph;
                this._rateHistory.push({ t: now, xph, hunt });
                if (this._rateHistory.length > RATE_HISTORY_MAX) {
                    this._rateHistory.splice(
                        0,
                        this._rateHistory.length - RATE_HISTORY_MAX
                    );
                }

                this._emitStatus('xph', this._formatXp(xph) + '/h');
            } catch (err) {
                this._log('Erro no tick', err);
            }
        }

        /** Histórico recente de taxas (para debug / futuros UIs). */
        getHistory() {
            return this._rateHistory.slice();
        }

        getCurrentXph() {
            return this._currentXph;
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

    window.BaiakIdleXpHoraModule = BaiakIdleXpHoraModule;

    try {
        const prev = window.__baiakIdleXpHora;
        const wasRunning = !!prev?.isRunning?.();
        try {
            prev?.stop?.();
        } catch (_) {}
        window.__baiakIdleXpHora = new BaiakIdleXpHoraModule();
        if (wasRunning || window.__BAIAKIDLE_AUTO_START_XP_HORA__) {
            window.__baiakIdleXpHora.start();
        }
    } catch (err) {
        console.error('[BaiakIdle XP/h] Falha no bootstrap', err);
    }
})();
