async function update(){
    let teams = await (await fetch("/teams/scoreboard")).json();
    console.log(teams);
    let html = "";
    for(let t of teams){
        html += `
        <div class="team">
            <div>${t.name}<span style="float:right">${t.number}</span></div>
            <div>${t.wins}</div>
            <div>${t.losses}</div>
            <div>${t.ties}</div>
            <div>${t.score}</div>
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