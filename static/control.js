function toMMSS (unix) {
    if(unix < 0) return "00:00";
    unix = Math.floor(unix/1000);
    var minutes = Math.floor((unix / 60));
    var seconds = unix - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

async function update(){
    let teams = await (await fetch("/teams/list")).json();
    let html = "<tr><th>Number</th><th>Name</th></tr>\n";
    for(let t of teams){
        html += `<tr><td>${t.number}</td><td>${t.name}</td></tr>\n`;
    }
    document.querySelector("#teams > table").innerHTML = html;3

    let matches = await(await fetch("/matches/list?dat=all")).json();
    html = "<tr><th>ID</th><th>Name</th><th>Red team</th><th>Red Score</th><th>Blue Team</th><th>Blue Score</th></tr>";
    for(let m of matches){
        html += `<tr><td>${m.id}</td><td>${m.type} ${m.number}</td><td class='number'>${m.redTeam}</td><td class='number'>${m.redScore ?? "-"}</td><td class='number'>${m.blueTeam}</td><td class='number'>${m.blueScore ??  '-'}</td></tr>`
    }
    document.querySelector("#schedule > table").innerHTML = html;
}

async function updateCurrent(){
    let data = await (await fetch("/game/data")).json();
    console.log(data);
    document.getElementById("currentNum").innerText = data.name;
    document.getElementById("currentTeams").innerText = `${data.red.num} v ${data.blue.num}`;
    document.getElementById("currentScore").innerText = `${data.red.score} - ${data.blue.score}`;
    document.getElementById("currentTime").innerText = toMMSS(data.endTime - Date.now())
}

window.onload = ()=>{
    update();
    setInterval(() => {
        updateCurrent();
    }, 2000);
    updateCurrent();
}