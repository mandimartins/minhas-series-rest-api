const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const User = require('./models/user')

const app = require('./app')

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
mongoose
    .connect(mongo,{useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=>{
        createInitialUsers()
        app.listen(port, ()=>console.log('listening...'))
    })
    .catch(e => console.log(e))