var diff = 0;
var date = Date.now();

var player;
var ticks = 0;
var tab = 'Merges'

const FORMULA = {
    merge_effect: (x) => { return (x > 0)?E(3+3*ACHIEVEMENTS.effs[0].cur()).pow(x-1):0 },
    dt_merges: () => {
        let sum = E(0)
        for (let i = 0; i < player.merges.length; i++) sum = sum.add(FORMULA.merge_effect(player.merges[i]))
        return sum
    },
    times: () => { return (UPGRADE[1].cur() - ticks < 0)?0:((UPGRADE[1].cur()-ticks)/1000) },
    merges_have: () => {
        let merge = 0
        for (let i = 0; i < player.merges.length; i++) if (player.merges[i]!=0) merge++
        return merge
    },
}

const TABS = [
    'Merges',
    'Prestige',
    'Achievements',
]

const UPGRADE = {
    0: {
        desc: 'Mergers spawn 1 Tier higher.',
        level: () => { return player.minMergeLevel },
        cost: () => { return E(3+(player.minMergeLevel-1)/25).pow(player.minMergeLevel-1).mul(1000) },
        buy: () => {
            let cost = UPGRADE[0].cost()
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
        curDesc: (x) => { return notate(x)+'ms' },
        buy: () => {
            let cost = UPGRADE[1].cost()
            if (player.number.gte(cost)) {
                player.number = player.number.sub(cost)
                player.ticks++
            }
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
                    player.merges[i]++;
                    if (player.merges[i] > player.bestMergeLevel) player.bestMergeLevel = player.merges[i]
                    player.merges[j] = 0;
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