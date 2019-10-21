var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validation');
var session = require('express-session');
var multer = require('multer');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var upload = multer({ dest:'./public/images'});
const db = require('monk')('localhost/nodeblog');


var index = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');

var app = express();

app.locals.moment =  require('moment');
app.locals.truncateText = function(text,length){
  var truncatedText = text.substring(0,length);
  return truncatedText
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/posts', posts);
app.use('/categories', categories);


//session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
//connect-flash
app.use(flash());
app.use(function(req, res,next){
  res.locals.messages = require('express-messages') (req,res);
  next();
});


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


 
//listen port 
const port= process.env.PORT || 3000;
app.listen( port, ()=>{
    console.log('server listen on port ' + port)
});

module.exports = app;