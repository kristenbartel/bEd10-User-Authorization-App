var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const db = require('../models');

const saltRounds = process.env.SALT_ROUNDS;
console.log("Salt Rounds in user routes are: ", process.env.SALT_ROUNDS);
/* GET users listing. */
router.get('/', async function(req, res, next) {
  res.render('index');
});

router.post('/register', async (req, res, next) => {
  let { username, password, email} = req.body;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  console.log(username, password, email);
  const newUser = await Users.create({
    username,
    password: hashedPassword,
    email
  });
  res.json({
    id: newUser.id
  });
});

router.post('/', (req, res, next) => {
  const password = 'hello';
  const hash = bcrypt.hashSync(password, saltRounds);
  bcrypt.hash(password, saltRounds, (err, hash) => {
  console.log('my password', password);
  console.log('my hashed password', hash);
  })
  res.send("user added")
})

router.post('/login', async (req, res, next) => {
  const {username, password} = req.body
  const userLogin = await Users.findOne({
    where: {
      username: username
    }
  });
  const dbPassword = userLogin.password
  // compareSync will take the entered password from req.body and rehash it, compare to dbPassword
  const comparePass =  bcrypt.compareSync(password, dbPassword);
  if (comparePass) {
    console.log("true--authorized user")
  } else {
    console.log("false--no user found")
  }
  console.log(userLogin);
   res.json(userLogin);
  // res.render("the next view/route combo= redirect")
})
module.exports = router;
