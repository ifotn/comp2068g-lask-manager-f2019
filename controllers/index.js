// link to express package
var express = require('express');

// instantiate new express router to handle http requests
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Task Manager' });
});

/* GET /about */
router.get('/about', (req, res, next) => {
  res.render('about', {
    message: 'Content from the controller goes here'
  })
})

// expose this file as public
module.exports = router;
