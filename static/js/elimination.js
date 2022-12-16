import {socket, init} from "/js/socketbase.js";

var results = []
var seeds = []

const NUM_TEAMS = 6;
const NUM_MATCHES = 9;
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
        // Get winner/loser numbers
        var match = results[i]
        let winner = match.redScore > match.blueScore ? match.redTeam : match.blueTeam;
        let loser = match.redScore < match.blueScore ? match.redTeam : match.blueTeam;
        // Populate bracket entries with numbers
        var matchDiv = document.getElementById(`match-${i+1}`);
        matchDiv.classList.remove("upcoming");
        matchDiv.classList.remove("next");
        matchDiv.querySelector("p").innerText = winner;
        
        var loserDiv = document.getElementById(`loser-${i+1}`);
        if(loserDiv != null)
            loserDiv.querySelector("p").innerText = loser;
    }
    for(; i<NUM_MATCHES; i++){
        var matchDiv = document.getElementById(`match-${i+1}`);
        matchDiv.classList.add("upcoming");
        matchDiv.classList.remove("next");
        matchDiv.querySelector("p").innerText = `${MATCH_NAME} ${i+1}`;
        if(i==NUM_MATCHES - 1)
            matchDiv.querySelector("p").innerText = `Semis`;
        
        var loserDiv = document.getElementById(`loser-${i+1}`);
        if(loserDiv != null)
            loserDiv.querySelector("p").innerText = `L. of ${i+1}`;
    }

    var currNum = results.length + 1;
    var currMatch = document.getElementById(`match-${currNum}`);
    if(currMatch != null){
        currMatch?.classList.add("next");

        // Sketchy way to get data about upcoming match
        document.getElementById("nextRed").innerText = document.getElementById(currMatch.getAttribute("data-red")).innerText;
        document.getElementById("nextBlue").innerText = document.getElementById(currMatch.getAttribute("data-blue")).innerText;
        document.getElementById("nextName").innerText = currMatch.innerText;
    }
    else {
        document.getElementById("nextRed").innerText = "???";
        document.getElementById("nextBlue").innerText = "???";
        document.getElementById("nextName").innerText = "Match ?";
    }
}


// window.onload = updateBracket();