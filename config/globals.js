// set up public array of global variables

// callbackURLs must be toggled to live domain addresses before publishing
module.exports = {
    'db': 'mongodb+srv://gcrfreeman:dbpass1244@georgian-pijii.mongodb.net/tasks',
    'ids': {
        'google': {
            clientID: '771176901294-etvcdacc4vpdnls7aqn8ad6b8kshh91p.apps.googleusercontent.com',
            clientSecret: 'n5a5bcUEm7jP6SWpP_5oKgrK',
            callbackURL: 'http://localhost:3000/google/callback'
        }
    }
}