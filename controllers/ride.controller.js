const {validationResult} = require('express-validator');
const rideService = require('../services/ride.service');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {userId , pickup, destination, vehicleType} = req.body;

    try {
        const ride = await rideService.createRide({user: req.user._id , pickup, destination, vehicleType});
        res.status(201).json(ride);
    } catch (error) {
        res.status(500).json({error: error.message});
    }

    
}