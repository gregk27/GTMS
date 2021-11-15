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
    html += `<tr><td>Met A</td><td>-</td><td>${currentMatch.red.metA}</td></tr>`
    html += `<tr><td>Met B</td><td>-</td><td>${currentMatch.red.metB}</td></tr>`
    document.querySelector('.alliance#red .breakdown').innerHTML = html;
    
    document.querySelector(`.alliance#blue .score`).innerText = currentMatch.blue.score
    document.querySelector(`.alliance#blue .team`).innerHTML = `${currentMatch.blue.name}<span>${currentMatch.blue.num}</span>`
    html = "";
    html += `<tr><td>${currentMatch.blue.metA}</td><td>-</td><td>Met A</td></tr>`
    html += `<tr><td>${currentMatch.blue.metB}</td><td>-</td><td>Met B</td></tr>`
    document.querySelector('.alliance#blue .breakdown').innerHTML = html;
})

// (async function() {
//     // config = await(await(fetch))
// })();