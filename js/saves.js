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
    if(typeof x == "string"){
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
}

function loadGame() {
    wipe()
    load(localStorage.getItem("incMergeSave"))
    loadVue()
    setInterval(save,1000)
}
