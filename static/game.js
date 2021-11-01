function toMMSS (unix) {
    if(unix < 0) return "00:00";
    unix = Math.floor(unix/1000);
    var minutes = Math.floor((unix / 60));
    var seconds = unix - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

async function update(){
    let data = await (await fetch("/game/data")).json();
    console.log(data);
    document.querySelector("#matchNum").innerText = data.name;
    document.querySelector("#red .teamNum").innerText = data.red.num;
    document.querySelector("#red .teamName").innerText = data.red.name;
    document.querySelector("#red .score").innerText = data.red.score;
    document.querySelector("#blue .teamNum").innerText = data.blue.num;
    document.querySelector("#blue .teamName").innerText = data.blue.name;
    document.querySelector("#blue .score").innerText = data.blue.score;
    document.querySelector("#time").innerText = toMMSS(data.endTime - Date.now())
}

window.onload = ()=>{
    setInterval(() => {
        update();
    }, 500);
    update();
};