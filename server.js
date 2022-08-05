const express= require('express')
const app=express()
const env=require('dotenv').config({path:'./.env'})
const passport=require('passport')
const ejs=require('ejs')
const path=require('path')
const MongoStore = require('connect-mongo')
const session=require('express-session')
const bodyParser=require('body-parser')
const { json } = require('body-parser')
require('./config/db.js')

require("./config/passport")(passport);

const port=process.env.port;

// Middleware
app.set("view engine","ejs")

//session
app.use(session({
    secret: process.env.secret_key,
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({
        mongoUrl:process.env.SESSION_MONGO,
    })
}))

app.use(passport.initialize())
app.use(passport.session())

// public directory
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'./public')))

// routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/article',require('./routes/article'))
app.use('/video',require('./routes/video'))

app.listen(port,
    ()=>console.log(`Application is running at ${port}`))