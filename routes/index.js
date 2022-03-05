var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

const isValidUser = (req, res, next) => { //parameters give this middleware access to req, res, next
  const token = req.cookies['token']; //this is the token that was create on the route before
  const secretKey = process.env.SECRET_KEY;
      jwt.verify(
        token,
        secretKey,
        function (err, decoded) {
          console.log('Decoded', decoded)
          if (decoded) {
            next();//this passes the request along so we can get the response back
          } else {
            res.redirect('/login'); //this 
            // res.render('register', {title: "Register you account"}) this renders a template/view
          }
        });
      }

router.get('/protected', isValidUser, (req, res, next) => { //isValidUser middleware validator
  res.render('protected')
});

router.get('/newUserForm', isValidUser, (req, res, next)=> {
  res.render('newUser');
})

router.get('/techstack', (req, res, next) => {
  res.render('techstack');
})

module.exports = router;
