var lastMatch = -1;

async function update(){
    let teams = await (await fetch("/teams/scoreboard")).json();
    console.log(teams);
    let html = "";
    for(let t of teams){
        html += `
        <div class="team">
            <div>${t.name}<span style="float:right">${t.number}</span></div>
            <div></div>
            <div>${t.wins}</div>
            <div>${t.losses}</div>
            <div>${t.ties}</div>
            <div></div>
            <div>${t.score}</div>
            <div>${t.metA}</div>
            <div>${t.metB}</div>
        </div>
        `
    }
    document.getElementById("schedule").innerHTML = html;
}

// Check if match id has changed, if it has then update
async function checkMatch(){
    match = await(await fetch("/game/data")).json();
    if(match.saved && match.id != lastMatch){
        lastMatch = match.id;
        update();
    }
}

window.onload = ()=>{
    setInterval(() => {
        checkMatch();
    }, 5000);
    checkMatch();
    update();
};