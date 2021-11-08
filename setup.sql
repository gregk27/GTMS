DELETE FROM scores WHERE 1=1;
DELETE FROM schedule WHERE 1=1;
DELETE FROM teams WHERE 1=1;


INSERT INTO teams (number, name) VALUES
	(0001, "Golden Shooters"),
	(2001, "Black Holes"),
	(307, "The Garbage Men"),
	(4708, "Fly Wings");

INSERT INTO schedule (type, number, redTeam, blueTeam) VALUES
	("Match", 1, 0001, 2001),
	("Match", 2, 307, 4708),
	("Match", 3, 2001, 307),
	("Match", 4, 4708, 0001), 
	("Match", 5, 4708, 2001),
	("Match", 6, 0001, 307);

SELECT * FROM teams;
SELECT * FROM schedule;