DELETE FROM scores WHERE 1=1;
DELETE FROM schedule WHERE 1=1;
DELETE FROM teams WHERE 1=1;

INSERT INTO teams (number, name) VALUES
	(1, 'VelociCLAPtors'),
	(2, 'Second Team'),
	(3, 'Third Team'),
	(4, 'Fourth Team'),
	(5, 'Fifth Team'),
	(6, 'Sixth Team'),
	(7, 'Seventh Team'),
	(8, 'Eighth Team'),
	(9, 'Ninth Team');

INSERT INTO schedule (type, number, redTeam, blueTeam) VALUES
	('Quals', 1, 1, 4),
	('Quals', 2, 4, 5),
	('Quals', 3, 1, 2),
	('Quals', 4, 4, 3),
	('Quals', 5, 5, 1),
	('Quals', 6, 3, 2),
	('Quals', 7, 2, 1),
	('Quals', 8, 5, 4),
	('Quals', 9, 4, 2),
	('Quals', 10, 3, 5),
	('Quals', 11, 1, 3),
	('Quals', 12, 2, 4),
	('Quals', 13, 4, 1),
	('Quals', 14, 1, 5),
	('Quals', 15, 5, 2),
	('Quals', 16, 3, 4),
	('Quals', 17, 2, 5),
	('Quals', 18, 3, 1),
	('Quals', 19, 2, 3),
	('Quals', 20, 5, 3);

SELECT * FROM teams;
SELECT * FROM schedule;
