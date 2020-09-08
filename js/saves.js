function upd(x,y){document.getElementById(x).innerHTML = y};
function E(x){return new ExpantaNum(x)};

function ex(x){
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}

function calc(dt) {
    if (ticks < UPGRADE.merges[1].cur() & (FORMULA.merges_have() < 20 || player.prestige.upgs.includes(12))) ticks += dt * (player.prestige.upgs.includes(13)?UPGRADE.prestige[13].cur().toNumber():1)
    if (ticks >= UPGRADE.merges[1].cur()) {
        addMerge()
        if (player.prestige.upgs.includes(12)) mergeAll()
        if (player.energy.upgs.includes(12)) {
            UPGRADE.merges[0].buy()
            UPGRADE.merges[1].buy()
        }
        ticks = 0
    }
    player.number = player.number.add(FORMULA.dt_merges().mul(dt / 1000))
    let pr_gain = player.prestige.upgs.includes(22)?FORMULA.prestige_gain().mul(dt / 100000):0
    player.prestige.points = player.prestige.points.add(pr_gain)
    player.prestige.stats = player.prestige.stats.add(pr_gain)
    for (let i = 0; i < 3; i++) {
        player.sacrifice.particles[particles[i]] = player.sacrifice.particles[particles[i]].add(FORMULA.particles_gain(i).mul(dt / 1000))
    }
    if (player.number.gte('e100') & !player.unlocks.includes('challenges')) {
        player.unlocks.push('challenges')
    }
    player.preons.points = player.preons.points.add(FORMULA.preons_gain().mul(dt/1000))
    player.preons.stats = player.preons.stats.add(FORMULA.preons_gain().mul(dt/1000))
}

function wipe() {
    player = {
        number: E(0),
        prestige: {
            points: E(0),
            stats: E(0),
            upgs: [],
        },
        energy: {
            points: E(0),
            stats: E(0),
            upgs: [],
        },
        sacrifice: {
            points: E(0),
            stats: E(0),
            upgs: [],
            particles: {
                p: E(0),
                n: E(0),
                e: E(0),
            }
        },
        preons: {
            points: E(0),
            stats: E(0),
            upgs: [],
        },
        chal: [],
        chalCompleted: [],
        unlocks: [],
        merges: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        minMergeLevel: 1,
        bestMergeLevel: 1,
        ticks: 0,
        achievements: [],
    }
}

function save(){
    if (localStorage.getItem("incMergeSave") == '') wipe()
    localStorage.setItem("incMergeSave",btoa(JSON.stringify(player)))
}
    
function load(x){
    if(typeof x == "string" & x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe()
    }
}

function loadPlayer(load) {
    player.number = ex(load.number)
    player.merges = load.merges
    player.minMergeLevel = load.minMergeLevel
    player.bestMergeLevel = load.bestMergeLevel
    player.ticks = load.ticks
    player.achievements = load.achievements
    if (load.unlocks != undefined) player.unlocks = load.unlocks
    if (load.chal != undefined) player.chal = load.chal
    if (load.chalCompleted != undefined) player.chalCompleted = load.chalCompleted
    if (load.prestige != undefined) player.prestige = {
        points: ex(load.prestige.points),
        stats: ex(load.prestige.stats),
        upgs: load.prestige.upgs,
    }
    if (load.energy != undefined) player.energy = {
        points: ex(load.energy.points),
        stats: ex(load.energy.stats),
        upgs: load.energy.upgs,
    }
    if (load.sacrifice != undefined) player.sacrifice = {
        points: ex(load.sacrifice.points),
        stats: ex(load.sacrifice.stats),
        upgs: load.sacrifice.upgs,
        particles: {
            p: ex(load.sacrifice.particles.p),
            n: ex(load.sacrifice.particles.n),
            e: ex(load.sacrifice.particles.e),
        }
    }
    if (load.preons != undefined) player.preons = {
        points: ex(load.preons.points),
        stats: ex(load.preons.stats),
        upgs: load.preons.upgs,
    }
}

function loadGame() {
    wipe()
    load(localStorage.getItem("incMergeSave"))
    loadVue()
    setInterval(save,1000)
}
