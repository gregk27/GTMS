DELETE FROM scores WHERE 1=1;
DELETE FROM schedule WHERE 1=1;
DELETE FROM teams WHERE 1=1;

INSERT INTO teams (number, name) VALUES
	(1111, 'VelociKLAPPtors'),
	(2222, 'Sharpshot Atlas'),
	(3333, 'The Best Team'),
	(777, 'The Gamblers'),
	(5272, 'Straight Shooters'),
	(4444, 'Sydenham');

-- Match type is one of PRACTICE, RANKING, ELIMINATION, OTHER
-- - Practice matches show on schedule but don't get counted for ranking
-- - RANKING matches show on schedule and count towards ranking
-- - ELIMINATION matches are same as OTHER, but reserved for future use
-- - OTHER matches do not appear on schedule or count for ranking
INSERT INTO schedule (type, prettyName, number, redTeam, blueTeam) VALUES
	('PRACTICE', 'Practice', 1, 1111, 2222),
	('PRACTICE', 'Practice', 2, 5272, 3333),
	('PRACTICE', 'Practice', 3, 4444, 777),

	('RANKED', 'Match', 1, 1111, 3333),
	('RANKED', 'Match', 2, 4444, 5272),
	('RANKED', 'Match', 3, 777, 2222),

	('RANKED', 'Match', 4, 3333, 4444),
	('RANKED', 'Match', 5, 1111, 2222),
	('RANKED', 'Match', 6, 5272, 777),

	('RANKED', 'Match', 7, 3333, 2222),
	('RANKED', 'Match', 8, 4444, 777),
	('RANKED', 'Match', 9, 1111, 5272),

	('RANKED', 'Match', 10, 2222, 4444),
	('RANKED', 'Match', 11, 1111, 777),
	('RANKED', 'Match', 12, 5272, 3333),

	('RANKED', 'Match', 13, 1111, 4444),
	('RANKED', 'Match', 14, 2222, 5272),
	('RANKED', 'Match', 15, 777, 3333),

	('RANKED', 'Match', 16, 4444, 5272),
	('RANKED', 'Match', 17, 1111, 3333),
	('RANKED', 'Match', 18, 777, 2222),

	('RANKED', 'Match', 19, 3333, 4444),
	('RANKED', 'Match', 20, 5272, 777),
	('RANKED', 'Match', 21, 1111, 2222),

	('RANKED', 'Match', 22, 4444, 777),
	('RANKED', 'Match', 23, 3333, 2222),
	('RANKED', 'Match', 24, 1111, 5272),

	('RANKED', 'Match', 25, 2222, 4444),
	('RANKED', 'Match', 26, 1111, 777),
	('RANKED', 'Match', 27, 5272, 3333),

	('RANKED', 'Match', 28, 1111, 3),
	('RANKED', 'Match', 29, 2222, 5272),
	('RANKED', 'Match', 30, 777, 6);

-- Exhibition match inserted at end
	('OTHER', 'Alliances Demo', -1, 9999, 9999)

SELECT * FROM teams;
SELECT * FROM schedule;
