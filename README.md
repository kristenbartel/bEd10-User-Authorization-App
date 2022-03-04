Kristen Bartel
----set up---- 
setting up an express app with ejs template engine, git (for gitignore) and bcrypt for authorization/hashing

1)express --ejs --git (or your app name) 
    This will generate all the files [????npx express generator????]

2)npm install  
    This command installs all the dependencies that were generated in the previous command. 

3)npm start 
    This will run the app- at this point text a sample route.

4)add nodemon to package.json in the "scripts" section. 

5)npm install bcrypt
    This installs the package needed for hashing. 
    
Documents needed: 
*express-generator-- https://expressjs.com/en/starter/generator.html

*sequelize (queries)-- https://sequelize.org/master/manual/model-querying-basics.html

*sequelize-cli-- https://www.npmjs.com/package/sequelize-cli

*bcrypt--  https://www.npmjs.com/package/bcrypt

*jSON Web Tokens install-- https://www.npmjs.com/package/jsonwebtoken

*jSON Web Tokens Docs-- https://jwt.io/libraries

NOTE: When running commands with npx vs npm means we are running selectively, from the cloud, instead of installing the entire package/module locally.

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
read more about cryptography here: https://en.wikipedia.org/wiki/Cryptography
-----create instance/DB-----
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

---creating express routes----
Express routes will be created in combination with sequelize 

---creating views that will be routed to---
Once routes are established views can be built with templates 
NOTES:
** html <forms> have actions=""- these actions are the routes that are connecting
** they also have methods that should match the crud methods-- ex. POST, GET
** html <input> must have attributes of type="text" and name=""- These must contain keys that match the req.body object-- the user input will be the req.body value

---env files---
1) Install dotenv module 
     npm install dotenv
2) create a .env file at the root
    put "secrets" in this file like this:  key=value
3) add to app.js:
    const dotenv = require('dotenv');
    dotenv.config();
    console.log("Salt Rounds are: ", process.env.SALT_ROUNDS);
4) add to route as needed:
    const saltRounds = process.env.SALT_ROUNDS;
    console.log("Salt Rounds in user routes are: ", process.env.SALT_ROUNDS);
5) ensure that the .env is in the .gitignore

Use this in conjunction with the next section 

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
