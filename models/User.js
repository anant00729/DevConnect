const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stringAndRequired = {
    type : String,
    required : true 
}

const userSchema = new Schema({
    name : stringAndRequired,
    email : stringAndRequired,
    password : stringAndRequired,
    avatar : {
        type : String
    },
    date : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('User', userSchema)