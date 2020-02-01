const request = require('supertest')
const app = require('../app')
const expect = require('chai').expect

const mongo = 'mongodb://localhost/test-minhas-series-rest'

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const User = require('../models/user')
const Serie = require('../models/serie')

describe('Testing RestAPI', () => {

    before('Connecting to mongodb', (done) => {
       mongoose
                .connect(mongo,{useNewUrlParser:true, useUnifiedTopology:true})
                .then(async()=>{
                    await User.deleteMany({})
                    const user = new User({
                        username:'alexa',
                        password:'1234',
                        roles: ['restrito']
                    })

                    await user.save()
                    await Serie.deleteMany({})
                    return true
                })
                done()
    })

    it('should return error', done =>{
        request(app)
            .get('/series')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.body.success).be.false
            })
            done() 
    })

    it('should auth an user', done => {
        request(app)
            .post('/auth')
            .send({username:'alexa',password:'1234'})
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).be.true
                expect(res.body.token).be.string
            })
            done()
    })
    
    it('should not be auth an user', done => {
        request(app)
            .post('/auth')
            .send({username:'alexa2',password:'1234'})
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).be.false
                expect(res.body.message).be.string
        })
        done()  
    })
})