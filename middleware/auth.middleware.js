const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model'); // Added missing import
const BlacklistToken = require('../models/blacklistToken.model');
const dotenv = require('dotenv');
dotenv.config();



module.exports.authUser = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await BlacklistToken.findOne({ token });

        if(isBlacklisted){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id); // Use `id` (as used in your `generateAuthToken` method)

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Attach user object to the request
        req.user = user;

        // Pass control to the next middleware
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error.message);
        res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports.authCaptain = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await BlacklistToken.findOne({ token });

        if(isBlacklisted){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded.id);

        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized: Captain not found' });
        }

        req.captain = captain;
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error.message);
        res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
}
