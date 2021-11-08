const fs = require('fs');

let needInit = !fs.existsSync("./db.sqlite");
const db = require('better-sqlite3')('db.sqlite');

// Create tables if the file didn't already exist
if(needInit){
    db.exec(fs.readFileSync("./tables.sql").toString())
}

const getTeamsStmt = db.prepare("SELECT * FROM teams");
const getCombinedMatchDataStmt = db.prepare("SELECT schedule.id, type, number, redTeam, scores.redScore AS redScore, scores.redMetA AS redMetA, scores.redMetB AS redMetB, blueTeam, scores.blueScore AS blueScore, scores.blueMetA AS blueMetA, scores.blueMetB AS blueMetB FROM schedule LEFT JOIN scores ON scores.id = schedule.id");

/** @type ActiveMatch */
var currentMatch = null;

function getSchedule(){
    const stmt = db.prepare("SELECT schedule.id, type, schedule.number, redTeam, red.name AS redName, blueTeam, blue.name AS blueName FROM schedule LEFT JOIN teams red ON red.number = redTeam LEFT JOIN teams blue ON blue.number = blueTeam WHERE id>?");
    // Show current match if it hasn't started yet
    stmt.bind(currentMatch.running ? currentMatch.id : currentMatch.id-1);
    return stmt.all();
}

async function getScoreboard(){
    let teams = getTeamsStmt.all();
    out = []
    for(let t of teams){
        let stmt = db.prepare(`
        select number, name, sum(wins) AS wins, sum(losses) AS losses, sum(ties) AS ties, sum(score) AS score, sum(metA) as metA, sum(metB) as metB from (
            SELECT COUNT(scores.id) AS wins, 0 as ties, 0 as losses, 0 as score, 0 as metA, 0 as metB from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ? AND redScore > blueScore) OR (blueTeam = ? AND blueScore > redScore)
            UNION ALL
            SELECT 0, COUNT(scores.id) AS ties, 0, 0, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ? AND redScore = blueScore) OR (blueTeam = ? AND blueScore = redScore)
            UNION ALL
            SELECT 0, 0, COUNT(scores.id) AS losses, 0, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ? AND redScore < blueScore) OR (blueTeam = ? AND blueScore < redScore)
            UNION ALL
            SELECT 0, 0, 0, SUM(redScore) as score, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ?)
            UNION ALL
            SELECT 0, 0, 0, SUM(blueScore) as score, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (blueTeam = ?)
            UNION ALL
            SELECT 0, 0, 0, 0, SUM(redMetA) as metA, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ?)
            UNION ALL
            SELECT 0, 0, 0, 0, SUM(blueMetA) as metA, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (blueTeam = ?)
            UNION ALL
            SELECT 0, 0, 0, 0, 0, SUM(redMetB) as metB from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ?)
            UNION ALL
            SELECT 0, 0, 0, 0, 0, SUM(blueMetB) as metB from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (blueTeam = ?)
            ) left join teams t on number=?;`)
        stmt.bind(t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number)
        out.push(stmt.get());
    }
    for(let t of out){
        t.rp = (t.wins*2+t.ties*1);
        if(t.wins+t.ties+t.losses > 0)
            t.rpa = t.rp/(t.wins+t.ties+t.losses);
        else
            t.rpa = 0
    }
    out.sort((a, b)=>{
        let delta = b.rpa - a.rpa;
        if(delta == 0)
            return b.score - a.score;
        return delta;
    })
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
    const getScheduledMatch = db.prepare("SELECT schedule.id, type, schedule.number, redTeam, red.name AS redName, blueTeam, blue.name AS blueName FROM schedule LEFT JOIN teams red ON red.number = redTeam LEFT JOIN teams blue ON blue.number = blueTeam WHERE id=?")
    getScheduledMatch.bind(id);
    /** @type Match */
    let sch = getScheduledMatch.get();
    currentMatch = {
        id: sch.id,
        running: false,
        saved: false,
        endTime: Date.now() + 5*60*1000,
        name: sch.type + " " + sch.number,
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
}

function startMatch(){
    if(!currentMatch.running){
        currentMatch.running = true;
        currentMatch.endTime = Date.now() + 5*60*1000;
    }
}

function getCurrentMatch(){
    if(!currentMatch.running){
        currentMatch.endTime = Date.now() + 5*60*1000 + 1000;
    }
    return currentMatch;
}

function getTeams(){
    return getTeamsStmt.all();
}

function getCombindMatchData(){
    return getCombinedMatchDataStmt.all();
}

function saveGame(){
    console.log(currentMatch);
    currentMatch.saved = true;
    try {
        const stmt = db.prepare("INSERT INTO scores (id, redScore, redMetA, redMetB, blueScore, blueMetA, blueMetB) VALUES (?, ?, ?, ?, ?, ?, ?)")
        stmt.bind(currentMatch.id, currentMatch.red.score, currentMatch.red.metA, currentMatch.red.metB, currentMatch.blue.score, currentMatch.blue.metA, currentMatch.blue.metB);
        stmt.run()
    } catch (e){
        const stmt = db.prepare("UPDATE scores SET redScore=?, redMetA=?, redMetB=?, blueScore=?, blueMetA=?, blueMetB=?, WHERE id=?")
        stmt.bind(currentMatch.red.score, currentMatch.red.metA, currentMatch.red.metB, currentMatch.blue.score, currentMatch.blue.metA, currentMatch.blue.metB, currentMatch.id);
        stmt.run()
    }
}

module.exports = {
    getSchedule, startMatch, getCurrentMatch, getTeams, getCombindMatchData, saveGame, loadMatch, getScoreboard
}