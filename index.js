const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const User = require('./models/user')

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
mongoose
    .connect(mongo,{useNewUrlParser:true})
    .then(()=>{
        createInitialUsers()
        app.listen(port, ()=>console.log('listening...'))
    })
    .catch(e => console.log(e))
