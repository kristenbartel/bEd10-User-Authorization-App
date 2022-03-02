var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
// get config vars
dotenv.config();
console.log("SALT_ROUNDS secretly held in .env: ", process.env.SALT_ROUNDS);

const secretKey = process.env.SECRET_KEY;
console.log("SECRET_KEY secretly held in .env: ", secretKey);

const token = jwt.sign({
  data: 'Free the ducks'
}, 'topSecretKey', { expiresIn: '1h' });
console.log("this is your jwt token created from env SECRET_KEY: ", token);

jwt.verify(
  token,
  secretKey,
  function (err, decoded) {
    console.log('Decoded', decoded)
  }
)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
