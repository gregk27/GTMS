let alliance = new URLSearchParams(window.location.search).get('a');
let authString = new URLSearchParams(window.location.search).get('auth');

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

function addScore(delta, dA=0, dB=0){
    fetch(`/game/addScore/${alliance}?d=${delta}&a=${dA}&b=${dB}&auth=${authString}`);
    document.querySelector("#score").innerText = parseInt(document.querySelector("#score").innerText) + delta;
}

async function buildButtons() {
    let config = await (await fetch("/config/buttons")).json();
    let html = "";
    for(let button of config){
        // If single button
        if(button.toString() === '[object Object]'){
            html+=`<button style="margin-top:${button.spaceBefore ?? ""}em; margin-bottom:${button.spaceAfter ?? ""}em;"
                 onclick="addScore(${button.score ?? 0}, ${button.metA ?? 0}, ${button.metB ?? 0})">${button.text}</button>\n`
        } else {
            html += "<div>\n";
            console.log(button);
            for(let sub of button){
                console.log(sub);
                html+=`<button style="margin-left:${sub.spaceBefore ?? ""}em; margin-right:${sub.spaceAfter ?? ""}em;"
                     onclick="addScore(${sub.score ?? 0}, ${sub.metA ?? 0}, ${sub.metB ?? 0})">${sub.text}</button>\n`
            }
            html += "</div>\n";
        }
    }
    document.getElementById("buttons").innerHTML = html;
    
}

window.onload = ()=>{
    document.body.classList.add(alliance)
    buildButtons();

    setInterval(() => {
        update();
    }, 2000);
    update();
};