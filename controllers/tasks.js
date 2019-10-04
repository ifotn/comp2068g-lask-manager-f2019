// set up routing w/express
const express = require('express')
const router = express.Router()

/* GET tasks index view */
router.get('/', (req, res, next) => {
    res.render('tasks/index')
})

// make controller public
module.exports = router