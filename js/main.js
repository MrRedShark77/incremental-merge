var diff = 0;
var date = Date.now();

var player;
var ticks = 0;
var tab = 'Merges'
var stab = 'Atom-Merges'
var particles = ['p','n','e']
var large_particles = ['Proton','Neutron','Electron']
var chal = []
var chalText = (c, r) => { return (player.chal[0] == c*10+r)?(player.number.gte(CHALLENGES[c*10+r].goal)?"Finish":'Exit'):(player.chalCompleted.includes(c*10+r)?'Finished':'Start') }

const FORMULA = {
    merge_effect: (x) => { return (x > 0)?E(3+3*ACHIEVEMENTS.effs[0].cur()).pow(x-1+FORMULA.particles_eff.e_effect().toNumber())
        .mul(FORMULA.prestige_effect())
        .mul(FORMULA.energy_effect())
        .mul(player.chalCompleted.includes(21)?CHALLENGES[21].cur():1)
        .mul(player.atoms.stats.gte(1)?ATOMS.cur[0][0][0]():1)
        .mul(player.preons.upgs.includes(35)?UPGRADE.preons[35].cur():1)
        .mul(player.sacrifice.upgs.includes(35)?UPGRADE.sacrifice[35].cur():1)
        .pow(player.prestige.upgs.includes(21)?1.15:1)
        .pow(player.chal.includes(22)?0.5:1)
        .pow(player.uranium.active?0.1:1)
        .div(player.chal.includes(21)?(player.number.add(1).cbrt()):1)
        :0 },
    atom_merge_effect: (x) => { return (x > 0)?E(5).pow(x-1)
        .mul(FORMULA.nuclear_effect())
        .mul(player.nuclear.upgs.includes(11)?UPGRADE.nuclear[11].cur():1)
        :0 },
    dt_merges: () => {
        let sum = E(0)
        for (let i = 0; i < player.merges.length; i++) sum = sum.add(FORMULA.merge_effect(player.merges[i]))
        return sum
    },
    dt_atom_merges: () => {
        let obj = {}
        for (let i = 0; i < player.atom_merges.length; i++) {
            if (!obj[player.atom_merges[i][1]]) obj[player.atom_merges[i][1]] = E(0)
            obj[player.atom_merges[i][1]] = obj[player.atom_merges[i][1]].add(FORMULA.atom_merge_effect(player.atom_merges[i][0]))
        }
        return obj
    },
    times: () => { return (UPGRADE.merges[1].cur() - ticks < 0)?0:((UPGRADE.merges[1].cur()-ticks)/1000) },
    merges_have: (arr) => {
        let merge = 0
        for (let i = 0; i < arr.length; i++) if (arr[i]>0) merge++
        return merge
    },
    atom_merges_have: (arr) => {
        let merge = 0
        for (let i = 0; i < arr.length; i++) if (arr[i][0]>0) merge++
        return merge
    },
    prestige_effect: () => { return player.prestige.stats.div(100).add(1)
        .pow(player.energy.upgs.includes(21)?1.15:1)
        .pow(player.prestige.upgs.includes(34)?UPGRADE.prestige[34].cur():1)
    },
    prestige_gain: () => { return player.number.add(1).logBase(player.energy.upgs.includes(32)?50:100).pow(3)
        .mul(player.prestige.upgs.includes(11)?UPGRADE.prestige[11].cur():1)
        .mul(FORMULA.particles_eff.n_effect())
        .mul(player.chalCompleted.includes(11)?CHALLENGES[11].cur():1)
        .mul(player.chal.includes(11)?0:1)
        .mul(player.atoms.stats.gte(1)?ATOMS.cur[1][0][0]():1)
        .mul(player.preons.upgs.includes(35)?UPGRADE.preons[35].cur():1)
        .mul(player.sacrifice.upgs.includes(35)?UPGRADE.sacrifice[35].cur():1)
        .pow(player.prestige.upgs.includes(14)?1.25:1)
        .pow(player.chal.includes(22)?0.5:1)
        .pow(player.uranium.active?0.1:1)
    },
    energy_gain: () => { return (player.energy.upgs.includes(13)?UPGRADE.energy[13].cur():E(1))
        .mul(FORMULA.particles_eff.p_effect()
        .mul(player.energy.upgs.includes(23)?UPGRADE.energy[23].cur():1))
        .mul(player.chal.includes(12)?0:1)
        .mul(player.atoms.stats.gte(1)?ATOMS.cur[2][0][0]():1)
        .mul(player.chalCompleted.includes(12)?CHALLENGES[12].cur():1)
        .mul(player.preons.upgs.includes(35)?UPGRADE.preons[35].cur():1)
        .mul(player.sacrifice.upgs.includes(35)?UPGRADE.sacrifice[35].cur():1)
        .pow(player.energy.upgs.includes(31)?1.25:1)
        .pow(player.chal.includes(22)?0.5:1)
        .pow(player.uranium.active?0.1:1)
    },
    energy_effect: () => { return player.energy.stats.add(1)
        .mul(player.energy.upgs.includes(34)?UPGRADE.energy[34].cur():1)
        .pow(player.prestige.upgs.includes(31)?0.95:0.75)
        .pow(player.energy.upgs.includes(33)?UPGRADE.energy[33].cur():1)
    },
    sacr_gain: () => { return player.prestige.stats.add(1).log10().mul(player.energy.stats.add(1).log10().pow(1.5))
        .mul(player.sacrifice.upgs.includes(21)?UPGRADE.sacrifice[21].cur():1)
        .mul(player.sacrifice.upgs.includes(22)?UPGRADE.sacrifice[22].cur():1)
        .mul(player.sacrifice.upgs.includes(33)?UPGRADE.sacrifice[33].cur():1)
        .mul(player.prestige.upgs.includes(35)?UPGRADE.prestige[35].cur():1)
        .mul(FORMULA.preons_effect())
        .mul(player.atoms.stats.gte(1)?ATOMS.cur[3][0][0]():1)
        .pow(player.sacrifice.upgs.includes(14)?1.15:1)
        .pow(player.uranium.active?0.1:1)
    },
    sacr_effect: () => { return player.sacrifice.stats.pow(1.15).mul(player.sacrifice.upgs.includes(11)?UPGRADE.sacrifice[11].cur():1)
        .mul(FORMULA.preons_effect())
        .mul(player.sacrifice.upgs.includes(15)?UPGRADE.sacrifice[15].cur():1)
        .pow(player.sacrifice.upgs.includes(34)?1.15:1)
        .pow(player.uranium.active?0.1:1)
        .pow(FORMULA.uranium_effect())
    },
    particles_eff: {
        p_gain: () => { return player.sacrifice.particles.p.add(1).logBase(player.sacrifice.upgs.includes(24)?3:5).add(1).mul(player.sacrifice.upgs.includes(25)?UPGRADE.sacrifice[25].cur():1) },
        n_gain: () => { return player.sacrifice.particles.n.add(1).logBase(player.sacrifice.upgs.includes(24)?7:10).add(1).mul(player.sacrifice.upgs.includes(25)?UPGRADE.sacrifice[25].cur():1) },
        e_gain: () => { return player.sacrifice.particles.e.add(1).logBase(player.sacrifice.upgs.includes(24)?5:7.5).add(1).mul(player.sacrifice.upgs.includes(25)?UPGRADE.sacrifice[25].cur():1) },
        p_effect: () => { return player.sacrifice.particles.p.add(1).logBase(player.sacrifice.upgs.includes(24)?12:15).add(1) },
        n_effect: () => { return player.sacrifice.particles.n.add(1).logBase(player.sacrifice.upgs.includes(24)?1.4:2).add(1).pow(player.sacrifice.upgs.includes(24)?2/3:1/2) },
        e_effect: () => { return player.sacrifice.particles.e.add(1).logBase(player.sacrifice.upgs.includes(24)?7:10).pow(player.sacrifice.upgs.includes(24)?2/5:1/3) },
    },
    particles_gain: (i) => { return FORMULA.sacr_effect().mul(FORMULA.particles_eff[['e','p','n'][i]+'_gain']()) },
    preons_gain: () => { return (player.sacrifice.upgs.includes(23) && !player.uranium.active)?player.preons.stats.add(1).log10().add(1)
        .mul(player.preons.upgs.includes(11)?UPGRADE.preons[11].cur():1)
        .mul(player.preons.upgs.includes(12)?UPGRADE.preons[12].cur():1)
        .mul(player.preons.upgs.includes(13)?UPGRADE.preons[13].cur():1)
        .mul(player.preons.upgs.includes(33)?UPGRADE.preons[33].cur():1)
        .mul(player.preons.upgs.includes(15)?UPGRADE.preons[15].cur():1)
        .mul(player.atoms.stats.gte(1)?ATOMS.cur[4][0][0]():1)
        .mul(player.chalCompleted.includes(22)?CHALLENGES[22].cur():1)
    :E(0)},
    preons_effect: () => { return player.preons.stats.add(1).log10().add(1)
        .mul(player.preons.upgs.includes(14)?UPGRADE.preons[14].cur():1)
        .mul(player.preons.upgs.includes(22)?UPGRADE.preons[22].cur():1)
        .mul(player.preons.upgs.includes(23)?UPGRADE.preons[23].cur():1)
        .pow(player.atoms.stats.gte(1)?ATOMS.cur[4][1][0]():1)
    },
    atoms_gain: () => { return player.sacrifice.particles.p.add(1).mul(player.sacrifice.particles.n.add(1)).mul(player.sacrifice.particles.e.add(1)).log10().div(50)
        .mul(FORMULA.nuclear_effect())
    },
    atomizes_gain: () => { return FORMULA.atoms_gain().pow(1/2) },
    nuclear_gain: () => { return E(1)
        .mul(player.nuclear.upgs.includes(13)?UPGRADE.nuclear[13].cur():1)
        .mul(player.preons.upgs.includes(25)?UPGRADE.preons[25].cur():1)
        .mul(player.prestige.upgs.includes(25)?UPGRADE.prestige[25].cur():1)
    },
    nuclear_effect: () => { return player.nuclear.stats.add(1).logBase(2).add(1) },
    uranium_gain: () => { return player.number.add(1).log10().sub(5).sub(player.uranium.points).floor().max(0) },
    uranium_need: () => { return E(10).pow(player.uranium.points.add(6)) },
    uranium_msg: () => { return (player.number.gte(FORMULA.uranium_need())?('Gain '+notate(FORMULA.uranium_gain(),0)):('You need '+notate(FORMULA.uranium_need())+' Numbers to gain more'))+' Uranium Power.' },
    uranium_effect: () => { return player.uranium.points.add(1).pow(1/3) },
    recycle_atoms: () => {
        let recycled = E(0)
        for (let i = 0; i < player.atom_merges.length; i++) if (player.atom_merges[i][0] != 0) {
            recycled = recycled.add(E(3).pow(Math.max(0,player.atom_merges[i][0]-player.minAtomMergeLevel)))
        }
        return recycled
    },
}

