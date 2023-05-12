//add "type" : "module" to package.json to run this file!!!!!!
//Import modules
import pg from 'pg';
import readline from 'readline';
import axios from 'axios';

//create client for DB connection
const {Client} = pg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'post',
  database: 'gitUsersDB'
});

//establish connection
async function connect(){
  await client.connect()
  .catch((err) => console.error('Oops. Connection error!', err.stack));
}

//close connection
async function disconnect(){
  await client.end();
}

//prompt for user input
const prompts = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//function to draw menu
function drawMenu() {
  console.log('1. Fetch user from GitHub and save to DB');
  console.log('2. Display users');
  console.log('3. Fetch users by location');
  console.log('4. Delete user by username');
  console.log('5. Fetch programming languages by user');
  console.log('6. Exit');
}

//function to ask user for input
async function ask(option) {
  return new Promise(resolve => {
    prompts.question(option, answer => {
    const escapedAnswer = answer.replace(/'/g, "''");
    resolve(escapedAnswer);});
 });
}

//function to fetch user from GitHub and save to DB
async function fetchAndSaveUser() {
    
  const username = await ask('Enter git login username: ');
  var url = `https://api.github.com/users/${username}`;
  
  //axios request to GitHub API
  const response = await axios.get(url);
  const login = response.data.login;
  const checkResult = await checkIfUserExists(login);

  if (checkResult.rows[0].count > 0) {
    console.log(`User with login: ${username}, already exists in the database.`);
    return;
  }

  //data from GitHub API
  const name = response.data.name;
  const location = response.data.location;
  const reposUrl = response.data.repos_url;
  const bio = response.data.bio;
  const languagesData = await axios.get(reposUrl);
  const progLanguagesTemp = languagesData.data.map(repo => repo.language);
  const progLanguages = progLanguagesTemp.filter((value, index, self) => self.indexOf(value) === index);
  const userEmail = response.data.email;
  const userTwitter = response.data.twitter_username;
  
  console.log('User has been fetched!');
  console.log('Saving user to DB...');

  //programming languages comes in array, so we need to convert it to string
  const progLanguagesString = JSON.stringify(progLanguages);
  const query = 'INSERT INTO "Users" ("userLogin", "userName", "userLocation", "progLanguages", "userBio", "userEmail", "userTwitter") VALUES ($1, $2, $3, $4, $5, $6, $7)';
  const values = [login, name, location, progLanguagesString, bio, userEmail, userTwitter];

  client.query(query, values);
  console.log('User has been saved to DB!');
  return;
}

//Database functions
//query to check if user exists in DB
async function checkIfUserExists(login){
  const query = 'SELECT COUNT(*) FROM "Users" WHERE "userLogin" = $1';
  const value = [login];
  const result = await client.query(query, value);
  return result;
}

//query to get users by location 
async function getUsersByLocation(location){
  const query = 'SELECT * FROM "Users" WHERE "userLocation" = $1';
  const value = [location];
  const result = await client.query(query, value);
  return result;
}

//query to get programming languages by user
async function getProgLanguagesByUser(login){
  const query = 'SELECT "progLanguages" FROM "Users" WHERE "userLogin" = $1';
  const value = [login];
  const result = await client.query(query, value);
  return result;
}

//query to delete user by login
async function deleteUserByLogin(login){
  const query = 'DELETE FROM "Users" WHERE "userLogin" = $1';
  const value = [login];
  const result = await client.query(query, value);
  if (result.rowCount === 0) {
    console.log('There are no users with that login username in the database.');
    return;
  }
  console.log(`User ${login} has been deleted!`);
}

//Menu functions
//fetch programming languages by user
async function fetchProgLanguagesByUser() {
  const login = await ask('Enter git login username: ');
  const checkResult = await checkIfUserExists(login);

  if (checkResult.rowCount === 0) {
    console.log('There are no users with that login username in the database.');
    return;
  }
  const result = await getProgLanguagesByUser(login);
  console.log(`User has repositories in:`);
  console.log(result.rows[0].progLanguages);
}

//fetch users by location
async function fetchUsersByLocation() {
  const location = await ask('Enter location: ');
  const result = await getUsersByLocation(location);
  if (result.rowCount === 0) {
    console.log('There are no users with that login username in the database.');
    return;
  }
  console.log(`Users in ${location}:`);
  console.log(result.rows)
}

//delete user by login
async function askUserToDelete()
{
  const login = await ask('Enter git login username: ');
  await deleteUserByLogin(login);
}

//query to get all users details
async function getUsers(){
  const query = 'SELECT * FROM "Users"';
  const result = await client.query(query);
  return result;
}

//function to display users
async function displayUsers() {
  const result = await getUsers();
  
  if (result.rowCount === 0) {
    console.log('There are no users in the database.');
    return;
  }

  console.log('All users:');
  console.log(result.rows);
  return;
}


async function main() {
  drawMenu();
  connect();
  const option = await ask('Select an option: ');
    switch(option) {
      case '1':
        await fetchAndSaveUser();
        break;
      case '2':
        await displayUsers();
        break;
      case '3':
        await fetchUsersByLocation();
        break;
      case '4':
        await askUserToDelete();
        break;
      case '5':
        await fetchProgLanguagesByUser();
        break;
      case '6':
        console.log('Bye!');
        break;
      default:
        console.log('Invalid option!');
        break;
    }
  prompts.close();
  disconnect();
}

main();
