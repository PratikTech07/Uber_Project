const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname')
        .isLength({ min: 3 })
        .withMessage('First name should be at least 3 characters long'),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password should be at least 5 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color should be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate should be at least 3 characters long'),
    body('vehicle.capacity').isInt({min : 1}).withMessage('Capacity should be a  greater than 1'),
    body('vehicle.type').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type')

], captainController.registerCaptain
);





module.exports = router;