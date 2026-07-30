// Módulo Baiak Idle (MAIN): Mover Itens
// - Monitora #inv-grid por itens com data-cmpitem.tier nas tiers ativas
// - Shift+clique move a pilha para #backpack-grid
// - Tiers vêm de window.__baiakIdleMoverItensTiers (sync da extensão)

(function () {
    const POLL_MS = 900;
    const BETWEEN_MOVES_MS = 350;

    class BaiakIdleMoverItensModule {
        constructor() {
            this._running = false;
            this._busy = false;
            this._observer = null;
            this._pollTimer = null;
        }

        _log(msg, extra) {}

        _sel() {
            return window.BaiakIdleSeletores || null;
        }

        /** @returns {number[]} */
        _enabledTiers() {
            const raw = window.__baiakIdleMoverItensTiers;
            const out = [];
            if (!raw || typeof raw !== 'object') return out;
            for (const key of ['0', '1', '2', '3', '4', '5']) {
                if (raw[key] || raw[Number(key)]) out.push(Number(key));
            }
            return out;
        }

        async _sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        async _moveMatching() {
            if (!this._running || this._busy) return;

            const tiers = this._enabledTiers();
            if (!tiers.length) return;

            const S = this._sel();
            if (!S?.ITEMS || typeof S.findInvItemsByTiers !== 'function') {
                this._log('Seletores ITEMS indisponíveis');
                return;
            }

            const items = S.findInvItemsByTiers(tiers);
            if (!items.length) return;

            this._busy = true;
            try {
                for (const cell of items) {
                    if (!this._running) break;
                    const info = S.parseCmpItem(cell);
                    const tier = S.getItemTier(cell);
                    const ok = S.shiftClick(cell);
                    this._log(
                        ok ? 'Movendo item (Shift+clique)' : 'Falha ao clicar item',
                        { name: info?.name, tier, uid: info?.uid }
                    );
                    await this._sleep(BETWEEN_MOVES_MS);
                }
            } catch (err) {
                this._log('Erro ao mover itens', err);
            } finally {
                this._busy = false;
            }
        }

        _scheduleCheck() {
            if (!this._running || this._busy) return;
            void this._moveMatching();
        }

        start() {
            if (this._running) {
                this._scheduleCheck();
                return { success: true, alreadyRunning: true };
            }

            this._running = true;
            this._busy = false;
            this._log('Módulo iniciado', { tiers: this._enabledTiers() });

            this._scheduleCheck();

            this._observer = new MutationObserver(() => {
                this._scheduleCheck();
            });

            const root = document.body || document.documentElement;
            if (root) {
                this._observer.observe(root, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['data-cmpitem', 'class', 'style']
                });
            }

            this._pollTimer = setInterval(() => this._scheduleCheck(), POLL_MS);
            return { success: true };
        }

        stop() {
            try {
                this._observer?.disconnect();
            } catch (_) {}
            this._observer = null;
            if (this._pollTimer) {
                clearInterval(this._pollTimer);
                this._pollTimer = null;
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

    window.BaiakIdleMoverItensModule = BaiakIdleMoverItensModule;

    try {
        const prev = window.__baiakIdleMoverItens;
        const wasRunning = !!prev?.isRunning?.();
        try {
            prev?.stop?.();
        } catch (_) {}
        window.__baiakIdleMoverItens = new BaiakIdleMoverItensModule();
        if (wasRunning || window.__BAIAKIDLE_AUTO_START_MOVER_ITENS__) {
            window.__baiakIdleMoverItens.start();
        }
    } catch (err) {
        console.error('[BaiakIdle Mover Itens] Falha no bootstrap', err);
    }
})();
