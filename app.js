const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const cors = require('cors')
const app = express();
const connectToDB  = require('./db/db')
connectToDB()
const userRoutes = require('./routes/user.routes')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended :true }))




app.get('/' , (req,res)=>{
    res.send('hello');
})

app.use('/users', userRoutes);


module.exports = app;
