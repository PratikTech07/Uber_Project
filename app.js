const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const cors = require('cors')
const app = express();
const connectToDB  = require('./db/db')
connectToDB()
const userRoutes = require('./routes/user.routes')
const cookieParser = require('cookie-parser');  
const captainRoutes = require('./routes/captain.routes')
const mapsRoutes = require('./routes/maps.routes')
const rideRoutes = require('./routes/ride.routes')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended :true }))
app.use(cookieParser())




app.get('/' , (req,res)=>{
    res.send('hello');
})

app.use('/users', userRoutes);

app.use('/captain', captainRoutes)
app.use('/maps', mapsRoutes)

app.use('/rides', rideRoutes);


module.exports = app;
