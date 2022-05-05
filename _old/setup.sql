DELETE FROM scores WHERE 1=1;
DELETE FROM schedule WHERE 1=1;
DELETE FROM teams WHERE 1=1;

INSERT INTO teams (number, name) VALUES
	(1000, 'First Team'),
	(2000, 'Second Team'),
	(3000, 'Third Team'),
	(4000, 'Fourth Team'),
	(5000, 'Fifth Team'),
	(6000, 'Sixth Team'),
	(7000, 'Seventh Team'),
	(8000, 'Eighth Team'),
	(9000, 'Ninth Team');

INSERT INTO schedule (type, number, redTeam, blueTeam) VALUES
	('Match', 1, 1000, 2000),
	('Match', 2, 3000, 4000),
	('Match', 3, 5000, 6000),
	('Match', 4, 7000, 8000),
	('Match', 5, 9000, 1000),
	('Match', 6, 2000, 3000),
	('Match', 7, 4000, 5000),
	('Match', 8, 6000, 7000),
	('Match', 9, 8000, 2000);

SELECT * FROM teams;
SELECT * FROM schedule;
