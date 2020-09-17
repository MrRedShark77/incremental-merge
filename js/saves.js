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
    if (ticks < UPGRADE.merges[1].cur() & (FORMULA.merges_have(player.merges) < player.merges.length || player.prestige.upgs.includes(12))) ticks += dt * (player.prestige.upgs.includes(13)?UPGRADE.prestige[13].cur().toNumber():1)
    if (ticks >= UPGRADE.merges[1].cur()) {
        addMerge()
        if (player.prestige.upgs.includes(12)) mergeAll()
        if (player.energy.upgs.includes(12)) {
            for (let i = 0; i < 2; i++) if (player.autobuys.merges[i]) UPGRADE.merges[i].buy()
        }
        ticks = 0
    }
    player.number = player.number.add(FORMULA.dt_merges().mul(dt / 1000))
    let pr_gain = player.prestige.upgs.includes(22)?FORMULA.prestige_gain().mul(dt / 100000):0
    player.prestige.points = player.prestige.points.add(pr_gain)
    player.prestige.stats = player.prestige.stats.add(pr_gain)
    let sc_gain = player.preons.upgs.includes(24)?FORMULA.sacr_gain().mul(dt / 100000):0
    player.sacrifice.points = player.sacrifice.points.add(sc_gain)
    player.sacrifice.stats = player.sacrifice.stats.add(sc_gain)
    for (let i = 0; i < 3; i++) {
        player.sacrifice.particles[particles[i]] = player.sacrifice.particles[particles[i]].add(FORMULA.particles_gain(i).mul(dt / 1000))
    }
    if (player.number.gte('e100') & !player.unlocks.includes('challenges')) {
        player.unlocks.push('challenges')
    }
    player.preons.points = player.preons.points.add(FORMULA.preons_gain().mul(dt/1000))
    player.preons.stats = player.preons.stats.add(FORMULA.preons_gain().mul(dt/1000))
    for (let i = 0; i < 8; i++) {
        let gain = FORMULA.dt_atom_merges()[ATOMCOLORS[i]]
        player.atoms.dusts[ATOMCOLORS[i]] = player.atoms.dusts[ATOMCOLORS[i]].add(gain?gain.mul(dt/1000):0)
    }
    if (ATOMS.cur[5][0][0]().gt(player.merges.length-20)) {
        player.merges.push(0)
    }
    if (!player.unlocks.includes('sacrifice') & player.prestige.upgs.includes(23)) player.unlocks.push('sacrifice')
    if (player.atoms.stats.gte(ATOMS.milestones[22].req) & player.autobuys.atoms[0]) {
        let max = E(player.autobuys.atoms[1]).isNaN()?E(Infinity):E(player.autobuys.atoms[1])
        if (FORMULA.atoms_gain().gte(max)) atomize()
    }
    player.atoms.points = player.atoms.points.add(player.nuclear.upgs.includes(14)?FORMULA.atoms_gain().mul(dt/1000):0)
    player.atoms.stats = player.atoms.stats.add(player.nuclear.upgs.includes(14)?FORMULA.atomizes_gain().mul(dt/1000):0)
    if (player.atoms.stats.gte(ATOMS.milestones[41].req)) {
        if (player.autobuys.atom_merges[0]) addAtomMerge()
        if (player.autobuys.atom_merges[1]) atom_mergeALL()
    }
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
        atoms: {
            points: E(0),
            stats: E(0),
            dusts: {},
            upgs: [],
        },
        nuclear: {
            points: E(0),
            stats: E(0),
            upgs: [],
        },
        uranium: {
            points: E(0),
            active: false,
        },
        chal: [],
        chalCompleted: [],
        unlocks: [],
        merges: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        atom_merges: [],
        minMergeLevel: 1,
        bestMergeLevel: 1,
        ticks: 0,
        tab: 0,
        stab: 0,
        minAtomMergeLevel: 1,
        achievements: [],
        autobuys: {
            merges: [true, true],
            atom_merges: [false, false],
            atoms: [false, E(2)],
        },
    }
    for (let i = 0; i < 8; i++) player.atoms.dusts[ATOMCOLORS[i]] = E(0)
    for (let i = 0; i < 20; i++) player.atom_merges.push([0, ATOMCOLORS[Math.floor(Math.random() * 8)]])
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

function exporty() {
    save();
    let file = new Blob([btoa(JSON.stringify(player))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "Incremental Merge Save.txt"
    a.click()
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame != "") {
        load(loadgame)
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
    if (load.atoms != undefined) {
        player.atoms = {
            points: ex(load.atoms.points),
            stats: ex(load.atoms.stats),
            dusts: {},
            upgs: load.atoms.upgs,
        }
        for (let i = 0; i < 8; i++) player.atoms.dusts[ATOMCOLORS[i]] = ex(load.atoms.dusts[ATOMCOLORS[i]])
    }
    if (load.atom_merges != undefined) player.atom_merges = load.atom_merges
    if (load.minAtomMergeLevel != undefined) player.minAtomMergeLevel = load.minAtomMergeLevel
    if (load.autobuys != undefined) {
        player.autobuys = {
            merges: load.autobuys.merges,
            atom_merges: ((load.autobuys.atom_merges != undefined)?(load.autobuys.atom_merges):([false,false])),
            atoms: [false, E(2)],
        }
    }
    if (load.nuclear != undefined) player.nuclear = {
        points: ex(load.nuclear.points),
        stats: ex(load.nuclear.stats),
        upgs: load.nuclear.upgs,
    }
    if (load.uranium != undefined) player.uranium = {
        points: ex(load.uranium.points),
        active: load.uranium.active,
    }
}

function loadGame() {
    wipe()
    load(localStorage.getItem("incMergeSave"))
    loadVue()
    setInterval(save,1000)
}
