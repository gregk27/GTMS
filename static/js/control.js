import {socket, init as sInit} from '/js/socketbase.js';
import init from '/js/gamebase.js'

sInit(["matchSaved", "matchLoaded", "matchStarted", "scoreChanged", "matchFinished"], ()=>{
    socket.emit("getScoreboard");
    socket.emit("getMatchData");
    socket.emit("getHostname");
})
init(updateCurrent, document.getElementById("currentTime"), null)

var authString = new URLSearchParams(window.location.search).get('auth');

socket.on("getScoreboard", (teams) => {
    let html = "<tr><th>Number</th><th>Name</th><th>W</th><th>L</th><th>T</th><th>RP</th><th>RPA</th><th>Score</th><th>MetA</th><th>MetB</th></tr>\n";
    for(let t of teams){
        html += `<tr>
        <td>${t.number}</td>
        <td>${t.name}</td>
        <td class='number'>${t.wins}</td>
        <td class='number'>${t.losses}</td>
        <td class='number'>${t.ties}</td>
        <td class='number'>${t.rp}</td>
        <td class='number'>${t.rpa.toFixed(2)}</td>
        <td class='number'>${t.score}</td>
        <td class='number'>${t.metA}</td>
        <td class='number'>${t.metB}</td>
        </tr>\n`;
    }
    document.querySelector("#teams > table").innerHTML = html;3
});

socket.on("getMatchData", (matches) => {
    let html = "<tr><th>ID</th><th>Name</th><th>Red team</th><th>Red Score</th><th>Red MetA</th><th>Red MetB</th><th>Blue Team</th><th>Blue Score</th><th>Blue MetA</th><th>Blue MetB</th><th></th></tr>";
    for(let m of matches){
        html += `<tr>
        <td>${m.id}</td>
        <td>${m.type} ${m.number}</td>
        <td class='number'>${m.redTeam}</td>
        <td class='number'>${m.redScore ?? "-"}</td>
        <td class='number'>${m.redMetA ?? "-"}</td>
        <td class='number'>${m.redMetB ?? "-"}</td>
        <td class='number'>${m.blueTeam}</td>
        <td class='number'>${m.blueScore ??  '-'}</td>
        <td class='number'>${m.blueMetA ??  '-'}</td>
        <td class='number'>${m.blueMetB ??  '-'}</td>
        <td><button onclick="loadNext(${m.id})">Load</button></td>
        </tr>\n`
    }
    document.querySelector("#schedule > table").innerHTML = html;
})

async function updateCurrent(data){
    document.getElementById("currentNum").innerText = data.name;
    document.getElementById("currentTeams").innerText = `${data.red.num} v ${data.blue.num}`;
    document.getElementById("currentScore").innerText = `${data.red.score} - ${data.blue.score}`;
}

window.saveScore = saveScore;
async function saveScore(){
    document.getElementById('saveScore').disabled = true;
    socket.emit("saveMatch", {}, authString);
}

window.startMatch = startMatch;
async function startMatch(){
    socket.emit("startMatch", {}, authString)
}

window.loadNext = loadNext;
async function loadNext(id=-1){
    socket.emit("loadMatch", {id}, authString);
}

window.testAudio = () => {
    socket.emit('testAudio', {}, authString);
}

socket.on("getHostname", (hostname)=>{
    new QRCode(document.getElementById("redInputCode"), {text: `http://${hostname}/input?a=red&auth=${authString}`, width:128, height:128});
    new QRCode(document.getElementById("blueInputCode"), {text: `${hostname}/input?a=blue&auth=${authString}`, width:128, height:128});
})

socket.on('matchSaved', () => {
    socket.emit("getMatchData");
    socket.emit("getScoreboard");
    
    document.getElementById("saveScore").style.display='none';
    document.getElementById("startMatch").style.display='none';
    document.getElementById("loadNext").style.display='inline';
    document.getElementById('saveScore').disabled = false;
})

socket.on('matchLoaded', (currentMatch)=>{
    document.getElementById("saveScore").style.display='none';
    document.getElementById("startMatch").style.display='inline';
    document.getElementById("loadNext").style.display='none';
    document.getElementById("startMatch").disabled = false;
})

socket.on('matchStarted', (currentMatch)=>{
    document.getElementById("saveScore").style.display='none';
    document.getElementById("startMatch").style.display='inline';
    document.getElementById("loadNext").style.display='none';
    document.getElementById("startMatch").disabled = true;
})

socket.on('matchFinished', (currentMatch)=>{
    document.getElementById("saveScore").style.display='inline';
    document.getElementById("startMatch").style.display='none';
    document.getElementById("loadNext").style.display='none';
    document.getElementById("startMatch").disabled = false;
})
