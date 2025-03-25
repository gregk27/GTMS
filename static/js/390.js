import {socket, init as sInit} from '/js/socketbase.js';

sInit([], ()=>{})
var authString = new URLSearchParams(window.location.search).get('auth');

window.showGame = () => {
    console.log("Show Game")
    socket.emit("broadcast", "showGame", {}, authString);
}

window.showPost = () => {
    console.log("Post Game")
    socket.emit("broadcast", "matchSaved", {}, authString);
}

window.saveScore = () => {
    let match = document.getElementById("match");
    let team = document.getElementById("team");
    let score = document.getElementById("score");
    let penalties = document.getElementById("penalties")
    let duckies = document.getElementById("duckies")
    let karma = document.getElementById("karma")
    socket.emit("saveScore", {
        match:  parseInt(match.value),
        team:  parseInt(team.value),
        score:  parseInt(score.value),
        penalties:  parseInt(penalties.value),
        duckies:  parseInt(duckies.value),
        karma:  parseInt(karma.value),
    }, authString)

    team.value = ""
    score.value = ""
    penalties.value = ""
    duckies.value = ""
    karma.value = ""
}