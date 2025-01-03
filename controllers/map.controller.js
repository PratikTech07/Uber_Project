const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');

module.exports.getCoordinate = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;
    try {
        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }
        const coordinates = await mapService.getAddressesCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.getDistanceTime = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({
                error: 'Both origin and destination are required'
            });
        }

        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);

    } catch (error) {
        res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
}


module.exports.getAutoSuggestions = async (req , res, next) => {
    try{
        const errors = validationResult(req.body);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { input } = req.query;
        const suggestions = await mapService.getAutoSuggestions(input);
        res.status(200).json(suggestions);
    }catch(error){
        res.status(500).json({error: error.message || 'Internal server error'});
    } 
}