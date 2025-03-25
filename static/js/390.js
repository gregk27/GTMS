import {socket, init as sInit} from '/js/socketbase.js';
import init from '/js/gamebase.js'

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