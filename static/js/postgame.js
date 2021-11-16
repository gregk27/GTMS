import {socket, init} from '/js/socketbase.js'

init(["matchSaved"])

var config;

socket.on("matchSaved", (currentMatch)=>{
    let delta = currentMatch.red.score - currentMatch.blue.score;
    if(delta > 0) {
        document.body.style.background = "var(--red-primary)";
        document.getElementById("result").innerHTML = `<div>${currentMatch.name}</div><h2>Red Wins!</h2>`;
    } else if (delta < 0) {
        document.body.style.background = "var(--blue-primary)";
        document.getElementById("result").innerHTML = `<div>${currentMatch.name}</div><h2>Blue Wins!</h2>`;
    } else {
        document.body.style.background = "";
        document.getElementById("result").innerHTML = `<div>${currentMatch.name}</div><h2>Tie!</h2>`;
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
});

(async () => {
    config = await (await fetch("/config/postgame")).json()
})();