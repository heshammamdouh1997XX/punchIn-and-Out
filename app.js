var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');
var dotenv=require('dotenv')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var punchRouter = require('./routes/punch');


// signup ,signin,profile and punchin and out page (4 pages)            done
// (manager,worker) done
// time , how many hours you worked , your money

var app = express();

dotenv.config();

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
app.use('/punch', punchRouter);

//db Config
mongoose
.connect(process.env.DB_url)
.then(console.log("DB connection successfully created !!"))
.catch((err)=>{
  console.log(err); 
})

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
