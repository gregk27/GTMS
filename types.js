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
 */