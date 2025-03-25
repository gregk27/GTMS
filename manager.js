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

// const getTeamsStmt = db.prepare("SELECT * FROM teams");
// const getCombinedMatchDataStmt = db.prepare("SELECT schedule.id, type, number, redTeam, scores.redScore AS redScore, scores.redMetA AS redMetA, scores.redMetB AS redMetB, blueTeam, scores.blueScore AS blueScore, scores.blueMetA AS blueMetA, scores.blueMetB AS blueMetB FROM schedule LEFT JOIN scores ON scores.id = schedule.id");

/** @type ActiveMatch */
var currentMatch = null;
/** @type NodeJS.Timeout[] */
var matchTimeouts = [];

function getSchedule(){
    const stmt = db.prepare(`
        SELECT schedule.id, type, schedule.number, 
        team1, t1.name AS team1Name,
        team2, t2.name AS team2Name,
        team3, t3.name AS team3Name,
        team4, t4.name AS team4Name,
        team5, t5.name AS team5Name,
        team6, t6.name AS team6Name
        FROM schedule
        LEFT JOIN teams t1 ON t1.number = team1
        LEFT JOIN teams t2 ON t2.number = team2
        LEFT JOIN teams t3 ON t3.number = team3
        LEFT JOIN teams t4 ON t4.number = team4
        LEFT JOIN teams t5 ON t5.number = team5
        LEFT JOIN teams t6 ON t6.number = team6
        WHERE id>?`);
    // Show current match if it hasn't started yet
    stmt.bind(currentMatch.running ? currentMatch.id : currentMatch.id-1);
    return stmt.all();
}

function getScoreboard(){
    let stmt = db.prepare(`
    SELECT team AS number, t.name, COUNT(*) as numMatches, SUM(points) AS score, SUM(duckies) as duckies, AVG(karma) AS karma
        FROM scores
        LEFT JOIN teams t ON t.number=team
        GROUP BY team
        ORDER BY score DESC;`)
    out = stmt.all();
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

    const getScheduledMatch = db.prepare(`
        SELECT schedule.id, type, schedule.number, 
        team1, t1.name AS team1Name,
        team2, t2.name AS team2Name,
        team3, t3.name AS team3Name,
        team4, t4.name AS team4Name,
        team5, t5.name AS team5Name,
        team6, t6.name AS team6Name
        FROM schedule
        LEFT JOIN teams t1 ON t1.number = team1
        LEFT JOIN teams t2 ON t2.number = team2
        LEFT JOIN teams t3 ON t3.number = team3
        LEFT JOIN teams t4 ON t4.number = team4
        LEFT JOIN teams t5 ON t5.number = team5
        LEFT JOIN teams t6 ON t6.number = team6
        WHERE id=?`)
    getScheduledMatch.bind(id);
    /** @type Match */
    let sch = getScheduledMatch.get();
    currentMatch = {
        id: sch.id,
        duration: config.matchLength,
        running: false,
        saved: false,
        endTime: Date.now() + config.matchLength*1000,
        name: sch.type + " " + sch.number,
        teams: [
            {
                num: sch.team1,
                name: sch.team1Name,
                colour: "FFFFFFF",
                score: {
                    duckies: 0,
                    fouls: 0,
                    karma: 0,
                    points: 0
                }
            },
            {
                num: sch.team2,
                name: sch.team2Name,
                colour: "FFFFFFF",
                score: {
                    duckies: 0,
                    fouls: 0,
                    karma: 0,
                    points: 0
                }
            },
            {
                num: sch.team3,
                name: sch.team3Name,
                colour: "FFFFFFF",
                score: {
                    duckies: 0,
                    fouls: 0,
                    karma: 0,
                    points: 0
                }
            },
            {
                num: sch.team4,
                name: sch.team4Name,
                colour: "FFFFFFF",
                score: {
                    duckies: 0,
                    fouls: 0,
                    karma: 0,
                    points: 0
                }
            },
            {
                num: sch.team5,
                name: sch.team5Name,
                colour: "FFFFFFF",
                score: {
                    duckies: 0,
                    fouls: 0,
                    karma: 0,
                    points: 0
                }
            },
            {
                num: sch.team6,
                name: sch.team6Name,
                colour: "FFFFFFF",
                score: {
                    duckies: 0,
                    fouls: 0,
                    karma: 0,
                    points: 0
                }
            },
        ]
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
    /**
     * @type {ActiveMatch}
     */
    let match = {
        name: "Test 1",
        duration: 10 * 60,
        id: 0,
        running: false,
        teams: [
            {
                name: "First Team",
                num: 1,
                colour: "#3b429f",
                score: {
                    points: 3,
                    duckies: 1,
                    fouls: 2,
                    karma: -1
                }
            },
            {
                name: "Second Team",
                num: 2,
                colour: "#74c2e7",
                score: {
                    points: 3,
                    duckies: 1,
                    fouls: 2,
                    karma: -1
                }
            },
            {
                name: "Third Team",
                num: 3,
                colour: "#1a936f",
                score: {
                    points: 3,
                    duckies: 1,
                    fouls: 2,
                    karma: -1
                }
            },
            {
                name: "Fourth Team",
                num: 60,
                colour: "#e3bac6",
                score: {
                    points: 3,
                    duckies: 1,
                    fouls: 2,
                    karma: -1
                }
            }
        ]
    };
    
    return match;
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

function saveScore(data){
    try {
        console.log(data);
        const stmt = db.prepare("insert into scores (matchId, team, points, penalties, duckies, karma) VALUES (?, ?, ?, ?, ?, ?)")
        stmt.bind(data.match, data.team, data.score, data.penalties, data.duckies, data.karma)
        stmt.run()
    }
    catch(e) {
        console.log(e);
    }
}

module.exports = {
    getSchedule, getCurrentMatch, getTeams, getCombindMatchData, getScoreboard, startMatch, saveMatch, loadMatch, addScore, saveScore
}

loadMatch();