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

socket.on("matchStarted", ()=>{
    showView(game);
})

socket.on("matchSaved", ()=>{
    showView(postgame)
})

socket.on("matchLoaded", ()=>{
    showView(scoreboard);
})