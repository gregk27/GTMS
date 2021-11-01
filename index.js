const express = require('express')
const app = express()
const port = 3000

var currentGame = {
    name: "Test 5",
    endTime: Date.now()+600000,
    id: 5,
    red: {
        num: 1234,
        name: "Test Team",
        score: 50
    },
    blue: {
        num: 4567,
        name: "Test Team 2",
        score: 30
    }
}

app.use(express.static('static',{index:false,extensions:['html']}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/game/data', (req, res) => {
    res.json(currentGame);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})