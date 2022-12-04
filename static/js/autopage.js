import {socket, init} from "/js/socketbase.js"

init(["matchSaved", "showGame", "matchStarted", "showElims"]);

var base;
var game;
var postgame;
var scoreboard;
var schedule;
var elims;
var views;

window.showView = showView;
function showView(view){
    for(let v of views){
        v.style.opacity = 0;
    }
    view.style.opacity = 1;
}

window.onload = () =>{
    base = document.getElementById("base");
    game = document.getElementById("game");
    postgame = document.getElementById("postgame");
    scoreboard = document.getElementById("scoreboard");
    schedule = document.getElementById("schedule");
    elims = document.getElementById("elims");
    views = [base, game, postgame, scoreboard, schedule, elims]
    window.views = views;
}

var cycleTimeout = null;
var scoreboardDuration = 0;
var scheduleDuration = 0;
var postgameDuration = 0;

fetch("/config/scoreboard").then(res => res.json()).then(cfg => {
    scoreboardDuration = cfg.duration * cfg.data.length * 1000;
    scheduleDuration = cfg.duration * 2 * 1000;
})
fetch("/config/postgame").then(res => res.json()).then(cfg => {
    postgameDuration = cfg.duration;
})

window.cycleScoreboard = cycleScoreboard;
function cycleScoreboard(){
    showView(scoreboard);
    clearTimeout(cycleTimeout);
    cycleTimeout = setTimeout(cycleSchedule, scoreboardDuration);
}

function cycleSchedule(){
    showView(schedule);
    clearTimeout(cycleTimeout);
    cycleTimeout = setTimeout(cycleScoreboard, scheduleDuration);
}


window.showBase = () => {
    showView(base)
    clearTimeout(cycleTimeout);
}

window.showGame = showGame;
function showGame() {
    showView(game)
    clearTimeout(cycleTimeout);
}

window.showPostgame = showPostgame;
function showPostgame(lastMatch) {
    showView(postgame)
    clearTimeout(cycleTimeout);
    // Cycle to scoreboard/schedule or elimination bracket page when done
    cycleTimeout = setTimeout(()=>{
        // Show schedule while playing ranked games
        if(lastMatch.type == "RANKED" || lastMatch.type == "PRACTICE")
            showSS();
        // Show tournament bracket while playing elimination games
        else if(lastMatch.type == "ELIMINATION")
            showElims();
    }, postgameDuration*1000)
}

window.showSS = showSS;
function showSS(){
    scoreboard.contentWindow.location.reload();
    clearTimeout(cycleTimeout);
    // Stagger to leave time for reload
    cycleTimeout = setTimeout(()=>{
        cycleScoreboard();
    }, 100)
}

window.showElims = showElims;
function showElims(){
    showView(elims);
}

socket.on("matchStarted", showGame)
socket.on("matchSaved", showPostgame)
socket.on("showSS", showSS)
socket.on("showElims", showElims)
socket.on("showGame", showGame)