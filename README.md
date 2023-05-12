# gitRestAPI
This repository references a gitHub RestAPI developed in Node.js - typescript. 

# installation
The necessary tools to run this project are Node.js and PostgreSQL 
https://nodejs.org/en/download
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

# set up
After cloning the repo run the following commands on vs terminal
npm init -y 
npm install pg
npm install -g db-migrate 
npm install -g db-migrate-pg

# initiate database
Go to pgAdmin, to establish connection to the server (see database.json)

# create database table with migration
On vs terminal, run the following command
db-migrate up initialize 

# OK you're good to go!
node .\main.js will run your code

# application walkthrough
The application will run as CLI, where the user can insert 6 different options.
Enter "1" to fetch a user from github (based on his login username) and save it to the database (refresh database after running the code)
Enter "2" to display all the users stored in the database (display all the details: login username, name, location, programming languages, bio, email and twitter. Will be null if user doesnt have any value in a certain field)
Enter "3" to fetch users based on a given location
Enter "4" to delete a user based on a given login username
Enter "5" to fetch the programming languages a user has worked with (referenced in user repos)
Enter "6" to exit the application
