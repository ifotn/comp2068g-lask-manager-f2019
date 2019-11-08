var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./controllers/index');
var usersRouter = require('./controllers/users');
// add.hbs new tasks controller (lesson 5)
const tasksRouter = require('./controllers/tasks')

// refs for auth
const passport = require('passport')
const session = require('express-session')
//const localStrategy = require('passport-local').Strategy

var app = express();

// db.  try to connect and log a result (success / failure)
const mongoose = require('mongoose')
const globals = require('./config/globals')

mongoose.connect(globals.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(
    (res) => {
      console.log('Connected to MongoDB')
    }
).catch(() => {
  console.log('Connection error')
})

// passport initialization
// 1. configure app to manage sessions
app.use(session({
    secret: 'f19T@skManagerSecret',
    resave: true,
    saveUninitialized: false
}))

// 2. set up passport
app.use(passport.initialize())
app.use(passport.session())

// 3. link passport to our User model
const User = require('./models/user')
passport.use(User.createStrategy())

// 4. set up passport to read / write user data to the session object
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Google Auth
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy({
    clientID: globals.ids.google.clientID,
    clientSecret: globals.ids.google.clientSecret,
    callbackURL: globals.ids.google.callbackURL
},
    (token, tokenSecret, profile, done) => {
        // do we already have a User document in MongoDB for this Google profile?
        User.findOne({oauthId: profile.id}, (err, user) => {
            if (err) {
                console.log(err) // error, so stop and debug
            }
            if (!err && user != null) {
                // Google already exists in our MongoDB so just return the user object
                done(null, user)
            }
            else {
                // Google user is new, register them in MongoDB users collection
                user = new User({
                    oauthId: profile.id,
                    username: profile.displayName,
                    oauthProvider: 'Google',
                    created: Date.now()
                })

                user.save((err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        done(null, user)
                    }
                })
            }
        })
    }
))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// map any url's starting with "/tasks" to the tasks controller
app.use('/tasks', tasksRouter)

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
