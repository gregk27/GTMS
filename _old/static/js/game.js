import init from '/js/gamebase.js';

init(update, document.getElementById("time"), ()=>{
    document.getElementById("review").style.bottom = "4em";
});

async function update(data){
    document.querySelector("#matchNum").innerText = data.name;
    document.querySelector("#red .teamNum").innerText = data.red.num;
    document.querySelector("#red .teamName").innerText = data.red.name;
    document.querySelector("#red .score").innerText = data.red.score;
    document.querySelector("#blue .teamNum").innerText = data.blue.num;
    document.querySelector("#blue .teamName").innerText = data.blue.name;
    document.querySelector("#blue .score").innerText = data.blue.score;
    document.getElementById("review").style.bottom = "2em";
}