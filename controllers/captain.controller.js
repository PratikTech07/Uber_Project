const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/auth.middleware');
const BlacklistToken = require('../models/blacklistToken.model');

module.exports = {
    registerCaptain: async (req, res, next) => {
        
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { fullname, email, password, vehicle } = req.body;

            const isCaptainAlredyExist = await captainModel.findOne({ email });
            
            if (isCaptainAlredyExist) {
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
                type: vehicle.type
            });

            const token = captain.generateAuthToken();

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });
            
            res.status(201).json({ token, captain });
        } catch (error) {
            next(error);
        }
    },

    loginCaptain: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
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

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.status(200).json({ token, captain });
        } catch (error) {
            next(error);
        }
    },

    getCaptainProfile: async (req, res, next) => {
        try {
            if (!req.captain) {
                return res.status(401).json({ message: 'Captain not found' });
            }
            res.status(200).json({ captain: req.captain });
        } catch (error) {
            next(error);
        }
    },

    logoutCaptain: async (req, res, next) => {
        try {
            const token = req.cookies.token || 
                (req.headers.authorization && req.headers.authorization.split(' ')[1]);

            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            await BlacklistToken.create({ token });
            res.clearCookie('token');
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            next(error);
        }
    }
};

