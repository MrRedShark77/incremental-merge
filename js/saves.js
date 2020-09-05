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
    if (ticks < UPGRADE[1].cur() & FORMULA.merges_have() < 20) ticks += dt
    if (ticks >= UPGRADE[1].cur()) {
        addMerge()
        ticks = 0
    }
    player.number = player.number.add(FORMULA.dt_merges().mul(dt / 1000))
}

function wipe() {
    player = {
        number: E(0),
        merges: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        minMergeLevel: 1,
        bestMergeLevel: 1,
        ticks: 0,
        upgs: [],
        achievements: [],
    }
}

function save(){
    if (localStorage.getItem("incMergeSave") == '') wipe()
    localStorage.setItem("incMergeSave",btoa(JSON.stringify(player)));
}
    
function load(x){
    if(typeof x == "string"){
        let load = JSON.parse(atob(x));
        player = {
            number: ex(load.number),
            merges: load.merges,
            minMergeLevel: load.minMergeLevel,
            bestMergeLevel: load.bestMergeLevel,
            ticks: load.ticks,
            upgs: load.upgs,
            achievements: load.achievements,
        }
    } else {
        wipe();
    }
}

function loadGame() {
    wipe()
    load(localStorage.getItem("incMergeSave"))
    loadVue()
    setInterval(save,1000)
}
