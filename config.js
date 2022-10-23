require ('./types')
/** @type Config */
module.exports = {
    port: 3000,
    authString: "password",
    initScript: "./setup.sql",
    matchLength: 4*60,
    freezeDelay: 2.5,
    audio: {
        leadTime: 0.25,
        interrupted: "/sounds/Match Pause_normalized.wav",
        sequence:[
            {
                time: 60,
                source: "/sounds/Start Auto_normalized.wav",
            },
            {
                time: 45,
                source: "/sounds/Start Teleop_normalized.wav",
            },
            {
                time: 15,
                source: "/sounds/Start of End Game_normalized.wav",
            },
            {
                time: 0,
                source: "/sounds/Match End_normalized.wav",
            }
        ]
    },
    scoreboard: {
        duration: 15,
        rankCol: {
            name: "RPA",
            width: 2,
            func: (t) => t.rpa.toFixed(2)
        },
        data: [
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
                    name: "Score",
                    width: 3,
                    func: (t) => t.score
                },
                {
                    name: "Balls Scored",
                    width: 8,
                    func: (t) => t.metA
                }
            ]
        ],
    },
    postgame: {
        duration: 45,
        breakdown: [
            {
                name: "Balls Scored",
                func: (a) => a.metA
            },
            {
                name: "Oppo. Fouls",
                func: (a) => a.metB
            }
        ]
    },
    buttons: [
        [
            {
                text: "Low",
                score: 5,
                metA: 1,
            },
            {
                text: "Mid",
                score: 7,
                metA: 1,
            },
            {
                text: "High",
                score: 15,
                metA: 1,
            }
        ],
        {
            text: "-1",
            score: -1,
            metB: 1,
            spaceBefore: 2,
        },
        [
            {
                text: "Foul",
                score: -7,
                metB: 7,
                opposing: true,
            },
            {
                text: "Tech Foul",
                score: -15,
                metB: 15,
                opposing: true,
            }
        ],
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