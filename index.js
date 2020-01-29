const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const jwtSecret = 'xyz1234abcd4321'

const cors = require('cors')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors({
    // origin: (origin,callback)=>{
    //     if(origin === 'http://127.0.0.2:8080'){
    //         callback(null, true)
    //     }else{
    //         callback(new Error('Not allowrd by CORS'))
    //     }
    // }
}))

const series = require('./routes/series')
const users = require('./routes/users')

app.use('/series',series)
app.use('/users',users)

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

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')
app.use('/docs',swaggerUi.serve, swaggerUi.setup(swaggerDoc))

mongoose
    .connect(mongo,{useNewUrlParser:true})
    .then(()=>{
        createInitialUsers()
        app.listen(port, ()=>console.log('listening...'))
    })
    .catch(e => console.log(e))
