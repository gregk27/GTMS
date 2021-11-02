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

window.onload = ()=>{
    setInterval(() => {
        update();
    }, 60000);
    update();
};