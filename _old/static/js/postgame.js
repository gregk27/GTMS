import {socket, init} from '/js/socketbase.js'

init(["matchSaved", "matchStarted"], ()=>{
    socket.emit("getCurrentMatch");
})

var config;
var lastScoreboard;
var currScoreboard;
var currMatch;

function update(currentMatch) {
    currMatch = currentMatch;
    socket.emit("getScoreboard");
    document.querySelector(".alliance#red .rank").innerText = "";
    document.querySelector(".alliance#blue .rank").innerText = "";

    let delta = currentMatch.red.score - currentMatch.blue.score;
    if(delta > 0) {
        document.body.style.background = "var(--red-primary)";
        document.getElementById("banner").innerHTML = `<div>${currentMatch.name}</div><h2>Red Wins!</h2>`;
    } else if (delta < 0) {
        document.body.style.background = "var(--blue-primary)";
        document.getElementById("banner").innerHTML = `<div>${currentMatch.name}</div><h2>Blue Wins!</h2>`;
    } else {
        document.body.style.background = "";
        document.getElementById("banner").innerHTML = `<div>${currentMatch.name}</div><h2>Tie!</h2>`;
    }

    document.querySelector(`.alliance#red .score`).innerText = currentMatch.red.score
    document.querySelector(`.alliance#red .team`).innerHTML = `<span>${currentMatch.red.num}</span>${currentMatch.red.name}`
    let html = "";
    for(let b of config.breakdown){
        html += `<tr><td>${b.name}</td><td>-</td><td>${eval(b.func)(currentMatch.red)}</td></tr>\n`
    }
    document.querySelector('.alliance#red .breakdown').innerHTML = html;
    
    document.querySelector(`.alliance#blue .score`).innerText = currentMatch.blue.score
    document.querySelector(`.alliance#blue .team`).innerHTML = `${currentMatch.blue.name}<span>${currentMatch.blue.num}</span>`
    html = "";
    for(let b of config.breakdown){
        html += `<tr><td>${eval(b.func)(currentMatch.blue)}</td><td>-</td><td>${b.name}</td></tr>`
    }
    document.querySelector('.alliance#blue .breakdown').innerHTML = html;
}

(async () => {
    config = await (await fetch("/config/postgame")).json()
})();

socket.on("matchSaved", update);
socket.on("getCurrentMatch", update);

socket.on("getScoreboard", (scoreboard)=>{
    if(currScoreboard == scoreboard) return;
    currScoreboard = scoreboard;
    let redRank, blueRank, redDelta=0, blueDelta=0;
    
    for(let [i, team] of Object.entries(scoreboard)){
        if(team.number == currMatch.red.num){
            redRank = parseInt(i);
        } else if(team.number == currMatch.blue.num){
            blueRank = parseInt(i);
        }
    }

    try {
        for(let [i, team] of Object.entries(lastScoreboard)){
            if(team.number == currMatch.red.num){
                redDelta = redRank-i;
            } else if(team.number == currMatch.blue.num){
                blueDelta = blueRank-i;
            }
        }
    } catch (e) {

    }
    
    let arrows = ['▲', '▶', '▼'];
    document.querySelector(".alliance#red .rank").innerText = `${redRank+1} ${arrows[Math.sign(redDelta)+1]} `;
    document.querySelector(".alliance#blue .rank").innerText = `${blueRank+1} ${arrows[Math.sign(blueDelta)+1]}`;
})

socket.on("matchStarted", ()=>{
    lastScoreboard = currScoreboard;
})