import {socket, init} from "/js/socketbase.js";

init(["matchStarted"], ()=>{
    socket.emit("getSchedule");
})

socket.on("getSchedule", (schedule) => {
    let html = "";
    for(let m of schedule){
        html += `
        <div class="match">
            <div class="matchName">${m.type} ${m.number}</div>
            <div></div>
            <div class="team">${m.team1}</div>
            <div class="team">${m.team2}</div>
            <div class="team">${m.team3}</div>
            <div class="team">${m.team4}</div>
            <div class="team">${m.team5}</div>
            <div class="team">${m.team6}</div>
        </div>
        `
    }
    document.getElementById("schedule").innerHTML = html;
})

// Update when the new match starts
socket.on('matchStarted', () => socket.emit("getSchedule"));