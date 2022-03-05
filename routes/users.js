var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');

const saltRounds = Number(process.env.SALT_ROUNDS);
// console.log("Salt Rounds in user routes are: ", process.env.SALT_ROUNDS);
          // router.post('/', (req, res, next) => {
          //   const password = 'hello';
          //   const hash = bcrypt.hashSync(password, saltRounds);
          //   bcrypt.hash(password, saltRounds, (err, hash) => {
          //   console.log('my password', password);
          //   console.log('my hashed password', hash);
          //   })
          //   res.send("user added")
          // })
// register new user
router.post('/register', async (req, res, next) => {
  let { username, password, email} = req.body;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const newUser = await Users.create({
    username,
    password: hashedPassword,
    email
  });
  const secretKey = process.env.SECRET_KEY;
  const token = jwt.sign({
      data: Users.username,
    }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token);
    res.redirect('/newUserForm');
  } 
);

router.post('/newUserForm', async (req, res, next) => {
  let {} = req.body;
  const newUser = await UserAccount.create({
    firstname,
    lastname,
    address,
    city,
    state,
    phone,
    income
  });
})

// log in user, authenticate, assign access token and store in cookies NOTE: comparePass returns auto-boolean
router.post('/login', async (req, res, next) => {
  const {username, password} = req.body
  const userLogin = await Users.findOne({
    where: {
      username: username
    }
  });
  const dbPassword = userLogin.password
  const comparePass =  bcrypt.compareSync(password, dbPassword);
  if (comparePass) {
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign({
      data: Users.username,
    }, secretKey, { expiresIn: '1h' });
        // console.log("this is your jwt token created from env SECRET_KEY: ", token);
    res.cookie('token', token);
    res.redirect('/protected');
        // console.log("true--authorized user");
  } else {
        // console.log("false--no user found");
    res.render('errors')
  }
  console.log(userLogin);
})


module.exports = router;
