const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const jwtSecret = 'xyz1234abcd4321'

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const series = require('./routes/series')

const createInitialUsers = async () => {
    const total = await User.countDocuments({})
    if(total === 0){
        const user = new User({
            username: 'tulio',
            password:'123456',
            roles:['restrito','admin']
        })
        await user.save()

        const user2 = await new User({
            username:'restrito',
            password:'123456',
            roles:['restrito']
        })

        await user2.save()
    }
}

app.use('/series',series)

app.post('/auth',async(req, res) =>{
    const user = req.body
    const userDb =  await User.findOne({username: user.username})
    if(userDb){
        if(userDb.password === user.password){
            const payload = {
                id:userDb._id,
                username:userDb.username,
                roles: userDb.roles
            }
            jwt.sign(payload, jwtSecret,(err, token)=>{
                res.send({
                    success:true,
                    token: token
                })
            })

        }else{
            res.send({success: false, message:'Wrong credentials'})
        }
    }else{
        res.send({success: false, message:'Wrong credentials'})
    }
})
mongoose
    .connect(mongo,{useNewUrlParser:true})
    .then(()=>{
        createInitialUsers()
        app.listen(port, ()=>console.log('listening...'))
    })
    .catch(e => console.log(e))
