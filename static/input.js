let alliance = new URLSearchParams(window.location.search).get('a');

function toMMSS (unix) {
    if(unix < 0) return "00:00";
    unix = Math.floor(unix/1000);
    var minutes = Math.floor((unix / 60));
    var seconds = unix - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

async function update(){
    let data = await (await fetch("/game/data")).json();
    console.log(data);
    document.querySelector("#matchNum").innerText = data.name;
    if(alliance == "red"){
        document.querySelector("#teamNum").innerText = data.red.num;
        document.querySelector("#score").innerText = data.red.score;
    } else if (alliance == "blue"){
        document.querySelector("#teamNum").innerText = data.blue.num;
        document.querySelector("#score").innerText = data.blue.score;
    }
    document.querySelector("#time").innerText = toMMSS(data.endTime - Date.now())
}

function addScore(delta){
    fetch(`/game/addScore/${alliance}?d=${delta}`);
    document.querySelector("#score").innerText = parseInt(document.querySelector("#score").innerText) + delta;
}

window.onload = ()=>{
    document.body.classList.add(alliance)

    setInterval(() => {
        update();
    }, 2000);
    update();
};