import { socket } from "/js/socketbase.js";
import init from "/js/gamebase.js"

init(update, document.querySelector("#time"), null)

let alliance = new URLSearchParams(window.location.search).get('a');
let authString = new URLSearchParams(window.location.search).get('auth');

async function update(data){
    document.querySelector("#matchNum").innerText = data.name;
    let score;
    if(alliance == "red"){
        document.querySelector("#teamNum").innerText = data.red.num;
        score = data.red;
    } else if (alliance == "blue"){
        document.querySelector("#teamNum").innerText = data.blue.num;
        score = data.blue;
    }
    document.querySelector("#score").innerHTML = `<span>${score.metA}</span> <span style="font-size:1.2em">${score.score}</span> <span>${score.metB}</span>`;
}

window.addScore = addScore;
function addScore(delta, dA=0, dB=0){
    socket.emit("addScore", {alliance, delta, dA, dB}, authString);
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
};