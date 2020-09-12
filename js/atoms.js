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
        'gives more Number.',
        'gives more Prestige points.',
        'gives more Energy, and boosts Energy chance gain.',
        'gives more Sacrifice points.',
        "gives more Preons, and boosts it's effect.",
        'gives more Merge space. (max 30)',
        'gives a chance that when a Merge spawns, spawns with +1 tier.',
        'gives a chance that when merging, the result spawns 1 tier higher 1+1 = 3.',
    ],
    cur: [
        [[() => { return player.atoms.dusts.red.add(1).pow(1.1) }, (x) => { return 'x'+notate(x) }], false],
        [[() => { return player.atoms.dusts.ora.add(1).pow(0.6) }, (x) => { return 'x'+notate(x) }], false],
        [[() => { return player.atoms.dusts.yel.add(1).pow(0.75) }, (x) => { return 'x'+notate(x)+' Energy' }], [() => { return player.atoms.dusts.yel.add(1).logBase(3).pow(1.5).min(50) }, (x) => { return notate(x)+'% chance' }]],
        [[() => { return player.atoms.dusts.gre.add(1).pow(0.45) }, (x) => { return 'x'+notate(x) }], false],
        [[() => { return player.atoms.dusts.blu.add(1).pow(0.8) }, (x) => { return 'x'+notate(x)+' Preons' }], [() => { return player.atoms.dusts.blu.add(1).pow(0.02).min(1.5) }, (x) => { return '^'+notate(x)+' effect' }]],
        [[() => { return player.atoms.dusts.pur.add(1).logBase(20).floor().min(30) }, (x) => { return '+'+notate(x,0)+' Merges space' }], false],
        [[() => { return player.atoms.dusts.whi.add(1).logBase(5).min(75) }, (x) => { return notate(x)+'%' }], false],
        [[() => { return player.atoms.dusts.bla.add(1).logBase(3).min(75) }, (x) => { return notate(x)+'%' }], false],
    ],
}