require("./types");

const express = require('express')
const ip = require('ip');
const manager = require('./manager');
const config = require("./config");
// Copy of config with functions stringified for sending through express
const configStr = JsonFuncToStr({... config});
const app = express()

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

app.get('/game/start', (req, res)=>{
  if(req.query['auth'] != config.authString) { 
    res.send("Unauthorized");
    return;
  }
  manager.startMatch();
  res.send("");
})

app.get('/game/addScore/:alliance', (req, res) => {
    if(req.query['auth'] != config.authString){
      res.send("Unauthorized");
      return
    }
    let currentGame = manager.getCurrentMatch();
    if(req.params["alliance"] == 'red'){
        currentGame.red.score += parseInt(req.query['d'] ?? '0');
        currentGame.red.metA  += parseInt(req.query['a'] ?? '0');
        currentGame.red.metB  += parseInt(req.query['b'] ?? '0');
    } else if (req.params["alliance"] == 'blue'){
        currentGame.blue.score += parseInt(req.query['d'] ?? '0');
        currentGame.blue.metA  += parseInt(req.query['a'] ?? '0');
        currentGame.blue.metB  += parseInt(req.query['b'] ?? '0');
    }
    res.send("");
})

app.get('/game/save', (req, res)=>{
  if(req.query['auth'] != config.authString) {
    res.send("Unauthorized");
    return;
  }
  manager.saveGame();
  res.json({result:true})
})

app.get('/teams/list', (req, res)=>{
  res.json(manager.getTeams());
})

app.get('/teams/scoreboard', (req, res)=>{
  manager.getScoreboard().then((dat)=>{
    res.json(dat);
  })
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

app.get('/matches/load', (req, res)=>{
  if(req.query['auth'] != config.authString) {
    res.send("Unauthorized");
    return;
  };
  if(req.query['id'] == null){
    manager.loadMatch(-1)
  } else {
    manager.loadMatch(parseInt(req.query['id']));
  }
  res.send("");
})


app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`)
})

manager.loadMatch();

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