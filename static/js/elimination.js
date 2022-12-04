import {socket, init} from "/js/socketbase.js";

var results = []
var seeds = []

const NUM_TEAMS = 5;
const NUM_MATCHES = 7;
const MATCH_NAME = "Elims";

init(["matchFinished"], ()=>{
    socket.emit("getEliminationScores");
})

// Chain socket events to get elim scores and ranking scoreboard
socket.on("getEliminationScores", (scores) => {
    results = scores;
    socket.emit("getScoreboard");
})
socket.on("getScoreboard", (scoreboard) => {
    seeds = scoreboard;
    updateBracket();
})

socket.on("matchFinished", () => socket.emit("getEliminationScores"));

function updateBracket() {
    for(let i=0; i<NUM_TEAMS; i++){
        document.getElementById(`seed-${i+1}`).querySelector("p").innerText = seeds[i].number
    }

    let i=0;
    console.log(results);
    for(i=0; i<results.length; i++){
        // Get winner/looser numbers
        var match = results[i]
        let winner = match.redScore > match.blueScore ? match.redTeam : match.blueTeam;
        let loser = match.redScore < match.blueScore ? match.redTeam : match.blueTeam;
        // Populate bracket entries with numbers
        var matchDiv = document.getElementById(`match-${i+1}`);
        matchDiv.classList.remove("upcoming");
        matchDiv.classList.remove("next");
        matchDiv.querySelector("p").innerText = winner;
        
        var loserDiv = document.getElementById(`looser-${i+1}`);
        if(loserDiv != null)
            loserDiv.querySelector("p").innerText = loser;
    }
    for(; i<NUM_MATCHES; i++){
        var matchDiv = document.getElementById(`match-${i+1}`);
        matchDiv.classList.add("upcoming");
        matchDiv.classList.remove("next");
        matchDiv.querySelector("p").innerText = `${MATCH_NAME} ${i+1}`;
        
        var loserDiv = document.getElementById(`looser-${i+1}`);
        if(loserDiv != null)
            loserDiv.querySelector("p").innerText = `Looser ${i+1}`;
    }
    document.getElementById(`match-${results.length+1}`)?.classList.add("next");
}


// window.onload = updateBracket();