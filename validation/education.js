const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateEducationInput(data){
    let err = {}

    
    data.school = !isEmpty(data.school) ? data.school : ''
    data.degree = !isEmpty(data.degree) ? data.degree : ''
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : ''


    if(validator.isEmpty(data.school)){
        err.school = 'School is required'
    }

    if(validator.isEmpty(data.degree)){
        err.degree = 'Degree is required'
    }

    if(validator.isEmpty(data.fieldofstudy)){
        err.fieldofstudy = 'fieldofstudy is required'
    }
    

    return {
        errors : err,
        isValid : isEmpty(err)
    }
}