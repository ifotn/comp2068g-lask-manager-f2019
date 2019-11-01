// set up routing w/express
const express = require('express')
const router = express.Router()

// reference the Task model
const Task = require('../models/task')

// use passport to check auth
const passport = require('passport')

// auth check function to be called from each route
function isLoggedIn(req, res, next) {
    // if user has logged in, call next which just continues execution
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

/* GET tasks index view */
router.get('/', isLoggedIn, (req, res, next) => {
    // use the task model to fetch a list of tasks and pass these to the view for display
    // if an error occurs, the err param will be filled
    // if no error occurs, the tasks param will be filled with the query result
    Task.find((err, tasks) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.render('tasks/index', {
                tasks: tasks,
                user: req.user
            })
        }
    })
})

/* GET tasks add view */
router.get('/add', isLoggedIn, (req, res, next) => {
    res.render('tasks/add', {
        user: req.user
    })
})

/* POST tasks/add form submission */
router.post('/add', isLoggedIn, (req, res, next) => {
    // use mongoose to try to save a new new task object
    Task.create({
        name: req.body.name,
        priority: req.body.priority
    }, (err, task) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/tasks')
        }
    })
})

/* GET tasks/delete/abc - colon in the path represents a url parameter */
router.get('/delete/:_id', isLoggedIn, (req, res, next) => {
    // store the selected id in a local variable
    var _id = req.params._id;

    // use Mongoose to delete the selected document from the db
    Task.remove({ _id: _id }, (err) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/tasks')
        }
    })
})

/* GET tasks/edit/abc - populate edit form w/existing task values */
router.get('/edit/:_id', isLoggedIn, (req, res, next) => {
    // store the _id parameter in a local variable
    var _id = req.params._id

    // use the selected id to look up the matching document
    Task.findById(_id, (err, task) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.render('tasks/edit', {
                task: task,
                user: req.user
            })
        }
    })
})

/* POST tasks/edit/abc - save update to selected task */
router.post('/edit/:_id', isLoggedIn, (req, res, next) => {
    var _id = req.params._id

    // parse checkbox to a boolean
    var complete = false
    if (req.body.complete == "on") {
        complete = true
    }
    //console.log('Complete: ' + req.body.complete)

    // instantiate a Task object with the new values from the form submission
    var task = new Task({
        _id: _id,
        name: req.body.name,
        priority: req.body.priority,
        complete: complete
    })

    // update the document with the selected id, passing in our new task object to replace the old vals
    Task.updateOne({ _id: _id }, task, (err) => {
        if (err) {
            console.log(err)
            res.end(err)
        }
        else {
            res.redirect('/tasks')
        }
    })
})

// make controller public
module.exports = router