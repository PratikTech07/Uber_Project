const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/auth.middleware');
const BlacklistToken = require('../models/blacklistToken.model');

module.exports.registerCaptain = async (req, res, next) => {
    try {  // Added try-catch block
        const errors = validationResult(req);

        // Fixed validation check syntax
        if (!errors.isEmpty()) {  // Added parentheses
            return res.status(400).json({ errors: errors.array() })
        }

        const { fullname, email, password, vehicle } = req.body;

        // Fixed typo in variable name
        const isCaptainAlreadyExist = await captainModel.findOne({ email });

        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: 'Captain already exist' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
        });

        const token = captain.generateAuthToken();

        res.status(201).json({ token, captain });
    } catch (error) {
        next(error);  // Added error handling
    }
}

module.exports.loginCaptain = async (req, res, next) => {
    try {  // Added try-catch block
        const errors = validationResult(req);

        // Fixed validation check syntax
        if (!errors.isEmpty()) {  // Added parentheses
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordMatch = await captain.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = captain.generateAuthToken();

        // Fixed res.cookies to res.cookie
        res.cookie('token', token);

        res.status(200).json({ token, captain });
    } catch (error) {
        next(error);  // Added error handling
    }
}


module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization.split(' ')[1];


    await BlacklistToken.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successful' });

}