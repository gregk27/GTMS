/** @type Config */
module.exports = {
    port: 3000,
    initScript: "./setup.sql",
    metrics: {
        metAName: "MetA",
        showMetA: true,
        metBName: "MetB",
        showMetB: true,
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
        // Sort by ranking point average, in event of tie sort by total score then metA
        let delta = b.rpa - a.rpa;
        if(delta == 0)
            delta = b.score - a.score;
        if(delta == 0)
            delta = b.metA - a.metA;
        return delta;
    },
}