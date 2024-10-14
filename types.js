/**
 * @typedef {{
 *  number: number,
 *  name: string
 * }} Team
 * 
 * @typedef {{
 *  points: number,
 *  fouls: number,
 *  duckies: number, 
 *  karma: number, 
 * }} Score
 * 
 * @typedef {{
 *  id: number,
 *  type: string,
 *  number: number,
 *  teams: number[],
 *  scores: Score[]
 * }} Match
 *  
 * @typedef {{
 *  num: number,
 *  name: string,
 *  score: Score
 * }} ActiveTeam
 * 
 * @typedef {{
 *   name: string,
 *   duration: number,
 *   endTime: number,
 *   running: boolean,
 *   saved: boolean,
 *   id: number,
 *   teams: ActiveTeam[]
 * }} ActiveMatch
 * 
 * @typedef {{
 *  number: number,
 *  name: string,
 *  score: Score
 *  numMatches: number,
 *  rp: number,
 *  rpa: number,
 *  scoreAvg: number,
 * }} TeamScore
 * 
 * @typedef {{
 *  time: number,
 *  source: string,
 * }} MatchSound
 * 
 * @typedef {{
 *  text: string,
 *  score?: number,
 *  metA?: number,
 *  metB?: number,
 *  spaceBefore?: number,
 *  spaceAfter?: number
 * }} Button
 * 
 * @typedef {{
 *  name: string,
 *  width: number,
 *  func: (t:TeamScore) => string
 * }} Column
 * 
 * @typedef {{
 *  port:number,
 *  authString: string,
 *  initScript: string,
 *  matchLength: number,
 *  freezeDelay: number,
 *  audio: {
 *      leadTime: number,
 *      interrupted: string,
 *      sequence: MatchSound[],
 *  },
 *  scoreboard: {
 *      duration: number,
 *      rankCol: Column,
 *      data: Column[][]
 *  },
 *  postgame: {
 *      breakdown: {name:string, func: (a:ActiveTeam) => string}[]
 *  },
 *  buttons: (Button | Button[])[],
 *  rankPointFunction: (t:TeamScore) => string,
 *  sortFunction: (a:TeamScore, b:TeamScore) => number,
 * }} Config
 */