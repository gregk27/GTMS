CREATE TABLE teams (
    number      INTEGER PRIMARY KEY,
    name        VARCHAR(128)
);

CREATE TABLE schedule (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    type        VARCHAR(16) NOT NULL,
    number      INTEGER NOT NULL,
    redTeam     INTEGER NOT NULL,
    blueTeam    INTEGER NOT NULL,

    FOREIGN KEY (redTeam)
        REFERENCES teams(number)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (blueTeam)
        REFERENCES teams(number)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE scores (
    id          INTEGER PRIMARY KEY,
    redScore    INTEGER NOT NULL,
    blueScore   INTEGER NOT NULL,

    FOREIGN KEY (id)
        REFERENCES schedule(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO teams (number, name) VALUES 
    (1234, 'Test 1'), 
    (5678, 'Test 2');

INSERT INTO schedule (type, number, redTeam, blueTeam) VALUES
    ('Practice', 1, 1234, 5678),
    ('Practice', 2, 5678, 1234);

SELECT * FROM teams;
SELECT * FROM schedule;