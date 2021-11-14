require("./types");

const ip = require('ip');
const server = require("./server");
const express = server.express
const app = server.app
const config = server.config

const manager = require('./manager');
// Copy of config with functions stringified for sending through express
const configStr = JsonFuncToStr({... config});

app.use(express.static('static',{index:false,extensions:['html']}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/hostname', (req, res) => {
  res.send(ip.address() + ":" + config.port);
})

app.get('/config/:entry', (req, res)=>{
  // Don't give the auth string
  if(req.params.entry == "authString") res.send("");
  res.json(configStr[req.params.entry]);
})

app.get('/game/data', (req, res) => {
    res.json(manager.getCurrentMatch());
})

app.get('/teams/list', (req, res)=>{
  res.json(manager.getTeams());
})

app.get('/teams/scoreboard', (req, res)=>{
  res.json(manager.getScoreboard());
})

app.get('/matches/list', (req, res)=>{
  if(req.query['dat']=='all'){
    res.json(manager.getCombindMatchData());
  } else if (req.query['dat']=='sch'){
    res.json(manager.getSchedule());
  } else {
    res.json(manager.getSchedule());
  }
})

server.on("testAudio", (client, payload, auth)=>{
  if(auth != config.authString) return;
  for(let a of config.audio.sequence){
    server.emit("queueAudio", a.source);
  }
})

server.on("getHostname", ()=>{
  return ip.address() + ":" + config.port;
})

server.on("getCurrentMatch", ()=>{
  return manager.getCurrentMatch();
})

server.on("getScoreboard", () => {
  return manager.getScoreboard();
})

server.on("getSchedule", () => {
  return manager.getSchedule();
})

server.on("getMatchData", () => {
  return manager.getCombindMatchData();
})

server.on("addScore", (client, payload, auth) => {
  if(auth != config.authString) return;
  manager.addScore(payload.alliance, payload.delta ?? 0, payload.dA ?? 0, payload.dB ?? 0);
})

server.on("loadMatch", (client, payload, auth) => {
  if(auth != config.authString) return;
  manager.loadMatch(payload.id ?? -1);
})

server.on("startMatch", (client, payload, auth)=>{
  if(auth != config.authString) return;
  manager.startMatch();
})

server.on("saveMatch", (client, payload, auth) => {
  if(auth != config.authString) return;
  manager.saveMatch();
})


/**
 * Convert functions in a JSON object to strings for sending over API
 */
 function JsonFuncToStr(json){
  for(let j in json) {
    if(Array.isArray(json[j]) || typeof json[j] == 'object'){
      json[j] = JsonFuncToStr(json[j]);
    } else if(typeof json[j] == "function"){
      json[j] = json[j].toString();
    }
  }
  return json
}