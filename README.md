Kristen Bartel 
----Objective----
Clearly describe the set up and implementation of AUTHO, my first user registration and authentication app.
AUTHO is able to:
    -register a new user and save the registration to a database
    -take in account details of new users and relationally connect them to their registration data
    -authenticate a user upon login
    -assign access tokens to logged in users 
    -store access tokens in cookies 
    -validate user tokens when accessing secured user routes

----Solutions Used----
    -node.js for server
    -express.js for routing
    -sequelize for ORM 
    -pg for promise based queries
    -ejs for views templating
    -bcrypt for hashing 
    -jsonwebtokens for token generation and verification
    -cookie-parser for reading cookie data

----Documents needed----
*express-generator-- https://expressjs.com/en/starter/generator.html

*sequelize (queries)-- https://sequelize.org/master/manual/model-querying-basics.html

*sequelize-cli-- https://www.npmjs.com/package/sequelize-cli

*bcrypt--  https://www.npmjs.com/package/bcrypt

*jSON Web Tokens install-- https://www.npmjs.com/package/jsonwebtoken

*jSON Web Tokens Docs-- https://jwt.io/libraries

*ejs

NOTE: When running commands with npx vs npm: we are running selectively, from the cloud, instead of installing the entire package/module locally.

---server set up and dependency installs---
1) npx express-generator --ejs --git name-of-your-app
2) npm i pg sequelize bcrypt jsonwebtoken dotenv
3) npx install 
4) set up www in bin with PORT number and custom console messages
5) package.json scripts with nodemon for app start

---initialize new remote instance---
1) create a new instance using https://www.elephantsql.com/
2) open instance and enter details

---sequelize setup---
aka communicating with the db
1) npx sequelize-cli init
2) set up config.json with elephantSQL details. ex:
        "development": {
            "username": "uovslnto",
            "password": "1q6wo9ko_2ZpGHf9dvmuHdKsEu-2WBHX",
            "database": "uovslnto",
            "host": "jelani.db.elephantsql.com",
            "dialect": "postgres"
        },

---connecting postico---
1) navigate to favorites and create new favorite- name it
2) enter host, user, password and password from elephantSQL

NOTE: the postgres database server always runs on port 5432

---create models, migrate and seed models---
1) create model (this auto generates a migration)
    npx sequelize-cli model:generate --name User --attributes "firstname:string,lastname:string,username:string,password:string,email:string"
2) run migration from the model to the db
    npx sequelize-cli db:migrate
3) create a seeder and seed the table
    -npx sequelize-cli seed:generate --name User
    -customize the seeder file
    -npx sequelize-cli db:seed:all 
        NOTE: db:seed:all seeds all seeder files over again- be specific if needed
OR
3) Use Postman to seed outlined below in ---POST route for Registration---

---env file---
1) Install dotenv module 
     npm install dotenv
2) create a .env file at the root
    put "secrets" in this file like this:  key=value
3) require where needed:
    const dotenv = require('dotenv');
    dotenv.config();
    console.log("Salt Rounds are: ", process.env.SALT_ROUNDS);
4) add secrets as needed:
    const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_FACTOR));
5) ensure that the .env is in the .gitignore

NOTE: jwt requires each token be a Number() value. See example below

---POST route for Registration using bcrypt---
Top Level:
1) require models, bcrypt, dotenv
2) destructure saltRounds 
    const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_FACTOR));
Route: 
1) create async/await route
    router.post('/register', async (req, res, next) => {})
2) const a req.body
    const {} =req.body
3) hash user password with bcrypt
    hashedPassword = bcrypt.hashSync(password, saltRounds);
4) create new user using hashedPassword with sequelize
      const user = await User.create({
        })
5) res.send or res.render from here
Testing route:
1) create req.body in postman
2) run POST to route
    NOTE: the route is /users/register due to this route being held in the users.js routes

---POST route for Login using bcrypt----
1) create async/await route
    router.post('/register', async (req, res, next) => {})
2) const a req.body
    const {} =req.body
3) find user using password with sequelize
      const user = await User.findOne({
          where: {
              username: username,
          }
        })
4) compare the db password with req.body password using bcrypt
    if (user) {
    const comparePass = bcrypt.compareSync(password, user.password)
    NOTE: this auto hashes req.body password before it compares to db
5) if comparePass is true then res.----

adding tokens

---GET routes and ejs view templates---
1) create GET routes that res.render the views
2) establish views for routing
    NOTES:
    ** html <forms> have actions=""- these actions are the routes that are connecting
    ** they also have methods that should match the crud methods-- ex. POST, GET
    ** html <input> must have attributes of type="text" and name=""- These must contain keys that match the req.body object-- the user input will be the req.body value

----AUTHO set up---- 
basic setting up an express app with ejs template engine, git (for gitignore), bcrypt for authorization/hashing, sequelize for ORM

1)express --ejs --git (or your app name) 
    This will generate all the files [????npx express generator????]

2)npm install  
    This command installs all the dependencies that were generated in the previous command. 

3)npm start 
    This will run the app- at this point test a sample route to ensure viability.

4)add nodemon to package.json in the "scripts" section for dev-run-ease

5)npm install bcrypt
    This installs the package needed for hashing. 
    

------NOTES ejs--------
html views can be 'templated' to bring in custom values to the client.
ejs stands for Embedded jS templates which are used in both server and client side applications.

