var diff = 0;
var date = Date.now();

var player;
var ticks = 0;
var tab = 'Merges'

const FORMULA = {
    merge_effect: (x) => { return (x > 0)?E(3+3*ACHIEVEMENTS.effs[0].cur()).pow(x-1).mul(FORMULA.prestige_effect()).mul(FORMULA.energy_effect()):0 },
    dt_merges: () => {
        let sum = E(0)
        for (let i = 0; i < player.merges.length; i++) sum = sum.add(FORMULA.merge_effect(player.merges[i]))
        return sum
    },
    times: () => { return (UPGRADE.merges[1].cur() - ticks < 0)?0:((UPGRADE.merges[1].cur()-ticks)/1000) },
    merges_have: () => {
        let merge = 0
        for (let i = 0; i < player.merges.length; i++) if (player.merges[i]!=0) merge++
        return merge
    },
    prestige_effect: () => { return player.prestige.stats.div(100).add(1) },
    prestige_gain: () => { return player.number.add(1).logBase(100).pow(3).mul(player.prestige.upgs.includes(11)?UPGRADE.prestige[11].cur():1) },
    energy_effect: () => { return player.energy.stats.add(1).pow(0.5) },
}

const TABS = [
    'Merges',
    'Prestige',
    'Energy',
    'Achievements',
    'Options',
]

const TABS_UNL = {
    'Merges': () => { return true },
    'Prestige': () => { return true },
    'Energy': () => { return player.energy.stats.gte(1) },
    'Achievements': () => { return true },
    'Options': () => { return true },
}

const UPGRADE = {
    merges: {
        0: {
            desc: 'Mergers spawn 1 Tier higher.',
            level: () => { return player.minMergeLevel },
            cost: () => { return E(3+(player.minMergeLevel-1)/25).pow(player.minMergeLevel-1).mul(1000) },
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
        row: 3,
        col: 1,
        11: {
            desc: 'Highest Merge Tier boost Prestige gain.',
            unl: () => { return true },
            cost: () => { return E(250) },
            cur: () => { return E(player.bestMergeLevel).add(1).pow(1/6) },
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
    },
    energy: {
        row: 3,
        col: 1,
        11: {
            desc: 'Highest Merge Tier boost chance to gain Energy.',
            unl: () => { return true },
            cost: () => { return E(5) },
            cur: () => { return E(player.bestMergeLevel).add(1).pow(1/5).toNumber() },
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
            cost: () => { return E(100) },
            cur: () => { return player.prestige.stats.add(1).log10().add(1).pow(0.75) },
            curDesc: (x) => { return notate(x)+'x' },
        },
    },
}

const ACHIEVEMENTS = {
    unls: {

    },
    effs: {
        0: {
            desc: 'Highest Merge level, every 10 will merge effects has added 2.5% stronger.',
            best: () => { return player.bestMergeLevel },
            cur: () => { return Math.floor(player.bestMergeLevel/10)*0.025 },
            curDesc: (x) => { return notate(x*100,1) + '%' }, 
        },
    },
}

function buyUPG(upg, id) {
    let cost = UPGRADE[upg][id].cost()
    if (player[upg].points.gte(cost) & !player[upg].upgs.includes(id)) {
        player[upg].points = player[upg].points.sub(cost)
        player[upg].upgs.push(id)
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

function changeTab(curTab) {
    document.getElementById(tab).style.display = 'none'
    tab = curTab
    document.getElementById(tab).style.display = ''
}

function addMerge() {
    for (let i = 0; i < player.merges.length; i++) if (player.merges[i] == 0) {
        player.merges[i] = player.minMergeLevel;
        break;
    }
}

function mergeAll() {
    if (player.merges.length > 1) {
        for (let i = 0; i < player.merges.length - 1; i++){
            for (let j = i+1; j < player.merges.length; j++){
                if(player.merges[i] == player.merges[j] && player.merges[i] != 0 && player.merges[j] != 0){
                    let chance = Math.random() * 101
                    if (chance <= (player.energy.upgs.includes(11)?UPGRADE.energy[11].cur():1)) {
                        let gain = player.energy.upgs.includes(13)?UPGRADE.energy[13].cur():1
                        player.energy.points = player.energy.points.add(gain)
                        player.energy.stats = player.energy.stats.add(gain)
                    }
                    player.merges[i]++
                    if (player.merges[i] > player.bestMergeLevel) player.bestMergeLevel = player.merges[i]
                    player.merges[j] = 0
                    break;
                }
            }
        }
    }
}

function notate(ex, acc=2) {
    ex = E(ex)
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

setInterval(loop, 50)