const express =require('express')
const env=require('dotenv').config()
const dbConfig=require('./config/dbConfig')
const cors =require ('cors')
const app=express()

const user=require('./Routes/userRouter')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/user', user);

const PORT =process.env.PORT
app.listen(PORT,console.log(`server is listening on ${PORT}`))