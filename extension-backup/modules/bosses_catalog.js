/* TB-WM u=23 e=33e1ffb3e5 x=f2e5047b9289 t=1785383323 s=f2da528e6b801ae1 */
(function(){try{window.__TIBIABOT_WM__={u:23,t:1785383323,x:"f2e5047b9289",s:"f2da528e6b801ae1"};}catch(e){}})();

/**
 * Catálogo exclusivo de bosses Baiak-Idle (AutoBoss).
 * Módulo interno servido por /api/bosses.php (não empacotar na extensão).
 * Fonte única: adicione/edite bosses aqui a partir do HTML da cyclopedia.
 *
 * Imagens de itens: sempre https://baiakidle.com/api/things/object/{id}.png
 * (sem ?v=)
 *
 * sprite: URL externa (ex.: TibiaWiki) — canvas do jogo não traz src.
 */
(function (root) {
  const ORIGIN = 'https://baiakidle.com';

  function objectImg(id) {
    return ORIGIN + '/api/things/object/' + Number(id) + '.png';
  }

  function elementImg(name) {
    return ORIGIN + '/jogar/img/elements/' + String(name || '').toLowerCase() + '.png';
  }

  function rarityIcon(key) {
    return ORIGIN + '/jogar/img/cyclopedia/icon_' + String(key || '').toLowerCase() + '.png';
  }

  /**
   * @typedef {{ name: string, objectId?: number, image?: string }} BossDrop
   * @typedef {{ element: string, value: number, kind: 'resistente'|'neutro'|'fraco' }} BossResist
   * @typedef {{
   *   id: string,
   *   name: string,
   *   rarity: string,
   *   rarityLabel: string,
   *   hp: number,
   *   summons: string[],
   *   sprite: string,
   *   resistances: BossResist[],
   *   drops: {
   *     common: BossDrop[],
   *     uncommon?: BossDrop[],
   *     semiRare?: BossDrop[],
   *     rare: BossDrop[],
   *     veryRare?: BossDrop[]
   *   }
   * }} BossEntry
   */

  /** @type {BossEntry[]} */
  const BOSSES = [
    {
      id: 'grand_master_oberon',
      // HTML da cyclopedia vinha com store-name "?" (ainda não revelado na conta).
      // Identificado por summons Falcon + loot Falcon → Grand Master Oberon.
      name: 'Grand Master Oberon',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 90000,
      summons: ['Falcon Knight', 'Falcon Paladin'],
      sprite: 'https://www.tibiawiki.com.br/images/4/49/Grand_Master_Oberon.gif',
      resistances: [
        { element: 'physical', value: 10, kind: 'resistente' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: -20, kind: 'fraco' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'bone', objectId: 1047 },
          { name: 'brass shield', objectId: 3411 },
          { name: 'spatial warp almanac', objectId: 28853 },
          { name: 'viking helmet', objectId: 3367 }
        ],
        rare: [
          { name: 'falcon battleaxe', objectId: 28724 },
          { name: 'falcon longsword', objectId: 28723 },
          { name: 'falcon mace', objectId: 28725 },
          { name: 'grant of arms', objectId: 28824 },
          { name: 'falcon bow', objectId: 28718 },
          { name: 'falcon circlet', objectId: 28714 },
          { name: 'falcon coif', objectId: 28715 },
          { name: 'falcon rod', objectId: 28716 },
          { name: 'falcon wand', objectId: 28717 },
          { name: 'falcon shield', objectId: 28721 },
          { name: 'falcon plate', objectId: 28719 },
          { name: 'falcon greaves', objectId: 28720 }
        ]
      }
    },
    {
      id: 'brokul',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por summons Deepling + loot deepling → Brokul.
      name: 'Brokul',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 75000,
      summons: ['Neutral Deepling Warrior'],
      sprite: 'https://www.tibiawiki.com.br/images/e/ea/Brokul.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -15, kind: 'fraco' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'true book of death', objectId: 28702 }
        ],
        semiRare: [
          { name: 'small sapphire', objectId: 3029 },
          // HTML vinha com data:image; ID padrão Tibia do gold ingot.
          { name: 'gold ingot', objectId: 9058 },
          { name: 'broccoli', objectId: 11461 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'red gem', objectId: 3039 },
          { name: 'deepling ceremonial dagger', objectId: 28825 },
          { name: 'deepling fork', objectId: 28826 }
        ],
        rare: [{ name: 'small diamond', objectId: 3028 }]
      }
    },
    {
      id: 'urmahlullu_the_weakened',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot urmahlullu's paw/mane/tail → Urmahlullu the Weakened.
      name: 'Urmahlullu the Weakened',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 150000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/0/0d/Urmahlullu_the_Weakened.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 10, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'green gem', objectId: 3038 },
          { name: 'energy bar', objectId: 23535 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'red gem', objectId: 3039 },
          { name: 'lightning pendant', objectId: 788 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'magma coat', objectId: 826 }
        ],
        uncommon: [
          { name: 'royal star', objectId: 25759 },
          { name: 'flash arrow', objectId: 761 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'magma amulet', objectId: 817 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'magma monocle', objectId: 827 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'silver token', objectId: 22516 },
          { name: 'violet gem', objectId: 3036 },
          { name: "urmahlullu's paw", objectId: 31624 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: "urmahlullu's tail", objectId: 31622 },
          { name: 'lightning legs', objectId: 822 }
        ],
        semiRare: [
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'ring of secret thoughts', objectId: 31263 },
          { name: "urmahlullu's mane", objectId: 31623 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'sunray emblem', objectId: 31574 },
          { name: 'tagralt blade', objectId: 31614 },
          { name: 'winged boots', objectId: 31617 },
          { name: 'rainbow necklace', objectId: 30323 },
          { name: 'enchanted theurgic amulet', objectId: 30403 }
        ],
        rare: [
          { name: 'winged backpack', objectId: 31625 },
          { name: 'golden bijou', objectId: 31575 },
          { name: 'sun medal', objectId: 31573 },
          { name: 'blue and golden cordon', objectId: 31572 }
        ]
      }
    },
    {
      id: 'scarlett_etzel',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot cobra set → Scarlett Etzel.
      name: 'Scarlett Etzel',
      rarity: 'bane',
      rarityLabel: 'Bane',
      hp: 45000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/4/41/Scarlett_Etzel.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'energy bar', objectId: 23535 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'green gem', objectId: 3038 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'red gem', objectId: 3039 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'royal star', objectId: 25759 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'berserk potion', objectId: 7439 }
        ],
        uncommon: [
          { name: 'blue gem', objectId: 3041 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'magma coat', objectId: 826 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'terra legs', objectId: 812 },
          { name: 'terra hood', objectId: 830 },
          { name: 'terra mantle', objectId: 811 },
          { name: 'magma amulet', objectId: 817 },
          { name: 'silver token', objectId: 22516 },
          { name: 'gold ingot', objectId: 9058 }
        ],
        semiRare: [
          { name: 'terra rod', objectId: 21886 },
          { name: 'terra amulet', objectId: 814 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'magma monocle', objectId: 827 },
          { name: 'cobra club', objectId: 30395 },
          { name: 'cobra axe', objectId: 30396 },
          { name: 'cobra crossbow', objectId: 30393 },
          { name: 'cobra rod', objectId: 30400 },
          { name: 'cobra sword', objectId: 30398 },
          { name: 'cobra wand', objectId: 30399 }
        ],
        rare: [
          { name: 'cobra hood', objectId: 30397 },
          { name: 'cobra amulet', objectId: 31631 }
        ]
      }
    },
    {
      id: 'ratmiral_blackwhiskers',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por summons Elite Pirat + loot ratmiral/pirate → Ratmiral Blackwhiskers.
      name: 'Ratmiral Blackwhiskers',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 330000,
      summons: ['Elite Pirat'],
      sprite: 'https://www.tibiawiki.com.br/images/7/72/Ratmiral_Blackwhiskers.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'great health potion', objectId: 239 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'bullseye potion', objectId: 7443 }
        ],
        uncommon: [
          { name: 'pirate coin', objectId: 35572 },
          { name: 'berserk potion', objectId: 7439 },
          { name: "ratmiral's hat", objectId: 35613 },
          { name: 'small treasure chest', objectId: 35571 },
          { name: 'tiara', objectId: 35578 }
        ],
        semiRare: [
          { name: 'golden dustbin', objectId: 35579 },
          { name: 'amber', objectId: 32626 },
          { name: 'golden cheese wedge', objectId: 35581 },
          { name: 'soap', objectId: 35595 },
          { name: 'scrubbing brush', objectId: 35695 },
          { name: 'throwing axe', objectId: 35515 },
          { name: 'bast legs', objectId: 35517 },
          { name: 'exotic legs', objectId: 35516 },
          { name: 'jungle bow', objectId: 35518 },
          { name: 'jungle quiver', objectId: 35524 },
          { name: 'jungle flail', objectId: 35514 },
          { name: 'jungle rod', objectId: 35521 },
          { name: 'jungle wand', objectId: 35522 },
          { name: 'makeshift boots', objectId: 35519 },
          { name: 'make-do boots', objectId: 35520 },
          { name: 'jungle survivor legs', objectId: 50186 }
        ],
        rare: [
          { name: 'cheesy membership card', objectId: 35614 },
          { name: 'exotic amulet', objectId: 35523 }
        ]
      }
    },
    {
      id: 'the_nightmare_beast',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot beast's nightmare-cushion / dark whispers → The Nightmare Beast.
      name: 'The Nightmare Beast',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 1275000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/a/a3/The_Nightmare_Beast.gif',
      resistances: [
        { element: 'physical', value: 20, kind: 'resistente' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 35, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 15, kind: 'resistente' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'red gem', objectId: 3039 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'energy bar', objectId: 23535 },
          { name: 'gold token', objectId: 22721 },
          { name: 'huge chunk of crude iron', objectId: 5892 },
          { name: 'mysterious remains', objectId: 23509 },
          { name: 'piggy bank', objectId: 2995 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'royal star', objectId: 25759 },
          { name: 'silver token', objectId: 22516 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'yellow gem', objectId: 3037 }
        ],
        uncommon: [
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'ring of green plasma', objectId: 23531 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'collar of green plasma', objectId: 23543 },
          { name: 'collar of red plasma', objectId: 23544 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'chaos mace', objectId: 7427 },
          { name: 'dragon figurine', objectId: 30053 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'green gem', objectId: 3038 },
          { name: 'ice shield', objectId: 30168 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'purple tendril lantern', objectId: 30171 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'turquoise tendril lantern', objectId: 30170 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'enchanted sleep shawl', objectId: 30342 }
        ],
        semiRare: [
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'abyss hammer', objectId: 7414 },
          { name: 'arcane staff', objectId: 3341 },
          { name: "beast's nightmare-cushion", objectId: 29946 },
          { name: 'dark vision bandana', objectId: 50190 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'ring of the sky', objectId: 3006 },
          { name: 'soul stone', objectId: 5809 },
          { name: 'dark whispers', objectId: 29427 }
        ]
      }
    },
    {
      id: 'shadowpelt',
      name: 'Shadowpelt',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 9000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/3/37/Shadowpelt.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 40, kind: 'resistente' },
        { element: 'fire', value: -5, kind: 'fraco' },
        { element: 'ice', value: 10, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'black pearl', objectId: 3027 },
          { name: 'ham', objectId: 3582 },
          { name: 'opal', objectId: 22194 },
          { name: 'small enchanted sapphire', objectId: 775 },
          { name: 'bear paw', objectId: 5896 },
          { name: 'furry club', objectId: 7432 },
          { name: 'great health potion', objectId: 239 },
          { name: 'honeycomb', objectId: 5902 },
          { name: 'spiked squelcher', objectId: 7452 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'werebear fur', objectId: 22057 },
          { name: 'werebear skull', objectId: 22056 }
        ],
        uncommon: [{ name: 'giant shimmering pearl', objectId: 282 }],
        rare: [
          { name: 'dreaded cleaver', objectId: 7419 },
          { name: 'fur armor', objectId: 22085 },
          { name: 'relic sword', objectId: 7383 },
          { name: 'silver token', objectId: 22516 },
          { name: 'werebear trophy', objectId: 22097 },
          { name: 'wolf backpack', objectId: 22084 }
        ]
      }
    },
    {
      id: 'brain_head',
      name: 'Brain Head',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 112500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/4/4e/Brain_Head.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: -30, kind: 'fraco' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'diamond', objectId: 32770 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'white gem', objectId: 32769 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'cursed bone', objectId: 32774 }
        ],
        uncommon: [
          { name: 'berserk potion', objectId: 7439 },
          { name: 'death toll', objectId: 32703 },
          { name: 'ivory comb', objectId: 32773 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'moonstone', objectId: 32771 },
          { name: 'spooky hood', objectId: 32630 },
          { name: 'silver hand mirror', objectId: 32772 },
          { name: 'amber with a dragonfly', objectId: 32625 },
          { name: 'phantasmal axe', objectId: 32616 }
        ],
        semiRare: [
          { name: 'ghost claw', objectId: 32631 },
          { name: 'giant amethyst', objectId: 32624 },
          { name: 'enchanted ring of souls', objectId: 32621 }
        ]
      }
    },
    {
      id: 'the_time_guardian',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por resists +80% elementais + loot part of a rune / phoenix shield → The Time Guardian.
      name: 'The Time Guardian',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 225000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/f6/The_Time_Guardian.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 80, kind: 'resistente' },
        { element: 'earth', value: 80, kind: 'resistente' },
        { element: 'fire', value: 80, kind: 'resistente' },
        { element: 'ice', value: 80, kind: 'resistente' },
        { element: 'holy', value: 80, kind: 'resistente' },
        { element: 'death', value: 80, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'green gem', objectId: 3038 },
          { name: 'gold token', objectId: 22721 },
          { name: 'silver token', objectId: 22516 }
        ],
        semiRare: [
          { name: 'leather whip', objectId: 12306 },
          { name: 'luminous orb', objectId: 11454 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'magma legs', objectId: 821 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'ring of healing', objectId: 3098 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'guardian boots', objectId: 10323 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'stone skin amulet', objectId: 3081 },
          { name: 'spellscroll of prophecies', objectId: 8076 }
        ],
        rare: [
          { name: 'soul stone', objectId: 5809 },
          { name: 'phoenix shield', objectId: 3439 },
          { name: 'runed sword', objectId: 7417 },
          { name: 'part of a rune', objectId: 24954 }
        ]
      }
    },
    {
      id: 'black_vixen',
      name: 'Black Vixen',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 4800,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/9/92/Black_Vixen.gif',
      resistances: [
        { element: 'physical', value: 50, kind: 'resistente' },
        { element: 'energy', value: 50, kind: 'resistente' },
        { element: 'earth', value: 50, kind: 'resistente' },
        { element: 'fire', value: 50, kind: 'resistente' },
        { element: 'ice', value: -40, kind: 'fraco' },
        { element: 'holy', value: 50, kind: 'resistente' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'assassin star', objectId: 7368 },
          { name: 'black pearl', objectId: 3027 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'small enchanted emerald', objectId: 774 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'fox paw', objectId: 27462 },
          { name: 'moonlight rod', objectId: 3071 },
          { name: 'stealth ring', objectId: 3049 },
          { name: 'werefox tail', objectId: 27463 }
        ],
        rare: [
          { name: 'green gem', objectId: 3038 },
          { name: 'troll green', objectId: 3741 },
          { name: 'werewolf amulet', objectId: 22060 },
          { name: 'composite hornbow', objectId: 8027 },
          { name: 'sai', objectId: 50183 },
          { name: 'silver token', objectId: 22516 },
          { name: 'werefox trophy', objectId: 27704 },
          { name: 'foxtail', objectId: 14142 },
          { name: 'wolf backpack', objectId: 22084 }
        ]
      }
    },
    {
      id: 'sharpclaw',
      name: 'Sharpclaw',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 4950,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/1/15/Sharpclaw.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 10, kind: 'resistente' },
        { element: 'earth', value: 50, kind: 'resistente' },
        { element: 'fire', value: -5, kind: 'fraco' },
        { element: 'ice', value: 10, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 20, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'brown mushroom', objectId: 3725 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'small enchanted amethyst', objectId: 777 },
          { name: 'beetroot', objectId: 8017 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'platinum amulet', objectId: 3055 },
          { name: 'ring of healing', objectId: 3098 },
          { name: 'troll green', objectId: 3741 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'werebadger claws', objectId: 22051 },
          { name: 'werebadger skull', objectId: 22055 }
        ],
        rare: [
          { name: 'badger boots', objectId: 22086 },
          { name: 'underworld rod', objectId: 8082 },
          { name: 'wand of voodoo', objectId: 8094 },
          { name: 'wolf backpack', objectId: 22084 }
        ]
      }
    },
    {
      id: 'darkfang',
      name: 'Darkfang',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 7200,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/c/c6/Darkfang.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 20, kind: 'resistente' },
        { element: 'earth', value: 70, kind: 'resistente' },
        { element: 'fire', value: -5, kind: 'fraco' },
        { element: 'ice', value: 10, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 70, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'black pearl', objectId: 3027 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'small enchanted sapphire', objectId: 775 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'platinum amulet', objectId: 3055 },
          { name: 'stone skin amulet', objectId: 3081 },
          { name: 'time ring', objectId: 3053 },
          { name: 'troll green', objectId: 3741 },
          { name: 'werewolf fur', objectId: 10317 },
          { name: 'wolf paw', objectId: 5897 },
          { name: 'wolf trophy', objectId: 2671 }
        ],
        rare: [
          { name: 'bonebreaker', objectId: 7428 },
          { name: 'dreaded cleaver', objectId: 7419 },
          { name: 'werewolf amulet', objectId: 22060 },
          { name: 'sai', objectId: 50183 },
          { name: 'silver token', objectId: 22516 },
          { name: 'wolf backpack', objectId: 22084 }
        ]
      }
    },
    {
      id: 'bloodback',
      name: 'Bloodback',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 7800,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/5/56/Bloodback.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 40, kind: 'resistente' },
        { element: 'fire', value: -5, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'great health potion', objectId: 239 },
          { name: 'red crystal fragment', objectId: 16126 },
          { name: 'small enchanted ruby', objectId: 776 },
          { name: 'furry club', objectId: 7432 },
          { name: 'red gem', objectId: 3039 },
          { name: 'spiked squelcher', objectId: 7452 },
          { name: 'stone skin amulet', objectId: 3081 },
          { name: 'wereboar hooves', objectId: 22053 },
          { name: 'wereboar loincloth', objectId: 22087 },
          { name: 'wereboar tusks', objectId: 22054 }
        ],
        rare: [
          { name: 'dreaded cleaver', objectId: 7419 },
          { name: 'fur armor', objectId: 22085 },
          { name: 'fur boots', objectId: 7457 },
          { name: 'wereboar trophy', objectId: 22095 },
          { name: 'silver token', objectId: 22516 },
          { name: 'wolf backpack', objectId: 22084 }
        ]
      }
    },
    {
      id: 'ghulosh',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot epaulette / unliving demonbone → Ghulosh.
      name: 'Ghulosh',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/e/e7/Ghulosh.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: -5, kind: 'fraco' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 20, kind: 'resistente' },
        { element: 'holy', value: -5, kind: 'fraco' },
        { element: 'death', value: 10, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'silver token', objectId: 22516 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'demon horn', objectId: 5954 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'red gem', objectId: 3039 },
          { name: 'stone skin amulet', objectId: 3081 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'wand of voodoo', objectId: 8094 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'solid rage', objectId: 23517 },
          { name: 'slightly rusted helmet', objectId: 8908 }
        ],
        uncommon: [{ name: 'slightly rusted shield', objectId: 8902 }],
        semiRare: [
          { name: 'gold token', objectId: 22721 },
          { name: "butcher's axe", objectId: 7412 },
          { name: 'dreaded cleaver', objectId: 7419 },
          { name: 'mercenary sword', objectId: 7386 }
        ],
        rare: [
          { name: 'epaulette', objectId: 28793 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'unliving demonbone', objectId: 28831 }
        ]
      }
    },
    {
      id: 'lokathmor',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot sturdy book + resists Earth/Energy fracos → Lokathmor.
      name: 'Lokathmor',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/fb/Lokathmor.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -5, kind: 'fraco' },
        { element: 'earth', value: -15, kind: 'fraco' },
        { element: 'fire', value: 30, kind: 'resistente' },
        { element: 'ice', value: 10, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'demon horn', objectId: 5954 },
          { name: 'demonic essence', objectId: 6499 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'green gem', objectId: 3038 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'stone skin amulet', objectId: 3081 },
          { name: 'silver token', objectId: 22516 },
          { name: 'blue robe', objectId: 3567 },
          { name: 'dreaded cleaver', objectId: 7419 },
          { name: 'slightly rusted shield', objectId: 8902 },
          { name: 'wand of inferno', objectId: 3071 }
        ],
        semiRare: [{ name: 'sturdy book', objectId: 28792 }]
      }
    },
    {
      id: 'mazzinor',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot energy (frozen lightning, lightning boots) + sinister book + wand of dimensions → Mazzinor.
      name: 'Mazzinor',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/f7/Mazzinor.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'demon horn', objectId: 5954 },
          { name: 'lightning boots', objectId: 820 },
          { name: 'red gem', objectId: 3039 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'stone skin amulet', objectId: 3081 },
          { name: 'wand of starstorm', objectId: 8092 },
          { name: 'gold token', objectId: 22721 },
          { name: 'assassin dagger', objectId: 7404 },
          { name: 'crystalline armor', objectId: 8050 },
          { name: 'dreaded cleaver', objectId: 7419 },
          { name: 'frozen lightning', objectId: 23519 }
        ],
        semiRare: [{ name: 'sinister book', objectId: 27932 }],
        rare: [{ name: 'wand of dimensions', objectId: 12603 }]
      }
    },
    {
      id: 'prince_drazzak',
      // Nome revelado na grid da cyclopedia: Prince Drazzak (detail ainda podia mostrar store-name "?").
      name: 'Prince Drazzak',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 495000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/0/0c/Prince_Drazzak.gif',
      resistances: [
        { element: 'physical', value: 35, kind: 'resistente' },
        { element: 'energy', value: 35, kind: 'resistente' },
        { element: 'earth', value: 35, kind: 'resistente' },
        { element: 'fire', value: 35, kind: 'resistente' },
        { element: 'ice', value: 35, kind: 'resistente' },
        { element: 'holy', value: 35, kind: 'resistente' },
        { element: 'death', value: 35, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'dream matter', objectId: 20063 },
          { name: 'cluster of solace', objectId: 20062 },
          { name: 'unrealized dream', objectId: 20264 },
          { name: 'demonic essence', objectId: 6499 },
          { name: 'demon horn', objectId: 5954 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'eye pod', objectId: 20279 },
          { name: 'psychedelic tapestry', objectId: 20277 },
          { name: 'demonic tapestry', objectId: 20278 }
        ],
        uncommon: [
          { name: 'dream warden mask', objectId: 20276 },
          { name: 'giant shimmering pearl', objectId: 282 }
        ],
        semiRare: [
          { name: 'nightmare horn', objectId: 20274 },
          { name: 'skull helmet', objectId: 5741 },
          { name: 'runed sword', objectId: 7417 },
          { name: 'nightmare blade', objectId: 7418 },
          { name: 'lightning boots', objectId: 820 }
        ]
      }
    },
    {
      id: 'utua_stone_sting',
      name: 'Utua Stone Sting',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 9600,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/e/e8/Utua_Stone_Sting.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 40, kind: 'resistente' },
        { element: 'fire', value: 25, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'scorpion tail', objectId: 9651 }
        ],
        uncommon: [
          { name: 'emerald bangle', objectId: 3010 },
          { name: 'coral brooch', objectId: 24391 },
          { name: 'lightning legs', objectId: 822 }
        ],
        semiRare: [
          { name: "utua's poison", objectId: 34101 },
          { name: 'gemmed figurine', objectId: 24392 },
          { name: 'skull helmet', objectId: 5741 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'chaos mace', objectId: 7427 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'green gem', objectId: 3038 },
          { name: 'crystal mace', objectId: 3333 },
          { name: 'magma legs', objectId: 821 },
          { name: 'mercenary sword', objectId: 7386 },
          { name: "warrior's axe", objectId: 14040 },
          { name: 'glacier kilt', objectId: 823 },
          { name: 'noble axe', objectId: 7456 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'ring of green plasma', objectId: 23531 }
        ],
        rare: [
          { name: 'fist on a stick', objectId: 12546 },
          { name: 'guardian axe', objectId: 14043 },
          { name: 'magic plate armor', objectId: 3366 },
          { name: "spellweaver's robe", objectId: 10438 },
          { name: 'demon shield', objectId: 3420 },
          { name: 'glacier robe', objectId: 824 },
          { name: 'raw watermelon tourmaline', objectId: 33778 },
          { name: 'red silk flower', objectId: 34258 }
        ]
      }
    },
    {
      id: 'the_blazing_rose',
      name: 'The Blazing Rose',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 15000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/0/0b/The_Blazing_Rose.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 20, kind: 'resistente' },
        { element: 'earth', value: 20, kind: 'resistente' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'supreme health potion', objectId: 23375 }
        ],
        uncommon: [
          { name: 'fiery heart', objectId: 9636 },
          { name: 'red gem', objectId: 3039 }
        ],
        semiRare: [
          { name: 'magma coat', objectId: 826 },
          { name: 'fire sword', objectId: 3280 },
          { name: 'magma amulet', objectId: 817 }
        ],
        rare: [{ name: 'library ticket', objectId: 28791 }]
      }
    },
    {
      id: 'bonelords_phylactery',
      // Nome revelado na grid da cyclopedia: Bonelord's Phylactery.
      name: "Bonelord's Phylactery",
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 750000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/0/0d/Bone_Overlord.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'red gem', objectId: 3039 },
          { name: 'small flask of eyedrops', objectId: 11512 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'yellow gem', objectId: 3037 }
        ],
        uncommon: [
          { name: 'bonelord eye', objectId: 5898 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'death ring', objectId: 6299 },
          { name: 'haunted blade', objectId: 7407 },
          { name: 'soul trap', objectId: 52714 },
          { name: 'unholy bone', objectId: 10316 },
          { name: 'skull tendril', objectId: 52715 }
        ],
        semiRare: [{ name: 'necromantic crypt rune', objectId: 52661 }]
      }
    },
    {
      id: 'ahau',
      name: 'Ahau',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 13500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/2/2b/Ahau.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 5, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'the living idol of tukh', objectId: 40578 },
          { name: 'rotten feather', objectId: 40527 },
          { name: 'great health potion', objectId: 239 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'ritual tooth', objectId: 40528 }
        ],
        uncommon: [
          { name: 'diamond', objectId: 32770 },
          { name: 'amber', objectId: 32626 }
        ],
        semiRare: [
          { name: 'amber with a bug', objectId: 32624 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'ring of green plasma', objectId: 23531 },
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'collar of red plasma', objectId: 23544 },
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'collar of green plasma', objectId: 23543 },
          { name: 'broken iks headpiece', objectId: 40532 },
          { name: 'broken macuahuitl', objectId: 40530 },
          { name: 'broken iks faulds', objectId: 40531 },
          { name: 'broken iks cuirass', objectId: 40533 }
        ]
      }
    },
    {
      id: 'the_last_lore_keeper',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot forbidden tome / key to knowledge / hammer of prophecy / umbral hammer → The Last Lore Keeper.
      name: 'The Last Lore Keeper',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 1125000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/3/33/The_Last_Lore_Keeper.gif',
      resistances: [
        { element: 'physical', value: 20, kind: 'resistente' },
        { element: 'energy', value: 20, kind: 'resistente' },
        { element: 'earth', value: 20, kind: 'resistente' },
        { element: 'fire', value: 20, kind: 'resistente' },
        { element: 'ice', value: 20, kind: 'resistente' },
        { element: 'holy', value: 20, kind: 'resistente' },
        { element: 'death', value: 20, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'great mana potion', objectId: 238 }
        ],
        uncommon: [
          { name: 'silver token', objectId: 22516 },
          { name: 'red gem', objectId: 3039 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'green gem', objectId: 3038 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'enchanted chicken wing', objectId: 5891 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'sapphire hammer', objectId: 7437 }
        ],
        semiRare: [
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'gold token', objectId: 22721 },
          { name: 'white piece of cloth', objectId: 5909 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'iron ore', objectId: 5880 },
          { name: 'ancient stone', objectId: 9632 },
          { name: 'golden armor', objectId: 3360 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'mystical hourglass', objectId: 9660 },
          { name: 'piece of royal steel', objectId: 5887 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'opal', objectId: 22194 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'spellscroll of prophecies', objectId: 8076 },
          { name: 'supreme health potion', objectId: 23375 }
        ],
        rare: [
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'hammer of prophecy', objectId: 7450 },
          { name: 'crude umbral hammer', objectId: 20079 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'silkweaver bow', objectId: 8029 },
          { name: 'voltage armor', objectId: 8051 },
          { name: 'bonelord shield', objectId: 3418 },
          { name: 'nightmare blade', objectId: 7418 },
          { name: 'crystalline sword', objectId: 16160 },
          { name: 'soul stone', objectId: 5809 },
          { name: 'forbidden tome', objectId: 24971 },
          { name: 'key to knowledge', objectId: 24972 },
          { name: 'umbral hammer', objectId: 20080 },
          { name: 'part of a rune', objectId: 24954 }
        ]
      }
    },
    {
      id: 'the_lily_of_night',
      name: 'The Lily of Night',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 28500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/e/ec/The_Lily_Of_Night.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'violet gem', objectId: 3036 },
          { name: 'demonic essence', objectId: 6499 }
        ],
        semiRare: [
          { name: 'skull staff', objectId: 3321 },
          { name: 'gloom wolf fur', objectId: 22007 }
        ],
        rare: [
          { name: 'death oyoroi', objectId: 50260 },
          { name: 'library ticket', objectId: 28791 }
        ]
      }
    },
    {
      id: 'the_scourge_of_oblivion',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot spark sphere / calamity / library ticket / instable proto matter → The Scourge of Oblivion.
      name: 'The Scourge of Oblivion',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 1200000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/4/43/The_Scourge_of_Oblivion.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'instable proto matter', objectId: 23516 },
          { name: 'plasmatic lightning', objectId: 23520 },
          { name: 'emerald bangle', objectId: 3010 },
          { name: 'royal star', objectId: 25759 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'silver token', objectId: 22516 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'red gem', objectId: 3039 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'gold token', objectId: 22721 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'green gem', objectId: 3038 },
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'huge chunk of crude iron', objectId: 5892 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'ring of the sky', objectId: 3006 },
          { name: 'spark sphere', objectId: 23518 }
        ],
        uncommon: [
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'rift shield', objectId: 22726 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'arcane staff', objectId: 3341 },
          { name: 'skullcracker armor', objectId: 8061 },
          { name: 'chaos mace', objectId: 7427 },
          { name: "cat's paw", objectId: 5479 },
          { name: 'piggy bank', objectId: 2995 },
          { name: 'mysterious remains', objectId: 23509 },
          { name: 'energy bar', objectId: 23535 }
        ],
        rare: [
          { name: 'library ticket', objectId: 28791 },
          { name: 'calamity', objectId: 8104 }
        ]
      }
    },
    {
      id: 'the_diamond_blossom',
      name: 'The Diamond Blossom',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 30000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/3/33/The_Diamond_Blossom.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 }
        ],
        uncommon: [
          { name: 'blue gem', objectId: 3041 },
          { name: 'white gem', objectId: 32769 }
        ],
        semiRare: [
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'crystalline sword', objectId: 16160 },
          { name: 'crystal mace', objectId: 3333 }
        ],
        rare: [{ name: 'library ticket', objectId: 28791 }]
      }
    },
    {
      id: 'ferumbras_mortal_shell',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot ferumbras' hat / staff / amulet / mana keg / boots of homecoming / scroll of ascension → Ferumbras Mortal Shell.
      name: 'Ferumbras Mortal Shell',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/f1/Ferumbras_Mortal_Shell.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 65, kind: 'resistente' },
        { element: 'earth', value: 65, kind: 'resistente' },
        { element: 'fire', value: 65, kind: 'resistente' },
        { element: 'ice', value: 65, kind: 'resistente' },
        { element: 'holy', value: 65, kind: 'resistente' },
        { element: 'death', value: 65, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'silver token', objectId: 22516 }
        ],
        uncommon: [
          { name: 'small sapphire', objectId: 3029 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'white pearl', objectId: 3026 },
          { name: 'black pearl', objectId: 3027 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'small topaz', objectId: 9057 }
        ],
        semiRare: [
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'red gem', objectId: 3039 },
          { name: 'emerald bangle', objectId: 3010 },
          { name: 'rift tapestry', objectId: 22731 },
          { name: 'green gem', objectId: 3038 },
          { name: 'folded rift carpet', objectId: 22737 }
        ],
        rare: [
          { name: "ferumbras' hat", objectId: 5903 },
          { name: 'mysterious scroll', objectId: 22865 },
          { name: 'lightning legs', objectId: 822 },
          { name: 'greenwood coat', objectId: 8041 },
          { name: 'bloody edge', objectId: 7416 },
          { name: 'chaos mace', objectId: 7427 },
          { name: 'golden armor', objectId: 3360 },
          { name: 'emerald sword', objectId: 8102 },
          { name: 'boots of homecoming', objectId: 22773 },
          { name: 'velvet mantle', objectId: 8040 },
          { name: 'skullcrusher', objectId: 7423 },
          { name: "ferumbras' staff", objectId: 22764 },
          { name: 'jade hammer', objectId: 7422 },
          { name: 'nightmare blade', objectId: 7418 },
          { name: 'phoenix shield', objectId: 3439 },
          { name: 'demon shield', objectId: 3420 },
          { name: 'glacier kilt', objectId: 823 },
          { name: 'magic plate armor', objectId: 3366 },
          { name: 'death gaze', objectId: 22758 },
          { name: 'berserker', objectId: 7403 },
          { name: 'rift bow', objectId: 22866 },
          { name: 'demonwing axe', objectId: 8098 },
          { name: "queen's sceptre", objectId: 7410 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'obsidian truncheon', objectId: 8100 },
          { name: 'abyss hammer', objectId: 7414 },
          { name: "ferumbras' mana keg", objectId: 22769 },
          { name: 'demonrage sword', objectId: 7382 },
          { name: 'mastermind shield', objectId: 3414 },
          { name: 'impaler', objectId: 7435 },
          { name: 'scroll of ascension', objectId: 22771 },
          { name: "ferumbras' amulet", objectId: 22767 },
          { name: 'rift crossbow', objectId: 22867 },
          { name: 'divine plate', objectId: 8057 },
          { name: 'great axe', objectId: 3303 },
          { name: 'great shield', objectId: 3422 },
          { name: 'magma legs', objectId: 821 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'havoc blade', objectId: 7405 },
          { name: 'ornamented axe', objectId: 7411 }
        ]
      }
    },
    {
      id: 'neferi_the_spy',
      name: 'Neferi the Spy',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 42000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/b/bf/Neferi_The_Spy.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: -10, kind: 'fraco' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 20, kind: 'resistente' }
      ],
      drops: {
        semiRare: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'terra rod', objectId: 21886 },
          { name: 'dagger', objectId: 3267 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'gold ingot', objectId: 9058 }
        ],
        rare: [
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'fire sword', objectId: 3280 },
          { name: 'terra boots', objectId: 813 },
          { name: 'hailstorm rod', objectId: 3067 },
          { name: 'lightning headband', objectId: 828 },
          { name: 'terra hood', objectId: 830 },
          { name: 'knight axe', objectId: 3318 },
          { name: 'lightning legs', objectId: 822 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'spellbook of warding', objectId: 8073 },
          { name: 'glacier shoes', objectId: 819 },
          { name: 'knight armor', objectId: 3370 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'glacier mask', objectId: 829 },
          { name: 'sea horse figurine', objectId: 31323 },
          { name: 'stealth ring', objectId: 3049 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'golden mask', objectId: 31324 },
          { name: 'tagralt-inlaid scabbard', objectId: 37002 },
          { name: 'eye-embroidered veil', objectId: 37003 }
        ]
      }
    },
    {
      id: 'irgix_the_flimsy',
      name: 'Irgix The Flimsy',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 36000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/1/1f/Irgix_the_Flimsy.gif',
      resistances: [
        { element: 'physical', value: 50, kind: 'resistente' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 80, kind: 'resistente' },
        { element: 'fire', value: 50, kind: 'resistente' },
        { element: 'ice', value: 50, kind: 'resistente' },
        { element: 'holy', value: 50, kind: 'resistente' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'skull coin', objectId: 32583 },
          { name: 'white gem', objectId: 32769 }
        ],
        uncommon: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'terra rod', objectId: 21886 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'red gem', objectId: 3039 }
        ],
        semiRare: [
          { name: 'silver hand mirror', objectId: 32772 },
          { name: 'necklace of the deep', objectId: 13990 },
          { name: 'wand of starstorm', objectId: 8092 },
          { name: 'wand of cosmic energy', objectId: 3073 },
          { name: 'death toll', objectId: 32703 }
        ],
        rare: [
          { name: 'diamond', objectId: 32770 },
          { name: 'pair of nightmare boots', objectId: 32619 }
        ]
      }
    },
    {
      id: 'sister_hetai',
      name: 'Sister Hetai',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 37500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/2/27/Sister_Hetai.gif',
      resistances: [
        { element: 'physical', value: 5, kind: 'resistente' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 10, kind: 'resistente' },
        { element: 'ice', value: -25, kind: 'fraco' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        uncommon: [{ name: 'dagger', objectId: 3267 }],
        semiRare: [{ name: 'crystal coin', objectId: 3043 }],
        rare: [
          { name: 'sacred tree amulet', objectId: 9302 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'lightning headband', objectId: 828 },
          { name: 'underworld rod', objectId: 8082 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'wand of cosmic energy', objectId: 3073 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'rainbow quartz', objectId: 25737 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'wand of inferno', objectId: 3071 },
          { name: 'knight armor', objectId: 3370 },
          { name: 'lightning pendant', objectId: 788 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'focus cape', objectId: 8043 },
          { name: 'magma coat', objectId: 826 },
          { name: 'ring of healing', objectId: 3098 },
          { name: 'wand of starstorm', objectId: 8092 },
          { name: 'magma boots', objectId: 818 },
          { name: 'metal spats', objectId: 21169 },
          { name: "warrior's shield", objectId: 14042 },
          { name: 'dwarven ring', objectId: 3097 },
          { name: 'golden mask', objectId: 31324 },
          { name: 'terra hood', objectId: 830 },
          { name: 'ring of green plasma', objectId: 23531 },
          { name: 'terra boots', objectId: 813 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'lightning legs', objectId: 822 },
          { name: 'sea horse figurine', objectId: 31323 },
          { name: 'tagralt-inlaid scabbard', objectId: 37002 },
          { name: 'eye-embroidered veil', objectId: 37003 }
        ]
      }
    },
    {
      id: 'leiden',
      name: 'Leiden',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 45000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/0/0c/Leiden.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'energy bar', objectId: 23535 },
          { name: 'sacred tree amulet', objectId: 9302 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'gold token', objectId: 22721 },
          { name: 'green gem', objectId: 3038 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'silver token', objectId: 22516 }
        ],
        uncommon: [
          { name: 'small diamond', objectId: 3028 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'red gem', objectId: 3039 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'terra boots', objectId: 813 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'oriental shoes', objectId: 21981 },
          { name: 'wooden spellbook', objectId: 25699 },
          { name: 'mammoth fur cape', objectId: 7463 },
          { name: 'lightning legs', objectId: 822 },
          { name: 'terra mantle', objectId: 811 }
        ],
        semiRare: [
          { name: 'jade hat', objectId: 10451 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'cobra crown', objectId: 11674 },
          { name: 'soul orb', objectId: 5944 },
          { name: 'elven mail', objectId: 3399 },
          { name: 'elven legs', objectId: 3401 },
          { name: 'crystalline armor', objectId: 8050 }
        ],
        rare: [
          { name: 'boots of haste', objectId: 3079 },
          { name: 'spiritualist gem', objectId: 49372 },
          { name: 'blood of the mountain', objectId: 25361 }
        ]
      }
    },
    {
      id: 'amenef_the_burning',
      name: 'Amenef the Burning',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 39000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/fb/Amenef_The_Burning.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 10, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 15, kind: 'resistente' },
        { element: 'ice', value: -20, kind: 'fraco' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        semiRare: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'slightly rusted legs', objectId: 8899 },
          { name: 'slightly rusted armor', objectId: 8896 },
          { name: 'guardian halberd', objectId: 3315 }
        ],
        rare: [
          { name: 'dwarven ring', objectId: 3097 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'doublet', objectId: 3379 },
          { name: 'knight armor', objectId: 3370 },
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'epee', objectId: 3326 },
          { name: 'underworld rod', objectId: 8082 },
          { name: 'knight axe', objectId: 3318 },
          { name: 'springsprout rod', objectId: 8084 },
          { name: 'wand of cosmic energy', objectId: 3073 },
          { name: 'wand of inferno', objectId: 3071 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'spellbook of warding', objectId: 8073 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'wand of starstorm', objectId: 8092 },
          { name: 'amber staff', objectId: 7426 },
          { name: 'assassin dagger', objectId: 7404 },
          { name: 'blue gem', objectId: 3041 },
          { name: "warrior's axe", objectId: 14040 },
          { name: 'focus cape', objectId: 8043 },
          { name: 'noble axe', objectId: 7456 },
          { name: 'sacred tree amulet', objectId: 9302 },
          { name: 'golden mask', objectId: 31324 },
          { name: 'mercenary sword', objectId: 7386 },
          { name: 'tagralt-inlaid scabbard', objectId: 37002 },
          { name: 'eye-embroidered veil', objectId: 37003 }
        ]
      }
    },
    {
      id: 'unaz_the_mean',
      name: 'Unaz the Mean',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 42000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/6/6e/Unaz_the_Mean.gif',
      resistances: [
        { element: 'physical', value: 50, kind: 'resistente' },
        { element: 'energy', value: 50, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: -10, kind: 'fraco' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        uncommon: [{ name: 'platinum coin', objectId: 3035 }],
        semiRare: [
          { name: 'ivory comb', objectId: 32773 },
          { name: 'skull coin', objectId: 32583 },
          { name: 'moonstone', objectId: 32771 },
          { name: 'pair of nightmare boots', objectId: 32619 }
        ],
        rare: [
          { name: 'diamond', objectId: 32770 },
          { name: 'machete', objectId: 3308 },
          { name: 'skull staff', objectId: 3321 },
          { name: "warrior's axe", objectId: 14040 },
          { name: 'death toll', objectId: 32703 },
          { name: 'silver hand mirror', objectId: 32772 },
          { name: 'red gem', objectId: 3039 }
        ]
      }
    },
    {
      id: 'megasylvan_yselda',
      name: 'Megasylvan Yselda',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 525000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/6/6b/Megasylvan_Yselda.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: -10, kind: 'fraco' },
        { element: 'fire', value: -15, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'yellow gem', objectId: 3037 }
        ],
        uncommon: [
          { name: 'amber with a bug', objectId: 32624 },
          { name: 'giant topaz', objectId: 0 }
        ],
        semiRare: [{ name: 'amber crusher', objectId: 46628 }],
        rare: [
          { name: 'amber axe', objectId: 0 },
          { name: 'amber greataxe', objectId: 0 },
          { name: 'amber slayer', objectId: 0 },
          { name: 'amber sabre', objectId: 0 },
          { name: 'amber cudgel', objectId: 0 },
          { name: 'amber bludgeon', objectId: 0 },
          { name: 'amber bow', objectId: 0 },
          { name: 'amber crossbow', objectId: 0 },
          { name: 'amber wand', objectId: 0 },
          { name: 'amber rod', objectId: 0 },
          { name: 'petrified leaf', objectId: 48515 },
          { name: 'strange inedible fruit', objectId: 48514 }
        ]
      }
    },
    {
      id: 'vok_the_freakish',
      name: 'Vok the Freakish',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 48000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/4/4b/Vok_the_Freakish.gif',
      resistances: [
        { element: 'physical', value: 50, kind: 'resistente' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: -10, kind: 'fraco' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'cursed bone', objectId: 32774 },
          { name: 'skull coin', objectId: 32583 },
          { name: 'white gem', objectId: 32769 },
          { name: 'moonstone', objectId: 32771 },
          { name: 'gemmed figurine', objectId: 24392 }
        ],
        uncommon: [{ name: 'ornate crossbow', objectId: 14247 }],
        semiRare: [{ name: 'pair of nightmare boots', objectId: 32619 }],
        rare: [
          { name: 'silver hand mirror', objectId: 32772 },
          { name: 'death toll', objectId: 32703 }
        ]
      }
    },
    {
      id: 'tanjis',
      name: 'Tanjis',
      rarity: 'bane',
      rarityLabel: 'Bane',
      hp: 45000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/6/67/Tanjis.gif',
      resistances: [
        { element: 'physical', value: -1, kind: 'fraco' },
        { element: 'energy', value: 10, kind: 'resistente' },
        { element: 'earth', value: -5, kind: 'fraco' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        semiRare: [
          { name: 'depth ocrea', objectId: 13996 },
          { name: 'ornate mace', objectId: 14001 },
          { name: 'ornate shield', objectId: 14000 }
        ]
      }
    },
    {
      id: 'kusuma',
      name: 'Kusuma',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 82500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/c/c0/Kusuma.gif',
      resistances: [
        { element: 'physical', value: 50, kind: 'resistente' },
        { element: 'energy', value: 50, kind: 'resistente' },
        { element: 'earth', value: 50, kind: 'resistente' },
        { element: 'fire', value: 50, kind: 'resistente' },
        { element: 'ice', value: 50, kind: 'resistente' },
        { element: 'holy', value: 50, kind: 'resistente' },
        { element: 'death', value: 40, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'soul orb', objectId: 5944 },
          { name: 'demonic essence', objectId: 6499 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'flask of demonic blood', objectId: 6558 },
          { name: 'peacock feather fan', objectId: 21975 },
          { name: 'golden lotus brooch', objectId: 21974 },
          { name: 'muck rod', objectId: 16117 },
          { name: 'white pearl', objectId: 3026 },
          { name: 'green gem', objectId: 3038 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'swamplair armor', objectId: 8052 }
        ],
        uncommon: [
          { name: 'giant emerald', objectId: 32623 },
          { name: 'oriental shoes', objectId: 21981 }
        ],
        semiRare: [
          { name: 'green piece of cloth', objectId: 5910 },
          { name: 'snakebite rod', objectId: 2181 },
          { name: 'leaf star', objectId: 25735 },
          { name: 'necrotic rod', objectId: 3069 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'terra hood', objectId: 830 }
        ]
      }
    },
    {
      id: 'obujos',
      name: 'Obujos',
      rarity: 'bane',
      rarityLabel: 'Bane',
      hp: 52500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/0/01/Obujos.gif',
      resistances: [
        { element: 'physical', value: 25, kind: 'resistente' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 60, kind: 'resistente' },
        { element: 'ice', value: 20, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 60, kind: 'resistente' }
      ],
      drops: {
        semiRare: [
          { name: 'deepling axe', objectId: 13991 },
          { name: 'depth scutum', objectId: 13998 }
        ],
        rare: [{ name: 'ornate legs', objectId: 13999 }]
      }
    },
    {
      id: 'solid_frozen_horror',
      name: 'Solid Frozen Horror',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 105000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/5/57/Solid_Frozen_Horror.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -5, kind: 'fraco' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: -15, kind: 'fraco' },
        { element: 'ice', value: 100, kind: 'imune' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'gold token', objectId: 22721 },
          { name: 'silver token', objectId: 22516 },
          { name: 'spark sphere', objectId: 23518 }
        ],
        uncommon: [
          { name: 'frosty heart', objectId: 9661 },
          { name: 'ice cube', objectId: 7441 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'pair of earmuffs', objectId: 7459 },
          { name: 'instable proto matter', objectId: 23516 },
          { name: 'crystal mace', objectId: 3333 },
          { name: 'crystalline sword', objectId: 16160 }
        ],
        rare: [
          { name: 'ice rapier', objectId: 3284 },
          { name: 'crystal sword', objectId: 7449 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'shiny blade', objectId: 16175 },
          { name: 'ornate crossbow', objectId: 14247 },
          { name: 'frozen plate', objectId: 8059 },
          { name: 'runic ice shield', objectId: 19363 }
        ]
      }
    },
    {
      id: 'shulgrax',
      // Nome revelado na grid da cyclopedia: Shulgrax.
      name: 'Shulgrax',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 60000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/3/34/Shulgrax.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -10, kind: 'fraco' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: -10, kind: 'fraco' },
        { element: 'ice', value: 10, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'silver token', objectId: 22516 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'opal', objectId: 22194 },
          { name: 'orichalcum pearl', objectId: 5021 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate health potion', objectId: 7643 }
        ],
        uncommon: [
          { name: 'flask of demonic blood', objectId: 6558 },
          { name: 'white pearl', objectId: 3026 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'demonic essence', objectId: 6499 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'small topaz', objectId: 9057 }
        ],
        semiRare: [
          { name: 'demonbone amulet', objectId: 3019 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'green gem', objectId: 3038 },
          { name: 'red gem', objectId: 3039 },
          { name: 'death ring', objectId: 6299 },
          { name: 'bloody edge', objectId: 7416 },
          { name: 'dreaded cleaver', objectId: 7419 },
          { name: 'chaos mace', objectId: 7427 },
          { name: 'shadow sceptre', objectId: 7451 },
          { name: 'lightning pendant', objectId: 788 },
          { name: 'lightning legs', objectId: 822 }
        ],
        rare: [
          { name: 'magic plate armor', objectId: 3366 },
          { name: 'rift shield', objectId: 22726 },
          { name: 'rift lance', objectId: 22727 },
          { name: 'treader of torment', objectId: 22756 },
          { name: 'rift crossbow', objectId: 22867 }
        ]
      }
    },
    {
      id: 'dragonking_zyrtarch',
      // Nome revelado na grid: Dragonking Zyrtarch (typo corrigido).
      name: 'Dragonking Zyrtarch',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 225000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/f5/Dragonking_Zyrtarch.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 100, kind: 'imune' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'gold token', objectId: 22721 },
          { name: 'silver token', objectId: 22516 },
          { name: 'platinum coin', objectId: 3035 }
        ],
        uncommon: [
          { name: 'red dragon scale', objectId: 5882 },
          { name: 'red dragon leather', objectId: 5948 },
          { name: 'zaoan monk robe', objectId: 50259 }
        ],
        semiRare: [
          { name: 'yellow gem', objectId: 3037 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'red gem', objectId: 3039 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'green gem', objectId: 3038 },
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'small ruby', objectId: 3030 }
        ],
        rare: [
          { name: 'piece of draconian steel', objectId: 5889 },
          { name: 'crystal of power', objectId: 9067 },
          { name: 'shield of corruption', objectId: 11688 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'drachaku', objectId: 10391 },
          { name: 'modified crossbow', objectId: 8021 },
          { name: 'dragon scale helmet', objectId: 3400 },
          { name: 'piece of royal steel', objectId: 5887 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'spellbook of mind control', objectId: 8074 },
          { name: "snake god's sceptre", objectId: 11692 }
        ]
      }
    },
    {
      id: 'lloyd',
      name: 'Lloyd',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 96000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/d/dd/Lloyd.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 5, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 10, kind: 'resistente' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'ring of healing', objectId: 3098 },
          { name: 'wand of starstorm', objectId: 8092 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'luminous orb', objectId: 11454 },
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'gold token', objectId: 22721 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'rusted armor', objectId: 8895 },
          { name: 'red gem', objectId: 3039 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'silver token', objectId: 22516 },
          { name: 'small topaz', objectId: 9057 }
        ],
        uncommon: [
          { name: 'small ruby', objectId: 3030 },
          { name: 'spellbook of warding', objectId: 8073 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'white piece of cloth', objectId: 5909 },
          { name: 'piece of hell steel', objectId: 5888 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'green gem', objectId: 3038 },
          { name: 'lightning legs', objectId: 822 },
          { name: 'violet gem', objectId: 3036 },
          { name: "spellweaver's robe", objectId: 10438 },
          { name: 'demon helmet', objectId: 3387 }
        ],
        semiRare: [{ name: 'boots of haste', objectId: 3079 }],
        rare: [
          { name: 'pillow backpack', objectId: 24393 },
          { name: 'part of a rune', objectId: 24954 }
        ]
      }
    },
    {
      id: 'dragon_pack',
      // Posicao oficial #42. Dados do HTML da cyclopedia (herald / merudri / gold-scaled sentinel).
      name: 'Dragon Pack',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 75000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/9/95/Dragon_Pack.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -10, kind: 'fraco' },
        { element: 'earth', value: -10, kind: 'fraco' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: -10, kind: 'fraco' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'ice cube', objectId: 7441 },
          { name: 'life crystal', objectId: 3061 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'broadsword', objectId: 3301 },
          { name: 'demonic essence', objectId: 6499 },
          { name: 'white gem', objectId: 32769 }
        ],
        uncommon: [
          { name: 'divine plate', objectId: 8057 },
          // HTML vinha com data:image; ID padrão Tibia do dragonbone staff.
          { name: 'dragonbone staff', objectId: 7430 },
          { name: 'dragon scale mail', objectId: 3386 },
          { name: 'dragon shield', objectId: 3416 },
          { name: 'dragon slayer', objectId: 7402 },
          { name: 'drakinata', objectId: 10388 },
          { name: 'fire sword', objectId: 3280 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'giant amethyst', objectId: 0 },
          { name: 'giant emerald', objectId: 0 },
          { name: 'giant topaz', objectId: 0 },
          { name: 'guardian boots', objectId: 10323 },
          { name: 'jade hat', objectId: 10451 },
          { name: 'royal helmet', objectId: 3392 },
          { name: 'serpent sword', objectId: 3297 },
          { name: 'shard', objectId: 7290 },
          { name: "spellweaver's robe", objectId: 10438 },
          { name: 'strange helmet', objectId: 3373 },
          { name: 'tower shield', objectId: 3428 },
          { name: 'wand of inferno', objectId: 3071 },
          { name: 'zaoan helmet', objectId: 10385 }
        ],
        semiRare: [
          { name: 'crystallized blood', objectId: 44752 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'exalted seal', objectId: 0 },
          { name: 'gold-scaled sentinel', objectId: 44751 }
        ],
        rare: [
          { name: 'arcane dragon robe', objectId: 44623 },
          { name: 'dauntless dragon scale armor', objectId: 44621 },
          { name: "herald's insignia", objectId: 44753 },
          { name: "herald's wings", objectId: 44754 },
          { name: 'merudri battle mail', objectId: 50264 },
          { name: 'mystical dragon robe', objectId: 44624 },
          { name: 'unerring dragon scale armor', objectId: 44622 }
        ]
      }
    },
    {
      id: 'drume',
      // Nome revelado na grid da cyclopedia: Drume.
      name: 'Drume',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 112500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/f2/Drume.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 10, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 10, kind: 'resistente' },
        { element: 'ice', value: 10, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 10, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'berserk potion', objectId: 7439 }
        ],
        uncommon: [
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'naga basin', objectId: 39401 },
          { name: "piece of timira's sensors", objectId: 39400 },
          { name: 'giant amethyst', objectId: 32624 }
        ],
        semiRare: [
          { name: 'giant ruby', objectId: 32621 },
          { name: 'giant emerald', objectId: 32623 },
          { name: "one of timira's many heads", objectId: 39399 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant topaz', objectId: 32620 }
        ],
        rare: [
          { name: 'dawnfire sherwani', objectId: 39164 },
          { name: 'frostflower boots', objectId: 39158 },
          { name: 'feverbloom boots', objectId: 39161 },
          { name: 'enchanted turtle amulet', objectId: 39233 },
          { name: 'midnight tunic', objectId: 39165 },
          { name: 'midnight sarong', objectId: 39167 },
          { name: 'naga quiver', objectId: 39160 },
          { name: 'naga sword', objectId: 39155 },
          { name: 'naga axe', objectId: 39156 },
          { name: 'naga club', objectId: 39157 },
          { name: 'naga wand', objectId: 39162 },
          { name: 'naga rod', objectId: 39163 },
          { name: 'naga crossbow', objectId: 39159 },
          { name: 'naga tanko', objectId: 50262 }
        ]
      }
    },
    {
      id: 'vladrukh',
      // Nome revelado na grid da cyclopedia: Vladrukh.
      name: 'Vladrukh',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 120000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/9/9e/Vladrukh.gif',
      resistances: [
        { element: 'physical', value: 35, kind: 'resistente' },
        { element: 'energy', value: -20, kind: 'fraco' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: -20, kind: 'fraco' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'energy bar', objectId: 23535 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'red gem', objectId: 3039 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'royal star', objectId: 25759 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'blue gem', objectId: 3041 }
        ],
        uncommon: [
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'green gem', objectId: 3038 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'terra rod', objectId: 21886 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'stone skin amulet', objectId: 3081 },
          { name: 'silver token', objectId: 22516 },
          { name: 'terra legs', objectId: 812 },
          { name: 'terra mantle', objectId: 811 },
          { name: 'raw watermelon tourmaline', objectId: 33778 },
          { name: 'wand of voodoo', objectId: 8094 },
          { name: 'violet gem', objectId: 3036 }
        ],
        semiRare: [
          { name: 'terra hood', objectId: 830 },
          { name: 'terra amulet', objectId: 814 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'underworld rod', objectId: 8082 }
        ],
        rare: [
          { name: 'lion spangenhelm', objectId: 34156 },
          { name: 'lion plate', objectId: 34157 },
          { name: 'lion shield', objectId: 34154 },
          { name: 'lion longsword', objectId: 34155 },
          { name: 'lion hammer', objectId: 34254 },
          { name: 'lion axe', objectId: 34253 },
          { name: 'lion longbow', objectId: 34150 },
          { name: 'lion spellbook', objectId: 34153 },
          { name: 'lion wand', objectId: 34152 },
          { name: 'lion amulet', objectId: 34158 },
          { name: 'lion rod', objectId: 34151 }
        ]
      }
    },
    {
      id: 'mounted_thorn_knight',
      // Nome revelado na grid da cyclopedia: Mounted Thorn Knight.
      name: 'Mounted Thorn Knight',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 375000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/d/dd/The_Enraged_Thorn_Knight.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        uncommon: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'blood preservation', objectId: 11449 },
          { name: 'supreme health potion', objectId: 23375 }
        ],
        semiRare: [
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'strong mana potion', objectId: 237 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'skull belt', objectId: 11480 },
          { name: 'blood sceptre', objectId: 51482 },
          { name: 'blood crown', objectId: 51483 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'norcferatu bloodhide', objectId: 51263 },
          { name: 'norcferatu bloodstrider', objectId: 51266 },
          { name: 'norcferatu bonecloak', objectId: 51264 },
          { name: 'norcferatu bonehood', objectId: 51261 },
          { name: 'norcferatu goretrampers', objectId: 51268 },
          { name: 'norcferatu tuskplate', objectId: 51262 },
          { name: 'norcferatu skullguard', objectId: 51260 },
          { name: 'norcferatu thornwraps', objectId: 51265 },
          { name: 'red gem', objectId: 3039 },
          { name: 'yellow gem', objectId: 3037 }
        ],
        rare: [{ name: 'greater proficiency catalyst', objectId: 51589 }]
      }
    },
    {
      id: 'foreshock',
      // Nome revelado na grid da cyclopedia: Foreshock.
      name: 'Foreshock',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 150000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/1/12/Foreshock.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 50, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 40, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: -100, kind: 'fraco' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'bright sword', objectId: 3295 },
          { name: 'gold token', objectId: 22721 },
          { name: 'silver token', objectId: 22516 }
        ],
        uncommon: [
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'piece of royal steel', objectId: 5887 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'green gem', objectId: 3038 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'demonic essence', objectId: 6499 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'giant shimmering pearl', objectId: 282 }
        ],
        semiRare: [
          { name: 'red gem', objectId: 3039 },
          { name: 'medusa shield', objectId: 3436 },
          { name: 'sniper gloves', objectId: 5875 },
          { name: 'spirit container', objectId: 5884 }
        ],
        rare: [
          { name: 'executioner', objectId: 7453 },
          { name: 'forbidden fruit', objectId: 24966 },
          { name: 'mandrake', objectId: 5014 },
          { name: 'sacred tree amulet', objectId: 9302 },
          { name: 'swamplair armor', objectId: 8052 }
        ]
      }
    },
    {
      id: 'faceless_bane',
      // Nome revelado na grid da cyclopedia: Faceless Bane.
      name: 'Faceless Bane',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 157500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/a/a0/Faceless_Bane.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -20, kind: 'fraco' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: -20, kind: 'fraco' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'gold token', objectId: 22721 }
        ],
        uncommon: [
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'green gem', objectId: 3038 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'plasmatic lightning', objectId: 23520 }
        ],
        semiRare: [
          { name: 'tiara of power', objectId: 23474 },
          { name: 'void boots', objectId: 23476 },
          { name: 'crystalline sword', objectId: 16160 }
        ]
      }
    },
    {
      id: 'sir_nictros',
      // Nome revelado na grid da cyclopedia: Sir Nictros.
      name: 'Sir Nictros',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 52500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/7/73/Sir_Nictros.gif',
      resistances: [
        { element: 'physical', value: 50, kind: 'resistente' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: -20, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'dagger', objectId: 3267 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'terra rod', objectId: 21886 }
        ],
        uncommon: [
          { name: 'red gem', objectId: 3039 },
          { name: 'crowbar', objectId: 3304 },
          { name: 'cyan crystal fragment', objectId: 16125 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'green gem', objectId: 3038 },
          { name: 'hailstorm rod', objectId: 3067 },
          { name: 'ice rapier', objectId: 3284 },
          { name: 'knife', objectId: 3291 },
          { name: 'life crystal', objectId: 3061 },
          { name: 'moonlight rod', objectId: 3070 },
          { name: 'red crystal fragment', objectId: 16126 },
          { name: 'snakebite rod', objectId: 2181 },
          { name: 'spear', objectId: 3277 },
          { name: 'twin hooks', objectId: 10392 },
          { name: 'yellow gem', objectId: 3037 }
        ],
        semiRare: [
          { name: 'blue gem', objectId: 3041 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'necrotic rod', objectId: 3069 },
          { name: 'orb', objectId: 3060 },
          { name: 'strange talisman', objectId: 3045 },
          { name: 'underworld rod', objectId: 8082 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'lightning pendant', objectId: 788 },
          { name: 'book backpack', objectId: 28571 },
          { name: 'dream blossom staff', objectId: 25700 },
          { name: 'ectoplasmic shield', objectId: 29430 },
          { name: 'enchanted pendulet', objectId: 30344 },
          { name: 'spirit guide', objectId: 29431 }
        ],
        rare: [
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'hexagonal ruby', objectId: 30180 },
          { name: 'springsprout rod', objectId: 8084 },
          { name: 'wand of everblazing', objectId: 16115 }
        ]
      }
    },
    {
      id: 'jaul',
      // Nome revelado na grid da cyclopedia: Jaul.
      name: 'Jaul',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 225000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/8/84/Jaul.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 80, kind: 'resistente' },
        { element: 'fire', value: -10, kind: 'fraco' },
        { element: 'ice', value: 35, kind: 'resistente' },
        { element: 'holy', value: -10, kind: 'fraco' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'silver token', objectId: 22516 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'piece of draconian steel', objectId: 5889 },
          { name: 'red gem', objectId: 3039 },
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'collar of red plasma', objectId: 23544 },
          { name: 'knight legs', objectId: 3371 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'young lich worm', objectId: 31590 }
        ],
        semiRare: [
          { name: 'embrace of nature', objectId: 31579 },
          { name: 'signet ring', objectId: 31592 },
          { name: 'death oyoroi', objectId: 50260 }
        ],
        rare: [
          { name: 'terra helmet', objectId: 31577 },
          { name: 'final judgement', objectId: 31738 }
        ]
      }
    },
    {
      id: 'lord_retro',
      // Nome revelado na grid da cyclopedia: Lord Retro.
      name: 'Lord Retro',
      rarity: 'bane',
      rarityLabel: 'Bane',
      hp: 135000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/8/8c/Lord_Retro.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 1, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 15, kind: 'resistente' }
      ],
      drops: {
        semiRare: [
          { name: 'deepling axe', objectId: 13991 },
          { name: 'depth calcei', objectId: 13997 },
          { name: 'depth galea', objectId: 13995 },
          { name: 'ornate mace', objectId: 14001 },
          { name: 'ornate shield', objectId: 14000 }
        ],
        rare: [
          { name: 'depth lorica', objectId: 13994 },
          { name: 'ornate chestplate', objectId: 13993 },
          { name: 'ornate legs', objectId: 13999 }
        ]
      }
    },
    {
      id: 'timira_the_many_headed',
      // Nome revelado na grid da cyclopedia: Timira the Many-Headed.
      name: 'Timira the Many-Headed',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 120000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/e/eb/Timira_the_Many-Headed.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'giant amethyst', objectId: 32624 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'giant sapphire', objectId: 32622 }
        ],
        uncommon: [{ name: 'decorative plume', objectId: 37605 }],
        semiRare: [{ name: 'changing backpack', objectId: 37536 }],
        rare: [
          { name: 'wind-up loco', objectId: 37398 },
          { name: 'wind-up key', objectId: 37397 },
          { name: '25 years backpack', objectId: 39693 },
          { name: 'brass button', objectId: 37604 }
        ]
      }
    },
    {
      id: 'the_dread_maiden',
      // Nome revelado na grid da cyclopedia: The Dread Maiden.
      name: 'The Dread Maiden',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/d/d5/The_Dread_Maiden.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: -10, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'diamond', objectId: 32770 },
          { name: 'white gem', objectId: 32769 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'moonstone', objectId: 32771 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'silver hand mirror', objectId: 32772 },
          { name: 'supreme health potion', objectId: 23375 }
        ],
        uncommon: [
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'ivory comb', objectId: 32773 },
          { name: 'amber', objectId: 32626 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'death toll', objectId: 32703 }
        ],
        semiRare: [
          { name: 'angel figurine', objectId: 32589 },
          { name: 'cursed bone', objectId: 32774 },
          { name: 'dark bell', objectId: 30325 },
          { name: 'giant amethyst', objectId: 32624 },
          { name: 'jagged sickle', objectId: 32595 },
          { name: 'soulforged lantern', objectId: 32591 },
          { name: 'jade legs', objectId: 50185 }
        ],
        rare: [
          { name: 'pair of nightmare boots', objectId: 32619 },
          { name: 'ghost claw', objectId: 32631 },
          { name: 'spooky hood', objectId: 32630 }
        ]
      }
    },
    {
      id: 'lady_tenebris',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot shadow mask / shadow paint / book of lies / cluster of solace → Lady Tenebris.
      name: 'Lady Tenebris',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 225000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/a/a9/Lady_Tenebris.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 20, kind: 'resistente' },
        { element: 'fire', value: 5, kind: 'resistente' },
        { element: 'ice', value: 15, kind: 'resistente' },
        { element: 'holy', value: 1, kind: 'resistente' },
        { element: 'death', value: 60, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'gold token', objectId: 22721 },
          { name: 'silver token', objectId: 22516 }
        ],
        uncommon: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'cluster of solace', objectId: 20062 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'giant shimmering pearl', objectId: 282 }
        ],
        semiRare: [
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'cluster of solace', objectId: 20062 },
          { name: 'green gem', objectId: 3038 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'onyx pendant', objectId: 22195 },
          { name: 'red gem', objectId: 3039 },
          { name: 'ring of the sky', objectId: 3006 },
          { name: 'shadow sceptre', objectId: 7451 },
          { name: 'spellbook of lost souls', objectId: 8075 },
          { name: 'spellbook of warding', objectId: 8073 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'wand of defiance', objectId: 16096 }
        ],
        rare: [
          { name: 'arcane staff', objectId: 3341 },
          { name: 'shadow mask', objectId: 24973 },
          { name: 'shadow paint', objectId: 24974 },
          { name: 'book of lies', objectId: 22755 },
          { name: 'crude umbral spellbook', objectId: 20088 },
          { name: 'sapphire amulet', objectId: 3021 },
          { name: 'umbral spellbook', objectId: 20089 },
          { name: 'part of a rune', objectId: 24954 }
        ]
      }
    },
    {
      id: 'count_vlarkorth',
      // Nome revelado na grid da cyclopedia: Count Vlarkorth.
      name: 'Count Vlarkorth',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/c/c7/Count_Vlarkorth.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 5, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: -10, kind: 'fraco' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'silver token', objectId: 22516 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'collar of red plasma', objectId: 23544 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'green gem', objectId: 3038 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'red gem', objectId: 3039 },
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'ring of green plasma', objectId: 23531 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'young lich worm', objectId: 31590 }
        ],
        semiRare: [
          { name: 'bear skin', objectId: 31578 },
          { name: 'embrace of nature', objectId: 31579 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'medal of valiance', objectId: 31591 }
        ],
        rare: [
          { name: 'terra helmet', objectId: 31577 },
          { name: 'final judgement', objectId: 31738 }
        ]
      }
    },
    {
      id: 'duke_krule',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot noble amulet / rotten heart / bear skin → Duke Krule.
      name: 'Duke Krule',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 435000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/0/0e/Duke_Krule.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 20, kind: 'resistente' },
        { element: 'fire', value: -15, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 40, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'piece of draconian steel', objectId: 5889 },
          { name: 'green gem', objectId: 3038 },
          { name: 'silver token', objectId: 22516 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'crusader helmet', objectId: 3391 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'red gem', objectId: 3039 },
          { name: 'terra hood', objectId: 830 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'young lich worm', objectId: 31590 }
        ],
        semiRare: [
          { name: 'bear skin', objectId: 31578 },
          { name: 'noble amulet', objectId: 31595 },
          // HTML vinha com data:image (sem /api/things); 31593 no HTML é noble cape.
          { name: 'rotten heart', objectId: 31596 }
        ],
        rare: [
          { name: 'terra helmet', objectId: 31577 },
          { name: 'final judgement', objectId: 31738 }
        ]
      }
    },
    {
      id: 'the_brainstealer',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot brainstealer's tissue / brain / brainwave + set eldritch.
      name: 'The Brainstealer',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/0/05/The_Brainstealer.gif',
      resistances: [
        { element: 'physical', value: 10, kind: 'resistente' },
        { element: 'energy', value: 3, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 5, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'moonstone', objectId: 32771 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'white gem', objectId: 32769 }
        ],
        uncommon: [
          { name: "brainstealer's tissue", objectId: 36794 },
          { name: "brainstealer's brain", objectId: 36795 }
        ],
        semiRare: [
          // HTML vinha com data:image; ID sequencial Baiak junto de tissue/brain.
          { name: "brainstealer's brainwave", objectId: 36796 }
        ],
        rare: [
          { name: 'eldritch breeches', objectId: 36667 },
          { name: 'eldritch cowl', objectId: 36670 },
          { name: 'eldritch hood', objectId: 36671 },
          // HTML vinha com data:image; IDs no intervalo eldritch já usado no Baiak.
          { name: 'eldritch bow', objectId: 36664 },
          { name: 'eldritch quiver', objectId: 36666 },
          { name: 'eldritch claymore', objectId: 36657 },
          { name: 'eldritch greataxe', objectId: 36661 },
          { name: 'eldritch warmace', objectId: 36659 },
          { name: 'eldritch shield', objectId: 36656 },
          { name: 'eldritch cuirass', objectId: 36663 },
          { name: 'eldritch folio', objectId: 36672 },
          { name: 'eldritch tome', objectId: 36673 },
          { name: 'eldritch rod', objectId: 36674 },
          { name: 'eldritch wand', objectId: 36675 },
          { name: 'gilded eldritch claymore', objectId: 36658 },
          { name: 'gilded eldritch greataxe', objectId: 36662 },
          { name: 'gilded eldritch warmace', objectId: 36660 },
          { name: 'gilded eldritch wand', objectId: 36676 },
          { name: 'gilded eldritch rod', objectId: 36677 },
          { name: 'gilded eldritch bow', objectId: 36665 },
          { name: 'eldritch crystal', objectId: 36679 }
        ]
      }
    },
    {
      id: 'rupture',
      // Nome revelado na grid da cyclopedia: Rupture.
      name: 'Rupture',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 435000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/1/12/Rupture.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'odd organ', objectId: 23510 },
          { name: 'gold token', objectId: 22721 },
          { name: 'mysterious remains', objectId: 23509 }
        ],
        uncommon: [
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'energy bar', objectId: 23535 },
          { name: 'plasma pearls', objectId: 23506 },
          { name: 'green gem', objectId: 3038 },
          { name: 'chaos mace', objectId: 7427 }
        ],
        semiRare: [
          { name: 'ring of green plasma', objectId: 23531 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'tiara of power', objectId: 23474 },
          { name: 'void boots', objectId: 23476 }
        ]
      }
    },
    {
      id: 'earl_osam',
      // Nome revelado na grid da cyclopedia: Earl Osam.
      name: 'Earl Osam',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/d/de/Earl_Osam.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -5, kind: 'fraco' },
        { element: 'earth', value: 50, kind: 'resistente' },
        { element: 'fire', value: -10, kind: 'fraco' },
        { element: 'ice', value: 50, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'piece of draconian steel', objectId: 5889 },
          { name: 'red gem', objectId: 3039 },
          { name: 'silver token', objectId: 22516 },
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'collar of red plasma', objectId: 23544 },
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'warrior helmet', objectId: 3369 },
          { name: 'guardian axe', objectId: 14043 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'young lich worm', objectId: 31590 }
        ],
        semiRare: [
          { name: 'embrace of nature', objectId: 31579 },
          { name: 'token of love', objectId: 31594 },
          { name: 'rotten heart', objectId: 31596 }
        ],
        rare: [
          { name: 'terra helmet', objectId: 31577 },
          { name: 'final judgement', objectId: 31738 }
        ]
      }
    },
    {
      id: 'lord_azaram',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot noble cape / ancient liche bone / piece of hell steel.
      name: 'Lord Azaram',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/a/a6/Lord_Azaram.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: -10, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'piece of hell steel', objectId: 5888 },
          { name: 'red gem', objectId: 3039 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'silver token', objectId: 22516 },
          // HTML vinha com data:image.
          { name: 'ancient liche bone', objectId: 31588 },
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'collar of red plasma', objectId: 23544 },
          { name: 'collar of green plasma', objectId: 23543 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'haunted blade', objectId: 7407 },
          { name: 'knight armor', objectId: 3370 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'ring of green plasma', objectId: 23531 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'young lich worm', objectId: 31590 }
        ],
        semiRare: [
          { name: 'huge chunk of crude iron', objectId: 5892 },
          { name: 'bear skin', objectId: 31578 },
          { name: 'noble cape', objectId: 31593 }
        ],
        rare: [
          { name: 'terra helmet', objectId: 31577 },
          { name: 'final judgement', objectId: 31738 }
        ]
      }
    },
    {
      id: 'the_fear_feaster',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot grimace / bloody tears / ghost chestplate.
      name: 'The Fear Feaster',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/7/74/The_Fear_Feaster.gif',
      resistances: [
        { element: 'physical', value: -10, kind: 'fraco' },
        { element: 'energy', value: -10, kind: 'fraco' },
        { element: 'earth', value: 20, kind: 'resistente' },
        { element: 'fire', value: -10, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'white gem', objectId: 32769 },
          { name: 'moonstone', objectId: 32771 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'silver hand mirror', objectId: 32772 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'death toll', objectId: 32703 },
          { name: 'ivory comb', objectId: 32773 },
          { name: 'angel figurine', objectId: 32589 },
          { name: 'diamond', objectId: 32770 },
          { name: 'cursed bone', objectId: 32774 },
          { name: 'soulforged lantern', objectId: 32591 },
          { name: 'grimace', objectId: 32593 },
          { name: 'amber', objectId: 32626 }
        ],
        semiRare: [
          { name: 'amber with a dragonfly', objectId: 32625 },
          { name: 'ghost claw', objectId: 32631 },
          { name: 'bloody tears', objectId: 32594 },
          { name: 'ghost chestplate', objectId: 32628 }
        ],
        rare: [
          { name: 'spooky hood', objectId: 32630 }
        ]
      }
    },
    {
      id: 'the_unwelcome',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot soulful legs / fabulous legs + todas resistências +40%.
      name: 'The Unwelcome',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/b/bf/The_Unwelcome.gif',
      resistances: [
        { element: 'physical', value: 40, kind: 'resistente' },
        { element: 'energy', value: 40, kind: 'resistente' },
        { element: 'earth', value: 40, kind: 'resistente' },
        { element: 'fire', value: 40, kind: 'resistente' },
        { element: 'ice', value: 40, kind: 'resistente' },
        { element: 'holy', value: 40, kind: 'resistente' },
        { element: 'death', value: 40, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'white gem', objectId: 32769 },
          { name: 'moonstone', objectId: 32771 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'silver hand mirror', objectId: 32772 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'death toll', objectId: 32703 },
          { name: 'ivory comb', objectId: 32773 },
          { name: 'angel figurine', objectId: 32589 },
          { name: 'diamond', objectId: 32770 },
          { name: 'cursed bone', objectId: 32774 },
          { name: 'soulforged lantern', objectId: 32591 },
          { name: 'grimace', objectId: 32593 },
          { name: 'amber', objectId: 32626 }
        ],
        semiRare: [
          { name: 'amber with a dragonfly', objectId: 32625 },
          { name: 'bloody tears', objectId: 32594 },
          { name: 'soulful legs', objectId: 32618 },
          { name: 'fabulous legs', objectId: 32617 }
        ],
        rare: [
          { name: 'ghost claw', objectId: 32631 },
          { name: 'spooky hood', objectId: 32630 }
        ]
      }
    },
    {
      id: 'court_warlock',
      // Nome revelado na grid da cyclopedia: Court Warlock.
      name: 'Court Warlock',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 550500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/a/a9/Court_Warlock.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'red gem', objectId: 3039 },
          { name: 'strong mana potion', objectId: 237 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'death ring', objectId: 6299 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'mind stone', objectId: 3062 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'ultimate health potion', objectId: 7643 }
        ],
        uncommon: [
          { name: 'glacier mask', objectId: 829 },
          { name: 'magma monocle', objectId: 827 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'wooden spellbook', objectId: 25699 },
          { name: 'giant amethyst', objectId: 32624 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'lightning headband', objectId: 828 },
          { name: 'wand of defiance', objectId: 16096 }
        ],
        semiRare: [
          { name: 'broken staff of mind control', objectId: 52747 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'glacier robe', objectId: 824 },
          { name: 'might ring', objectId: 3048 },
          { name: 'spellbook of mind control', objectId: 8074 },
          { name: 'terra hood', objectId: 830 },
          { name: 'terra mantle', objectId: 811 },
          { name: 'magma coat', objectId: 826 },
          { name: 'twisted marionette', objectId: 52746 }
        ],
        rare: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'stag boots', objectId: 52353 },
          { name: 'stag footwraps', objectId: 52354 },
          { name: 'stag helmet', objectId: 52348 },
          { name: 'stag legs', objectId: 52351 },
          { name: 'stag plate', objectId: 52350 },
          { name: 'stag robe', objectId: 52349 },
          { name: 'stag scrolls', objectId: 52356 },
          { name: 'stag shinguards', objectId: 52352 },
          { name: 'stag shield', objectId: 52357 },
          { name: 'stag spellbook', objectId: 52355 }
        ]
      }
    },
    {
      id: 'fatal_bug',
      // Nome revelado na grid da cyclopedia: Fatal Bug.
      name: 'Fatal Bug',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 610500,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/7/79/Fatal_Bug.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'red gem', objectId: 3039 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'composite hornbow', objectId: 8027 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'transcendence potion', objectId: 49271 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'berserk potion', objectId: 7439 }
        ],
        uncommon: [
          { name: 'strong mana potion', objectId: 237 },
          { name: 'mercenary sword', objectId: 7386 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'wand of everblazing', objectId: 16115 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'traditional sai', objectId: 10389 }
        ],
        semiRare: [
          { name: 'muck rod', objectId: 16117 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'ring of red plasma', objectId: 23533 },
          // HTML vinha com data:image.
          { name: 'ancient crypt rune', objectId: 52711 },
          { name: 'worn guide book', objectId: 52710 }
        ]
      }
    },
    {
      id: 'alptramun',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot alptramun's toothbrush / dream shroud / pair of dreamwalkers.
      name: 'Alptramun',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 480000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/c/c9/Alptramun.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 20, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'red gem', objectId: 3039 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'energy bar', objectId: 23535 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'gold token', objectId: 22721 },
          { name: 'green gem', objectId: 3038 },
          { name: 'huge chunk of crude iron', objectId: 5892 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'mysterious remains', objectId: 23509 },
          { name: 'piggy bank', objectId: 2995 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'pomegranate', objectId: 30169 },
          { name: 'royal star', objectId: 25759 },
          { name: 'silver token', objectId: 22516 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'yellow gem', objectId: 3037 }
        ],
        uncommon: [
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'ring of green plasma', objectId: 23531 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'collar of green plasma', objectId: 23543 },
          { name: "alptramun's toothbrush", objectId: 29943 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'chaos mace', objectId: 7427 },
          { name: 'crunor idol', objectId: 30055 },
          { name: 'dream shroud', objectId: 29423 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'pair of dreamwalkers', objectId: 29424 },
          { name: 'ring of the sky', objectId: 3006 },
          { name: 'soul stone', objectId: 5809 },
          { name: 'violet gem', objectId: 3036 }
        ],
        semiRare: [
          { name: 'abyss hammer', objectId: 7414 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'purple tendril lantern', objectId: 30171 }
        ]
      }
    },
    {
      id: 'the_primal_menace',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot spiritthorn / alicorn / arcanomancer / arboreal + charged rings.
      name: 'The Primal Menace',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 600000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/a/a5/The_Primal_Menace.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -5, kind: 'fraco' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 5, kind: 'resistente' },
        { element: 'ice', value: 50, kind: 'resistente' },
        { element: 'holy', value: 40, kind: 'resistente' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'berserk potion', objectId: 7439 }
        ],
        uncommon: [
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'giant amethyst', objectId: 32624 },
          // HTML vinha com data:image (sem /api/things); ID precisa confirmação.
          { name: 'royal almandine', objectId: 32627 }
        ],
        semiRare: [
          // HTML vinha com data:image; 32620/32621 no jogo são ghost backpack / ring of souls.
          { name: 'giant ruby', objectId: 0 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant topaz', objectId: 0 }
        ],
        rare: [
          // HTML vinha só com data:image (sem objectId). Nomes mantidos; IDs precisam do /api/things do jogo.
          { name: 'arboreal tome', objectId: 0 },
          { name: 'arboreal crown', objectId: 0 },
          { name: 'spiritthorn armor', objectId: 0 },
          { name: 'spiritthorn helmet', objectId: 0 },
          { name: 'alicorn headguard', objectId: 0 },
          { name: 'alicorn quiver', objectId: 0 },
          { name: 'arcanomancer regalia', objectId: 0 },
          { name: 'arcanomancer folio', objectId: 0 },
          { name: 'charged arcanomancer sigil', objectId: 0 },
          { name: 'charged arboreal ring', objectId: 0 },
          { name: 'charged alicorn ring', objectId: 0 },
          { name: 'charged spiritthorn ring', objectId: 0 }
        ]
      }
    },
    {
      id: 'anomaly',
      // Nome revelado na grid da cyclopedia: Anomaly.
      name: 'Anomaly',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 435000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/9/9a/Anomaly.gif',
      resistances: [
        { element: 'physical', value: -20, kind: 'fraco' },
        { element: 'energy', value: -20, kind: 'fraco' },
        { element: 'earth', value: 20, kind: 'resistente' },
        { element: 'fire', value: -20, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: -20, kind: 'fraco' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'gold token', objectId: 22721 },
          { name: 'mysterious remains', objectId: 23509 },
          { name: 'odd organ', objectId: 23510 },
          { name: 'platinum coin', objectId: 3035 }
        ],
        uncommon: [
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate health potion', objectId: 7643 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'energy drink', objectId: 0 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'green gem', objectId: 3038 },
          { name: 'curious matter', objectId: 23511 },
          { name: 'frozen lightning', objectId: 23519 }
        ],
        semiRare: [
          { name: 'collar of blue plasma', objectId: 23542 },
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'ring of green plasma', objectId: 23531 },
          { name: 'crystalline sword', objectId: 16160 },
          { name: 'lightning headband', objectId: 828 },
          { name: 'chaos mace', objectId: 7427 },
          { name: 'shadow sceptre', objectId: 7451 },
          { name: 'spellbook of warding', objectId: 8073 },
          { name: 'lightning legs', objectId: 822 },
          { name: 'lightning robe', objectId: 825 },
          { name: 'tiara of power', objectId: 23474 },
          { name: 'void boots', objectId: 23476 },
          { name: 'ruthless axe', objectId: 6553 },
          { name: 'giant shimmering pearl', objectId: 282 }
        ]
      }
    },
    {
      id: 'magma_bubble',
      // HTML da cyclopedia vinha com store-name "?".
      // Identificado por loot firefighting axe / fiery tear / portable flame + set primal rare.
      name: 'Magma Bubble',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 675000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/c/c7/Magma_Bubble.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'berserk potion', objectId: 7439 }
        ],
        uncommon: [
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'giant amethyst', objectId: 32624 }
        ],
        semiRare: [
          // HTML vinha com data:image; 32620/32621 no jogo são ghost backpack / ring of souls.
          { name: 'giant ruby', objectId: 0 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant topaz', objectId: 0 },
          { name: 'fiery tear', objectId: 0 },
          { name: 'portable flame', objectId: 0 },
          { name: 'firefighting axe', objectId: 39544 }
        ],
        rare: [
          { name: 'arboreal tome', objectId: 0 },
          { name: 'arboreal crown', objectId: 0 },
          { name: 'spiritthorn armor', objectId: 0 },
          { name: 'spiritthorn helmet', objectId: 0 },
          { name: 'alicorn headguard', objectId: 0 },
          { name: 'alicorn quiver', objectId: 0 },
          { name: 'arcanomancer regalia', objectId: 0 },
          { name: 'arcanomancer folio', objectId: 0 },
          { name: 'charged arcanomancer sigil', objectId: 0 },
          { name: 'charged arboreal ring', objectId: 0 },
          { name: 'charged alicorn ring', objectId: 0 },
          { name: 'charged spiritthorn ring', objectId: 0 }
        ]
      }
    },
    {
      id: 'the_gravedigger',
      // Posicao oficial #68. Antes catalogado como Ichgahal por engano.
      // Loot shrunken head / bonelord eye+shield → The Gravedigger.
      name: 'The Gravedigger',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 525000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/2/2f/The_Gravedigger.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'bonelord eye', objectId: 5898 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'necrotic rod', objectId: 3069 },
          { name: 'strong mana potion', objectId: 237 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'assassin star', objectId: 7368 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'red gem', objectId: 3039 },
          { name: 'terra rod', objectId: 21886 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'bonelord shield', objectId: 3418 },
          { name: 'grave flower', objectId: 3661 },
          { name: 'assassin dagger', objectId: 7404 },
          { name: 'blue gem', objectId: 3041 },
          // HTML vinha com data:image; 32621 no jogo é enchanted ring of souls.
          { name: 'giant ruby', objectId: 0 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'small flask of eyedrops', objectId: 11512 },
          { name: 'giant amethyst', objectId: 32624 },
          { name: 'shrunken head', objectId: 52712 }
        ],
        semiRare: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'deathly crypt rune', objectId: 0 }
        ]
      }
    },
    {
      id: 'mitmah_vanguard',
      // Posicao oficial #69. Dados do HTML da cyclopedia.
      name: 'Mitmah Vanguard',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 375000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/9/9b/Mitmah_Vanguard.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 5, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'great health potion', objectId: 239 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'white gem', objectId: 32769 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'crystal of the mitmah', objectId: 44439 },
          { name: 'broken mitmah necklace', objectId: 44438 },
          { name: 'broken mitmah chestplate', objectId: 44727 }
        ],
        uncommon: [
          { name: 'yellow gem', objectId: 3037 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'green gem', objectId: 3038 },
          // HTML vinha com data:image (sem /api/things); 32620 no jogo é ghost backpack.
          { name: 'giant topaz', objectId: 0 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant amethyst', objectId: 32624 }
        ],
        semiRare: [
          { name: 'splintered mitmah gem', objectId: 44728 }
        ],
        rare: [
          { name: 'stoic iks boots', objectId: 44648 },
          { name: 'stoic iks faulds', objectId: 44643 },
          { name: 'stoic iks casque', objectId: 44636 },
          { name: 'stoic iks cuirass', objectId: 44619 },
          { name: 'stoic iks chestplate', objectId: 44620 },
          { name: 'stoic iks sandals', objectId: 44649 },
          { name: 'stoic iks headpiece', objectId: 44637 },
          { name: 'stoic iks culet', objectId: 44642 },
          { name: 'iks footwraps', objectId: 50291 },
          { name: 'stoic iks robe', objectId: 50255 }
        ]
      }
    },
    {
      id: 'the_pale_worm',
      // Posicao oficial #70. Dados do HTML (+ pale worm's scalp).
      name: 'The Pale Worm',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 630000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/9/9e/The_Pale_Worm.gif',
      resistances: [
        { element: 'physical', value: 5, kind: 'resistente' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 5, kind: 'resistente' },
        { element: 'fire', value: 5, kind: 'resistente' },
        { element: 'ice', value: 5, kind: 'resistente' },
        { element: 'holy', value: 5, kind: 'resistente' },
        { element: 'death', value: 5, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'white gem', objectId: 32769 },
          { name: 'moonstone', objectId: 32771 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'silver hand mirror', objectId: 32772 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        uncommon: [
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'death toll', objectId: 32703 },
          { name: 'ivory comb', objectId: 32773 },
          { name: 'angel figurine', objectId: 32589 },
          { name: 'diamond', objectId: 32770 },
          { name: 'cursed bone', objectId: 32774 },
          { name: 'soulforged lantern', objectId: 32591 },
          { name: 'grimace', objectId: 32593 },
          { name: 'amber', objectId: 32626 }
        ],
        semiRare: [
          { name: 'amber with a dragonfly', objectId: 32625 },
          { name: 'ghost claw', objectId: 32631 },
          { name: 'bloody tears', objectId: 32594 },
          { name: "pale worm's scalp", objectId: 32598 },
          { name: 'fabulous legs', objectId: 32617 },
          { name: 'phantasmal axe', objectId: 32616 },
          { name: 'ghost backpack', objectId: 32620 },
          { name: 'soulful legs', objectId: 32618 },
          { name: 'jade legs', objectId: 50185 }
        ],
        rare: [
          { name: 'ghost chestplate', objectId: 32628 },
          { name: 'spooky hood', objectId: 32630 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'spectral scrap of cloth', objectId: 0 },
          { name: 'enchanted ring of souls', objectId: 32621 }
        ]
      }
    },
    {
      id: 'eradicator',
      // Posicao oficial #71. Dados do HTML da cyclopedia (spark sphere / resists +50%).
      name: 'Eradicator',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 435000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/f1/Eradicator.gif',
      resistances: [
        { element: 'physical', value: 50, kind: 'resistente' },
        { element: 'energy', value: 50, kind: 'resistente' },
        { element: 'earth', value: 50, kind: 'resistente' },
        { element: 'fire', value: 50, kind: 'resistente' },
        { element: 'ice', value: 50, kind: 'resistente' },
        { element: 'holy', value: 50, kind: 'resistente' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'gold token', objectId: 22721 },
          { name: 'mysterious remains', objectId: 23509 },
          { name: 'odd organ', objectId: 23510 },
          // HTML vinha com data:image; ID padrão do spark sphere.
          { name: 'spark sphere', objectId: 23518 }
        ],
        uncommon: [
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'energy bar', objectId: 23535 },
          { name: 'plasmatic lightning', objectId: 23520 },
          { name: 'instable proto matter', objectId: 23516 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'green gem', objectId: 3038 },
          { name: 'spellbook of warding', objectId: 8073 },
          { name: 'steel boots', objectId: 3554 }
        ],
        semiRare: [
          { name: 'crystal mace', objectId: 3333 },
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'ring of green plasma', objectId: 23531 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'spellbook of lost souls', objectId: 8075 }
        ]
      }
    },
    {
      id: 'outburst',
      // Posicao oficial #72. Dados do HTML da cyclopedia.
      name: 'Outburst',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 435000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/3/36/Outburst.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -10, kind: 'fraco' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: -10, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'gold token', objectId: 22721 },
          { name: 'mysterious remains', objectId: 23509 }
        ],
        uncommon: [
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'green crystal shard', objectId: 16121 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'green gem', objectId: 3038 },
          { name: 'chaos mace', objectId: 7427 },
          { name: 'ring of red plasma', objectId: 23533 }
        ],
        semiRare: [
          { name: 'tiara of power', objectId: 23474 },
          { name: 'void boots', objectId: 23476 },
          { name: 'crystalline sword', objectId: 16160 }
        ]
      }
    },
    {
      id: 'razzagorn',
      // Posicao oficial #73. Dados do HTML da cyclopedia (maimer / visage of the end days).
      name: 'Razzagorn',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 435000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/d/db/Razzagorn.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 40, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 10, kind: 'resistente' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'silver token', objectId: 22516 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'opal', objectId: 22194 },
          { name: 'orichalcum pearl', objectId: 5021 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great health potion', objectId: 239 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate health potion', objectId: 7643 }
        ],
        uncommon: [
          { name: 'flask of demonic blood', objectId: 6558 },
          { name: 'white pearl', objectId: 3026 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'terra rod', objectId: 21886 },
          { name: 'devil helmet', objectId: 3356 },
          { name: 'demonic essence', objectId: 6499 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'small topaz', objectId: 9057 }
        ],
        semiRare: [
          { name: 'violet gem', objectId: 3036 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'red gem', objectId: 3039 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'bullseye potion', objectId: 7443 }
        ],
        rare: [
          { name: 'visage of the end days', objectId: 22754 },
          { name: 'maimer', objectId: 22762 },
          { name: 'great shield', objectId: 3422 }
        ]
      }
    },
    {
      id: 'tarbaz',
      // Posicao oficial #74. Dados do HTML da cyclopedia (shroud of despair / rift lance).
      name: 'Tarbaz',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 435000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/0/0e/Tarbaz.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'silver token', objectId: 22516 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate health potion', objectId: 7643 }
        ],
        uncommon: [
          { name: 'flask of demonic blood', objectId: 6558 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'white pearl', objectId: 3026 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'green crystal shard', objectId: 16121 }
        ],
        semiRare: [
          { name: 'yellow gem', objectId: 3037 },
          { name: 'green gem', objectId: 3038 },
          { name: 'glacier amulet', objectId: 815 },
          { name: 'glacier kilt', objectId: 823 },
          { name: 'glacier robe', objectId: 824 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'underworld rod', objectId: 8082 }
        ],
        rare: [
          { name: 'rift crossbow', objectId: 22867 },
          { name: 'rift lance', objectId: 22727 },
          { name: 'shroud of despair', objectId: 22757 }
        ]
      }
    },
    {
      id: 'ragiaz',
      // Posicao oficial #75. Dados do HTML da cyclopedia (death gaze / earth +90%).
      name: 'Ragiaz',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 420000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/7/75/Ragiaz.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 90, kind: 'resistente' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 50, kind: 'resistente' }
      ],
      drops: {
        common: [{ name: 'silver token', objectId: 22516 }],
        uncommon: [
          { name: 'flask of demonic blood', objectId: 6558 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'demonic essence', objectId: 6499 }
        ],
        semiRare: [
          { name: 'yellow gem', objectId: 3037 },
          { name: 'cyan crystal fragment', objectId: 16125 },
          { name: 'red crystal fragment', objectId: 16126 },
          { name: 'green crystal fragment', objectId: 16127 },
          { name: 'white pearl', objectId: 3026 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'green gem', objectId: 3038 },
          { name: 'red gem', objectId: 3039 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'skull staff', objectId: 3321 },
          { name: 'amber staff', objectId: 7426 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great health potion', objectId: 239 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'small topaz', objectId: 9057 }
        ],
        rare: [
          { name: 'death gaze', objectId: 22758 },
          { name: 'rift bow', objectId: 22866 },
          { name: 'rift crossbow', objectId: 22867 },
          { name: "reaper's axe", objectId: 7420 }
        ]
      }
    },
    {
      id: 'plagirath',
      // Posicao oficial #76. Dados do HTML da cyclopedia (plague bite / traditional sai).
      name: 'Plagirath',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 435000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/fd/Plagirath.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: -10, kind: 'fraco' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: -25, kind: 'fraco' },
        { element: 'ice', value: 10, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'silver token', objectId: 22516 },
          { name: 'cyan crystal fragment', objectId: 16125 },
          { name: 'red crystal fragment', objectId: 16126 },
          { name: 'green crystal fragment', objectId: 16127 },
          { name: 'ultimate health potion', objectId: 7643 }
        ],
        uncommon: [
          { name: 'white pearl', objectId: 3026 },
          { name: 'small sapphire', objectId: 3029 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'demonic essence', objectId: 6499 },
          { name: 'mercenary sword', objectId: 7386 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'terra amulet', objectId: 814 },
          { name: 'small topaz', objectId: 9057 }
        ],
        semiRare: [
          { name: 'traditional sai', objectId: 10389 },
          { name: 'muck rod', objectId: 16117 },
          { name: 'spellbook of warding', objectId: 8073 }
        ],
        rare: [
          { name: 'rift lance', objectId: 22727 },
          { name: 'plague bite', objectId: 22759 },
          { name: 'rift bow', objectId: 22866 },
          { name: 'rift crossbow', objectId: 22867 }
        ]
      }
    },
    {
      id: 'eldritch_dragon_lord',
      // Posicao oficial #77. Dados do HTML da cyclopedia (dragon tongue / golden claw).
      name: 'Eldritch Dragon Lord',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 657000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/2/21/Eldritch_Dragon_Lord.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'dragon tongue', objectId: 24938 },
          { name: 'red gem', objectId: 3039 },
          { name: 'strong mana potion', objectId: 237 },
          { name: 'wand of inferno', objectId: 3071 },
          { name: 'great mana potion', objectId: 238 },
          // HTML vinha com data:image; ID padrão Tibia do dragonbone staff.
          { name: 'dragonbone staff', objectId: 7430 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'dragon ham', objectId: 3583 },
          { name: 'dragon shield', objectId: 3416 }
        ],
        uncommon: [
          { name: 'fire sword', objectId: 3280 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'giant amethyst', objectId: 0 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'dragon slayer', objectId: 7402 }
        ],
        semiRare: [
          { name: 'golden claw', objectId: 52711 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'fiery crypt rune', objectId: 0 }
        ]
      }
    },
    {
      id: 'ice_horror',
      // Posicao oficial #78. Dados do HTML da cyclopedia (frozen crapace / icy horns).
      name: 'Ice Horror',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 750000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/9/95/Ice_Horror.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ice rapier', objectId: 3284 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'red gem', objectId: 3039 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'frosty heart', objectId: 9661 },
          { name: 'crystal ring', objectId: 3007 },
          { name: 'pair of earmuffs', objectId: 7459 },
          { name: 'strong mana potion', objectId: 237 },
          { name: 'ultimate mana potion', objectId: 23373 }
        ],
        uncommon: [
          { name: 'blue gem', objectId: 3041 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'glacier amulet', objectId: 815 },
          { name: 'crystal mace', objectId: 3333 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'giant emerald', objectId: 0 },
          { name: 'giant ruby', objectId: 0 },
          { name: 'giant sapphire', objectId: 0 }
        ],
        semiRare: [
          { name: 'frozen crapace', objectId: 52728 },
          { name: 'glacier mask', objectId: 829 },
          { name: 'ice cube', objectId: 7441 },
          { name: 'icy horns', objectId: 52727 },
          { name: 'icy scales', objectId: 52726 },
          { name: 'shard', objectId: 7290 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'icy crypt rune', objectId: 0 }
        ]
      }
    },
    {
      id: 'arbaziloth',
      // Posicao oficial #79. Dados do HTML da cyclopedia (arbaziloth shoulder piece / inferniarch).
      name: 'Arbaziloth',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 540000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/f/f0/Arbaziloth.gif',
      resistances: [
        { element: 'physical', value: 30, kind: 'resistente' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 15, kind: 'resistente' },
        { element: 'ice', value: 20, kind: 'resistente' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 20, kind: 'resistente' }
      ],
      drops: {
        uncommon: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'platinum coin', objectId: 3035 }
        ],
        semiRare: [
          { name: 'strong mana potion', objectId: 237 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'red gem', objectId: 3039 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'death ring', objectId: 6299 },
          { name: 'devil helmet', objectId: 3356 },
          { name: 'fire axe', objectId: 3320 },
          { name: 'fire sword', objectId: 3280 },
          { name: 'giant sword', objectId: 3281 },
          { name: 'gold ring', objectId: 3063 },
          { name: 'golden sickle', objectId: 3306 },
          { name: 'ice rapier', objectId: 3284 },
          { name: 'life ring', objectId: 3052 },
          { name: 'magma amulet', objectId: 817 },
          { name: 'magma legs', objectId: 821 },
          { name: 'might ring', objectId: 3048 },
          { name: 'platinum amulet', objectId: 3055 },
          { name: 'purple tome', objectId: 2848 },
          { name: 'ring of healing', objectId: 3098 },
          { name: 'silver amulet', objectId: 3054 },
          { name: 'skull staff', objectId: 3321 },
          { name: "spellweaver's robe", objectId: 10438 },
          { name: 'stone skin amulet', objectId: 3081 },
          { name: 'strange helmet', objectId: 3373 },
          { name: 'underworld rod', objectId: 8082 },
          { name: 'wand of inferno', objectId: 3071 },
          { name: 'arbaziloth shoulder piece', objectId: 50067 },
          { name: 'demon shield', objectId: 3420 },
          { name: 'demonbone amulet', objectId: 3019 },
          { name: 'demonrage sword', objectId: 7382 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'giant amethyst', objectId: 0 },
          { name: 'giant emerald', objectId: 0 },
          { name: 'giant ruby', objectId: 0 },
          { name: 'giant sapphire', objectId: 0 },
          { name: 'golden legs', objectId: 3364 },
          { name: 'magic plate armor', objectId: 3366 }
        ],
        rare: [
          { name: 'demon claws', objectId: 50060 },
          { name: 'demon skull', objectId: 31212 },
          { name: 'inferniarch arbalest', objectId: 49522 },
          { name: 'inferniarch battleaxe', objectId: 49523 },
          { name: 'inferniarch blade', objectId: 49527 },
          { name: 'inferniarch bow', objectId: 49520 },
          { name: 'inferniarch claws', objectId: 50250 },
          { name: 'inferniarch flail', objectId: 49525 },
          { name: 'inferniarch greataxe', objectId: 49524 },
          { name: 'inferniarch rod', objectId: 49529 },
          { name: 'inferniarch slayer', objectId: 49530 },
          { name: 'inferniarch wand', objectId: 49528 },
          { name: 'inferniarch warhammer', objectId: 49526 },
          { name: 'maliceforged helmet', objectId: 49531 },
          { name: 'hellstalker visor', objectId: 49532 },
          { name: 'dreadfire headpiece', objectId: 49533 },
          { name: 'demonfang mask', objectId: 49534 },
          { name: 'demon mengu', objectId: 50189 },
          { name: 'demon in a green box', objectId: 50064 },
          // HTML vinha só com abreviação (sem /api/things)
          { name: 'demon in a golden box', objectId: 0 },
          { name: 'demon in a red box', objectId: 0 }
        ]
      }
    },
    {
      id: 'the_rootkraken',
      // Posicao oficial #80. Dados do HTML da cyclopedia (amber crusher / armas amber / petrified leaf).
      name: 'The Rootkraken',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 525000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/7/72/The_Rootkraken.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: -10, kind: 'fraco' },
        { element: 'fire', value: -15, kind: 'fraco' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: 'platinum coin', objectId: 3035 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'yellow gem', objectId: 3037 }
        ],
        uncommon: [
          { name: 'amber with a bug', objectId: 32624 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'giant topaz', objectId: 0 }
        ],
        semiRare: [{ name: 'amber crusher', objectId: 46628 }],
        rare: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'amber axe', objectId: 0 },
          { name: 'amber greataxe', objectId: 0 },
          { name: 'amber slayer', objectId: 0 },
          { name: 'amber sabre', objectId: 0 },
          { name: 'amber cudgel', objectId: 0 },
          { name: 'amber bludgeon', objectId: 0 },
          { name: 'amber bow', objectId: 0 },
          { name: 'amber crossbow', objectId: 0 },
          { name: 'amber wand', objectId: 0 },
          { name: 'amber rod', objectId: 0 },
          { name: 'petrified leaf', objectId: 48515 },
          { name: 'strange inedible fruit', objectId: 48514 }
        ]
      }
    },
    {
      id: 'urmahlullu_the_immaculate',
      // Posicao oficial #81. Dados do HTML (HP 768k, Energy +40%, loot urmahlullu/winged).
      name: 'Urmahlullu the Immaculate',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 768000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/4/42/Urmahlullu_the_Immaculate.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 40, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'green gem', objectId: 3038 },
          { name: 'energy bar', objectId: 23535 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'red gem', objectId: 3039 },
          { name: 'lightning pendant', objectId: 788 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'magma coat', objectId: 826 }
        ],
        uncommon: [
          { name: 'royal star', objectId: 25759 },
          { name: 'flash arrow', objectId: 761 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'magma amulet', objectId: 817 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'magma monocle', objectId: 827 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'silver token', objectId: 22516 },
          { name: 'violet gem', objectId: 3036 },
          { name: "urmahlullu's paw", objectId: 31624 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: "urmahlullu's tail", objectId: 31622 },
          { name: 'lightning legs', objectId: 822 }
        ],
        semiRare: [
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'ring of secret thoughts', objectId: 31263 },
          { name: "urmahlullu's mane", objectId: 31623 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'sunray emblem', objectId: 31574 },
          { name: 'tagralt blade', objectId: 31614 },
          { name: 'winged boots', objectId: 31617 },
          { name: 'rainbow necklace', objectId: 30323 },
          { name: 'enchanted theurgic amulet', objectId: 30403 }
        ],
        rare: [
          { name: 'winged backpack', objectId: 31625 },
          { name: 'golden bijou', objectId: 31575 },
          { name: 'sun medal', objectId: 31573 },
          { name: 'blue and golden cordon', objectId: 31572 }
        ]
      }
    },
    {
      id: 'gorzindel',
      // Posicao oficial #82. Dados do HTML (HP 450k, Energy +5%, books/curious matter).
      name: 'Gorzindel',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/2/26/Gorzindel.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 5, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          { name: 'small amethyst', objectId: 3033 },
          { name: 'small diamond', objectId: 3028 },
          { name: 'small emerald', objectId: 3032 },
          { name: 'small ruby', objectId: 3030 },
          { name: 'small topaz', objectId: 9057 },
          { name: 'onyx chip', objectId: 22193 },
          { name: 'great spirit potion', objectId: 7642 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'chaos mace', objectId: 7427 },
          { name: 'crown armor', objectId: 3381 },
          { name: 'curious matter', objectId: 23511 },
          { name: 'demon horn', objectId: 5954 },
          { name: 'dreaded cleaver', objectId: 7419 },
          { name: 'giant shimmering pearl', objectId: 282 }
        ],
        uncommon: [{ name: 'slightly rusted shield', objectId: 8902 }],
        semiRare: [
          { name: 'gold token', objectId: 22721 },
          { name: 'green gem', objectId: 3038 },
          { name: 'knowledgeable book', objectId: 27934 },
          { name: 'ominous book', objectId: 27933 },
          { name: 'magic sulphur', objectId: 5904 },
          { name: 'muck rod', objectId: 16117 },
          { name: 'red gem', objectId: 3039 },
          { name: 'silver token', objectId: 22516 },
          { name: 'sinister book', objectId: 27932 },
          { name: 'spellbook of warding', objectId: 8073 },
          { name: 'steel boots', objectId: 3554 },
          { name: 'stone skin amulet', objectId: 3081 },
          { name: 'wand of cosmic energy', objectId: 3073 },
          { name: 'yellow gem', objectId: 3037 }
        ]
      }
    },
    {
      id: 'goshnars_cruelty',
      // Posicao oficial #83. Dados do HTML (cruelty's chest/claw, figurine of cruelty).
      name: "Goshnar's Cruelty",
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/b/b3/Goshnar%27s_Cruelty.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [{ name: 'crystal coin', objectId: 3043 }],
        uncommon: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'red gem', objectId: 3039 },
          { name: 'green gem', objectId: 3038 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'white gem', objectId: 32769 },
          { name: 'dragon figurine', objectId: 30053 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        semiRare: [
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: "cruelty's chest", objectId: 33923 },
          { name: "cruelty's claw", objectId: 33922 }
        ],
        rare: [
          { name: 'figurine of cruelty', objectId: 34019 },
          { name: 'spectral saddle', objectId: 34073 },
          { name: 'spectral horse tack', objectId: 34074 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'bag you desire', objectId: 0 }
        ]
      }
    },
    {
      id: 'the_monster',
      // Posicao oficial #84. Dados do HTML (mutant bone/skin, antler-horn helmet).
      name: 'The Monster',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 525000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/3/3d/The_Monster.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'red gem', objectId: 3039 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'green gem', objectId: 3038 },
          { name: 'violet gem', objectId: 3036 }
        ],
        semiRare: [
          { name: 'giant amethyst', objectId: 32624 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'giant emerald', objectId: 32623 }
        ],
        rare: [
          { name: 'raw watermelon tourmaline', objectId: 33778 },
          { name: "alchemist's notepad", objectId: 40594 },
          { name: 'mutant bone kilt', objectId: 40595 },
          { name: 'mutated skin armor', objectId: 40591 },
          { name: 'mutated skin legs', objectId: 40590 },
          { name: 'stitched mutant hide legs', objectId: 40589 },
          { name: "alchemist's boots", objectId: 40592 },
          { name: 'mutant bone boots', objectId: 40593 },
          { name: 'mutant hide trousers', objectId: 50184 },
          { name: 'antler-horn helmet', objectId: 40588 }
        ]
      }
    },
    {
      id: 'goshnars_greed',
      // Posicao oficial #85. Dados do HTML (greed's arm, figurine of greed, bag you desire).
      name: "Goshnar's Greed",
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/a/a4/Goshnar%27s_Greed.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          { name: "greed's arm", objectId: 33924 }
        ],
        uncommon: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'red gem', objectId: 3039 },
          { name: 'green gem', objectId: 3038 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'white gem', objectId: 32769 },
          { name: 'dragon figurine', objectId: 30053 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        semiRare: [{ name: 'giant shimmering pearl', objectId: 282 }],
        rare: [
          { name: 'figurine of greed', objectId: 34021 },
          { name: 'the skull of a beast', objectId: 34075 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'bag you desire', objectId: 0 }
        ]
      }
    },
    {
      id: 'goshnars_hatred',
      // Posicao oficial #86. Dados do HTML (vial of hatred, figurine of hatred).
      name: "Goshnar's Hatred",
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/5/58/Goshnar%27s_Hatred.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'crystal coin', objectId: 3043 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'vial of hatred', objectId: 0 }
        ],
        uncommon: [
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'red gem', objectId: 3039 },
          { name: 'green gem', objectId: 3038 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'white gem', objectId: 32769 },
          { name: 'dragon figurine', objectId: 30053 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        semiRare: [{ name: 'giant shimmering pearl', objectId: 282 }],
        rare: [
          { name: 'figurine of hatred', objectId: 34020 },
          { name: 'spectral horseshoe', objectId: 34072 },
          { name: 'spectral horse tack', objectId: 34074 },
          { name: 'bracelet of strengthening', objectId: 34076 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'bag you desire', objectId: 0 }
        ]
      }
    },
    {
      id: 'goshnars_malice',
      // Posicao oficial #87. Dados do HTML (malice's spine/horn, Energy/Earth/Fire +15%).
      name: "Goshnar's Malice",
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/d/d5/Goshnar%27s_Malice.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 15, kind: 'resistente' },
        { element: 'fire', value: 15, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [{ name: 'crystal coin', objectId: 3043 }],
        uncommon: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'red gem', objectId: 3039 },
          { name: 'green gem', objectId: 3038 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'white gem', objectId: 32769 },
          { name: 'dragon figurine', objectId: 30053 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        semiRare: [
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: "malice's spine", objectId: 33921 },
          { name: "malice's horn", objectId: 33920 }
        ],
        rare: [
          { name: 'bracelet of strengthening', objectId: 34076 },
          { name: 'spectral horseshoe', objectId: 34072 },
          { name: 'the skull of a beast', objectId: 34075 },
          { name: 'figurine of malice', objectId: 34018 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'bag you desire', objectId: 0 }
        ]
      }
    },
    {
      id: 'goshnars_spite',
      // Posicao oficial #88. Dados do HTML (figurine of spite / spite's spirit).
      name: "Goshnar's Spite",
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 450000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/6/6c/Goshnar%27s_Spite.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [{ name: 'crystal coin', objectId: 3043 }],
        uncommon: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'red gem', objectId: 3039 },
          { name: 'green gem', objectId: 3038 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'white gem', objectId: 32769 },
          { name: 'dragon figurine', objectId: 30053 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        semiRare: [{ name: 'giant shimmering pearl', objectId: 282 }],
        rare: [
          { name: 'the skull of a beast', objectId: 34075 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'figurine of spite', objectId: 0 },
          { name: "spite's spirit", objectId: 0 },
          { name: 'bag you desire', objectId: 0 }
        ]
      }
    },
    {
      id: 'world_devourer',
      // Posicao oficial #89 (Nemesis). Dados do HTML (devourer core / crackling egg / tiara of power).
      name: 'World Devourer',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 900000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/a/a8/World_Devourer.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'gold token', objectId: 22721 }
        ],
        uncommon: [
          { name: 'blue crystal shard', objectId: 16119 },
          { name: 'great mana potion', objectId: 238 },
          { name: 'great spirit potion', objectId: 7642 },
          { name: 'green crystal shard', objectId: 16121 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'ultimate health potion', objectId: 7643 },
          { name: 'violet crystal shard', objectId: 16120 },
          { name: 'crystallized anger', objectId: 0 },
          { name: 'energy vein', objectId: 0 },
          { name: 'giant shimmering pearl', objectId: 282 },
          { name: 'odd organ', objectId: 23510 },
          { name: 'plasmatic lightning', objectId: 23520 },
          { name: 'green gem', objectId: 3038 },
          { name: 'amber staff', objectId: 7426 },
          { name: 'lightning headband', objectId: 828 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'tiara of power', objectId: 23474 },
          { name: 'void boots', objectId: 23476 }
        ],
        semiRare: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'devourer core', objectId: 0 },
          { name: 'crackling egg', objectId: 23684 }
        ]
      }
    },
    {
      id: 'king_zelos',
      // Posicao oficial #90. Dados do HTML (mortal mace / galea-toga mortis / young lich worm).
      name: 'King Zelos',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 720000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/4/40/King_Zelos.gif',
      resistances: [
        { element: 'physical', value: 10, kind: 'resistente' },
        { element: 'energy', value: 3, kind: 'resistente' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 5, kind: 'resistente' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [
          { name: 'platinum coin', objectId: 3035 },
          { name: 'crystal coin', objectId: 3043 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'silver token', objectId: 22516 }
        ],
        uncommon: [
          { name: 'gold token', objectId: 22721 },
          { name: 'green gem', objectId: 3038 },
          { name: 'red gem', objectId: 3039 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'collar of green plasma', objectId: 23543 },
          { name: 'magma coat', objectId: 826 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'red tome', objectId: 2852 },
          { name: 'ring of blue plasma', objectId: 23529 },
          { name: 'ring of red plasma', objectId: 23533 },
          { name: 'young lich worm', objectId: 31590 }
        ],
        semiRare: [
          { name: 'mortal mace', objectId: 31580 },
          { name: 'golden hyaena pendant', objectId: 12543 },
          { name: 'bow of cataclysm', objectId: 31581 },
          { name: 'galea mortis', objectId: 31582 },
          { name: 'toga mortis', objectId: 31583 },
          { name: 'death oyoroi', objectId: 50260 },
          { name: 'shadow cowl', objectId: 31737 }
        ]
      }
    },
    {
      id: 'chagorz',
      // Posicao oficial #91. Dados do HTML (todas +15%, darklight geode, bag you covet).
      name: 'Chagorz',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 525000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/1/10/Chagorz.gif',
      resistances: [
        { element: 'physical', value: 15, kind: 'resistente' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 15, kind: 'resistente' },
        { element: 'fire', value: 15, kind: 'resistente' },
        { element: 'ice', value: 15, kind: 'resistente' },
        { element: 'holy', value: 15, kind: 'resistente' },
        { element: 'death', value: 15, kind: 'resistente' }
      ],
      drops: {
        common: [{ name: 'crystal coin', objectId: 3043 }],
        uncommon: [
          { name: 'mastermind potion', objectId: 7440 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'red gem', objectId: 3039 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'giant amethyst', objectId: 32624 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'green gem', objectId: 3038 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'white gem', objectId: 32769 }
        ],
        rare: [
          // HTML vinha só com abreviação (sem /api/things)
          { name: 'darklight geode', objectId: 0 },
          { name: 'bag you covet', objectId: 0 }
        ]
      }
    },
    {
      id: 'ichgahal',
      // Posicao oficial #92. Dados do HTML (ichgahal's fungal infestation / putrefactive figurine).
      name: 'Ichgahal',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 525000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/1/14/Ichgahal.gif',
      resistances: [
        { element: 'physical', value: 15, kind: 'resistente' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 15, kind: 'resistente' },
        { element: 'fire', value: 15, kind: 'resistente' },
        { element: 'ice', value: 15, kind: 'resistente' },
        { element: 'holy', value: 15, kind: 'resistente' },
        { element: 'death', value: 15, kind: 'resistente' }
      ],
      drops: {
        common: [{ name: 'crystal coin', objectId: 3043 }],
        uncommon: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'yellow gem', objectId: 3037 },
          // No HTML, 32624 = amber with a bug (nao giant amethyst)
          { name: 'amber with a bug', objectId: 32624 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'raw watermelon tourmaline', objectId: 33778 },
          { name: 'red gem', objectId: 3039 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'amber with a dragonfly', objectId: 32625 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'putrefactive figurine', objectId: 43962 },
          { name: "ichgahal's fungal infestation", objectId: 43964 },
          { name: 'white gem', objectId: 32769 }
        ],
        rare: [
          // HTML vinha só com abreviação (sem /api/things)
          { name: 'cursed wood', objectId: 0 },
          { name: 'bag you covet', objectId: 0 }
        ]
      }
    },
    {
      id: 'murcion',
      // Posicao oficial #93. Dados do HTML (todas +15%, cursed wood / bag you covet).
      name: 'Murcion',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 525000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/e/eb/Murcion.gif',
      resistances: [
        { element: 'physical', value: 15, kind: 'resistente' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 15, kind: 'resistente' },
        { element: 'fire', value: 15, kind: 'resistente' },
        { element: 'ice', value: 15, kind: 'resistente' },
        { element: 'holy', value: 15, kind: 'resistente' },
        { element: 'death', value: 15, kind: 'resistente' }
      ],
      drops: {
        common: [{ name: 'crystal coin', objectId: 3043 }],
        uncommon: [
          { name: 'red gem', objectId: 3039 },
          { name: 'amber with a bug', objectId: 32624 },
          { name: 'amber with a dragonfly', objectId: 32625 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'green gem', objectId: 3038 },
          { name: 'mastermind potion', objectId: 7440 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        rare: [
          // HTML vinha só com abreviação (sem /api/things)
          { name: 'cursed wood', objectId: 0 },
          { name: 'bag you covet', objectId: 0 }
        ]
      }
    },
    {
      id: 'vemiath',
      // Posicao oficial #94. Dados do HTML (vemiath's infused basalt / darklight geode).
      name: 'Vemiath',
      rarity: 'archfoe',
      rarityLabel: 'Archfoe',
      hp: 525000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/8/8e/Vemiath.gif',
      resistances: [
        { element: 'physical', value: 15, kind: 'resistente' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 15, kind: 'resistente' },
        { element: 'fire', value: 15, kind: 'resistente' },
        { element: 'ice', value: 15, kind: 'resistente' },
        { element: 'holy', value: 15, kind: 'resistente' },
        { element: 'death', value: 15, kind: 'resistente' }
      ],
      drops: {
        common: [{ name: 'crystal coin', objectId: 3043 }],
        uncommon: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'giant emerald', objectId: 32623 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'green gem', objectId: 3038 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'giant amethyst', objectId: 32624 },
          { name: 'gold ingot', objectId: 9058 },
          { name: 'red gem', objectId: 3039 },
          { name: 'dragon figurine', objectId: 30053 },
          { name: 'raw watermelon tourmaline', objectId: 33778 },
          { name: "vemiath's infused basalt", objectId: 43967 },
          { name: 'violet gem', objectId: 3036 }
        ],
        rare: [
          // HTML vinha só com abreviação (sem /api/things)
          { name: 'darklight geode', objectId: 0 },
          { name: 'bag you covet', objectId: 0 }
        ]
      }
    },
    {
      id: 'goshnars_megalomania',
      // Posicao oficial #95 (Nemesis). Dados do HTML (figurines + megalomania's skull/essence).
      name: "Goshnar's Megalomania",
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 750000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/c/ce/Goshnar%27s_Megalomania.gif',
      resistances: [
        { element: 'physical', value: 0, kind: 'neutro' },
        { element: 'energy', value: 0, kind: 'neutro' },
        { element: 'earth', value: 0, kind: 'neutro' },
        { element: 'fire', value: 0, kind: 'neutro' },
        { element: 'ice', value: 0, kind: 'neutro' },
        { element: 'holy', value: 0, kind: 'neutro' },
        { element: 'death', value: 0, kind: 'neutro' }
      ],
      drops: {
        common: [{ name: 'crystal coin', objectId: 3043 }],
        uncommon: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'blue gem', objectId: 3041 },
          { name: 'red gem', objectId: 3039 },
          { name: 'green gem', objectId: 3038 },
          { name: 'yellow gem', objectId: 3037 },
          { name: 'white gem', objectId: 32769 },
          { name: 'dragon figurine', objectId: 30053 },
          { name: 'bullseye potion', objectId: 7443 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'berserk potion', objectId: 7439 },
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'supreme health potion', objectId: 23375 },
          { name: 'ultimate spirit potion', objectId: 23374 }
        ],
        semiRare: [{ name: 'giant shimmering pearl', objectId: 282 }],
        rare: [
          { name: 'figurine of malice', objectId: 34018 },
          { name: 'figurine of cruelty', objectId: 34019 },
          { name: 'figurine of hatred', objectId: 34020 },
          { name: 'figurine of greed', objectId: 34021 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'figurine of spite', objectId: 0 },
          { name: 'figurine of megalomania', objectId: 33953 },
          { name: "megalomania's skull", objectId: 33925 },
          { name: "megalomania's essence", objectId: 0 },
          { name: 'bag you desire', objectId: 0 }
        ]
      }
    },
    {
      id: 'bakragore',
      // Posicao oficial #96 (Nemesis). Dados do HTML (HP 990k, todas +15%, spiritual horseshoe).
      name: 'Bakragore',
      rarity: 'nemesis',
      rarityLabel: 'Nemesis',
      hp: 990000,
      summons: [],
      sprite: 'https://www.tibiawiki.com.br/images/5/55/Bakragore.gif',
      resistances: [
        { element: 'physical', value: 15, kind: 'resistente' },
        { element: 'energy', value: 15, kind: 'resistente' },
        { element: 'earth', value: 15, kind: 'resistente' },
        { element: 'fire', value: 15, kind: 'resistente' },
        { element: 'ice', value: 15, kind: 'resistente' },
        { element: 'holy', value: 15, kind: 'resistente' },
        { element: 'death', value: 15, kind: 'resistente' }
      ],
      drops: {
        common: [{ name: 'crystal coin', objectId: 3043 }],
        uncommon: [
          // HTML vinha com data:image (sem /api/things)
          { name: 'ultimate mana potion', objectId: 23373 },
          { name: 'giant amethyst', objectId: 32624 },
          { name: 'giant topaz', objectId: 32620 },
          { name: 'ultimate spirit potion', objectId: 23374 },
          { name: 'giant ruby', objectId: 32621 },
          { name: 'giant sapphire', objectId: 32622 },
          { name: 'mastermind potion', objectId: 7440 },
          { name: 'red gem', objectId: 3039 },
          { name: 'violet gem', objectId: 3036 },
          { name: 'yellow gem', objectId: 3037 }
        ],
        rare: [
          { name: 'spiritual horseshoe', objectId: 44048 },
          // HTML vinha com data:image (sem /api/things)
          { name: 'bag you covet', objectId: 0 }
        ]
      }
    }
  ];

  function normalizeDrop(drop) {
    if (!drop) return null;
    const objectId = Number(drop.objectId) || 0;
    const name = String(drop.name || '').trim();
    const image = String(drop.image || '').trim() || (objectId ? objectImg(objectId) : '');
    // Nome basta: alguns loots do HTML vinham só com data:image (sem objectId).
    if (!name) return null;
    return {
      name,
      objectId: objectId || 0,
      image
    };
  }

  function normalizeBoss(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const id = String(raw.id || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');
    const name = String(raw.name || '').trim();
    if (!id || !name) return null;

    const dropsIn = raw.drops || {};
    const mapList = (list) =>
      (Array.isArray(list) ? list : []).map(normalizeDrop).filter(Boolean);

    return {
      id,
      name,
      rarity: String(raw.rarity || '').toLowerCase(),
      rarityLabel: String(raw.rarityLabel || raw.rarity || '').trim(),
      rarityIcon: rarityIcon(raw.rarity || ''),
      hp: Math.max(0, Number(raw.hp) || 0),
      summons: Array.isArray(raw.summons)
        ? raw.summons
            .map((s) => String(s || '').trim())
            .filter((s) => s && s !== '—' && s !== '-')
        : [],
      sprite: String(raw.sprite || '').trim(),
      resistances: (Array.isArray(raw.resistances) ? raw.resistances : []).map((r) => ({
        element: String(r.element || '').toLowerCase(),
        value: Number(r.value) || 0,
        kind: String(r.kind || 'neutro').toLowerCase(),
        icon: elementImg(r.element)
      })),
      drops: {
        common: mapList(dropsIn.common),
        uncommon: mapList(dropsIn.uncommon),
        semiRare: mapList(dropsIn.semiRare),
        rare: mapList(dropsIn.rare),
        veryRare: mapList(dropsIn.veryRare)
      }
    };
  }

  const catalog = BOSSES.map(normalizeBoss).filter(Boolean);

  root.BAIAK_IDLE_BOSS_ORIGIN = ORIGIN;
  root.BAIAK_IDLE_BOSS_OBJECT_IMG = objectImg;
  root.BAIAK_IDLE_BOSS_ELEMENT_IMG = elementImg;
  root.BAIAK_IDLE_BOSS_RARITY_ICON = rarityIcon;
  root.BAIAK_IDLE_BOSSES = catalog;

  root.BAIAK_IDLE_GET_BOSS = function (idOrName) {
    const key = String(idOrName || '')
      .trim()
      .toLowerCase();
    if (!key) return null;
    return (
      catalog.find((b) => b.id === key) ||
      catalog.find((b) => b.name.toLowerCase() === key) ||
      null
    );
  };
})(typeof window !== 'undefined' ? window : globalThis);

