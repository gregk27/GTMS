import {socket, init} from '/socketbase.js';

init(["matchLoaded", "matchStarted", "scoreChanged", "matchFinished"]);

var currentMatch = null;

function toMMSS (unix) {
    if(unix < 0) return "00:00";
    unix = Math.floor(unix/1000);
    var minutes = Math.floor((unix / 60));
    var seconds = unix - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

async function update(data){
    currentMatch = data;
    document.querySelector("#matchNum").innerText = data.name;
    document.querySelector("#red .teamNum").innerText = data.red.num;
    document.querySelector("#red .teamName").innerText = data.red.name;
    document.querySelector("#red .score").innerText = data.red.score;
    document.querySelector("#blue .teamNum").innerText = data.blue.num;
    document.querySelector("#blue .teamName").innerText = data.blue.name;
    document.querySelector("#blue .score").innerText = data.blue.score;
}

window.onload = async ()=>{
    document.querySelector("#time").innerText = toMMSS(0);
    update(await (await fetch("/game/data")).json());
    // If it's reloaded mid-match, use higher frequency since it'll be offset from what it should be
    setInterval(() => document.querySelector("#time").innerText = toMMSS(currentMatch.endTime - Date.now()), 100);
};

var timer = null;

socket.on("matchLoaded", (match)=>{
    update(match);
    document.querySelector("#time").innerText = toMMSS(match.duration)
})

socket.on("matchStarted", (match)=>{
    update(match);
    // Since this runs on the start event, time should be within 100ms of correct at a constant interval
    setInterval(() => document.querySelector("#time").innerText = toMMSS(currentMatch.endTime - Date.now()), 1000);
})

socket.on("scoreChanged", (match)=>{
    update(match);
})

socket.on("matchFinished", (match)=>{
    if(timer != null) clearInterval(timer);
    document.querySelector("#time").innerText = toMMSS(0);
})