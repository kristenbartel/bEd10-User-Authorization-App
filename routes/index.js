var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

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
router.get('/protected', isValidUser, (req, res, next) => { 
  res.render('protected')
});

router.get('/newUserForm', isValidUser, (req, res, next)=> {
  res.render('newUser');
})

module.exports = router;
