require("./types");

const fs = require('fs');
const config = require('./config');
const server = require("./server");

let needInit = !fs.existsSync("./db.sqlite");
const db = require('better-sqlite3')('db.sqlite');

// Create tables if the file didn't already exist
if(needInit){
    db.exec(fs.readFileSync("./tables.sql").toString())
    db.exec(fs.readFileSync(config.initScript).toString())
}

const getTeamsStmt = db.prepare("SELECT * FROM teams");
const getCombinedMatchDataStmt = db.prepare("SELECT schedule.id, type, prettyName, number, redTeam, scores.redScore AS redScore, scores.redMetA AS redMetA, scores.redMetB AS redMetB, blueTeam, scores.blueScore AS blueScore, scores.blueMetA AS blueMetA, scores.blueMetB AS blueMetB FROM schedule LEFT JOIN scores ON scores.id = schedule.id");

/** @type ActiveMatch */
var currentMatch = null;
/** @type NodeJS.Timeout[] */
var matchTimeouts = [];

function getSchedule(){
    const stmt = db.prepare("SELECT schedule.id, type, prettyName, schedule.number, redTeam, red.name AS redName, blueTeam, blue.name AS blueName FROM schedule LEFT JOIN teams red ON red.number = redTeam LEFT JOIN teams blue ON blue.number = blueTeam WHERE id>? AND (type='RANKED' OR type='PRACTICE')");
    // Show current match if it hasn't started yet
    stmt.bind(currentMatch.running ? currentMatch.id : currentMatch.id-1);
    return stmt.all();
}

function getScoreboard(){
    let teams = getTeamsStmt.all();
    out = []
    for(let t of teams){
        let stmt = db.prepare(`
        select number, name, sum(wins) AS wins, sum(losses) AS losses, sum(ties) AS ties, sum(score) AS score, sum(metA) as metA, sum(metB) as metB from (
            SELECT COUNT(scores.id) AS wins, 0 as ties, 0 as losses, 0 as score, 0 as metA, 0 as metB from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE ((redTeam = ? AND redScore > blueScore) OR (blueTeam = ? AND blueScore > redScore)) AND type='RANKED'
            UNION ALL
            SELECT 0, COUNT(scores.id) AS ties, 0, 0, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE ((redTeam = ? AND redScore = blueScore) OR (blueTeam = ? AND blueScore = redScore)) AND type='RANKED'
            UNION ALL
            SELECT 0, 0, COUNT(scores.id) AS losses, 0, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE ((redTeam = ? AND redScore < blueScore) OR (blueTeam = ? AND blueScore < redScore)) AND type='RANKED'
            UNION ALL
            SELECT 0, 0, 0, SUM(redScore) as score, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ?) AND type='RANKED'
            UNION ALL
            SELECT 0, 0, 0, SUM(blueScore) as score, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (blueTeam = ?) AND type='RANKED'
            UNION ALL
            SELECT 0, 0, 0, 0, SUM(redMetA) as metA, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ?) AND type='RANKED'
            UNION ALL
            SELECT 0, 0, 0, 0, SUM(blueMetA) as metA, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (blueTeam = ?) AND type='RANKED'
            UNION ALL
            SELECT 0, 0, 0, 0, 0, SUM(redMetB) as metB from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ?) AND type='RANKED'
            UNION ALL
            SELECT 0, 0, 0, 0, 0, SUM(blueMetB) as metB from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (blueTeam = ?) AND type='RANKED'
            ) left join teams t on number=?;`)
        stmt.bind(t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number)
        out.push(stmt.get());
    }
    for(let t of out){
        t.numMatches = (t.wins+t.ties+t.losses);
        t.rp = config.rankPointFunction(t);
        if(t.numMatches > 0){
            t.rpa = t.rp/t.numMatches;
            t.scoreAvg = t.score/t.numMatches;
        }
        else{
            t.rpa = 0;
            t.scoreAvg = 0;
        }
    }
    out.sort(config.sortFunction);
    return out;
}

