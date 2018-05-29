const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const keys = require('../config/keys')
const userFind = require('../routes/api/users/UserMongo')
require('../models/User')

mongoose.model('User')

const otps = {}

otps.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
otps.secretOrKey = keys.secretOrKey

module.exports = passport => {
    passport.use(new JWTStrategy(otps, async (jwt_payload,done)=>{
        const user = await userFind.findUserByEmail(jwt_payload.id, false)
        if(user){
            done(null, user)
        }else {
            done(null,false)
        }
        //console.log('jwt_payload :', jwt_payload);
    }))
}
