const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateProfileInput(data){
    let err = {}

    
    data.handle = !isEmpty(data.handle) ? data.handle : ''
    data.status = !isEmpty(data.status) ? data.status : ''
    data.skills = !isEmpty(data.skills) ? data.skills : ''

    if(!validator.isLength(data.handle, {min : 2, max : 40})){
        err.handle = 'Handle needs to be between 2 and 40 characters'
    }

    if(validator.isEmpty(data.handle)){
        err.handle = 'Profile handle is required'
    }

    if(validator.isEmpty(data.status)){
        err.status = 'Status is required'
    }

    if(validator.isEmpty(data.skills)){
        err.skills = 'Skills set is required'
    }

    if(!isEmpty(data.website)){
        if(!validator.isURL(data.website)){
            err.website = 'not a valid URL'
        }
    }

    if(!isEmpty(data.youtube)){
        if(!validator.isURL(data.youtube)){
            err.youtube = 'not a valid youtube URL'
        }
    }

    if(!isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter)){
            err.twitter = 'not a valid twitter URL'
        }
    }

    if(!isEmpty(data.facebook)){
        if(!validator.isURL(data.facebook)){
            err.facebook = 'not a valid facebook URL'
        }
    }

    if(!isEmpty(data.instagram)){
        if(!validator.isURL(data.instagram)){
            err.instagram = 'not a valid instagram URL'
        }
    }

    if(!isEmpty(data.linkedin)){
        if(!validator.isURL(data.linkedin)){
            err.linkedin = 'not a valid linkedin URL'
        }
    }


    return {
        errors : err,
        isValid : isEmpty(err)
    }
}