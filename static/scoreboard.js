var lastMatch = -1;
var config;
var widths = [];

async function update(){
    let teams = await (await fetch("/teams/scoreboard")).json();
    let html = new Array(teams.length).fill("");
    for(let [rank, team] of teams.entries()){
        for(let [i, page] of config.entries()){
            html[i] += `
            <div class="team" style="grid-template-columns:${widths[i]}">        
            <div>${rank+1}</div>
            <div>${team.name}<span style="float:right">${team.number}</span></div>
            <div></div>
            <div>${team.rpa.toFixed(2)}</div>
            <div></div>`;
            for(let col of page){
                html[i] += `<div>${eval(col.func)(team)}</div>`
            }
            html[i] += `<div></div></div>`;
        }
    }
    for(let i in config){
        document.querySelector(`#layer-${i} .scores`).innerHTML = html[i];
    }
}

// Check if match id has changed, if it has then update
async function checkMatch(){
    match = await(await fetch("/game/data")).json();
    if(match.saved && match.id != lastMatch){
        lastMatch = match.id;
        update();
    }
}

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
    for(let [i, page] of config.entries()){
        let cols = `<div>Rank</div>\n<div>Team</div>\n<div></div>\n<div>RPA</div><div></div>\n`;
        let width = `2em 40% 0 2em auto`;
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
    setInterval(() => {
        checkMatch();
    }, 5000);
    setInterval(()=>{
        cycle();
    }, 2000);
    config = await (await fetch("/config/scoreboard")).json();
    buildTables();
    checkMatch();
    update();
};