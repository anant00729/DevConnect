const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validatePostInput(data){
    let err = {}

    
    data.text = !isEmpty(data.text) ? data.text : ''

    if(!validator.isLength(data.text, {min : 3, max : 300})){
        err.text = 'Post must be in between 3 to 300 characters'
    }

    if(validator.isEmpty(data.text)){
        err.text = 'Text is required'
    }


    return {
        errors : err,
        isValid : isEmpty(err)
    }
}