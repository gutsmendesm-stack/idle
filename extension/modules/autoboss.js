/* TB-WM u=23 e=33e1ffb3e5 x=f2e5047b9289 t=1785384201 s=21770c85a4711af8 */
(function(){try{window.__TIBIABOT_WM__={u:23,t:1785384201,x:"f2e5047b9289",s:"21770c85a4711af8"};}catch(e){}})();

// Seletores Baiak Idle — centralizados para todos os módulos
// Uso: window.BaiakIdleSeletores.findElement(BaiakIdleSeletores.AUTO_SELL.SELL_ALL, 'SELL_ALL')
// Sempre sobrescreve (versão sobe) para não ficar preso em build antigo na página.

(function () {
        const VERSION = 18;

    class BaiakIdleSeletores {
        static get VERSION() {
            return VERSION;
        }

        static get DEBUG() {
            return Boolean(window.__BAIAKIDLE_SELECTORS_DEBUG);
        }

        // ====================================================================
        // PULAR BOSS
        // ====================================================================
        static get PULAR_BOSS() {
            return {
                BOSSBAR_FRAME: [
                    '.bossbar-frame'
                ],
                BOSSBAR_HP: [
                    '.bossbar-hp'
                ]
            };
        }

        // ====================================================================
        // MEMBER DEAD (membro morto no party)
        // ====================================================================
        static get MEMBER_DEAD() {
            return {
                MEMBER: [
                    '.member.dead',
                    'div.member.dead'
                ]
            };
        }

        // ====================================================================
        // OCULTAR NOMES (party + nickname da conta)
        // ====================================================================
        static get OCULTAR_NOMES() {
            return {
                PARTY_LIST: [
                    '#party-list',
                    '#party-list.party',
                    'div#party-list.party',
                    '.party'
                ],
                MEMBER_NAME: [
                    '.m-name',
                    'span.m-name'
                ],
                /** Nomes da party com escopo completo (fallback se PARTY_LIST falhar) */
                MEMBER_NAME_SCOPED: [
                    '#party-list .m-name',
                    '#party-list.party .m-name',
                    'div#party-list.party .m-name',
                    '.party .m-name'
                ],
                HUD_NICK: [
                    '#hud-nick',
                    'div#hud-nick.hud-nick',
                    '.hud-nick'
                ],
                MEMBER: [
                    '#party-list .member',
                    '.party .member',
                    'div.member'
                ],
                MEMBER_LEVEL: [
                    '.m-lvl',
                    '.m-level',
                    '[data-level]',
                    '[data-lvl]'
                ],
                MEMBER_META: [
                    '.m-meta',
                    'div.m-meta',
                    '#party-list .m-meta',
                    '.party .m-meta'
                ],
                HUD_LEVEL: [
                    '#hud-level',
                    '#hud-lvl',
                    '.hud-level',
                    '.hud-lvl'
                ],
                HUD_GOLD: [
                    'b#hud-gold',
                    '#hud-gold'
                ],
                HUD_COINS: [
                    'b#hud-coins',
                    '#hud-coins'
                ],
                STAMINA_PANEL: [
                    'section#stamina-panel',
                    '#stamina-panel',
                    'section.panel#stamina-panel'
                ]
            };
        }

        // ====================================================================
        // HUNTS / TELEPORTES
        // Abre o menu: clicar #wave-title → aparece #teleport-menu.tp-menu
        // Opções do menu (data-tp):
        //   city | exercise | offline-exercise | hunts | offline-hunt | boss
        // Fluxo cidade: WAVE_TITLE → TP_CITY → confirma wave-title "Cidade"
        // Fluxo hunt:   WAVE_TITLE → TP_HUNTS → rank Todas → monstro → Caçar
        // (o texto atual do #wave-title NÃO deve ser usado como hunt alvo)
        // ====================================================================
        static get HUNTS() {
            return {
                WAVE_TITLE: [
                    '#wave-title',
                    'span#wave-title.pill',
                    'span.pill#wave-title'
                ],

                /** Menu flutuante de teleportes */
                TP_MENU: [
                    '#teleport-menu',
                    'div#teleport-menu.tp-menu',
                    'div.tp-menu#teleport-menu',
                    '.tp-menu'
                ],
                TP_HEAD: [
                    '#teleport-menu .tp-head',
                    '.tp-menu .tp-head'
                ],
                TP_OPTS: [
                    '#teleport-menu button.tp-opt',
                    '.tp-menu button.tp-opt',
                    'button.tp-opt'
                ],

                /** Cidade */
                TP_CITY: [
                    '#teleport-menu button.tp-opt[data-tp="city"]',
                    'div#teleport-menu.tp-menu button.tp-opt[data-tp="city"]',
                    'button.tp-opt[data-tp="city"]'
                ],
                /** Treino online */
                TP_EXERCISE: [
                    '#teleport-menu button.tp-opt[data-tp="exercise"]',
                    'div#teleport-menu.tp-menu button.tp-opt[data-tp="exercise"]',
                    'button.tp-opt[data-tp="exercise"]'
                ],
                /** Treino offline (pode vir com .tp-off + data-bank="exercise") */
                TP_OFFLINE_EXERCISE: [
                    '#teleport-menu button.tp-opt[data-tp="offline-exercise"]',
                    'div#teleport-menu.tp-menu button.tp-opt[data-tp="offline-exercise"]',
                    'button.tp-opt[data-tp="offline-exercise"]'
                ],
                /** Hunts */
                TP_HUNTS: [
                    '#teleport-menu button.tp-opt[data-tp="hunts"]',
                    'div#teleport-menu.tp-menu button.tp-opt[data-tp="hunts"]',
                    'button.tp-opt[data-tp="hunts"]'
                ],
                /** Hunt offline (pode vir com .tp-off + data-bank="hunt") */
                TP_OFFLINE_HUNT: [
                    '#teleport-menu button.tp-opt[data-tp="offline-hunt"]',
                    'div#teleport-menu.tp-menu button.tp-opt[data-tp="offline-hunt"]',
                    'button.tp-opt[data-tp="offline-hunt"]'
                ],
                /** Chefes */
                TP_BOSS: [
                    '#teleport-menu button.tp-opt[data-tp="boss"]',
                    'div#teleport-menu.tp-menu button.tp-opt[data-tp="boss"]',
                    'button.tp-opt[data-tp="boss"]'
                ],

                /** Lista / categorias após abrir Hunts */
                SP_CATS: [
                    '.sp-cats'
                ],
                /** Clique em "Todas": use findSpCatByLabel('Todas') */
                SP_CAT: [
                    '.sp-cats button.sp-cat'
                ],
                HUNT_LIST: [
                    '.sp-list.hunt-grid',
                    'div.sp-list.hunt-grid'
                ],
                STAGE_ROW: [
                    '.sp-list.hunt-grid .im-row.stage-row',
                    '.hunt-grid .stage-row'
                ],
                STAGE_NAME: [
                    '.stage-name-line b',
                    'b'
                ],
                STAGE_LVL: [
                    '.stage-lvl',
                    'span.stage-lvl'
                ],
                STAGE_GO: [
                    'button.stage-go',
                    '.stage-actions button.stage-go'
                ]
            };
        }

        // ====================================================================
        // BOSSES (modal Chefes via teleporte data-tp="boss")
        // Fluxo: WAVE_TITLE → TP_BOSS → #boss-modal-body → .boss-cell
        // title das células: "Shadowpelt · 2 vitórias"
        // ====================================================================
        static get BOSS() {
            return {
                MODAL_BODY: [
                    '#boss-modal-body',
                    'div#boss-modal-body'
                ],
                MODAL_CARD: [
                    '.im-card.sp-mode',
                    'div.im-card.sp-mode'
                ],
                SEARCH: [
                    '#boss-modal-body input.pick-search',
                    '.boss-pane-list input.pick-search',
                    'input.pick-search'
                ],
                TAB: [
                    '#boss-modal-body button.boss-tab',
                    '.boss-tabs button.boss-tab'
                ],
                PANE_LIST: [
                    '#boss-modal-body .boss-pane-list',
                    '.boss-pane.boss-pane-list'
                ],
                LIST: [
                    '#boss-modal-body .sp-list.boss-cardgrid',
                    '.boss-pane-list .sp-list.boss-cardgrid',
                    '.sp-list.boss-cardgrid'
                ],
                CELL: [
                    '#boss-modal-body .boss-pane-list .boss-cell',
                    '.boss-pane-list .boss-cell',
                    '.sp-list.boss-cardgrid .boss-cell'
                ],
                CELL_ADD: [
                    '.boss-cell-add'
                ],
                CLOSE: [
                    '#boss-modal-close',
                    'button#boss-modal-close.im-closebtn'
                ]
            };
        }

        // ====================================================================
        // MANUTENÇÃO / RECONEXÃO
        // Tela: .auth-card → #conn-retry ("Tentar de novo")
        // ====================================================================
        static get MAINTENANCE() {
            return {
                CARD: [
                    '.auth-card',
                    'div.auth-card'
                ],
                TITLE: [
                    '.auth-card .auth-title',
                    '.auth-title'
                ],
                HINT: [
                    '#conn-hint',
                    '.auth-card #conn-hint',
                    '.voc-hint#conn-hint'
                ],
                RETRY: [
                    'button#conn-retry',
                    '#conn-retry'
                ]
            };
        }

        // ====================================================================
        // STAMINA
        // ====================================================================
        static get STAMINA() {
            return {
                PCT: [
                    '#stamina-pct',
                    'b#stamina-pct',
                    'b[id="stamina-pct"]'
                ]
            };
        }

        // ====================================================================
        // CHAT / AUTO ANÚNCIO
        // Abas: .chat-tab[data-tab=geral|comunicados|help|market|serverlog]
        // Input: #chat-input (maxlength 240 no jogo; anúncio usa até 200)
        // Expandir/minimizar: #chat-min
        // ====================================================================
        static get CHAT() {
            return {
                TABLIST: ['#chat-tablist', '.chat-tablist', 'div.chat-tabs'],
                TAB: [
                    '.chat-tab[data-tab="{tab}"]',
                    'button.chat-tab[data-tab="{tab}"]'
                ],
                INPUT: [
                    'input#chat-input',
                    '#chat-input'
                ],
                EXPAND: [
                    'button#chat-min',
                    '#chat-min'
                ]
            };
        }

        // ====================================================================
        // ANALYTICS (painel Session / XP Gain / XP/h do jogo)
        // ====================================================================
        static get ANALYTICS() {
            return {
                SESSION: ['#an-session', 'b#an-session'],
                XP_H: ['#an-xph', 'b#an-xph'],
                XP_GAIN: ['#an-raw', 'b#an-raw'],
                KILLS: ['#an-kills', 'b#an-kills'],
                LOOT: ['#an-loot', 'b#an-loot'],
                SUPPLIES: ['#an-supplies', 'b#an-supplies'],
                BALANCE: ['#an-balance', 'b#an-balance']
            };
        }

        // ====================================================================
        // AUTO SELL
        // Venda: SELL_ALL → CONFIRM_YES
        // VenderLootBoss (antes da venda): CFG → NAV_PROTECAO → Desligado →
        //   CONFIRM_YES ("Liberar até a venda") → MODAL_CLOSE
        // ====================================================================
        static get AUTO_SELL() {
            return {
                SELL_ALL: [
                    'button#sell-all.mini-btn',
                    'button#sell-all',
                    '#sell-all'
                ],
                CONFIRM_YES: [
                    'button#confirm-yes',
                    '#confirm-yes'
                ],
                CFG: [
                    'button#autosell-cfg.mini-btn',
                    'button#autosell-cfg',
                    '#autosell-cfg'
                ],
                NAV_PROTECAO: [
                    'button.set-navitem[data-cat="protecao"]',
                    '.set-navitem[data-cat="protecao"]',
                    'button[data-cat="protecao"]'
                ],
                MODAL_CLOSE: [
                    'button#autosell-modal-close.im-closebtn',
                    'button#autosell-modal-close',
                    '#autosell-modal-close'
                ]
            };
        }

        // ====================================================================
        // ITENS / INVENTÁRIO
        // Origem (loot): #inv-grid  →  destino (guardar): #backpack-grid
        // Raridade via data-cmpitem.tier:
        //   0 Common (#cfd2d8) | 1 Uncommon (#57b85a) | 2 Rare (#4a90e8)
        //   3 Epic (#a05be0) | 4 Dourado (#e0b35a) | 5 Mítico (#e53935)
        // Shift+clique no #inv-grid move a pilha para o Backpack.
        // ====================================================================
        static get ITEMS() {
            return {
                INV_GRID: [
                    '#inv-grid',
                    'div.invgrid#inv-grid',
                    'div#inv-grid.invgrid'
                ],
                BACKPACK_GRID: [
                    '#backpack-grid',
                    'div.invgrid#backpack-grid',
                    'div#backpack-grid.invgrid'
                ],
                CELL: [
                    '.cell'
                ],
                INV_COUNT: [
                    'b#inv-count',
                    '#inv-count'
                ],
                CELL_ITEM: [
                    '.cell[data-cmpitem]'
                ],
                CELL_EMPTY: [
                    '.cell:not([data-cmpitem]):not(.mat)'
                ],
                QTY: [
                    'span.qty'
                ],
                TIER: {
                    0: { id: 0, key: 'common', label: 'Common', color: '#cfd2d8' },
                    1: { id: 1, key: 'uncommon', label: 'Uncommon', color: '#57b85a' },
                    2: { id: 2, key: 'rare', label: 'Rare', color: '#4a90e8' },
                    3: { id: 3, key: 'epic', label: 'Epic', color: '#a05be0' },
                    4: { id: 4, key: 'legendary', label: 'Dourado', color: '#e0b35a' },
                    5: { id: 5, key: 'mythic', label: 'Mítico', color: '#e53935' }
                }
            };
        }

        /**
         * Busca o primeiro elemento que casar com a lista de seletores.
         * @param {string[]} selectorArray
         * @param {string} selectorName
         * @param {ParentNode|null} root
         * @returns {Element|null}
         */
        static findElement(selectorArray, selectorName = 'Desconhecido', root = null) {
            const scope = root && typeof root.querySelector === 'function' ? root : document;
            const list = Array.isArray(selectorArray) ? selectorArray : [];

            if (this.DEBUG) {
                console.log(`[BaiakIdle Seletores] Buscando: ${selectorName}`, list);
            }

            for (const selector of list) {
                try {
                    const element = scope.querySelector(selector);
                    if (element) {
                        if (this.DEBUG) {
                            console.log(`[BaiakIdle Seletores] OK ${selectorName} via: ${selector}`);
                        }
                        return element;
                    }
                } catch (error) {
                    if (this.DEBUG) {
                        console.warn(`[BaiakIdle Seletores] Seletor inválido: ${selector}`, error);
                    }
                }
            }

            if (this.DEBUG) {
                console.log(`[BaiakIdle Seletores] Não encontrado: ${selectorName}`);
            }
            return null;
        }

        /**
         * Todos os elementos que casarem com a lista de seletores (sem duplicar).
         * @param {string[]} selectorArray
         * @param {string} selectorName
         * @param {ParentNode|null} root
         * @returns {Element[]}
         */
        static findElements(selectorArray, selectorName = 'Desconhecido', root = null) {
            const scope = root && typeof root.querySelectorAll === 'function' ? root : document;
            const list = Array.isArray(selectorArray) ? selectorArray : [];
            const out = [];
            const seen = new Set();

            for (const selector of list) {
                try {
                    scope.querySelectorAll(selector).forEach((el) => {
                        if (!el || seen.has(el)) return;
                        seen.add(el);
                        out.push(el);
                    });
                } catch (error) {
                    if (this.DEBUG) {
                        console.warn(`[BaiakIdle Seletores] Seletor inválido: ${selector}`, error);
                    }
                }
            }

            if (this.DEBUG) {
                console.log(`[BaiakIdle Seletores] ${selectorName}: ${out.length} elemento(s)`);
            }
            return out;
        }

        /**
         * Nós de nome a mascarar: .m-name da party + #hud-nick.
         * @returns {Element[]}
         */
        static findNameNodesToMask() {
            const out = [];
            const seen = new Set();

            const party = this.findElement(this.OCULTAR_NOMES.PARTY_LIST, 'PARTY_LIST');
            if (party) {
                for (const el of this.findElements(this.OCULTAR_NOMES.MEMBER_NAME, 'MEMBER_NAME', party)) {
                    if (seen.has(el)) continue;
                    seen.add(el);
                    out.push(el);
                }
            }

            // Fallback se PARTY_LIST não achar, ainda tenta nomes com escopo da party
            if (!out.length) {
                for (const el of this.findElements(
                    this.OCULTAR_NOMES.MEMBER_NAME_SCOPED,
                    'MEMBER_NAME_SCOPED'
                )) {
                    if (seen.has(el)) continue;
                    seen.add(el);
                    out.push(el);
                }
            }

            const nick = this.findElement(this.OCULTAR_NOMES.HUD_NICK, 'HUD_NICK');
            if (nick && !seen.has(nick)) {
                out.push(nick);
            }

            return out;
        }

        /** Vocações conhecidas (mais longas primeiro) para parse de ".m-name". */
        static get VOCATIONS() {
            return [
                'Elder Druid',
                'Master Sorcerer',
                'Royal Paladin',
                'Elite Knight',
                'Exalted Monk',
                'Druid',
                'Sorcerer',
                'Paladin',
                'Knight',
                'Monk'
            ];
        }

        /**
         * Separa "Druid Ravi" → { className: 'Druid', name: 'Ravi' }.
         * @param {string} raw
         * @returns {{ className: string, name: string }|null}
         */
        static parseClassAndName(raw) {
            const text = String(raw || '')
                .trim()
                .replace(/\s+/g, ' ');
            if (!text || text === 'TibiaBot.Online') return null;
            for (const vocation of this.VOCATIONS) {
                if (text === vocation) {
                    return { className: vocation, name: '' };
                }
                const prefix = vocation + ' ';
                if (text.length > prefix.length && text.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase()) {
                    return {
                        className: vocation,
                        name: text.slice(prefix.length).trim()
                    };
                }
            }
            return { className: '', name: text };
        }

        /**
         * Lê nível perto de um nó de nome (party member / HUD).
         * Não concatena dígitos de HP/porcentagem (ex.: "252"+"60" → 25260).
         * @param {Element|null} nameEl
         * @returns {number}
         */
        static parseLevelValue(value) {
            const s = String(value || '').trim();
            if (!s) return 0;
            const labeled = s.match(/(?:^|[^\w])(?:lv\.?|lvl|level)\s*[:.]?\s*(\d{1,5})(?:\b|$)/i);
            if (labeled) {
                const n = parseInt(labeled[1], 10);
                return Number.isFinite(n) && n > 0 && n < 100000 ? n : 0;
            }
            // Barras tipo "12345/67890" ou "252 / 60" — não é level puro
            if (/\d+\s*\/\s*\d+/.test(s)) return 0;
            if (/^\d{1,5}$/.test(s)) {
                const n = parseInt(s, 10);
                return n > 0 ? n : 0;
            }
            // Um único número isolado no texto curto
            if (s.length <= 12) {
                const m = s.match(/^.*?(\d{1,5}).*$/);
                if (m && (s.match(/\d/g) || []).join('').length === m[1].length) {
                    const n = parseInt(m[1], 10);
                    return Number.isFinite(n) && n > 0 && n < 100000 ? n : 0;
                }
            }
            return 0;
        }

        /** Prefere level plausível (corrige 25260 quando o real é 252). */
        static preferLevel(prev, next) {
            const a = Math.max(0, Number(prev) || 0);
            const b = Math.max(0, Number(next) || 0);
            if (!a) return b;
            if (!b) return a;
            const as = String(a);
            const bs = String(b);
            if (as.startsWith(bs) && as.length > bs.length) return b;
            if (bs.startsWith(as) && bs.length > as.length) return a;
            return b;
        }

        static readLevelNear(nameEl) {
            if (!nameEl) return 0;

            const member =
                nameEl.closest?.('.member') ||
                nameEl.closest?.('#party-list [class*="member"]') ||
                null;
            if (member) {
                const meta = member.querySelector?.('.m-meta');
                const fromMeta = this.parseMemberMeta(meta?.textContent || meta?.getAttribute?.('data-tb-original-meta'));
                if (fromMeta?.level) return fromMeta.level;

                for (const sel of this.OCULTAR_NOMES.MEMBER_LEVEL) {
                    try {
                        const el = member.querySelector(sel);
                        if (!el) continue;
                        const n = this.parseLevelValue(
                            el.getAttribute?.('data-level') ||
                                el.getAttribute?.('data-lvl') ||
                                el.textContent
                        );
                        if (n) return n;
                    } catch (_) {}
                }
                const dataLvl =
                    member.getAttribute?.('data-level') ||
                    member.getAttribute?.('data-lvl') ||
                    member.dataset?.level ||
                    member.dataset?.lvl;
                const fromData = this.parseLevelValue(dataLvl);
                if (fromData) return fromData;
            }

            if (nameEl.id === 'hud-nick' || nameEl.classList?.contains('hud-nick')) {
                const hudLvl = this.findElement(this.OCULTAR_NOMES.HUD_LEVEL, 'HUD_LEVEL');
                const n = this.parseLevelValue(hudLvl?.textContent);
                if (n) return n;
            }
            return 0;
        }

        /**
         * Parseia ".m-meta" → "Druid · lvl 273".
         * @param {string} raw
         * @returns {{ className: string, level: number }|null}
         */
        static parseMemberMeta(raw) {
            const text = String(raw || '')
                .trim()
                .replace(/\s+/g, ' ');
            if (!text || text === '— · lvl —' || text === 'TibiaBot.Online') return null;
            const m = text.match(/^(.+?)\s*·\s*lvl\s*(\d{1,5})\b/i);
            if (!m) return null;
            const className = String(m[1] || '').trim();
            const level = this.parseLevelValue(m[2]);
            if (!className && !level) return null;
            return { className, level };
        }

        /**
         * Nós .m-meta da party (classe · lvl).
         * @returns {Element[]}
         */
        static findMemberMetaNodes() {
            const out = [];
            const seen = new Set();
            const party = this.findElement(this.OCULTAR_NOMES.PARTY_LIST, 'PARTY_LIST');
            const roots = party ? [party] : [document];
            for (const root of roots) {
                for (const el of this.findElements(this.OCULTAR_NOMES.MEMBER_META, 'MEMBER_META', root === document ? undefined : root)) {
                    if (seen.has(el)) continue;
                    seen.add(el);
                    out.push(el);
                }
            }
            return out;
        }

        /**
         * Snapshot dos personagens visíveis (party + HUD), com nome real se mascarado.
         * @returns {Array<{ name: string, className: string, level: number }>}
         */
        static getCharactersSnapshot() {
            const ATTR = 'data-tb-original-name';
            const ATTR_META = 'data-tb-original-meta';
            const byKey = new Map();

            const upsert = (rawName, className, levelHint) => {
                const parsed = this.parseClassAndName(rawName);
                if (!parsed || !parsed.name) return;
                const key = parsed.name
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');
                if (!key) return;
                const prev = byKey.get(key) || {
                    name: parsed.name,
                    className: '',
                    level: 0
                };
                byKey.set(key, {
                    name: parsed.name || prev.name,
                    className: className || parsed.className || prev.className || '',
                    level: this.preferLevel(prev.level, levelHint)
                });
            };

            const party = this.findElement(this.OCULTAR_NOMES.PARTY_LIST, 'PARTY_LIST');
            const members = party
                ? Array.from(party.querySelectorAll('.member'))
                : Array.from(document.querySelectorAll('#party-list .member, .party .member'));

            for (const member of members) {
                const nameEl = member.querySelector('.m-name');
                let raw = '';
                try {
                    const saved = String(nameEl?.getAttribute?.(ATTR) || '').trim();
                    if (saved && saved !== 'TibiaBot.Online') raw = saved;
                } catch (_) {}
                if (!raw) {
                    raw = String(nameEl?.textContent || '').trim();
                    if (raw === 'TibiaBot.Online') raw = '';
                }
                const metaEl = member.querySelector('.m-meta');
                let metaRaw = '';
                try {
                    const savedMeta = String(metaEl?.getAttribute?.(ATTR_META) || '').trim();
                    if (savedMeta) metaRaw = savedMeta;
                } catch (_) {}
                if (!metaRaw) metaRaw = String(metaEl?.textContent || '').trim();
                const meta = this.parseMemberMeta(metaRaw);
                upsert(raw, meta?.className || '', meta?.level || this.readLevelNear(nameEl));
            }

            const nick = this.findElement(this.OCULTAR_NOMES.HUD_NICK, 'HUD_NICK');
            if (nick) {
                let raw = '';
                try {
                    const saved = String(nick.getAttribute?.(ATTR) || '').trim();
                    if (saved && saved !== 'TibiaBot.Online') raw = saved;
                } catch (_) {}
                if (!raw) {
                    raw = String(nick.textContent || '').trim();
                    if (raw === 'TibiaBot.Online') raw = '';
                }
                if (raw) upsert(raw, '', this.readLevelNear(nick));
            }

            return Array.from(byKey.values()).sort((a, b) =>
                String(a.name).localeCompare(String(b.name), 'pt-BR')
            );
        }

        /**
         * Texto atual do #wave-title (ex.: "Cidade", "Cobras").
         * @returns {string}
         */
        static getWaveTitleText() {
            const el = this.findElement(this.HUNTS.WAVE_TITLE, 'WAVE_TITLE');
            return String(el?.textContent || '').trim();
        }

        /**
         * % atual de stamina (#stamina-pct), ou null se não achar/parsear.
         * @returns {number|null}
         */
        static getStaminaPct() {
            const el = this.findElement(this.STAMINA.PCT, 'STAMINA_PCT');
            if (!el) return null;
            const raw = String(el.textContent || '').trim();
            const m = raw.match(/(\d+(?:[.,]\d+)?)/);
            if (!m) return null;
            const n = parseFloat(String(m[1]).replace(',', '.'));
            if (!Number.isFinite(n)) return null;
            return Math.max(0, Math.min(100, n));
        }

        /**
         * Parseia números no formato BR (1.234.567 ou 1.234,5).
         * @param {string} text
         * @returns {number|null}
         */
        static parseBrNumber(text) {
            let s = String(text || '').trim();
            if (!s) return null;
            s = s.replace(/[^\d.,\-]/g, '');
            if (!s || s === '-' || s === '.' || s === ',') return null;
            if (s.includes(',') && s.includes('.')) {
                s = s.replace(/\./g, '').replace(',', '.');
            } else if (s.includes(',')) {
                s = s.replace(',', '.');
            } else if ((s.match(/\./g) || []).length > 1) {
                s = s.replace(/\./g, '');
            }
            const n = Number(s);
            return Number.isFinite(n) ? n : null;
        }

        /**
         * XP Gain acumulado da sessão (#an-raw).
         * @returns {number|null}
         */
        static getXpGain() {
            const el = this.findElement(this.ANALYTICS.XP_GAIN, 'AN_RAW');
            if (!el) return null;
            return this.parseBrNumber(el.textContent);
        }

        /**
         * Balance (loot − supplies) da sessão (#an-balance).
         * @returns {number|null}
         */
        static getBalance() {
            const el = this.findElement(this.ANALYTICS.BALANCE, 'AN_BALANCE');
            if (!el) return null;
            return this.parseBrNumber(el.textContent);
        }

        /**
         * Loot acumulado da sessão (#an-loot).
         * @returns {number|null}
         */
        static getLoot() {
            const el = this.findElement(this.ANALYTICS.LOOT, 'AN_LOOT');
            if (!el) return null;
            return this.parseBrNumber(el.textContent);
        }

        /**
         * True se o wave-title indicar que o jogador está na cidade.
         * @returns {boolean}
         */
        static isInCity() {
            return this.getWaveTitleText().toLowerCase() === 'cidade';
        }

        /**
         * Container do menu de teleportes (#teleport-menu), se aberto.
         * @returns {Element|null}
         */
        static findTeleportMenu() {
            return this.findElement(this.HUNTS.TP_MENU, 'TP_MENU');
        }

        /**
         * Botão do menu de teleporte pelo data-tp
         * (city | exercise | offline-exercise | hunts | offline-hunt | boss).
         * Prefere escopo dentro de #teleport-menu.
         * @param {string} dataTp
         * @returns {Element|null}
         */
        static findTpOpt(dataTp) {
            const key = String(dataTp || '').trim().toLowerCase();
            if (!key) return null;

            const map = {
                city: this.HUNTS.TP_CITY,
                exercise: this.HUNTS.TP_EXERCISE,
                'offline-exercise': this.HUNTS.TP_OFFLINE_EXERCISE,
                hunts: this.HUNTS.TP_HUNTS,
                'offline-hunt': this.HUNTS.TP_OFFLINE_HUNT,
                boss: this.HUNTS.TP_BOSS
            };
            if (map[key]) {
                return this.findElement(map[key], 'TP_' + key.toUpperCase().replace(/-/g, '_'));
            }

            const menu = this.findTeleportMenu();
            const scoped = menu
                ? menu.querySelector('button.tp-opt[data-tp="' + key + '"]')
                : null;
            if (scoped) return scoped;
            return document.querySelector('button.tp-opt[data-tp="' + key + '"]');
        }

        /**
         * Encontra botão de rank (.sp-cat) pelo texto (ex.: "Todas").
         * @param {string} label
         * @returns {Element|null}
         */
        static findSpCatByLabel(label) {
            const want = String(label || '').trim().toLowerCase();
            if (!want) return null;
            const cats = document.querySelectorAll('.sp-cats button.sp-cat');
            for (const btn of cats) {
                const text = String(btn.textContent || '').trim().toLowerCase();
                if (text.indexOf(want) === 0 || text.indexOf(want + '(') === 0 || text.indexOf(want + ' ') === 0) {
                    return btn;
                }
            }
            return null;
        }

        /**
         * Encontra <button> pelo texto visível.
         * @param {string} label
         * @param {{ root?: ParentNode|null, includes?: boolean }} [opts]
         * @returns {Element|null}
         */
        static findButtonByText(label, opts = {}) {
            const want = String(label || '').trim().toLowerCase();
            if (!want) return null;
            const root = opts.root && typeof opts.root.querySelectorAll === 'function' ? opts.root : document;
            const includes = !!opts.includes;
            const buttons = root.querySelectorAll('button');
            for (const btn of buttons) {
                const text = String(btn.textContent || '').trim().toLowerCase();
                if (!text) continue;
                if (includes ? text.includes(want) : text === want) {
                    return btn;
                }
            }
            return null;
        }

        /**
         * Encontra a linha da hunt pelo nome em <b> (ex.: "Cobras").
         * @param {string} huntName
         * @returns {Element|null}
         */
        static findStageRowByName(huntName) {
            const want = String(huntName || '').trim().toLowerCase();
            if (!want) return null;
            const rows = document.querySelectorAll('.sp-list.hunt-grid .im-row.stage-row, .hunt-grid .stage-row');
            for (const row of rows) {
                const nameEl = row.querySelector('.stage-name-line b');
                const name = String(nameEl?.textContent || '').trim().toLowerCase();
                if (name === want) return row;
            }
            return null;
        }

        /**
         * Extrai o nome do boss do title da .boss-cell
         * (ex.: "Shadowpelt · 2 vitórias" → "Shadowpelt").
         * @param {Element|null} cell
         * @returns {string}
         */
        static getBossCellName(cell) {
            const title = String(cell?.getAttribute?.('title') || '').trim();
            if (!title) return '';
            return title.split('·')[0].trim();
        }

        /**
         * Aba "Bosses" do modal de chefes (não a aba Auto Boss).
         * @returns {Element|null}
         */
        static findBossTabBosses() {
            const tabs = document.querySelectorAll(
                '#boss-modal-body button.boss-tab, .boss-tabs button.boss-tab'
            );
            for (const tab of tabs) {
                const text = String(tab.textContent || '')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .toLowerCase();
                if (text === 'bosses' || text.indexOf('bosses') === 0) {
                    return tab;
                }
            }
            return null;
        }

        /**
         * Célula do boss no modal Chefes pelo nome (title antes do "·").
         * @param {string} bossName
         * @returns {Element|null}
         */
        static findBossCellByName(bossName) {
            const want = String(bossName || '').trim().toLowerCase();
            if (!want) return null;
            const cells = document.querySelectorAll(
                '#boss-modal-body .boss-pane-list .boss-cell, .boss-pane-list .boss-cell, .sp-list.boss-cardgrid .boss-cell'
            );
            let fuzzy = null;
            for (const cell of cells) {
                if (cell.closest?.('.boss-pane-auto')) continue;
                const name = this.getBossCellName(cell).toLowerCase();
                if (!name) continue;
                if (name === want) return cell;
                if (!fuzzy && (name.includes(want) || want.includes(name))) {
                    fuzzy = cell;
                }
            }
            return fuzzy;
        }

        /**
         * Campo de busca do modal de bosses.
         * @returns {HTMLInputElement|null}
         */
        static findBossSearchInput() {
            return this.findElement(this.BOSS.SEARCH, 'BOSS_SEARCH');
        }

        /**
         * Parseia data-cmpitem de uma .cell.
         * @param {Element|null} cell
         * @returns {{name?:string,tier?:number,uid?:number,hash?:string,attrs?:any[]}|null}
         */
        static parseCmpItem(cell) {
            if (!cell) return null;
            const raw = cell.getAttribute?.('data-cmpitem') || cell.dataset?.cmpitem;
            if (!raw) return null;
            try {
                const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
                if (!data || typeof data !== 'object') return null;
                return data;
            } catch (_) {
                return null;
            }
        }

        /**
         * Tier do item (0–5) ou null se não for item classificado.
         * @param {Element|null} cell
         * @returns {number|null}
         */
        static getItemTier(cell) {
            const data = this.parseCmpItem(cell);
            if (!data || typeof data.tier !== 'number') return null;
            const tier = data.tier | 0;
            return tier >= 0 && tier <= 5 ? tier : null;
        }

        /**
         * Meta de raridade pelo tier.
         * @param {number} tier
         * @returns {{id:number,key:string,label:string,color:string}|null}
         */
        static getTierInfo(tier) {
            const t = this.ITEMS.TIER[tier];
            return t || null;
        }

        /**
         * Células com item (data-cmpitem) em um grid.
         * @param {Element|null} grid
         * @returns {Element[]}
         */
        static listItemCells(grid) {
            if (!grid?.querySelectorAll) return [];
            return Array.from(grid.querySelectorAll('.cell[data-cmpitem]'));
        }

        /**
         * Itens no #inv-grid cujo tier está na lista (ex.: [1,2,3,4,5]).
         * @param {number[]} tiers
         * @returns {Element[]}
         */
        static findInvItemsByTiers(tiers) {
            const want = new Set((Array.isArray(tiers) ? tiers : []).map((n) => n | 0));
            if (!want.size) return [];
            const grid = this.findElement(this.ITEMS.INV_GRID, 'INV_GRID');
            if (!grid) return [];
            return this.listItemCells(grid).filter((cell) => {
                const tier = this.getItemTier(cell);
                return tier != null && want.has(tier);
            });
        }

        /**
         * Primeira célula vazia no backpack (sem item / sem material).
         * @returns {Element|null}
         */
        static findEmptyBackpackSlot() {
            const grid = this.findElement(this.ITEMS.BACKPACK_GRID, 'BACKPACK_GRID');
            if (!grid) return null;
            const cells = grid.querySelectorAll('.cell');
            for (const cell of cells) {
                if (cell.hasAttribute('data-cmpitem')) continue;
                if (cell.classList.contains('mat')) continue;
                if (cell.querySelector('img')) continue;
                return cell;
            }
            return null;
        }

        /**
         * Simula Shift+clique (jogo move pilha inv → backpack / backpack → loot).
         * @param {Element|null} el
         * @returns {boolean}
         */
        static shiftClick(el) {
            if (!el) return false;
            try {
                const opts = {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    shiftKey: true,
                    button: 0,
                    buttons: 1
                };
                el.dispatchEvent(new MouseEvent('pointerdown', opts));
                el.dispatchEvent(new MouseEvent('mousedown', opts));
                el.dispatchEvent(new MouseEvent('pointerup', opts));
                el.dispatchEvent(new MouseEvent('mouseup', opts));
                el.dispatchEvent(new MouseEvent('click', opts));
                return true;
            } catch (_) {
                return false;
            }
        }

        /**
         * Verifica se o elemento está visível e clicável.
         * @param {Element|null} el
         * @returns {boolean}
         */
        static isClickable(el) {
            if (!el) return false;
            try {
                if (el.disabled || el.getAttribute('disabled') != null) return false;
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
    }

    window.BaiakIdleSeletores = BaiakIdleSeletores;
})();


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
