// This script can be added to any page for audio capability
// However, this may come at a performance cost due to the number of sockets being managed

import {socket, init} from "/js/socketbase.js"
// const socket = s.socket;
init(["queueAudio"]);

/** @type HTMLAudioElement */
var audioPlayer = null;
/** @type Object.<string, HTMLAudioElement> */
var players = {};
var busy = false;

var queue = []

function cacheAudio(src){
    if(players[src] != undefined && players[src] != null) return;
    players[src] = document.createElement("audio");
    document.getElementById("audios").appendChild(players[src]);
    players[src].addEventListener("ended", playNextAudio);

    players[src].src = src;
}

function playNextAudio(){
    if(queue.length > 0){
        busy = true;
        audioPlayer = players[queue.shift()];
        audioPlayer.play();
    } else {
        busy = false;
    }
}

window.addEventListener("load", async () => {
    // Create an invisible div to hold the audio elements
    let div = document.createElement("div");
    div.id = "audios";
    div.style.display = 'none';
    document.body.appendChild(div);

    let config = await(await(fetch("/config/audio"))).json();
    for(let a of config.sequence)
        cacheAudio(a.source);
});

socket.on("queueAudio", (src) => {
    cacheAudio(src);
    queue.push(src);
    if(!busy){
        playNextAudio();
    }
})