function loadMatch(id=-1){
    if(id == -1){
        if(currentMatch == null){
            id = db.prepare("SELECT MIN(id) AS id FROM schedule").get().id;
        } else {
            id = currentMatch.id+1; 
        } 
    }
    // If the match was interrupted, kill the remaining timeouts and emit event
    if(currentMatch != null && currentMatch.running && !currentMatch.saved){
        for(let t of matchTimeouts){
            clearTimeout(t)
        }
        server.emit("matchInterrupted", currentMatch);
        server.emit("queueAudio", config.audio.interrupted);
    }

    const getScheduledMatch = db.prepare("SELECT schedule.id, type, prettyName, schedule.number, redTeam, red.name AS redName, blueTeam, blue.name AS blueName FROM schedule LEFT JOIN teams red ON red.number = redTeam LEFT JOIN teams blue ON blue.number = blueTeam WHERE id=?")
    getScheduledMatch.bind(id);
    /** @type Match */
    let sch = getScheduledMatch.get();
    currentMatch = {
        id: sch.id,
        duration: config.matchLength,
        running: false,
        saved: false,
        endTime: Date.now() + config.matchLength*1000,
        // Name is pretty name + number. If number is negative then it's just pretty name
        name: sch.prettyName + (sch.number >= 0 ? (" " + sch.number) : ""),
        red: {
            name: sch.redName,
            num: sch.redTeam,
            score: 0,
            metA: 0,
            metB: 0
        },        
        blue: {
            name: sch.blueName,
            num: sch.blueTeam,
            score: 0,
            metA: 0,
            metB: 0
        }
    }
    server.emit("matchLoaded", currentMatch);
}

function startMatch(){
    if(!currentMatch.running){
        currentMatch.running = true;
        currentMatch.endTime = Date.now() + currentMatch.duration*1000;

        matchTimeouts = []
        for(let a of config.audio.sequence){
            matchTimeouts.push(setTimeout(() => server.emit("queueAudio", a.source), (currentMatch.duration-a.time-config.audio.leadTime)*1000))
        }
        // Emit event when match ends
        matchTimeouts.push(setTimeout(() => server.emit("matchFinished", currentMatch), currentMatch.duration*1000));

        server.emit("matchStarted", currentMatch);
    }
}

function getCurrentMatch(){
    if(!currentMatch.running){
        currentMatch.endTime = Date.now() + currentMatch.duration*1000 + 750; // Add some time to allow for network latency
    }
    return currentMatch;
}

function getTeams(){
    return getTeamsStmt.all();
}

function getCombindMatchData(){
    return getCombinedMatchDataStmt.all();
}

function saveMatch(){
    console.log(currentMatch);
    currentMatch.saved = true;
    try {
        const stmt = db.prepare("INSERT INTO scores (id, redScore, redMetA, redMetB, blueScore, blueMetA, blueMetB) VALUES (?, ?, ?, ?, ?, ?, ?)")
        stmt.bind(currentMatch.id, currentMatch.red.score, currentMatch.red.metA, currentMatch.red.metB, currentMatch.blue.score, currentMatch.blue.metA, currentMatch.blue.metB);
        stmt.run()
    } catch (e){
        const stmt = db.prepare("UPDATE scores SET redScore=?, redMetA=?, redMetB=?, blueScore=?, blueMetA=?, blueMetB=? WHERE id=?")
        stmt.bind(currentMatch.red.score, currentMatch.red.metA, currentMatch.red.metB, currentMatch.blue.score, currentMatch.blue.metA, currentMatch.blue.metB, currentMatch.id);
        stmt.run()
    }
    server.emit("matchSaved", currentMatch);
}

function addScore(alliance, delta, dA, dB){
    if (alliance == 'red') {
        currentMatch.red.score += delta;
        currentMatch.red.metA += dA;
        currentMatch.red.metB += dB;
    } else if (alliance == 'blue') {
        currentMatch.blue.score += delta;
        currentMatch.blue.metA += dA;
        currentMatch.blue.metB += dB;
    }
    server.emit("scoreChanged", currentMatch);
}

module.exports = {
    getSchedule, getCurrentMatch, getTeams, getCombindMatchData, getScoreboard, startMatch, saveMatch, loadMatch, addScore
}

loadMatch();