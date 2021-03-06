/**
 * @typedef {{
 *  number: number,
 *  name: string
 * }} Team
 * 
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
 * 
 * @typedef {{
 *   name: string,
 *   duration: number,
 *   endTime: number,
 *   running: boolean,
 *   saved: boolean,
 *   id: number,
 *   red: {
 *       num: number,
 *       name: string,
 *       score: number,
 *       metA: number,
 *       metB: number
 *   },
 *   blue: {
 *       num: number,
 *       name: string,
 *       score: number,
 *       metA: number,
 *       metB: number
 *   }
 * }} ActiveMatch
 * 
 * @typedef {{
 *  number: number,
 *  name: string,
 *  wins: number,
 *  losses: number,
 *  ties: number,
 *  score: number,
 *  metA: number,
 *  metB: number,
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
 *  audio: {
 *      leadTime: number,
 *      sequence: MatchSound[],
 *  },
 *  scoreboard: {
 *      duration: number,
 *      rankCol: Column,
 *      data: Column[][]
 *  }
 *  buttons: (Button | Button[])[],
 *  rankPointFunction: (t:TeamScore) => string,
 *  sortFunction: (a:TeamScore, b:TeamScore) => number,
 * }} Config
 */