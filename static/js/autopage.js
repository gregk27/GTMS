import {socket, init} from "/js/socketbase.js"

init(["matchSaved", "matchLoaded", "matchStarted"]);

var base;
var game;
var postgame;
var scoreboard;
var schedule;
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
    views = [base, game, postgame, scoreboard, schedule]
    window.views = views;
}

var cycleTimeout = null;
var scoreboardDuration = 0;
var scheduleDuration = 0;

(async () => {
    let cfg = await(await fetch("/config/scoreboard")).json();
    scoreboardDuration = cfg.duration * cfg.data.length * 1000;
    scheduleDuration = cfg.duration * 2 * 1000;
})();

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
function showPostgame() {
    showView(postgame)
    clearTimeout(cycleTimeout);
    // Cycle to scoreboard/schedule page when done
    cycleTimeout = setTimeout(()=>{
        showSS();
    }, 60000)
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

socket.on("matchStarted", showGame)
socket.on("matchSaved", showPostgame)
socket.on("matchLoaded", showGame)