basic syntax: 
<% 'Scriptlet' tag, for control-flow, no output
<%= Outputs the value into the template (HTML escaped)
<%- Outputs the unescaped value into the template

example
<% if (message) { %>
  <h2><%= message.name %></h2>
<% } %>

----Authentication Basics----
-Passwords get entered by users as plain text.

-Encrypting plain text user-input can be encrypted/decrypted with a 'key'. If a security breach finds your key then content can be easily decrypted. Encrypting is only good for user-content, not user-passwords.

-Hashed plain text means taking a user-input and converting it to something else completely different, know as a hash. The hash is generated used a "salting" method which gives it a highly unique string of char/ints. SaltRounds is a number the dictates the level of intricacy of the salting process. High level saltRounds come at a "cost". See example:
    GHz core you can roughly expect:
        rounds=8 : ~40 hashes/sec
        rounds=9 : ~20 hashes/sec
        rounds=10: ~10 hashes/sec
        rounds=11: ~5  hashes/sec
        rounds=12: 2-3 hashes/sec
        rounds=13: ~1 sec/hash
        rounds=14: ~1.5 sec/hash
        rounds=15: ~3 sec/hash
        rounds=25: ~1 hour/hash
        rounds=31: 2-3 days/hash

major concepts about cryptography here: https://en.wikipedia.org/wiki/Cryptography

-----creating development instance/DB-----
1)Install packages/modules/etc
    npm install sequelize pg
        npx sequelize-cli init

2)Configure the config file for your localhost name, etc that was generated from step 1

3)Create a database db
    npx sequelize-cli db:create

4)Create model using custom name and attributes: 
    npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
    
    (this creates a migration file that will run into the model after you have customized this, run the next command)

5)Run migration (from step 3) into model
    npx sequelize-cli db:migrate

6)Create a seed file with a custom name:
    npx sequelize-cli seed:generate --name user

7)Fill/customize the seed file and then run: 
    npx sequelize-cli db:seed:all

Note: check file structure after each command, navigate to file and customize. Also use postico 'refresh' to ensure step migrations and seeds are populating to db.

In AUTHO the design is: 
  insert picture here


---Web Tokens---
1) install the jwt library
     npm install jsonwebtoken
2) in the app.js:
    const jwt = require('jsonwebtoken');

    const token = jwt.sign({
    data: 'Free the ducks'
    }, 'put your custom key here', { expiresIn: '1h' });
    console.log("SECRET_KEY secretly held in .env: ", token);

This will generate a token with a 1h parameter from the .env file SECRET_KEY=topSecretKey

These tokens are verification passes to routes/rooms. The database is the gatekeeper for these routes/rooms that will check the token. They  typically have perishable timeout parameters.

3) Tokens are verified once access-restricted routes are called
    jwt.verify(
        token,
        secretKey,
    function (err, decoded) {
        console.log('Decoded', decoded)
  }
)
    NOTE: the issue date/time is unix based time stamp, therefore will look straaaange....
    The unix time stamp is a way to track time as a running total of seconds. This count starts at the Unix Epoch on January 1st, 1970 at UTC. Therefore, the unix time stamp is merely the number of seconds between a particular date and the Unix Epoch. It should also be pointed out (thanks to the comments from visitors to this site) that this point in time technically does not change no matter where you are located on the globe. This is very useful to computer systems for tracking and sorting dated information in dynamic and distributed applications both online and client side. On this date the Unix Time Stamp will cease to work due to a 32-bit overflow. Before this moment millions of applications will need to either adopt a new convention for time stamps or be migrated to 64-bit systems which will buy the time stamp a "bit" more time.


---bezkoder for Authorizing---
https://www.bezkoder.com/node-js-jwt-authentication-postgresql/

-Three important parts of JWT: Header, Payload and Signature
together they combine to a standard structure: header.payload.signature

The Client typically attaches JWT in Authorization header with Bearer prefix:
(Authorization: Bearer [header].[payload].[signature])

Or only in x-access-token header:
(x-access-token: [header].[payload].[signature])


put this in a route that accesses the GET/home or something like that
// Setting the auth token in cookies
        res.cookie('token', "test cookie"); //pass in a second arguments that is not auth token

        const authToken = req.cookies['AuthToken'];

---stack abuse---
https://stackabuse.com/handling-authentication-in-express-js/

bodyParser is now a built in part of express so there is no need to initialize

.then is inter-changable with async await

think about adding "user roles"

generate a JWT with payload at userID and verify the user 


---notes from another section on sequelize generate, migrate, seed---
npm init -y
npm i express sequelize pg
npm i --save-dev nodemon sequelize-cli
touch index.js

npx sequelize-cli init
this will create a project structure with sequelize index.js in models as well as a few other files for seqeulize


config file must be configured prior to creating db: 
    enter the db name of choice- prior to making it so it pulls the db name from the config file

    enter the server being used so it knows where to create it

    enter the dialect being used, in this case postgres

npx sequelize-cli db:create
this will create a db from the info in the config file

npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
this will create a data model with the defined --name and --attributes

npx sequelize-cli db:migrate
this will create a migrate file

npx sequelize-cli seed:generate --name <insert table name>
this will create a file that you can enter data manually to seed with the next command-- be sure to seed the Table Name-- not the model file name. 

npx sequelize-cli db:seed:all

acknowledge the bootstrap open source assets used, 