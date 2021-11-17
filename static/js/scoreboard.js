import {socket, init} from "/js/socketbase.js";

init(["matchSaved"], ()=>{
    socket.emit("getScoreboard");
})

var config;
var widths = [];

(async () => {
    config = await (await fetch("/config/scoreboard")).json();
})();

socket.on("getScoreboard", (teams)=>{
    let html = new Array(teams.length).fill("");
    for(let [rank, team] of teams.entries()){
        for(let [i, page] of config.data.entries()){
            html[i] += `
            <div class="team" style="grid-template-columns:${widths[i]}">        
            <div>${rank+1}</div>
            <div>${team.name}<span style="float:right">${team.number}</span></div>
            <div></div>
            <div>${eval(config.rankCol.func)(team)}</div>
            <div></div>`;
            for(let col of page){
                html[i] += `<div>${eval(col.func)(team)}</div>`
            }
            html[i] += `<div></div></div>`;
        }
    }
    for(let i in config.data){
        document.querySelector(`#layer-${i} .scores`).innerHTML = html[i];
    }
})

var currLayer = 0;
var numLayer = 0;
async function cycle(){
    document.getElementById(`layer-${currLayer}`).style.opacity = 0;
    if(++currLayer >= numLayer) currLayer = 0;
    document.getElementById(`layer-${currLayer}`).style.opacity = 100;
}

async function buildTables(){
    let html = "";
    numLayer = 0;
    widths = [];
    for(let [i, page] of config.data.entries()){
        let cols = `<div>Rank</div>\n<div>Team</div>\n<div></div>\n<div>${config.rankCol.name}</div><div></div>\n`;
        let width = `2em 40% 0 ${config.rankCol.width}em auto`;
        for(let col of page){
            cols += `<div>${col.name}</div>`;
            width += ` ${col.width}em `;
        }
        cols += "<div></div>";
        width += "auto";
        widths[i] = width;
        html += `
        <div class="layer" id="layer-${numLayer}">
            <div class="team" style="margin:1em auto; grid-template-columns:${width}">
            ${cols}
            </div>
            <secion class="scores"></section>
        </div>`
        numLayer ++
    }
    document.getElementById("body").innerHTML = html;
    document.getElementById("layer-0").style.opacity = 100;
}

window.onload = async ()=>{
    setInterval(()=>{
        cycle();
    }, config.duration*1000);
    buildTables();
};

socket.on("matchSaved", () => socket.emit("getScoreboard"));