/**
 * @typedef {{
 *  number: number,
 *  name: string
 * }} Team
 * @typedef {{
 *  id: number,
 *  type: string,
 *  number: number,
 *  redTeam: number,
 *  redScore: number,
 *  redName?: number
 *  blueTeam: number,
 *  blueScore: number,
 *  blueName?: number
 * }} Match
 * @typedef {{
 *   name: string,
 *   endTime: number,
 *   running: boolean,
 *   saved: boolean,
 *   id: number,
 *   red: {
 *       num: number,
 *       name: string,
 *       score: number
 *   },
 *   blue: {
 *       num: number,
 *       name: string,
 *       score: number
 *   }
 * }} ActiveMatch
 */

const fs = require('fs');

let needInit = !fs.existsSync("./db.sqlite");
const db = require('better-sqlite3')('db.sqlite');

// Create tables if the file didn't already exist
if(needInit){
    db.exec(fs.readFileSync("./tables.sql").toString())
}

const getTeamsStmt = db.prepare("SELECT * FROM teams");
const getCombinedMatchDataStmt = db.prepare("SELECT schedule.id, type, number, redTeam, scores.redScore AS redScore, blueTeam, scores.blueScore AS blueScore FROM schedule LEFT JOIN scores ON scores.id = schedule.id");

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
        select number, name, sum(wins) AS wins, sum(losses) AS losses, sum(ties) AS ties, sum(score) AS score from (
            SELECT COUNT(scores.id) AS wins, 0 as ties, 0 as losses, 0 AS score from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ? AND redScore > blueScore) OR (blueTeam = ? AND blueScore > redScore)
            UNION
            SELECT 0 as wins, COUNT(scores.id) AS ties, 0 as losses, 0 AS score from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ? AND redScore = blueScore) OR (blueTeam = ? AND blueScore = redScore)
            UNION
            SELECT 0 as wins, 0 as ties, COUNT(scores.id) AS losses, 0 AS score from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ? AND redScore < blueScore) OR (blueTeam = ? AND blueScore < redScore)
            UNION
            SELECT 0 as wins, 0 as ties, 0 AS losses, SUM(redScore) as score from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (redTeam = ?)
            UNION
            SELECT 0 as wins, 0 as ties, 0 AS losses, SUM(blueScore) as score from (scores LEFT JOIN schedule ON scores.id=schedule.id)
            WHERE (blueTeam = ?)
            ) left join teams t on number=?;`)
        stmt.bind(t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number, t.number)
        out.push(stmt.get());
    }
    out.sort((a, b)=>{
        return b.wins*2+b.ties*1 - a.wins*2+a.ties*1;
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
            score: 0
        },        
        blue: {
            name: sch.blueName,
            num: sch.blueTeam,
            score: 0
        }
    }
}

function startMatch(){
    if(!currentMatch.running){
        currentMatch.running = true;
        currentMatch.endTime = Date.now() + 0.5*60*1000;
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
    currentMatch.saved = true;
    try {
        const stmt = db.prepare("INSERT INTO scores (id, redScore, blueScore) VALUES (?, ?, ?)")
        stmt.bind(currentMatch.id, currentMatch.red.score, currentMatch.blue.score);
        stmt.run()
    } catch (e){
        const stmt = db.prepare("UPDATE scores SET redScore=?, blueScore=? WHERE id=?")
        stmt.bind(currentMatch.red.score, currentMatch.blue.score, currentMatch.id);
        stmt.run()
    }
}

module.exports = {
    getSchedule, startMatch, getCurrentMatch, getTeams, getCombindMatchData, saveGame, loadMatch, getScoreboard
}