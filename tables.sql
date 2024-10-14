DROP TABLE IF EXISTS  teams;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS  scores;

CREATE TABLE teams (
    number      INTEGER PRIMARY KEY,
    name        VARCHAR(128)
);

CREATE TABLE schedule (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    type        VARCHAR(16) NOT NULL,
    number      INTEGER NOT NULL,
    team1       INTEGER NOT NULL,
    team2       INTEGER NOT NULL,
    team3       INTEGER NOT NULL,
    team4       INTEGER NOT NULL,

    FOREIGN KEY (team1)
        REFERENCES teams(number)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (team2)
        REFERENCES teams(number)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (team3)
        REFERENCES teams(number)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (team4)
        REFERENCES teams(number)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE scores (
    matchId     INTEGER NOT NULL,
    team        INTEGER NOT NULL,
    points      INTEGER NOT NULL,
    penalties   INTEGER NOT NULL,
    duckies     INTEGER NOT NULL,
    karma       INTEGER NOT NULL,

    PRIMARY KEY (matchId, team),

    FOREIGN KEY (matchId)
        REFERENCES schedule(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
        
    FOREIGN KEY (team)
        REFERENCES teams(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO teams (number, name) VALUES 
    (1, 'Test 1'), 
    (2, 'Test 2'), 
    (3, 'Test 3'), 
    (4, 'Test 4'), 
    (5, 'Test 5'), 
    (6, 'Test 6'), 
    (7, 'Test 7'), 
    (8, 'Test 8');

INSERT INTO schedule (type, number, team1, team2, team3, team4) VALUES
    ('Test', 1, 1, 2, 3, 4),
    ('Test', 2, 5, 6, 7, 8),
    ('Test', 3, 1, 2, 7, 8),
    ('Test', 4, 5, 6, 3, 4);

INSERT INTO scores (matchId, team, points, penalties, duckies, karma) VALUES
    (1, 1, 5, 0, 1, 1),
    (1, 2, 12, 5, 2, 1),
    (1, 3, 12, 5, 2, 1),
    (1, 4, 12, 5, 2, 1),
    (3, 1, 10, 2, 3, 2);

SELECT * FROM teams;
SELECT * FROM schedule;