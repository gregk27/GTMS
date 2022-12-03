import {socket, init} from "/js/socketbase.js";

init(["matchFinished"], ()=>{
    socket.emit("getEliminationScores");
})

socket.on("getEliminationScores", (scores) => {
    results = scores;
    updateBracket();
})

socket.on("matchFinished", () => socket.emit("getEliminationScores"));

var results = []

var seeds = [1000, 2000, 3000, 4000, 5000, 6000, 7000]

const NUM_TEAMS = 5;
const NUM_MATCHES = 7;
const MATCH_NAME = "Elims";

function updateBracket() {
    for(let i=0; i<NUM_TEAMS; i++){
        document.getElementById(`seed-${i+1}`).querySelector("p").innerText = seeds[i]
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