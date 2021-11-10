// This script can be added to any page for audio capability
// However, this may come at a performance cost due to the number of sockets being managed

const socket = io();
/** @type HTMLAudioElement */
var audioPlayer;
var busy = false;

var queue = []

window.onload = () => {
    audioPlayer = document.createElement("audio");
    document.body.appendChild(audioPlayer);
    audioPlayer.addEventListener("ended", ()=>{
        if(queue.length > 0){
            busy = true;
            audioPlayer.src = queue.shift();
            audioPlayer.play();
        } else {
            busy = false;
        }
    })
}

socket.on("queueAudio", (src) => {
    if(!busy){
        audioPlayer.src = src;
        audioPlayer.play();
        busy = true;
    } else {
        queue.push(src);
    }
})