lastMatch = -1;

async function update(){
    let schedule = await (await fetch("/matches/list?dat=sch")).json();
    let html = "";
    for(let m of schedule){
        html += `
        <div class="match">
            <div class="matchName">${m.type} ${m.number}</div>
            <div class="redTeam">${m.redName}<span style="float:right">${m.redTeam}</span></div>
            <div class="blueTeam">${m.blueName}<span style="float:right">${m.blueTeam}</span></div>
        </div>
        `
    }
    document.getElementById("schedule").innerHTML = html;
}

// Check if match id has changed, if it has then update
async function checkMatch(){
    match = await(await fetch("/game/data")).json();
    if(match.id != lastMatch){
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