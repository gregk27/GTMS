var lastMatch = -1;

async function update(){
    let teams = await (await fetch("/teams/scoreboard")).json();
    console.log(teams);
    let html0 = "";
    let html1 = "";
    // NOTE: Loops for 1 to n, since rank is used more than index
    for(let i=1; i<=teams.length; i++){
        t = teams[i-1];
        html0 += `
        <div class="team">
            <div>${i}</div>
            <div>${t.name}<span style="float:right">${t.number}</span></div>
            <div></div>
            <div>${t.rpa.toFixed(2)}</div>
            <div></div>
            <div>${t.wins}</div>
            <div>${t.losses}</div>
            <div>${t.ties}</div>
            <div></div>
        </div>`
        html1 += `
        <div class="team">
            <div>${i}</div>
            <div>${t.name}<span style="float:right">${t.number}</span></div>
            <div></div>
            <div>${t.rpa.toFixed(2)}</div>
            <div></div>
            <div>${t.score}</div>
            <div>${t.metA}</div>
            <div>${t.metB}</div>
            <div></div>
        </div>`
    }
    document.querySelector("#layer-0 .schedule").innerHTML = html0;
    document.querySelector("#layer-1 .schedule").innerHTML = html1;
}

// Check if match id has changed, if it has then update
async function checkMatch(){
    match = await(await fetch("/game/data")).json();
    if(match.saved && match.id != lastMatch){
        lastMatch = match.id;
        update();
    }
}

var currLayer = 0;
var numLayer = 2;
async function cycle(){
    document.getElementById(`layer-${currLayer}`).style.opacity = 0;
    if(++currLayer >= numLayer) currLayer = 0;
    document.getElementById(`layer-${currLayer}`).style.opacity = 100;
}

window.onload = ()=>{
    setInterval(() => {
        checkMatch();
    }, 5000);
    setInterval(()=>{
        cycle();
    }, 30000)
    checkMatch();
    update();
};