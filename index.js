const express = require('express')
const manager = require('./manager');
const app = express()
const port = 3000

app.use(express.static('static',{index:false,extensions:['html']}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/game/data', (req, res) => {
    res.json(manager.getCurrentMatch());
})

app.get('/game/start', (req, res)=>{
  manager.startMatch();
  res.send("");
})

app.get('/game/addScore/:alliance', (req, res) => {
    let currentGame = manager.getCurrentMatch();
    if(req.params["alliance"] == 'red'){
        currentGame.red.score += parseInt(req.query['d']);
        console.log(currentGame.red.score);
    } else if (req.params["alliance"] == 'blue'){
        currentGame.blue.score += parseInt(req.query['d']);
        console.log(currentGame.red.score);
    }
    res.send("");
})

app.get('/game/save', (req, res)=>{
  manager.saveGame();
  res.json({result:true})
})

app.get('/teams/list', (req, res)=>{
  res.json(manager.getTeams());
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
  if(req.query['id'] == null){
    manager.loadMatch(-1)
  } else {
    manager.loadMatch(parseInt(req.query['id']));
  }
  res.send("");
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

manager.loadMatch();