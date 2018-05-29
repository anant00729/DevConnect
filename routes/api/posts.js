const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const router = express.Router()

const Post = require('../../models/Posts')

const validatePostInput = require('../../validation/post')

router.get('/test', (req,res)=>{
    res.json({message : 'posts method GET works'})
})

router.post('/', passport.authenticate('jwt', {session : false}), async (req,res)=>{
    const { errors , isValid } = validatePostInput(req.body)

    if(!isValid){
        return res.status(404).json(errors)
    }


    
    const newPost = new Post({
        text : req.body.text,
        name : req.body.name,
        avatar : req.body.avatar,
        user : req.user.id,
    })
    try{
        const post = await newPost.save()
    }catch(err){
        return res.status(404).json({errorMessage : 'Something went wrong while POST request for creating a new post'})
    }
    

})

module.exports = router