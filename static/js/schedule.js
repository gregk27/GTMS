import {socket, init} from "/js/socketbase.js";

init(["matchStarted"], ()=>{
    socket.emit("getSchedule");
})

socket.on("getSchedule", (schedule) => {
    let html = "";
    for(let m of schedule){
        html += `
        <div class="match">
            <div class="matchName">${m.prettyName.replace("$N", m.number)}</div>
            <div class="redTeam">${m.redName}<span style="float:right">${m.redTeam}</span></div>
            <div class="blueTeam">${m.blueName}<span style="float:right">${m.blueTeam}</span></div>
        </div>
        `
    }
    document.getElementById("schedule").innerHTML = html;
})

// Update when the new match starts
socket.on('matchStarted', () => socket.emit("getSchedule"));