const TABS = [
    'Merges',
    'Prestige',
    'Energy',
    'Sacrifice',
    'Preons',
    'Atoms',
    'Challenges',
    'Achievements',
    'Options',
]

const STABS = [
    'Atom-Merges',
    "Atom Dusts",
    "Atom Milestones",
    "Nucelar",
]

const TABS_UNL = {
    'Merges': () => { return true },
    'Prestige': () => { return true },
    'Energy': () => { return player.energy.stats.gte(1) },
    'Achievements': () => { return true },
    'Options': () => { return true },
    'Sacrifice': () => { return player.unlocks.includes('sacrifice') },
    'Challenges': () => { return player.unlocks.includes('challenges') },
    'Preons': () => { return player.sacrifice.upgs.includes(23) },
    'Atoms': () => { return player.unlocks.includes('atoms') },
}

const STABS_UNL = {
    'Atom-Merges': () => { return true },
    "Atom Dusts": () => { return true },
    "Atom Milestones": () => { return true },
    "Nucelar": () => { return player.atoms.stats.gte(ATOMS.milestones[33].req) },
}

const UPGRADE = {
    merges: {
        0: {
            autobuy: 0,
            desc: 'Mergers spawn 1 Tier higher.',
            level: () => { return player.minMergeLevel },
            cost: () => { return E(3+(player.minMergeLevel-1)/(25
                *(player.prestige.upgs.includes(32)?1.25:1)
                *(player.prestige.upgs.includes(24)?UPGRADE.prestige[24].cur().toNumber():1))).pow(player.minMergeLevel-1).mul(1000) },
            buy: () => {
                let cost = UPGRADE.merges[0].cost()
                if (player.number.gte(cost)) {
                    player.number = player.number.sub(cost)
                    player.minMergeLevel++
                    if (player.minMergeLevel > player.bestMergeLevel) player.bestMergeLevel = player.minMergeLevel
                    for (let i = 0; i < player.merges.length; i++) if (player.merges[i]<player.minMergeLevel & player.merges[i]!=0) player.merges[i] = player.minMergeLevel
                }
            },
        },
        1: {
            autobuy: 1,
            desc: 'Mergers spawn faster.',
            level: () => { return player.ticks },
            cost: () => { return E(5).pow(player.ticks).mul(1000) },
            cur: () => { return 3000/((player.ticks+1) ** (2/5)) },
            curDesc: (x) => { return notate(x)+' ms' },
            buy: () => {
                let cost = UPGRADE.merges[1].cost()
                if (player.number.gte(cost)) {
                    player.number = player.number.sub(cost)
                    player.ticks++
                }
            },
        },
    },
    prestige: {
        row: 5,
        col: 3,
        11: {
            desc: 'Highest Merge Tier boost Prestige gain.',
            unl: () => { return true },
            cost: () => { return E(250) },
            cur: () => { return E(player.bestMergeLevel).add(1).pow(player.energy.upgs.includes(22)?1/2:1/6)
                .pow(player.prestige.upgs.includes(15)?UPGRADE.prestige[15].cur():1)
            },
            curDesc: (x) => { return notate(x)+'x' },
        },
        12: {
            desc: 'Automatically Merge all mergers like interval "Add Merger".',
            unl: () => { return player.prestige.upgs.includes(11) },
            cost: () => { return E(1000) },
        },
        13: {
            desc: 'Energy stats makes interval for Merges faster.',
            unl: () => { return player.prestige.upgs.includes(12) & player.energy.stats.gte(1) },
            cost: () => { return E(5000) },
            cur: () => { return E(player.energy.stats).add(1).pow(1/5) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        21: {
            desc: 'Raise merges production by 1.15.',
            unl: () => { return player.prestige.upgs.includes(12) },
            cost: () => { return E(20000) },
        },
        22: {
            desc: 'Gain 1% Prestige points/s.',
            unl: () => { return player.prestige.upgs.includes(21) },
            cost: () => { return E(50000) },
        },
        23: {
            desc: 'Unlock Sacrifice.',
            unl: () => { return player.prestige.upgs.includes(22) & !player.unlocks.includes('sacrifice') },
            cost: () => { return E(1e6) },
        },
        31: {
            desc: 'Energy effect formula is better.',
            unl: () => { return player.sacrifice.upgs.includes(13) & player.prestige.upgs.includes(22) },
            cost: () => { return E(1e6) },
        },
        32: {
            desc: 'Merge upgrade 1 cost is 25% cheaper.',
            unl: () => { return player.sacrifice.upgs.includes(13) & player.prestige.upgs.includes(22) },
            cost: () => { return E(3e6) },
        },
        33: {
            desc: 'Energy upgrade 1 formula is better.',
            unl: () => { return player.sacrifice.upgs.includes(13) & player.prestige.upgs.includes(22) },
            cost: () => { return E(6e6) },
        },
        14: {
            desc: 'Raise Prestige gain by 1.25.',
            unl: () => { return player.prestige.upgs.includes(33) & player.atoms.stats.gte(ATOMS.milestones[11].req) },
            cost: () => { return E(1e10) },
        },
        24: {
            desc: 'Merge upgrade 1 cost is adds 5% cheaper every 100 lvl Merge upgrade 2.',
            unl: () => { return player.prestige.upgs.includes(33) & player.atoms.stats.gte(ATOMS.milestones[11].req) },
            cost: () => { return E(1e15) },
            cur: () => { return E(player.ticks).div(100).floor().mul(0.05).add(1) },
            curDesc: (x) => { return notate(x.sub(1).mul(100),0)+'%' },
        },
        34: {
            desc: 'Prestige stats boost Prestige effect.',
            unl: () => { return player.prestige.upgs.includes(33) & player.atoms.stats.gte(ATOMS.milestones[11].req) },
            cost: () => { return E(1e21) },
            cur: () => { return E(player.prestige.stats).add(1).log10().add(1).pow(1/15) },
            curDesc: (x) => { return '^'+notate(x) },
        },
        15: {
            desc: 'Uranium Powers boost Prestige Upgrade 1 effect.',
            unl: () => { return player.nuclear.upgs.includes(21) && player.prestige.upgs.includes(34) },
            cost: () => { return E(1e33) },
            cur: () => { return player.uranium.points.add(1).pow(0.8) },
            curDesc: (x) => { return '^'+notate(x) },
        },
        25: {
            desc: 'Prestige Stats boost Nuclear Power gain.',
            unl: () => { return player.nuclear.upgs.includes(21) && player.prestige.upgs.includes(34) },
            cost: () => { return E(1e36) },
            cur: () => { return player.prestige.points.add(1).log10().add(1).log10().add(1) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        35: {
            desc: 'Prestige Stats boost Sacrifice gain.',
            unl: () => { return player.nuclear.upgs.includes(21) && player.prestige.upgs.includes(34) },
            cost: () => { return E(1e38) },
            cur: () => { return player.prestige.points.add(1).logBase(5).add(1) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
    },
    energy: {
        row: 4,
        col: 3,
        11: {
            desc: 'Highest Merge Tier boost chance to gain Energy.',
            unl: () => { return true },
            cost: () => { return E(5) },
            cur: () => { return E(player.bestMergeLevel).add(1).pow(player.prestige.upgs.includes(33)?1/3:1/5).toNumber() },
            curDesc: (x) => { return notate(x)+'x' },
        },
        12: {
            desc: 'Automatically buy Merge upgrades like interval "Add Merger".',
            unl: () => { return player.energy.upgs.includes(11) },
            cost: () => { return E(25) },
        },
        13: {
            desc: 'Prestige stats boost Energy points gain.',
            unl: () => { return player.energy.upgs.includes(12) & player.prestige.stats.gte(1) },
            cost: () => { return E(50) },
            cur: () => { return player.prestige.stats.add(1).log10().add(1).pow(0.75)
                .pow(player.energy.upgs.includes(14)?UPGRADE.energy[14].cur():1)
            },
            curDesc: (x) => { return notate(x)+'x' },
        },
        21: {
            desc: 'Raise Prestige effect by 1.15.',
            unl: () => { return player.sacrifice.upgs.includes(12) & player.energy.upgs.includes(13) },
            cost: () => { return E(5000) },
        },
        22: {
            desc: 'Prestige upgrade 1 formula is better.',
            unl: () => { return player.sacrifice.upgs.includes(12) & player.energy.upgs.includes(13) },
            cost: () => { return E(20000) },
        },
        23: {
            desc: 'Energy Stats boost Energy gain.',
            unl: () => { return player.sacrifice.upgs.includes(12) & player.energy.upgs.includes(13) },
            cost: () => { return E(50000) },
            cur: () => { return player.energy.stats.add(1).log10().add(1).pow(0.5) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        31: {
            desc: 'Raise Energy gain by 1.25.',
            unl: () => { return player.energy.upgs.includes(23) & player.atoms.stats.gte(ATOMS.milestones[11].req) },
            cost: () => { return E(5e8) },
        },
        32: {
            desc: 'Prestige gain formula is better.',
            unl: () => { return player.energy.upgs.includes(23) & player.atoms.stats.gte(ATOMS.milestones[11].req) },
            cost: () => { return E(1e12) },
        },
        33: {
            desc: 'Energy stats boost Energy effect.',
            unl: () => { return player.energy.upgs.includes(23) & player.atoms.stats.gte(ATOMS.milestones[11].req) },
            cost: () => { return E(1e17) },
            cur: () => { return E(player.energy.stats).add(1).log10().add(1).pow(1/15) },
            curDesc: (x) => { return '^'+notate(x) },
        },
        14: {
            desc: 'Uranium Powers boost Energy Upgrade 3 effect.',
            unl: () => { return player.nuclear.upgs.includes(21) && player.energy.upgs.includes(33) },
            cost: () => { return E(1e34) },
            cur: () => { return player.uranium.points.add(1).pow(0.85) },
            curDesc: (x) => { return '^'+notate(x) },
        },
        24: {
            desc: 'Energy Stats boost Nuclear chance.',
            unl: () => { return player.nuclear.upgs.includes(21) && player.energy.upgs.includes(33) },
            cost: () => { return E(1e37) },
            cur: () => { return player.energy.points.add(1).log10().add(1).log10().add(1) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        34: {
            desc: 'Nuclear Powers boost Energy effect.',
            unl: () => { return player.nuclear.upgs.includes(21) && player.energy.upgs.includes(33) },
            cost: () => { return E(1e38) },
            cur: () => { return player.nuclear.stats.add(1).pow(1.05) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
    },
    sacrifice: {
        row: 5,
        col: 3,
        11: {
            desc: 'Numbers boost Particles gain.',
            unl: () => { return true },
            cost: () => { return E(25) },
            cur: () => { return player.number.add(1).log10().add(1).pow(player.preons.upgs.includes(32)?1.5:0.5) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        12: {
            desc: 'Proton boost chance to Energy gain.',
            unl: () => { return player.sacrifice.upgs.includes(11) },
            cost: () => { return E(50) },
            cur: () => { return player.sacrifice.particles.p.add(1).log10().add(1).pow(0.75) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        13: {
            desc: 'Unlock 3 new Prestige & Energy upgrades.',
            unl: () => { return player.sacrifice.upgs.includes(12) },
            cost: () => { return E(100) },
        },
        21: {
            desc: 'Energy Stats boost Sacrifice gain.',
            unl: () => { return player.sacrifice.upgs.includes(13) },
            cost: () => { return E(250) },
            cur: () => { return player.energy.stats.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        22: {
            desc: 'Prestige Stats boost Sacrifice gain.',
            unl: () => { return player.sacrifice.upgs.includes(13) },
            cost: () => { return E(500) },
            cur: () => { return player.prestige.stats.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        23: {
            desc: 'Unlock Preons, generate Preons.',
            unl: () => { return player.sacrifice.upgs.includes(13) },
            cost: () => { return E(5e3) },
        },
        31: {
            desc: 'You keep all Prestige upgrades upon sacrificing.',
            unl: () => { return player.sacrifice.upgs.includes(23) & player.preons.upgs.includes(21) & !player.atoms.stats.gte(ATOMS.milestones[21].req) },
            cost: () => { return E(1e6) },
        },
        32: {
            desc: 'You keep all Energy upgrades upon sacrificing.',
            unl: () => { return player.sacrifice.upgs.includes(23) & player.preons.upgs.includes(21) & !player.atoms.stats.gte(ATOMS.milestones[21].req) },
            cost: () => { return E(1e7) },
        },
        33: {
            desc: 'Protons, Neutrons & Electrons boost Sacrifice gain.',
            unl: () => { return player.sacrifice.upgs.includes(23) & player.preons.upgs.includes(21) },
            cost: () => { return E(1e8) },
            cur: () => { return player.sacrifice.particles.p.add(1).log10().add(1)
                .add(player.sacrifice.particles.n.add(1).log10().add(1))
                .add(player.sacrifice.particles.e.add(1).log10().add(1))
            },
            curDesc: (x) => { return notate(x)+'x' },
        },
        14: {
            desc: 'Raise Sacrifice gain by 1.15.',
            unl: () => { return player.sacrifice.upgs.includes(33) & player.atoms.stats.gte(ATOMS.milestones[11].req) },
            cost: () => { return E(1e12) },
        },
        24: {
            desc: 'Particles effect formula is better.',
            unl: () => { return player.sacrifice.upgs.includes(33) & player.atoms.stats.gte(ATOMS.milestones[11].req) },
            cost: () => { return E(1e14) },
        },
        34: {
            desc: 'Raise Particles by 1.15.',
            unl: () => { return player.sacrifice.upgs.includes(33) & player.atoms.stats.gte(ATOMS.milestones[11].req) },
            cost: () => { return E(1e16) },
        },
        15: {
            desc: 'Nuclear Powers boost Particles gain.',
            unl: () => { return player.sacrifice.upgs.includes(34) & player.nuclear.upgs.includes(22) },
            cost: () => { return E(1e34) },
            cur: () => { return player.nuclear.stats.add(1).pow(1.15) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        25: {
            desc: 'Nuclear Powers boost all Particle effects of gain.',
            unl: () => { return player.sacrifice.upgs.includes(34) & player.nuclear.upgs.includes(22) },
            cost: () => { return E(1e35) },
            cur: () => { return player.nuclear.stats.add(1).log10().add(1) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        35: {
            desc: 'Sacrifice Stats boost all pre-Sacrifice productions.',
            unl: () => { return player.sacrifice.upgs.includes(34) & player.nuclear.upgs.includes(22) },
            cost: () => { return E(1e36) },
            cur: () => { return player.sacrifice.stats.add(1).log10().add(1) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
    },
    preons: {
        row: 5,
        col: 3,
        11: {
            desc: 'Multiply Preon production based on Energy Stat.',
            unl: () => { return true },
            cost: () => { return E(1000) },
            cur: () => { return player.energy.stats.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        12: {
            desc: 'Multiply Preon production based on Prestige Stat.',
            unl: () => { return true },
            cost: () => { return E(1e4) },
            cur: () => { return player.prestige.stats.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        13: {
            desc: 'Multiply Preon production based on Preon Stat.',
            unl: () => { return true },
            cost: () => { return E(1.5e5) },
            cur: () => { return player.preons.stats.add(1).logBase(2).add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        14: {
            desc: 'Multiply the multiplier that Preons give to particle production based on Neutrons.',
            unl: () => { return true },
            cost: () => { return E(1e6) },
            cur: () => { return player.sacrifice.particles.n.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        21: {
            desc: 'You unlock 3 more Sacrifice upgrades.',
            unl: () => { return player.preons.upgs.includes(14) },
            cost: () => { return E(5e6) },
        },
        22: {
            desc: 'Your Preon effect is multiplied based off of protons.',
            unl: () => { return player.preons.upgs.includes(14) },
            cost: () => { return E(1e7) },
            cur: () => { return player.sacrifice.particles.p.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        23: {
            desc: 'Your Preon effect is multiplied based off of electrons.',
            unl: () => { return player.preons.upgs.includes(14) },
            cost: () => { return E(5e7) },
            cur: () => { return player.sacrifice.particles.e.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        24: {
            desc: 'Gain 1% Sacrifice Points/s.',
            unl: () => { return player.preons.upgs.includes(14) },
            cost: () => { return E(1e9) },
        },
        31: {
            desc: 'Unlock 5th Challenge.',
            unl: () => { return player.preons.upgs.includes(24) },
            cost: () => { return E(2.5e9) },
        },
        32: {
            desc: '1st Sacrifice upgrade formula is better.',
            unl: () => { return player.preons.upgs.includes(24) },
            cost: () => { return E(5e9) },
        },
        33: {
            desc: 'Highest Merge Tier boost Preons gain.',
            unl: () => { return player.preons.upgs.includes(24) },
            cost: () => { return E(1e10) },
            cur: () => { return E(player.bestMergeLevel).add(1).pow(0.75) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        34: {
            desc: 'Unlock Atoms.',
            unl: () => { return player.preons.upgs.includes(24) & !player.unlocks.includes('atoms') },
            cost: () => { return E(1e11) },
        },
        15: {
            desc: 'Nuclear Powers boost Preons gain.',
            unl: () => { return player.preons.upgs.includes(33) & player.nuclear.upgs.includes(15) },
            cost: () => { return E(1e25) },
            cur: () => { return player.nuclear.stats.add(1).pow(2) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        25: {
            desc: 'Preons boost Nuclear Powers gain.',
            unl: () => { return player.preons.upgs.includes(33) & player.nuclear.upgs.includes(15) },
            cost: () => { return E(1e30) },
            cur: () => { return player.preons.stats.add(1).log10().add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        35: {
            desc: 'Preons boost all Pre-Sacrifice productions.',
            unl: () => { return player.preons.upgs.includes(33) & player.nuclear.upgs.includes(15) },
            cost: () => { return E(1e32) },
            cur: () => { return player.preons.stats.add(1).pow(1/8) },
            curDesc: (x) => { return notate(x)+'x' },
        },
    },
    atom_merges: {
        0: {
            desc: 'Atom-Mergers spawn 1 Tier higher.',
            level: () => { return player.minAtomMergeLevel },
            cost: () => { return E(2+(player.minAtomMergeLevel-1)/25).pow(player.minAtomMergeLevel) },
            buy: () => {
                let cost = UPGRADE.atom_merges[0].cost()
                if (player.atoms.points.gte(cost)) {
                    player.atoms.points = player.atoms.points.sub(cost)
                    player.minAtomMergeLevel++
                    for (let i = 0; i < player.atom_merges.length; i++) if (player.atom_merges[i][0]<player.minAtomMergeLevel & player.atom_merges[i][0]!=0) player.atom_merges[i][0] = player.minAtomMergeLevel
                }
            },
        }
    },
    nuclear: {
        row: 5,
        col: 2,
        11: {
            desc: 'Atoms boost Atom Dusts.',
            unl: () => { return true },
            cost: () => { return E(5) },
            cur: () => { return player.atoms.points.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        12: {
            desc: 'Nuclear Power Chance is multiplied based on number of times atomized.',
            unl: () => { return true },
            cost: () => { return E(10) },
            cur: () => { return player.atoms.stats.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        13: {
            desc: 'Atoms boost Nuclear Power gain.',
            unl: () => { return true },
            cost: () => { return E(25) },
            cur: () => { return player.atoms.points.add(1).log10().add(1) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        14: {
            desc: 'Gain 100% Atoms, and Atomizes based on Atoms.',
            unl: () => { return true },
            cost: () => { return E(50) },
        },
        15: {
            desc: 'Unlock 3 more preon upgrades.',
            unl: () => { return true },
            cost: () => { return E(100) },
        },
        21: {
            desc: 'Unlock 3 more Prestige & Energy upgrades.',
            unl: () => { return player.nuclear.upgs.includes(15) },
            cost: () => { return E(1000) },
        },
        22: {
            desc: 'Unlock 3 more Sacrifice upgrades.',
            unl: () => { return player.nuclear.upgs.includes(15) },
            cost: () => { return E(1e4) },
        },
        23: {
            desc: 'Placeholder.',
            unl: () => { return player.nuclear.upgs.includes(15) },
            cost: () => { return E(1/0) },
        },
        24: {
            desc: 'Placeholder.',
            unl: () => { return player.nuclear.upgs.includes(15) },
            cost: () => { return E(1/0) },
        },
        25: {
            desc: 'Placeholder.',
            unl: () => { return player.nuclear.upgs.includes(15) },
            cost: () => { return E(1/0) },
        },
    },
}

const CHALLENGES = {
    col: 3,
    row: 2,
    11: {
        title: 'Non-Prestige',
        desc: 'You cannot gain Prestige.',
        reward: 'Numbers boost Prestige gain.',
        goal: E(1e36),
        unl: () => { return true },
        cur: () => { return player.number.add(1).log10().add(1).pow(0.4) },
        curDesc: (x) => { return notate(x)+'x' },
    },
    12: {
        title: 'Non-Energy',
        desc: 'You cannot gain Energy.',
        reward: 'Numbers boost Energy gain.',
        goal: E(1e64),
        unl: () => { return true },
        cur: () => { return player.number.add(1).log10().add(1).pow(0.6) },
        curDesc: (x) => { return notate(x)+'x' },
    },
    21: {
        title: 'Number-Divison',
        desc: 'Divide Merges production based on Numbers.',
        reward: 'Numbers boost Merges production.',
        goal: E(1e45),
        unl: () => { return player.chalCompleted.includes(11) & player.chalCompleted.includes(12) },
        cur: () => { return player.number.add(1).log10().add(1).pow(2) },
        curDesc: (x) => { return notate(x)+'x' },
    },
    22: {
        title: 'Lower-Points',
        desc: 'Raise all pre-Sacrifice productions by 0.5.',
        reward: 'Numbers boost Preons gain.',
        goal: E(1e20),
        unl: () => { return player.chalCompleted.includes(11) & player.chalCompleted.includes(12) },
        cur: () => { return player.number.add(1).log10().add(1) },
        curDesc: (x) => { return notate(x)+'x' },
    },
    31: {
        title: 'Non-Merge',
        desc: 'You cannot merge mergers (like Non-Energy).',
        reward: 'Every time you merge, you have a chance based on your number go up by 2 instead of one for the same price.',
        goal: E(1e125),
        unl: () => { return player.preons.upgs.includes(31) },
        cur: () => { return player.number.add(1).log10().add(1).logBase(2) },
        curDesc: (x) => { return notate(x)+'%' },
    },
    32: {
        title: 'Placeholder',
        desc: 'Placeholder.',
        reward: 'Placeholder.',
        goal: E(1/0),
        unl: () => { return false },
    },
}

const ACHIEVEMENTS = {
    unls: {

    },
    effs: {
        0: {
            desc: 'Highest Merge level, every 10 will merge effects has added 2.5% stronger (capped at 100%).',
            best: () => { return player.bestMergeLevel },
            cur: () => { return Math.min(Math.floor(player.bestMergeLevel/10)*0.025, 1) },
            curDesc: (x) => { return notate(x*100,1) + '%' }, 
        },
    },
}

function startChal(id) {
    if (player.chal.length == 0) {
        resetChal()
        player.chal.push(id)
    } else if (player.chal[0] == id) {
        if (player.number.gte(CHALLENGES[id].goal) & !player.chalCompleted.includes(id)) {
            player.chalCompleted.push(id)
        }
        resetChal()
        player.chal = []
    }
}

function resetChal() {
    player.number = E(0)
    player.prestige.points = E(0)
    player.prestige.stats = E(0)
    if (!player.sacrifice.upgs.includes(31) & !player.atoms.stats.gte(ATOMS.milestones[21].req)) player.prestige.upgs = []
    player.energy.points = E(0)
    player.energy.stats = E(0)
    if (!player.sacrifice.upgs.includes(32) & !player.atoms.stats.gte(ATOMS.milestones[21].req)) player.energy.upgs = []
    player.merges = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    player.minMergeLevel = 1
    player.ticks = 0
}

function buyUPG(upg, id) {
    let cost = UPGRADE[upg][id].cost()
    if (player[upg].points.gte(cost) & !player[upg].upgs.includes(id)) {
        player[upg].points = player[upg].points.sub(cost)
        player[upg].upgs.push(id)
        if (upg == 'prestige' & id == 23 & !player.unlocks.includes('sacrifice')) player.unlocks.push('sacrifice')
        if (upg == 'preons' & id == 34 & !player.unlocks.includes('atoms')) player.unlocks.push('atoms')
    }
}

function resetPrestige() {
    if (FORMULA.prestige_gain().gte(100)) {
        player.prestige.points = player.prestige.points.add(FORMULA.prestige_gain())
        player.prestige.stats = player.prestige.stats.add(FORMULA.prestige_gain())
        player.number = E(0)
        player.merges = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        player.minMergeLevel = 1
        player.ticks = 0
    }
}

function resetSacrifice() {
    if (FORMULA.sacr_gain().gte(20)) {
        player.sacrifice.points = player.sacrifice.points.add(FORMULA.sacr_gain())
        player.sacrifice.stats = player.sacrifice.stats.add(FORMULA.sacr_gain())
        resetChal()
    }
}

function resetAtom() {
    player.atoms.points = player.atoms.points.add(FORMULA.atoms_gain())
    player.atoms.stats = player.atoms.stats.add(1)
    player.unlocks = ['atoms', 'challenges']
    if (player.atoms.stats.gte(ATOMS.milestones[21].req)) player.unlocks.push('sacrifice')
    player.chal = []
    if (!player.atoms.stats.gte(ATOMS.milestones[13].req)) player.chalCompleted = []
    player.number = E(0)
    player.prestige.points = E(0)
    player.prestige.stats = E(0)
    if (!player.atoms.stats.gte(ATOMS.milestones[21].req)) player.prestige.upgs = []
    player.energy.points = E(0)
    player.energy.stats = player.atoms.stats.gte(ATOMS.milestones[32].req)?E(100):E(0)
    if (!player.atoms.stats.gte(ATOMS.milestones[21].req)) player.energy.upgs = []
    player.merges = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    player.minMergeLevel = 1
    player.ticks = 0
    player.sacrifice = {
        points: E(0),
        stats: E(0),
        upgs: player.atoms.stats.gte(ATOMS.milestones[23].req)?player.sacrifice.upgs:[],
        particles: {
            p: E(0),
            n: E(0),
            e: E(0),
        }
    }
    player.preons = {
        points: E(0),
        stats: E(0),
        upgs: player.atoms.stats.gte(ATOMS.milestones[31].req)?player.preons.upgs:[],
    }
}

function atomize() {
    if (FORMULA.atoms_gain().gte(1)) {
        if (player.atoms.stats.gte(ATOMS.milestones[22].req)?true:confirm('Are you really atomize? Reset all previous progress to gain Atoms! Ready?')) {
            resetAtom()
        }
    }
}

function startUranium() {
    if (player.uranium.active & FORMULA.uranium_gain().gt(0)) {
        player.uranium.points = player.uranium.points.add(FORMULA.uranium_gain())
    }
    resetAtom()
    player.uranium.active = !player.uranium.active
}

function changeTab(curTab) {
    player.tab = curTab
}

function changeSTab(curTab) {
    player.stab = curTab
}

function addMerge() {
    for (let i = 0; i < player.merges.length; i++) if (player.merges[i] == 0) {
        player.merges[i] = player.minMergeLevel;
        let chance = E(Math.random() * 101).lte(player.atoms.stats.gte(1)?ATOMS.cur[6][0][0]():-1)
        if (chance) player.merges[i]++
        break;
    }
}

function addAtomMerge() {
    if (player.atoms.points.gte(1) && FORMULA.atom_merges_have(player.atom_merges) < 20) {
        player.atoms.points = player.atoms.points.sub(1)
        for (let i = 0; i < player.atom_merges.length; i++) if (player.atom_merges[i][0] == 0) {
            player.atom_merges[i][0] = player.minAtomMergeLevel
            player.atom_merges[i][1] = ATOMCOLORS[Math.floor(Math.random() * 8)]
            break
        }
    }
}

function mergeAll() {
    if (player.merges.length > 1 & !player.chal.includes(31)) {
        for (let i = 0; i < player.merges.length - 1; i++){
            for (let j = i+1; j < player.merges.length; j++){
                if(player.merges[i] == player.merges[j] && player.merges[i] != 0 && player.merges[j] != 0){
                    let chance = E(Math.random() * 101).lte(E(1).mul(player.energy.upgs.includes(11)?UPGRADE.energy[11].cur():1).mul(player.sacrifice.upgs.includes(12)?UPGRADE.sacrifice[12].cur():1).add(player.atoms.stats.gte(1)?ATOMS.cur[2][1][0]():1))
                    if (chance) {
                        let gain = FORMULA.energy_gain()
                        player.energy.points = player.energy.points.add(gain)
                        player.energy.stats = player.energy.stats.add(gain)
                    }
                    chance = E(Math.random() * 101).lte(E(player.chalCompleted.includes(31)?CHALLENGES[31].cur():-1).add(player.atoms.stats.gte(1)?ATOMS.cur[7][0][0]().add(1):0))
                    if (chance) player.merges[i]++
                    player.merges[i]++
                    if (player.merges[i] > player.bestMergeLevel) player.bestMergeLevel = player.merges[i]
                    player.merges[j] = 0
                    break;
                }
            }
        }
    }
}

function atom_mergeALL() {
    if (player.atom_merges.length > 2) {
        for (let i = 0; i < player.atom_merges.length-2; i++) {
            let merged = false
            for (let j = i+1; j < player.atom_merges.length-1; j++) {
                for (let k = j+1; k < player.atom_merges.length; k++) {
                    if((player.atom_merges[i][0]==player.atom_merges[j][0] && player.atom_merges[j][0]==player.atom_merges[k][0] && player.atom_merges[i][0]==player.atom_merges[k][0]) && player.atom_merges[i][0]>0 && player.atom_merges[j][0]>0 && player.atom_merges[k][0]>0) {
                        player.atom_merges[i][0]++
                        player.atom_merges[i][1]=ATOMCOLORS[Math.floor(Math.random() * 8)]
                        player.atom_merges[j][0]=0
                        player.atom_merges[k][0]=0
                        merged = true

                        let chance = E(Math.random() * 101).lt(E(1)
                            .mul(player.nuclear.upgs.includes(12)?UPGRADE.nuclear[12].cur():1)
                            .mul(player.energy.upgs.includes(24)?UPGRADE.energy[24].cur():1)
                        )
                        if (chance & player.atoms.stats.gte(ATOMS.milestones[33].req)) {
                            let gain = FORMULA.nuclear_gain()
                            player.nuclear.points = player.nuclear.points.add(gain)
                            player.nuclear.stats = player.nuclear.stats.add(gain)
                        }

                        break
                    }
                }
                if (merged) break
            }
        }
    }
}

function recycleAtoms() {
    if (FORMULA.recycle_atoms().gt(0)) if (confirm('Are you really recycle all Atom-Mergers?')) {
        player.atoms.points = player.atoms.points.add(FORMULA.recycle_atoms())
        for (let i = 0; i < player.atom_merges.length; i++) player.atom_merges[i][0] = 0
    }
}

function notate(ex, acc=2) {
    ex = E(ex)
    if (ex.isInfinite()) return 'Infinity'
    let e = ex.log10().floor()
    if (e.lt(6)) {
        if (e.lt(3)) {
            return ex.toFixed(acc)
        }
        return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    let m = ex.div(E(10).pow(e))
    return (e.log10().gte(6)?'':m.toFixed(2))+'e'+notate(e,0)
}

function loop(){
    diff = Date.now()-date;
    calc(diff);
    date = Date.now();
}

setInterval(loop, 33)