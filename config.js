require ('./types')
/** @type Config */
module.exports = {
    port: 3000,
    authString: "password",
    initScript: "./setup.sql",
    metrics: {
        scoreName: "Avg. Score",
        showScoreAvg: true,
        metAName: "Total Goals",
        showMetA: true,
        metBName: "MetB",
        showMetB: false,
    },
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
    sortFunction: (a, b)=>{
        // Sort by ranking point average, in event of tie sort by average score then metA
        let delta = b.rpa - a.rpa;
        if(delta == 0)
            delta = b.metA/b.numMatches - a.metA/b.numMatches;
        if(delta == 0)
            delta = b.scoreAvg - a.scoreAvg;
        return delta;
    },
}