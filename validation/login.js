const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateLoginInput(data){
    let err = {}

    
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    


    if(validator.isEmpty(data.email)){
        err.email = 'Email is required'
    }

    if(!validator.isEmail(data.email)){
        err.email = 'Email is invalid'
    }

    if(validator.isEmpty(data.password)){
        err.password = 'Password is required'
    }

    if(!validator.isLength(data.password, {min: 6 , max : 30})){
        err.password = 'Password must be between 6 and 30 characters'
    }


    return {
        errors : err,
        isValid : isEmpty(err)
    }
}