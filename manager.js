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
 *   running: false,
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

function loadMatch(id=-1){
    if(id == -1){
      id = (currentMatch == null) ? 1 : currentMatch.id+1;  
    }
    const getScheduledMatch = db.prepare("SELECT schedule.id, type, schedule.number, redTeam, red.name AS redName, blueTeam, blue.name AS blueName FROM schedule LEFT JOIN teams red ON red.number = redTeam LEFT JOIN teams blue ON blue.number = blueTeam WHERE id=?")
    getScheduledMatch.bind(id);
    /** @type Match */
    let sch = getScheduledMatch.get();
    currentMatch = {
        id: sch.id,
        running: false,
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
    getSchedule, startMatch, getCurrentMatch, getTeams, getCombindMatchData, saveGame, loadMatch
}