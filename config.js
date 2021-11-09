require ('./types')
/** @type Config */
module.exports = {
    port: 3000,
    authString: "password",
    initScript: "./setup.sql",
    matchLength: 5*60,
    scoreboard: [
        [
            {
                name: "Wins",
                width: 3,
                func: (t) => t.wins
            },
            {
                name: "Losses",
                width: 3,
                func: (t) => t.losses
            },
            {
                name: "Ties",
                width: 3,
                func: (t) => t.ties
            }
        ],
        [
            {
                name: "Total Score",
                width: 5,
                func: (t) => t.score
            },
            {
                name: "Avg. Goals",
                width: 5,
                func: (t) => t.scoreAvg
            },
        ],
        [
            {
                name: "Total Balls",
                width: 5,
                func: (t) => t.metA
            },
            {
                name: "Avg. Balls",
                width: 5,
                func: (t) => t.numMatches > 0 ? t.metA/t.numMatches : 0
            },
        ]
    ],
    buttons: [
        [
            {
                text: "Low",
                score: 1,
                metA: 1,
            },
            {
                text: "Mid",
                score: 2,
                metA: 1,
            },
            {
                text: "High",
                score: 3,
                metA: 1,
            }
        ],
        {
            text: "-1",
            score: -1,
            metB: 1,
            spaceBefore: 2,
        }
    ],
    rankPointFunction: (t) => {
        return 2*t.wins + 1*t.ties;
    },
    sortFunction: (a, b)=>{
        // Sort by ranking point average, in event of tie sort by average balls/match then average score
        let delta = b.rpa - a.rpa;
        if(delta == 0)
            delta = b.metA/b.numMatches - a.metA/b.numMatches;
        if(delta == 0)
            delta = b.scoreAvg - a.scoreAvg;
        return delta;
    },
}