import init from "/js/gamebase.js"

var config;

function update(currentMatch){
    document.querySelector("#banner div").innerText = currentMatch.name;

    document.querySelector(`.alliance#red .score`).innerText = currentMatch.red.score
    document.querySelector(`.alliance#red .team`).innerHTML = `<span>${currentMatch.red.num}</span>${currentMatch.red.name}`
    let html = "";
    for(let b of config.breakdown){
        html += `<tr><td>${b.name}</td><td>-</td><td>${eval(b.func)(currentMatch.red)}</td></tr>\n`
    }
    document.querySelector('.alliance#red .breakdown').innerHTML = html;
    
    document.querySelector(`.alliance#blue .score`).innerText = currentMatch.blue.score
    document.querySelector(`.alliance#blue .team`).innerHTML = `${currentMatch.blue.name}<span>${currentMatch.blue.num}</span>`
    html = "";
    for(let b of config.breakdown){
        html += `<tr><td>${eval(b.func)(currentMatch.blue)}</td><td>-</td><td>${b.name}</td></tr>`
    }
    document.querySelector('.alliance#blue .breakdown').innerHTML = html;
}

(async () => {
    config = await (await fetch("/config/postgame")).json()
    // Load config before initializing
    init(update, document.querySelector("#banner h2"));
})();