const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// load profile model
const Profile = require('../../models/Profile')
// load user model
const User = require('../../models/User') 
// validate profile 
const validateProfileInput = require('../../validation/profile')
// validate experience 
const validateExperienceInput = require('../../validation/experience')
// validate education
const validateEducationInput = require('../../validation/education')

router.get('/test', (req,res)=>{
    res.json({message : 'profile method GET works'})
})

router.get('/', passport.authenticate('jwt',{session : false}), async (req,res)=>{
    
    const errors = {}
    try {
        const  profile = await Profile.findOne({ user : req.user.id }).populate('user', ['name','avatar'])
        if(!profile){
            errors.noprofile = 'There is no profile for this user'
            return res.status(400).json(errors)
        }
        res.json(profile)
    }catch(err){
        return res.status(500).json({message : err})
    }
    
    
})

router.post('/', passport.authenticate('jwt',{session : false}), (req,res)=>{
    const { errors , isValid } = validateProfileInput(req.body)

    // check profile validation
    if(!isValid){
        // return any error with status 400
        return res.status(400).json(errors)
    }

    const profileFields = {}
    profileFields.user = req.user.id
    
    if(req.body.handle) profileFields.handle = req.body.handle
    if(req.body.company) profileFields.company = req.body.company
    if(req.body.website) profileFields.website = req.body.website
    if(req.body.location) profileFields.location = req.body.location
    if(req.body.bio) profileFields.bio = req.body.bio
    if(req.body.status) profileFields.status = req.body.status
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername
    
    //Skills 
    if(typeof req.body.skills != undefined){
        profileFields.skills = req.body.skills.split(',')
    }

    profileFields.social = {}
    //Social
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram

    
    createOrUpdateProfile(profileFields,req.user.id,res)
})

const createOrUpdateProfile = async (profileFields,id,res)=>{
    try {
        
        const profile = await Profile.findOne({user : id}).exec()

        if(profile){
            // Update the user profile
            const updatedProfile = await Profile.findOneAndUpdate({user : id}, { $set : profileFields}, { new : true}).populate('user', ['name', 'avatar']).exec()

            res.status(200).json(updatedProfile)
        }else {
            // Create the user profile

            //1. check if handle exists
            const handleProfile = await Profile.findOne({ handle : profileFields.handle }).populate('user', ['name', 'avatar']).exec()
            if(handleProfile){
                return res.status(400).json({errorMessage : 'That handle already exists'})
            }

            //2. save profile 
            const newProfile = await new Profile(profileFields).save()
            res.status(200).json(profile)
        }
    }catch(err) {return res.status(500).json({errorMessage : err.message})}
    
}


router.get('/handle/:handle', async (req,res)=>{
    const error = {errorMessage : 'There is no profile for this user'}
    try{
    const profile = await Profile.findOne({handle : req.params.handle}).populate('user', ['name', 'avatar'])

    if(!profile){
        return res.status(404).json(error)
    }

    res.status(200).json(profile)
    
    }catch(err){
        return res.status(404).json({errorFromDB : err , error })
    }

})


router.get('/user/:userId', async (req,res)=>{

    const error = {errorMessage : 'There is no profile for this user'}
    try{
    const profile = await Profile.findOne({user : req.params.userId}).populate('user', ['name', 'avatar'])

    if(!profile){
        return res.status(404).json(error)
    }

    res.status(200).json(profile)
    
    }catch(err){
        return res.status(404).json({errorFromDB : err , error })
    }
})

router.get('/all', async (req,res)=>{
    const error = {errorMessage : 'There are no profiles'}

    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']).exec()

        if(!profiles){
            return res.status(404).json(error)
        }else {
            return res.status(200).json(profiles)
        }
    }catch(err){
        return res.status(404).json(error)
    }
    
})

router.post('/experience',passport.authenticate('jwt', {session : false}), async (req,res)=>{
    const { errors, isValid } = validateExperienceInput(req.body)


    if(!isValid){
        return res.status(404).json(errors)
    }
    const error = {errorMessage : 'There are no profiles'}
    try{
        const profile = await Profile.findOne({user : req.user.id}).exec()

        if(profile){
            const newExp = {
                title : req.body.title,
                company : req.body.company,
                location : req.body.location,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description
            }
    
            // Add to experience Array
            profile.experience.unshift(newExp)
    
            const saveProfile = await profile.save()
            if(!saveProfile) return res.status(404).json({errorFromDB : err , error })           
            
            res.status(200).json(saveProfile)
    
        }
    }catch(err){
        return res.status(404).json({errorFromDB : err , error })   
    }

})


router.post('/education',passport.authenticate('jwt', {session : false}), async (req,res)=>{
    const { errors, isValid } = validateEducationInput(req.body)


    if(!isValid){
        return res.status(404).json(errors)
    }
    const error = {errorMessage : 'There are no profiles'}
    try{
        const profile = await Profile.findOne({user : req.user.id}).exec()

        if(profile){
            const newEdu = {
                school : req.body.school,
                degree : req.body.degree,
                fieldofstudy : req.body.fieldofstudy,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description
            }
    
            // Add to experience Array
            profile.education.unshift(newEdu)
    
            const saveProfile = await profile.save()
            if(!saveProfile) return res.status(404).json({errorFromDB : err , error })           
            
            res.status(200).json(saveProfile)
    
        }
    }catch(err){
        return res.status(404).json({errorFromDB : err , error })   
    }

})


router.delete('/experience/:expId', passport.authenticate('jwt', {session : false}), async (req,res)=>{
    try{
        const profile = await Profile.findOne({user : req.user.id}).exec()

        const removeIndex = profile.experience.map(e=>e.id).indexOf(req.params.expId)

        // splice out the item from the array 
        profile.experience.splice(removeIndex, 1)

        const updatedProfile = await profile.save()
        res.status(200).json(updatedProfile)
    }catch(err){
        return res.status(404).json({errorFromDB : err , error })   
    }
})


router.delete('/education/:eduId', passport.authenticate('jwt', {session : false}), async (req,res)=>{
    try{
        const profile = await Profile.findOne({user : req.user.id}).exec()

        const removeIndex = profile.education.map(e=>e.id).indexOf(req.params.eduId)

        // splice out the item from the array 
        profile.education.splice(removeIndex, 1)

        const updatedProfile = await profile.save()
        res.status(200).json(updatedProfile)
    }catch(err){
        return res.status(404).json({errorFromDB : err , error })   
    }
})


router.delete('/', passport.authenticate('jwt', {session : false}), async (req,res)=>{
    const error = {errorMessage : 'Something went wrong, while deleting profile'}
    try{
        let isProfileDel = await Profile.findOneAndRemove({user : req.user.id}).exec()
        if(isProfileDel){
            const isUserDeleted = await User.findOneAndRemove({_id : req.user.id})

            res.status(200).json({message : 'User profile deleted successfuly'})
        }else {
            res.status(404).json({message : 'User profile not found'})
        }

    }catch(err){
        return res.status(404).json({errorFromDB : err.messsage , error })   
    }
})


module.exports = router