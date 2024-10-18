import init from '/js/gamebase.js';

init(update, document.getElementById("time"), ()=>{
    document.getElementById("review").style.bottom = "4em";
});

var initialized = false;

/**
 * 
 * @param {ActiveMatch} data 
 */
async function update(data){
    if(!initialized) {
        let horzOffset = "1em";
        let vertOffset = "1em";
        generateBlocks([`top:${vertOffset};left:${horzOffset}`,`bottom:${vertOffset};left:${horzOffset}`,`top:${vertOffset};right:${horzOffset}`,`bottom:${vertOffset};right:${horzOffset}`], ["Score", "Count", "Penalties", "Another"]);
        initialized = true;
    }
    console.log(data);

    for(let i = 0; i < data.teams.length; i++){
        let team = data.teams[i];
        document.getElementById(`_name-${i}`).innerText = `${team.num} - ${team.name}`;
        document.getElementById(`Score-${i}`).innerText = team.score.points;
        document.getElementById(`Count-${i}`).innerText = team.score.duckies;
        document.getElementById(`Penalties-${i}`).innerText = team.score.fouls;
        document.getElementById(`Another-${i}`).innerText = team.score.karma;

        document.getElementById(`_scoreblock-${i}`).style.setProperty("--team-colour", team.colour)
    }

    document.querySelector("#matchNum").innerText = data.name;
    document.getElementById("review").style.top = "0.5em";
}

/**
 * 
 * @param {string[]} locations 
 * @param {string[]} scoreItems 
 */
function generateBlocks(locations, scoreItems){
    let html = "";
    for(let i = 0; i < locations.length; i ++){
        html += `\n<div class="teamScore" id="_scoreblock-${i}" style="position:absolute;${locations[i]}">`;
        html += `\n<div class="scoreItem teamName">`;
        html += `\t<span class="scoreName" id="_name-${i}"></span>`
        html += `</div>`;

        for(let item of scoreItems){
            html += `\n<div class="scoreItem">`
            html += `\t<span class="scoreName">${item}</span>`
            // Set text to empty braille character to get height set
            html += `\t<span class="scoreValue" id="${item}-${i}">&#10240</span>`
            html += `</div>`
        }
        html += `</div>`;
    }
    document.getElementsByTagName("body")[0].innerHTML += html;
}