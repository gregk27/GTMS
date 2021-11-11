require("./types");

const ip = require('ip');
const {express, app, config, server, emit} = require("./server");
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

app.get("/testAudio", (req, res)=>{
  for(let a of config.audio.sequence){
    emit("queueAudio", a.source);
  }
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