# Stolen Bike Cases - JOIN Coding Challenge - Backend (Node.js)
![JOIN Stolen Bike Cases](https://github.com/join-com/coding-challenge-backend-nodejs/raw/master/illustration.png)

accessible on our test server at: [http://167.114.167.222:3000](http://167.114.167.222:3000)

## Setup
0. Install docker (for PostgreSQL) and Node
1. `yarn install`
2. `yarn run start_db` to run db
3. `yarn run bootstrap-db`
4. `yarn run dev` or `yarn run start` and go to [http://localhost:3000](http://localhost:3000)
5. `yarn run test` and `yarn run test-coverage` (not complete 😰)
6. `yarn run stop_db`

## Context
Stolen bikes are a typical problem in Berlin. The Police want to be more efficient in resolving stolen bike cases. They decided to build a software that can automate their processes — the software that you're going to develop.

## Product Requirements
- [x] Bike owners can report a stolen bike.
	- POST /reports
	- PUT /reports/:id]
- [x] A bike can have multiple characteristics: license number, color, type, full name of the owner, date, and description of the theft
	- GET /reports/:id
	- GET /reports
- [x] The Police can increase or decrease the number of police officers
	- GET /officers
	- DELETE /officers/:id
	- GET /officers/:id
	- POST /officers
	- PUT /officers/:id
- [x] Each police officer should be able to search bikes by different characteristics in a database and see which police officer is responsible for a stolen bike case.
	- GET /reports?color=red&type=new
	- GET /reports/:id
- [x] New stolen bike cases should be automatically assigned to any free police officer.
- [x] A police officer can only handle one stolen bike case at a time.
- [x] When the Police find a bike, the case is marked as resolved and the responsible police officer becomes available to take a new stolen bike case.
	- POST /reports/:id/resolve
- [x] The system should be able to assign unassigned stolen bike cases automatically when a police officer becomes available.

### Entities
- report:
	- id
	- date_of_submit, date_of_theft, description
	- bike: license_number, color, type, owner_full_name
	- is_resolved
	- associate_officer
		- id
		- name
- officer:
	- id
	- name
	- current_case_id

## Your Mission
Your task is to provide APIs for a frontend application that satisfies all requirements above.

Please stick to the Product Requirements. You should not implement authorization and authentication, as they are not important for the assessment. Assume everyone can make requests to any api.

## Tech Requirements
- Node.js
- You are free to use any framework, but it’s recommended that you use one that you’re good at
- Use only SQL Database
- Tests (quality and coverage)
- Typescript is a plus

## Instructions
- Fork this repo
- The challenge is on!
- Build a performant, clean and well-structured solution
- Commit early and often. We want to be able to check your progress
- Make your API public. Deploy it using the service of your choice (e.g. AWS, Heroku, Digital Ocean...)
- Create a pull request
- Please complete your working solution within 7 days of receiving this challenge, and be sure to notify us when it is ready for review.
