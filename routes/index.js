var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const { Users } = require('../models');

// GET routes
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/techstack', (req, res, next) => {
  res.render('techstack');
})

// middleware 
const isValidUser = (req, res, next) => {
  const token = req.cookies['token']; 
  const secretKey = process.env.SECRET_KEY;
      jwt.verify(
        token,
        secretKey,
        function (err, decoded) {
          console.log('Decoded', decoded)
          if (decoded) {
            next();
          } else {
            res.redirect('/login');
          }
        });
      }

// protected routed using middleware isValidUSer
router.get('/protected/:id', isValidUser, async function (req, res, next) { 
  const {id} = req.params;
  const user = await UserAccount.findOne({
    where: {
      id:id
    }
  })
  console.log(user);
  res.render('protected', {
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    address: user.address,
    city: user.city,
    state: user.state,
    email: user.email
  })
});

router.get('/newUserForm', isValidUser, (req, res, next)=> {
  res.render('newUser');
})

module.exports = router;
