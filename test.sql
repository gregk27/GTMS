select number, name, sum(wins) AS wins, sum(losses) AS losses, sum(ties) AS ties, sum(score) AS score, sum(metA) as metA, sum(metB) as metB from (
    SELECT COUNT(scores.id) AS wins, 0 as ties, 0 as losses, 0 as score, 0 as metA, 0 as metB from (scores LEFT JOIN schedule ON scores.id=schedule.id)
    WHERE (redTeam = 1 AND redScore > blueScore) OR (blueTeam = 1 AND blueScore > redScore)
    UNION ALL
    SELECT 0, COUNT(scores.id) AS ties, 0, 0, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
    WHERE (redTeam = 1 AND redScore = blueScore) OR (blueTeam = 1 AND blueScore = redScore)
    UNION ALL
    SELECT 0, 0, COUNT(scores.id) AS losses, 0, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
    WHERE (redTeam = 1 AND redScore < blueScore) OR (blueTeam = 1 AND blueScore < redScore)
    UNION ALL
    SELECT 0, 0, 0, SUM(redScore) as score, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
    WHERE (redTeam = 1)
    UNION ALL
    SELECT 0, 0, 0, SUM(blueScore) as score, 0, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
    WHERE (blueTeam = 1)
    SELECT 0, 0, 0, 0, SUM(redMetA) as metA, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
    WHERE (redTeam = 1)
    UNION ALL
    SELECT 0, 0, 0, 0, SUM(blueMetA) as metA, 0 from (scores LEFT JOIN schedule ON scores.id=schedule.id)
    WHERE (blueTeam = 1)
    SELECT 0, 0, 0, 0, 0, SUM(redMetB) as metB from (scores LEFT JOIN schedule ON scores.id=schedule.id)
    WHERE (redTeam = 1)
    UNION ALL
    SELECT 0, 0, 0, 0, 0, SUM(blueMetB) as metB from (scores LEFT JOIN schedule ON scores.id=schedule.id)
    WHERE (blueTeam = 1)
    ) left join teams t on number=1
    ;