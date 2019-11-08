// refs
const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

const User = new mongoose.Schema({
    username: String,
    password: String,
    oauthId: String,
    oauthProvider: String,
    created: Date
})

// make this a special class intended for user management
User.plugin(plm)

// make public
module.exports = mongoose.model('User', User)