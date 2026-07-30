// Módulo Baiak Idle (MAIN): Auto Anúncio
// - Canal: .chat-tab[data-tab]
// - Mensagem: #chat-input (máx. 200) + Enter
// - Config: window.__baiakIdleAutoAnuncioConfig = { channel, text, intervalMin }
// - UI de status no overlay (postMessage)

(function () {
    if (typeof window.BaiakIdleAutoAnuncioModule !== 'undefined') return;

    const STATUS_UI_MS = 1000;
    const POLL_MS = 2000;
    const TAB_WAIT_MS = 400;
    const INPUT_WAIT_MS = 200;
    const MAX_TEXT = 200;
    const DEFAULT_CHANNEL = 'geral';
    const DEFAULT_INTERVAL_MIN = 5;
    const MIN_INTERVAL_MIN = 1;
    const MAX_INTERVAL_MIN = 120;
    const CHANNELS = ['geral', 'comunicados', 'help', 'market'];
    const STORAGE_KEY_NEXT = '__baiakIdleAutoAnuncioNextAt';

    class BaiakIdleAutoAnuncioModule {
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

        _config() {
            const raw = window.__baiakIdleAutoAnuncioConfig;
            let channel = DEFAULT_CHANNEL;
            let text = '';
            let intervalMin = DEFAULT_INTERVAL_MIN;
            if (raw && typeof raw === 'object') {
                const ch = String(raw.channel || '').trim().toLowerCase();
                if (CHANNELS.includes(ch)) channel = ch;
                text = String(raw.text || '').trim().slice(0, MAX_TEXT);
                const n = Number(raw.intervalMin);
                if (Number.isFinite(n)) intervalMin = n;
            }
            intervalMin = Math.max(
                MIN_INTERVAL_MIN,
                Math.min(MAX_INTERVAL_MIN, Math.round(intervalMin))
            );
            return { channel, text, intervalMin };
        }

        _getNextAt() {
            try {
                const raw = sessionStorage.getItem(STORAGE_KEY_NEXT);
                const value = raw ? parseInt(raw, 10) : 0;
                return Number.isFinite(value) ? value : 0;
            } catch (_) {
                return 0;
            }
        }

        _setNextAt(ts) {
            try {
                sessionStorage.setItem(STORAGE_KEY_NEXT, String(ts));
            } catch (_) {}
        }

        _clearNextAt() {
            try {
                sessionStorage.removeItem(STORAGE_KEY_NEXT);
            } catch (_) {}
        }

        _remainingMs() {
            const next = this._getNextAt();
            if (!next) return 0;
            return Math.max(0, next - Date.now());
        }

        _formatRemain(ms) {
            const sec = Math.ceil(Math.max(0, ms) / 1000);
            if (sec < 60) return sec + 's';
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return m + 'm' + (s ? String(s).padStart(2, '0') + 's' : '');
        }

        _emitStatus(status, remainingMs, extraText) {
            const remaining = Math.max(0, Number(remainingMs) || 0);
            let remainingText = '';
            if (status === 'waiting') {
                remainingText = this._formatRemain(remaining);
            } else if (status === 'sending') {
                remainingText = 'enviando…';
            } else if (status === 'no_text') {
                remainingText = 'sem texto';
            } else if (status === 'no_chat') {
                remainingText = 'chat?';
            } else if (status === 'stopped') {
                remainingText = '';
            } else if (extraText) {
                remainingText = String(extraText);
            }
            const key = status + '|' + remainingText;
            if (key === this._lastStatusKey && status !== 'waiting') return;
            this._lastStatusKey = key;
            try {
                window.postMessage(
                    {
                        source: 'TIBIA_BOT_MAIN',
                        type: 'MODULE_STATUS',
                        payload: {
                            botId: 'baiak_idle',
                            botLabel: 'Baiak-Idle',
                            moduleId: 'auto_anuncio',
                            moduleLabel: 'Auto Anúncio',
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

        _click(el) {
            const S = this._sel();
            if (S?.clickElement) return !!S.clickElement(el);
            if (!el) return false;
            try {
                el.click();
                return true;
            } catch (_) {
                return false;
            }
        }

        _findTab(channel) {
            const S = this._sel();
            const selectors = S?.CHAT?.TAB
                ? S.CHAT.TAB.map((sel) => sel.replace('{tab}', channel))
                : ['.chat-tab[data-tab="' + channel + '"]', 'button.chat-tab[data-tab="' + channel + '"]'];
            for (const sel of selectors) {
                try {
                    const el = document.querySelector(sel);
                    if (el) return el;
                } catch (_) {}
            }
            return null;
        }

        _findInput() {
            const S = this._sel();
            if (S?.findElement && S.CHAT?.INPUT) {
                const el = S.findElement(S.CHAT.INPUT, 'CHAT_INPUT');
                if (el) return el;
            }
            return document.getElementById('chat-input') || document.querySelector('#chat-input');
        }

        _findExpandBtn() {
            const S = this._sel();
            if (S?.findElement && S.CHAT?.EXPAND) {
                const el = S.findElement(S.CHAT.EXPAND, 'CHAT_EXPAND');
                if (el) return el;
            }
            return document.getElementById('chat-min') || document.querySelector('#chat-min');
        }

        _isVisible(el) {
            if (!el) return false;
            try {
                const style = window.getComputedStyle(el);
                if (!style) return true;
                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                    return false;
                }
                const rect = el.getBoundingClientRect?.();
                if (rect && rect.width <= 0 && rect.height <= 0) return false;
                return true;
            } catch (_) {
                return true;
            }
        }

        async _ensureChatOpen() {
            let input = this._findInput();
            if (input && this._isVisible(input)) return input;
            const expand = this._findExpandBtn();
            if (expand) {
                this._click(expand);
                await this._sleep(TAB_WAIT_MS);
            }
            input = this._findInput();
            return input && this._isVisible(input) ? input : input || null;
        }

        _setInputValue(input, text) {
            if (!input) return false;
            try {
                input.focus();
            } catch (_) {}
            try {
                const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
                if (proto && typeof proto.set === 'function') {
                    proto.set.call(input, text);
                } else {
                    input.value = text;
                }
            } catch (_) {
                try {
                    input.value = text;
                } catch (_) {}
            }
            try {
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}
            return true;
        }

        _pressEnter(input) {
            if (!input) return false;
            const opts = { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13 };
            try {
                input.dispatchEvent(new KeyboardEvent('keydown', opts));
                input.dispatchEvent(new KeyboardEvent('keypress', opts));
                input.dispatchEvent(new KeyboardEvent('keyup', opts));
            } catch (_) {
                return false;
            }
            return true;
        }

        async _sendOnce() {
            const cfg = this._config();
            if (!cfg.text) {
                this._emitStatus('no_text', 0);
                return false;
            }

            const input = await this._ensureChatOpen();
            if (!input) {
                this._emitStatus('no_chat', 0);
                return false;
            }

            const tab = this._findTab(cfg.channel);
            if (tab && !tab.classList.contains('on')) {
                this._click(tab);
                await this._sleep(TAB_WAIT_MS);
            }

            const liveInput = this._findInput() || input;
            this._click(liveInput);
            await this._sleep(INPUT_WAIT_MS);
            this._setInputValue(liveInput, cfg.text);
            await this._sleep(80);
            this._pressEnter(liveInput);
            return true;
        }

        async _tick() {
            if (!this._running || this._busy) return;

            const cfg = this._config();
            if (!cfg.text) {
                this._emitStatus('no_text', 0);
                return;
            }

            const remain = this._remainingMs();
            if (remain > 0) {
                this._emitStatus('waiting', remain);
                return;
            }

            this._busy = true;
            this._emitStatus('sending', 0);
            try {
                const ok = await this._sendOnce();
                const waitMs = Math.max(MIN_INTERVAL_MIN, cfg.intervalMin) * 60 * 1000;
                this._setNextAt(Date.now() + waitMs);
                if (ok) {
                    this._emitStatus('waiting', waitMs);
                }
            } catch (_) {
                this._setNextAt(Date.now() + 30 * 1000);
                this._emitStatus('waiting', 30 * 1000);
            } finally {
                this._busy = false;
            }
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
                if (!this._running) return;
                if (this._busy) return;
                const cfg = this._config();
                if (!cfg.text) {
                    this._emitStatus('no_text', 0);
                    return;
                }
                const remain = this._remainingMs();
                if (remain > 0) this._emitStatus('waiting', remain);
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
                this._startStatusTicker();
                this._startPoll();
                void this._tick();
                return { success: true, alreadyRunning: true };
            }

            this._running = true;
            this._busy = false;
            this._lastStatusKey = '';
            // Envia assim que ativar (se já não houver cooldown desta sessão).
            if (!this._getNextAt()) {
                this._setNextAt(0);
            }
            this._startStatusTicker();
            this._startPoll();
            void this._tick();
            return { success: true };
        }

        stop() {
            this._running = false;
            this._busy = false;
            this._stopPoll();
            this._stopStatusTicker();
            this._lastStatusKey = '';
            this._emitStatus('stopped', 0);
            return { success: true };
        }

        isRunning() {
            return !!this._running;
        }
    }

    window.BaiakIdleAutoAnuncioModule = BaiakIdleAutoAnuncioModule;

    try {
        if (!window.__baiakIdleAutoAnuncio) {
            window.__baiakIdleAutoAnuncio = new BaiakIdleAutoAnuncioModule();
        }
        if (window.__BAIAKIDLE_AUTO_START_AUTO_ANUNCIO__) {
            window.__baiakIdleAutoAnuncio.start();
        }
    } catch (err) {
        console.error('[BaiakIdle Auto Anúncio] Falha no bootstrap', err);
    }
})();
