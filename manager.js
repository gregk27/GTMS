/**
 * @typedef {{
 *  number: number,
 *  name: string
 * }} Team
 * @typedef {{
 *  id: number,
 *  type: string,
 *  number: number,
 *  played: boolean,
 *  redTeam: number,
 *  redScore: number,
 *  blueTeam: number,
 *  blueScore: number,
 * }} Match
 * @typedef {{
 *   name: string,
 *   endTime: number,
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

const getSchedule = db.prepare("SELECT * FROM schedule");
const getScheduledMatch = db.prepare("SELECT * FROM schedule WHERE id=?")

var currentMatchIdx = 0;
/** @type ActiveMatch */
var currentMatch = null;

/** @type Match[] */
var schedule = [];
schedule = getSchedule.all();

function startMatch(id=-1){
    if(id == -1){
      id = (currentMatch == null) ? 1 : currentMatch.id+1;  
    }
    getScheduledMatch.bind(id);
    /** @type Match */
    let sch = getScheduledMatch.get();
    currentMatch = {
        id: sch.id,
        endTime: Date.now() + 5*60*1000,
        name: sch.type + " " + sch.number,
        red: {
            name:"R",
            num: sch.redTeam,
            score: 0
        },        
        blue: {
            name:"B",
            num: sch.blueTeam,
            score: 0
        }
    }
}

function getCurrentMatch(){
    return currentMatch;
}

module.exports = {
    startMatch, getCurrentMatch
}