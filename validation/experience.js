const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateExperienceInput(data){
    let err = {}

    
    data.title = !isEmpty(data.title) ? data.title : ''
    data.company = !isEmpty(data.company) ? data.company : ''
    data.from = !isEmpty(data.from) ? data.from : ''


    if(validator.isEmpty(data.title)){
        err.title = 'Job title is required'
    }

    if(validator.isEmpty(data.company)){
        err.company = 'Company is required'
    }

    if(validator.isEmpty(data.from)){
        err.from = 'From date is required'
    }
    

    return {
        errors : err,
        isValid : isEmpty(err)
    }
}