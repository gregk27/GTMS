import init from '/js/gamebase.js';

init(update, document.getElementById("time"), ()=>{
    document.getElementById("review").style.bottom = "4em";
});

/**
 * 
 * @param {ActiveMatch} data 
 */
async function update(data){
    generateBlocks(4, ["Score", "Count", "Penalties", "Another"])
    console.log(data);

    for(let i = 0; i < data.teams.length; i++){
        let team = data.teams[i];
        document.getElementById(`_name-${i}`).innerText = `${team.num} - ${team.name}`;
        document.getElementById(`Score-${i}`).innerText = team.score.points;
        document.getElementById(`Count-${i}`).innerText = team.score.duckies;
        document.getElementById(`Penalties-${i}`).innerText = team.score.fouls;
        document.getElementById(`Another-${i}`).innerText = team.score.karma;
    }

    document.querySelector("#matchNum").innerText = data.name;
    document.querySelector("#red .teamNum").innerText = data.red.num;
    document.querySelector("#red .teamName").innerText = data.red.name;
    document.querySelector("#red .score").innerText = data.red.score;
    document.querySelector("#blue .teamNum").innerText = data.blue.num;
    document.querySelector("#blue .teamName").innerText = data.blue.name;
    document.querySelector("#blue .score").innerText = data.blue.score;
    document.getElementById("review").style.bottom = "2em";
}

/**
 * 
 * @param {number} numTeams 
 * @param {string[]} scoreItems 
 */
function generateBlocks(numTeams, scoreItems){
    let html = "";
    for(let i = 0; i < numTeams; i ++){
        html += `\n<div class="teamScore">`;
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