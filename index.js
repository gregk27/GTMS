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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

manager.startMatch();