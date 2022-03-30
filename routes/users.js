var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const saltRounds = Number(process.env.SALT_ROUNDS);

// get users listing
router.get('/', function(req, res, next) {
  res.cookie('token', "test cookie");
  res.render('index');
});

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
    res.redirect('/login');
  } 
);

router.post('/', (req, res, next) => {
  const password = 'hello';
  const hash = bcrypt.hashSync(password, saltRounds);
  bcrypt.hash(password, saltRounds, (err, hash) => {
  console.log('my password', password);
  console.log('my hashed password', hash);
  })
  res.send("user added")
})

// log in functionality 
router.post('/login', async (req, res, next) => {
  const {username, password} = req.body
  const userLogin = await Users.findOne({
    where: {
      username: username
    }
  });
  const dbPassword = userLogin.password
  // compareSync will take the entered password from req.body, rehash it, and compare to dbPassword
  const comparePass =  bcrypt.compareSync(password, dbPassword); //boolean
  
  if (comparePass) {
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign({
      data: Users.username,
    }, secretKey, { expiresIn: '1h' });
    console.log("this is your jwt token created from env SECRET_KEY: ", token);
    res.cookie('token', token);
    res.redirect('/protected');
    console.log("true--authorized user");
    // next('the view you want to redirect to);
  } else {
    console.log("false--no user found");
    res.send('user not found')
  }
  console.log(userLogin);
   
  // res.render("the next view/route combo= redirect")
})

// middleware helper -- the gatekeeper to the route



module.exports = router;
