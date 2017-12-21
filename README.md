
# exoplanets-project

## Introduction
A **NodeJS** application that uses arcsecond.io exoplanets API to get detailed information  of planets listed in a csv file which is uploaded by the user. 

## Tasks 

 - Top 10 planets by Radius
 - Top 10 planets by Mass
 - Top 10 planets by Orbital Period
 - Number of planets per discovery method (ex: Radial Velocity: 12, Transit: 32, Imaging: 11 etc…)

## Instructions
To use this project, follow the instructions below:
(First, to run the server)
 - `npm install`
 - `node index.js`
(To run the client)
Enter `http://localhost:8000/server` in web browser.
Further:
 - Upload csv file containing the hotname and pl_letter
 - wait for the results (it takes considerable time to get the planet details from the  API)
 - In the result, you will see three tables which show the results for the following tasks
	 - Top 10 planets by Radius
	 - Top 10 planets by Mass
	 - Top 10 planets by Orbital Period

## Technologies Used

 - [express](https://github.com/expressjs/express)
 - [socket.io](https://socket.io/)
 - [request](https://www.npmjs.com/package/request)
 - [fs](https://www.npmjs.com/package/fs)
