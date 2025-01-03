const axios = require("axios");
const rideModel = require("../models/ride.modal");
const mapService = require("./maps.service");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination){

    if(!pickup || !destination){
        throw new Error('Both pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const RATES = {
        auto: { base: 30, perKm: 15, perMin: 2 },
        motorcycle: { base: 20, perKm: 12, perMin: 1.5 },
        car: { base: 40, perKm: 18, perMin: 3 }
    };

    const fare = {
        auto: RATES.auto.base + (distanceTime.distance.value / 1000) * RATES.auto.perKm + (distanceTime.duration.value / 60) * RATES.auto.perMin,
        motorcycle: RATES.motorcycle.base + (distanceTime.distance.value / 1000) * RATES.motorcycle.perKm + (distanceTime.duration.value / 60) * RATES.motorcycle.perMin,
        car: RATES.car.base + (distanceTime.distance.value / 1000) * RATES.car.perKm + (distanceTime.duration.value / 60) * RATES.car.perMin
    } 
    return fare;

}

function getOtp(num){
    return crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
}
 

module.exports.createRide = async ({
    user,destination,pickup,vehicleType
 }) => {
    if(!user || !destination || !pickup || !vehicleType){
        throw new Error('All fields are required are required');
    }

    const fare = await getFare(pickup, destination);
    const newRide = new rideModel({
        user,
        destination,
        pickup,
        fare: fare[vehicleType],
        otp : getOtp(6),
        vehicleType 
    });

    return newRide;
}


