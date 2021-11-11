import {socket, init as sInit} from '/socketbase.js';

sInit(["matchLoaded", "matchStarted", "scoreChanged", "matchFinished"]);

function toMMSS (unix) {
    if(unix < 0) return "00:00";
    unix = Math.floor(unix/1000);
    var minutes = Math.floor((unix / 60));
    var seconds = unix - (minutes * 60);
    
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

export var currentMatch = null;

var update = null;
var clock = null;
var timer = null;
var updatePost = 0;

export default async function init(clbk, clk, postWindow=2500) {
    update = clbk;
    clock = clk;
    updatePost = postWindow;

    // Run load script
    if(document.readyState === "complete"){
        onLoad();
    } else {
        window.onload = onLoad
    }
}

async function onLoad(){
    clock.innerText = toMMSS(0);  
    // Load data for current match
    currentMatch = await (await fetch("/game/data")).json();
    update(currentMatch);
    // If it's reloaded mid-match, use higher frequency since it'll be offset from what it should be
    if(currentMatch.running){
        timer = setInterval(() => clock.innerText = toMMSS(currentMatch.endTime - Date.now()), 100);
    } else {
        clock.innerText = toMMSS(currentMatch.duration*1000);
    }
    console.log(currentMatch);
}


socket.on("matchLoaded", (match)=>{
    currentMatch = match;
    update(match);
    clock.innerText = toMMSS(match.duration*1000)
    if(timer != null) clearInterval(timer);
})

socket.on("matchStarted", (match)=>{
    currentMatch = match;
    update(match);
    // Since this runs on the start event, time should be within 100ms of correct at a constant interval
    timer = setInterval(() => clock.innerText = toMMSS(currentMatch.endTime - Date.now()), 1000);
})

socket.on("scoreChanged", (match)=>{
    currentMatch = match;
    // Only show updates shortly after timer has ended, prevents score swings from fixing input mistakes
    if(updatePost < 0 || currentMatch.endTime > Date.now()-updatePost)
        update(match);
})

socket.on("matchFinished", (match)=>{
    currentMatch = match;
    if(timer != null) clearInterval(timer);
    clock.innerText = toMMSS(0);
})