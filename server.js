const express = require('express')
const mongoose = require('mongoose')
const dbURI = require('./config/keys').mongoURI


const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()
// connect to mongo
mongoose.connect(dbURI)
        .then(()=>console.log('successfully connected to mongo db'))
        .catch(err=>console.log(`error in DB connection : ${err.message}`))


// use routes 
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

app.get('/',(req,res)=>{
    res.send('Hello')
})

const port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log(`server is running on port number : ${port}`)
})