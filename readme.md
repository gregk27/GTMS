# Greg's Tournament Management System
Greg's Tournament Management System is a centralized scheduling and scoring system for simple tournaments, based on by FIRST Robotics Competition's Field Management System.

## Features
 - Live scoring from any number of input devices
 - Track and display ranking across multiple matches
 - Track and display cumulative values for score and 2 custom metrics
 - Display schedule of upcoming matches
 - Highly configurable to meet various user needs
 - System operations can be distributed across multiple devices
 - Designed for camera passthrough with OBS

## Pages
### Game Page (`/game`)
The game page is the primary way displaying scores during gameplay. It is designed to have the background replaced with a camera feed in OBS.
![](./.readmeImages/gamePage.png)

### Scoreboard Page (`/scoreboard`)
The scoreboard page displays the cumulative scores from all played matches. It contains the following columns:
 - **Rank:** The team's current rank, calculated based on RPA
 - **RPA:** Ranking point average, calculated as `AVG(Wins*2 + Ties)`
 - **Wins:** Number of games won
 - **Losses:** Number of games lost
 - **Ties:** Number of games tied
 - **Score:** Cumulative score from matches
 - **MetA:** Cumulative value of custom metric A, heading should be changed to match application
 - **MetB:** Cumulative value of custom metric B, heading should be changed to match application

![](./.readmeImages/scoreboardPage.gif)

### Schedule Page (`/schedule`)
The schedule page displays the list of upcoming matches.


![](./.readmeImages/schedulePage.png)

### Input Page (`/input?a=[red|blue]&auth=[authString]`)
The input page is designed for mobile devices to provide data for live scoring. Team colour should be specified in the Query String, otherwise inputs will not be registered. Additionally, the `authString` must be provided for secruity. Any number of devices can be used in this role, but there is no system to detect duplicate inputs.


![](./.readmeImages/inputPage.png)

### Control Page (`/control?auth=[authString]`)
The control page is the central point for operating the system. The `authString` must be provided as a query argument for secruity. From this page, the user can start a match, save the scores, and load the next or any match. It also includes information about the current match, a scoreboard, and the complete match schedule with scores. QR codes are provided for the input page, which include colour and authString parameters.


![](./.readmeImages/controlPage.png)

## Configuration
There are various elements of the system which can be configured to meet user requirements. Configuration settings are placed in `config.js`.
### Server Settings
 - **port:** Set the port used by the webserver
 - **authString:** Set the string required to make changes
 - **initScript:** Set the sql script to be run on initialization, this should clear any existing data and insert values for teams and match schedule. Refer to [Initializing Database](#initializing-database) for details.

### Displayed Metrics
The system is counts each team's total score, as well as 2 user-defined metrics to be counted. These metrics are refered to as `score`, `metA` and `metB` respectively.

 - **scoreName:** Name displayed in scoreboard for the total score
 - **showScoreAvg:** If true, score column will show average score instead of total score
 - **metAName:** Name displayed in scoreboard for metA
 - **showMetA:** If true a column for metA will be shown in the scoreboard
 - **metBName:** Name displayed in scoreboard for metB
 - **showMetB:** If true a column for metB will be shown in the scoreboard

### Input Buttons
The buttons on the input page can be customized by providing a list of JSON objects. Singular buttons added to the list will be vertically spaced, if a list of buttons is added they will be grouped vertically and spaced horizontally.

Each button has the following properties, only text is required:
 - **text:** The button's text
 - **score:** The change to be made to score
 - **metA:** The change to be made to metA
 - **metB:** The change to be made to metB
 - **spaceBefore:** Space to be placed before button, in `em`
 - **spaceAfter:** Space to be placed after button, in `em`

### Ranking calculation
The two functions used for ranking teams is provided by the configuration file. `rankPointFunction(t)` takes one TeamScore and returns their Ranking Points, and `sortFunction(a, b)` takes 2 TeamScores. A TeamScore object contains the following properties:
 - **number:** Team number
 - **name:** Team name
 - **wins:** Number of wins
 - **losses:** Number of losses
 - **ties:** Number of ties
 - **score:** Sum of match scores
 - **metA:** Sum of metA
 - **metB:** Sum of metB
 - **numMatches:** Number of matches the team has played
 - **rp:** Ranking Points, calculated as `2*wins + ties`
 - **rpa:** Ranking Point Average, calculated as `rp/(wins+losses+ties)`
 - **scoreAvg:** Average match score, calculated as `score/(wins+losses+ties)`
#### rankPointFunction
The rankPointFunction should return the number of ranking points earned by the team from their current stats. The number it returns will be averaged across the number of matches to obtain the Ranking Point Average. The default function shown below gives 2 RP for a win, and 1 for a tie.

```js
(t) => {
	return 2*t.wins + 1*t.ties;
}
```
#### sortFunction
The sortFunction should should -1 if `b` is ranked higher than `a`, and 1 if `a` is ranked higher than `b`. Any combination of the above data can be used in calculating the ranking order. The default sorting function shown below sorts by RPA, then average score, then MetA.

```js
(a, b) => {
	// Sort by ranking point average, in event of tie sort by average score then metA
	let delta = b.rpa - a.rpa;
	if(delta == 0)
		delta = b.scoreAvg - a.scoreAvg;
	if(delta == 0)
		delta = b.metA - a.metA;
	return delta;
}
```
## Initialising Database
When the application is first run, it will automatically create the database file, `db.sqlite`, and run a specified `initScript` to setup the tables for operation. This code should clear any existing data, insert teams, and insert the match schedule. The following code is the example used for creating the screenshots, and can be found in `setup.sql`: 

```SQL
DELETE FROM scores WHERE 1=1;
DELETE FROM schedule WHERE 1=1;
DELETE FROM teams WHERE 1=1;


INSERT INTO teams (number, name) VALUES
	(1000, "First Team"),
	(2000, "Second Team"),
	(3000, "Third Team"),
	(4000, "Fourth Team"),
	(5000, "Fifth Team"),
	(6000, "Sixth Team"),
	(7000, "Seventh Team"),
	(8000, "Eighth Team"),
	(9000, "Ninth Team");

INSERT INTO schedule (type, number, redTeam, blueTeam) VALUES
	("Match", 1, 1000, 2000),
	("Match", 2, 3000, 4000),
	("Match", 3, 5000, 6000),
	("Match", 4, 7000, 8000),
	("Match", 5, 9000, 1000),
	("Match", 6, 2000, 3000),
	("Match", 7, 4000, 5000),
	("Match", 8, 6000, 7000),
	("Match", 9, 8000, 2000);

SELECT * FROM teams;
SELECT * FROM schedule;
```