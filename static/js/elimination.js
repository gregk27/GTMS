var results = [
    {
        type:"ELIMINATION", 
        number: 1,
        redTeam: 9994,
        blueTeam: 9995,
        redScore: 100, 
        blueScore: 200
    },
    {
        type: "ELIMINATION", 
        number: 2, 
        redTeam: 9992,
        blueTeam: 9993,
        redScore: 200, 
        blueScore: 100
    },
    {
        type: "ELIMINATION", 
        number: 3, 
        redTeam: 9991,
        blueTeam: 9995,
        redScore: 200, 
        blueScore: 100
    },
    {
        type: "ELIMINATION", 
        number: 4, 
        redTeam: 9993,
        blueTeam: 9994,
        redScore: 50, 
        blueScore: 100
    },
]

var seeds = [9991, 9992, 9993, 9994, 9995, 9996, 9997]

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


window.onload = updateBracket();