const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const router = express.Router()

const Post = require('../../models/Posts')
const Profile = require('../../models/Profile')

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

    console.log('newPost :', newPost);
    
    try{
        const post = await newPost.save()
        res.status(200).json(post)
    }catch(err){
        return res.status(404).json({errorMessage : 'Something went wrong for POST request for creating a new post'})
    }
})

router.get('/', async (req,res)=>{
    try {
        const posts = await Post.find().sort({date : -1}).exec()
        res.status(200).json(posts)
    }catch(err){
        return res.status(404).json({errorMessage : 'Something went wrong for GET request for displaying all the posts'})
    }
    

})

router.get('/:postId', async (req,res)=>{
    try {
        const post = await Post.findById(req.params.postId).exec()
        res.status(200).json(post)
    }catch(err){
        return res.status(404).json({errorMessage : 'No post found for this postID'})
    }
})

router.delete('/:postId', passport.authenticate('jwt', {session : false }), async (req,res)=>{
    try{


        const profile = await Profile.findOne({user : req.user.id}).exec()
        if(profile){
            const post = await Post.findById(req.params.postId)
            if(post){
                // check for the post user
                if(post.user.toString() !== req.user.id){
                    return res.status(401).json({ errorMessage : 'User not autherized'})
                }
                // delete
                const deleted = await post.remove()
                if(deleted){
                    res.status(200).json({message : 'Post deleted' })
                }
            }
        }else {
            return res.status(404).json({errorMessage : 'Profile not found'})
        }

    }catch(error){
        return res.status(404).json({errorMessage : 'Post not found'})
    }
})

router.post('/like/:likeId', passport.authenticate('jwt', {session : false }), async (req,res)=>{
    try{
        const profile = await Profile.findOne({user : req.user.id}).exec()
        if(profile){
            const post = await Post.findById(req.params.likeId)
            if(post){
                if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0){
                    return res.status(200).json({errorMessage : 'you have aleady liked this post'})
                }

                // Add user id to the likes array
                post.likes.unshift({user : req.user.id})
                const savedPost = await post.save()
                res.status(200).json({likeStatus : 'SUCCESS' ,savedPost})
            }
        }else {
            return res.status(404).json({errorMessage : 'Profile not found'})
        }

    }catch(error){
        return res.status(404).json({errorMessage : 'Post not found'})
    }
})


router.post('/unlike/:unlikeId', passport.authenticate('jwt', {session : false }), async (req,res)=>{
    try{
        const profile = await Profile.findOne({user : req.user.id}).exec()
        if(profile){
            const post = await Post.findById(req.params.unlikeId)
            if(post){
                if(post.likes.filter(like=>like.user.toString() === req.user.id).length === 0){
                    return res.status(200).json({errorMessage : 'You have not yet liked this post'})
                }

                // Get the index of the liked post and remove it from the like array
                const removeIndex = post.likes.map(item=>item.user.toString()).indexOf(req.user.id)

                // splice out the item from the likes array 
                post.likes.splice(removeIndex,1)

                const savedPost = await post.save()
                res.status(200).json({unlikeStatus : 'SUCCESS' ,savedPost})
            }
        }else {
            return res.status(404).json({errorMessage : 'Profile not found'})
        }

    }catch(error){
        return res.status(404).json({errorMessage : 'Post not found'})
    }
})

router.post('/comment/:id', passport.authenticate('jwt',{session : false}), async (req,res)=>{
    
    const { errors , isValid } = validatePostInput(req.body)

    if(!isValid){
        return res.status(404).json(errors)
    }

    try{
        const post = await Post.findById(req.params.id).exec()
        
        
        if(post){
            const newComment = {
                text : req.body.text,
                name : req.body.name,
                avatar : req.body.avatar,
                user : req.user.id
            }
        
            // Add to comments array 
            post.comments.unshift(newComment)

            const savedPost = await post.save()
            res.status(200).json(savedPost)
        }else {
            return res.status(404).json({errorMessage : 'Post not found'})
        }
    }catch(error){
        return res.status(404).json({errorMessage : 'Something went wrong while adding the comment to the post'})
    }
    

})


router.delete('/comment/:id/:comment_id', passport.authenticate('jwt',{session : false}), async (req,res)=>{
    
    
    try{
        const post = await Post.findById(req.params.id).exec()
        
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){

            console.log('length :', post.comments.filter(comment => {
                console.log('comment._id.toString() :', comment._id.toString());
                console.log('req.params.comments_id :', req.params.comment_id);
                comment._id.toString() === req.params.comment_id
            }).length);


            return res.status(404).json({errorMessage : 'Comment doent exists'})
        }
        const removeIndex = post.comments.map(item=>item._id.toString()).indexOf(req.params.comment_id)

        post.comments.splice(removeIndex,1)
        const savedPost = await post.save()
        res.status(200).json(savedPost)
        
    }catch(error){
        return res.status(404).json({errorMessage : 'Something went wrong while adding the comment to the post'})
    }
    

})


module.exports = router