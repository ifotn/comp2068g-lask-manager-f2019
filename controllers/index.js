// link to express package
var express = require('express');

// instantiate new express router to handle http requests
var router = express.Router();

// refs for auth
const passport = require('passport')
const User = require('../models/user')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Task Manager',
    user: req.user
  });
});

/* GET /about */
router.get('/about', (req, res, next) => {
  res.render('about', {
    message: 'Content from the controller goes here',
    user: req.user
  })
})

/* GET /register */
router.get('/register', (req, res, next) => {
  res.render('register')
})

/* POST /register */
router.post('/register', (req, res, next) => {
  // use the User model w/passport to try creating a new user
  // passport-local-mongoose will salt and hash the password
  User.register(new User({
    username: req.body.username
  }), req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      res.end(err)
    }
    else {
      // log the user in and redirect to /tasks
      req.login(user, (err) => {
        res.redirect('/tasks')
      })
    }
  })
})

/* GET /login */
router.get('/login', (req, res, next) => {
  // check for invalid login message & pass to the view to display
  let messages = req.session.messages || []

  // clear the session messages
  req.session.messages = []

  // pass local messages variable to the view for display
  res.render('login', {
    messages: messages
  })
})

/* POST /login */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/tasks',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login'
}))

/* GET /logout */
router.get('/logout', (req, res, next) => {
  // call passport's built-in logout method
  req.logout()
  res.redirect('/login')
})

/* GET /google */
// check if the user is already logged in with Google; if not invoke Google Signin
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}),
    (req, res, next) => {}
)

/* GET /google/callback */
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}),
    (req, res, next) => {
      res.redirect('/tasks')
    })

// expose this file as public
module.exports = router;
