DELETE FROM scores WHERE 1=1;
DELETE FROM schedule WHERE 1=1;
DELETE FROM teams WHERE 1=1;

INSERT INTO teams (number, name) VALUES
	(1, 'VelociKLAPPtors'),
	(2, 'Sharpshot Atlas'),
	(3, 'The Best Team'),
	(777, 'The Gamblers'),
	(5272, 'Straight Shooters'),
	(4, 'Sydenham')

-- Match type is one of PRACTICE, RANKING, ELIMINATION, OTHER
-- - Practice matches show on schedule but don't get counted for ranking
-- - RANKING matches show on schedule and count towards ranking
-- - ELIMINATION matches are same as OTHER, but reserved for future use
-- - OTHER matches do not appear on schedule or count for ranking
INSERT INTO schedule (type, prettyName, number, redTeam, blueTeam) VALUES
	('RANKED', 'Match', 1, 1, 2),
	('RANKED', 'Match', 2, 3, 1),
	('RANKED', 'Match', 3, 2, 6),
	('RANKED', 'Match', 4, 7, 8),
	('RANKED', 'Match', 5, 9, 1),
	('RANKED', 'Match', 6, 2, 3),
	('RANKED', 'Match', 7, 1, 2),
	('RANKED', 'Match', 8, 6, 7),
	('RANKED', 'Match', 9, 8, 2);

SELECT * FROM teams;
SELECT * FROM schedule;
