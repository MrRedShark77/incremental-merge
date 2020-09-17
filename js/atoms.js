const ATOMCOLORS = [
    'red',
    'ora',
    'yel',
    'gre',
    'blu',
    'pur',
    'whi',
    'bla'
]

const ATOMS = {
    dusts: {
        col: 2,
        row: 4,
    },
    name: [
        'Red',
        'Orange',
        'Yellow',
        'Green',
        'Blue',
        'Purple',
        'White',
        'Black'
    ],
    desc: [
        'gives more Numbers.',
        'gives more Prestige points.',
        'gives more Energy, and boosts Energy chances to gain.',
        'gives more Sacrifice points.',
        "gives more Preons, and boosts it's effect.",
        'gives more Merge space. (max 30)',
        'gives a chance that when a Merge spawns, spawns with +1 tier.',
        'gives a chance that when merging, the result spawns 1 tier higher 1+1 = 3.',
    ],
    cur: [
        [[() => { return player.atoms.dusts.red.add(1).pow(1.25) }, (x) => { return 'x'+notate(x) }], false],
        [[() => { return player.atoms.dusts.ora.add(1).pow(0.6) }, (x) => { return 'x'+notate(x) }], false],
        [[() => { return player.atoms.dusts.yel.add(1).pow(0.75) }, (x) => { return 'x'+notate(x)+' Energy' }], [() => { return player.atoms.dusts.yel.add(1).logBase(3).pow(1.5).min(50) }, (x) => { return notate(x)+'% chance' }]],
        [[() => { return player.atoms.dusts.gre.add(1).pow(0.45) }, (x) => { return 'x'+notate(x) }], false],
        [[() => { return player.atoms.dusts.blu.add(1).pow(0.8) }, (x) => { return 'x'+notate(x)+' Preons' }], [() => { return player.atoms.dusts.blu.add(1).pow(0.02).min(1.5) }, (x) => { return '^'+notate(x)+' effect' }]],
        [[() => { return player.atoms.dusts.pur.add(1).logBase(20).floor().min(30) }, (x) => { return '+'+notate(x,0)+' Merges space' }], false],
        [[() => { return player.atoms.dusts.whi.add(1).logBase(5).min(75) }, (x) => { return notate(x)+'%' }], false],
        [[() => { return player.atoms.dusts.bla.add(1).logBase(3).min(75) }, (x) => { return notate(x)+'%' }], false],
    ],
    milestones: {
        col: 4,
        row: 3,
        11: {
            desc: 'Unlock 3 new Sacrifice upgrades.',
            req: E(1),
        },
        12: {
            desc: 'Unlock 3 new Prestige & Energy upgrades.',
            req: E(2),
        },
        13: {
            desc: 'Keep Challenges on Atomize.',
            req: E(4),
        },
        21: {
            desc: 'Keep Prestige & Energy on Atomize (instead of 4 & 5 Sacrifice upgrades).',
            req: E(9),
        },
        22: {
            desc: 'Unlock Atomize Autobuyer. (Max x used to Atomize, where x is Atoms to reset)',
            req: E(16),
        },
        23: {
            desc: 'Keep Sacrifice on Atomize.',
            req: E(25),
        },
        31: {
            desc: 'Keep Preons on Atomize.',
            req: E(36),
        },
        32: {
            desc: 'Start with Energy unlocked (100 Energy stats).',
            req: E(100),
        },
        33: {
            desc: 'Unlock Nucelar.',
            req: E(1e3),
        },
        41: {
            desc: 'Unlock Auto Atom-Merge (buy new Auto-Merger & Auto-Merge).',
            req: E(1e4),
        },
        42: {
            desc: 'Unlock Uranium on Nuclear.',
            req: E(1e5),
        },
        43: {
            desc: 'Placeholder.',
            req: E(1/0),
        },
    },
}