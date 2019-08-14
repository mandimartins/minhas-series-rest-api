const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const series = require('./routes/series')

app.use('/series',series)
mongoose
    .connect(mongo,{useNewUrlParser:true})
    .then(()=>{
        app.listen(port, ()=>console.log('listening...'))
    })
    .catch(e => console.log(e))
