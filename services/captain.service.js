const captainModel = require('../models/captain.model');
const bcrypt = require('bcrypt');

module.exports.createCaptain = async ({
    firstname,
    lastname,
    email,
    password,
    color,
    plate,
    capacity,
    type
}) => {
     // Input validation
     
    if (!firstname || !lastname || !email || !password || !color || !plate || !capacity || !type) {
        throw new Error('All fields are required');
    }
   
    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            type : type
        }
    });

    

    return captain;
}