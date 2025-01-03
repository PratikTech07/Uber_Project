const axios = require('axios');

module.exports.getAddressesCoordinate = async (address) => {
    try {
        const response = await axios.get(`https://maps.gomaps.pro/maps/api/geocode/json`, {
            params: {
                address: address,
                key: process.env.GOOGLE_API
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lon: location.lng
            };
        }
        throw new Error('No coordinates found for this address');
    } catch (error) {
        throw new Error(`Error getting coordinates: ${error.message}`);
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }
    try {
        const response = await axios.get(`https://maps.gomaps.pro/maps/api/distancematrix/json`, {
            params: {
                origins: origin,
                destinations: destination,
                key: process.env.GOOGLE_API,

            }
        });

        // Debug log


        // Validate response structure
        if (!response.data || response.data.status !== 'OK') {
            throw new Error('Invalid API response status');
        }

        if (!response.data.rows || !response.data.rows[0]) {
            throw new Error('No results found in API response');
        }

        const element = response.data.rows[0].elements?.[0];
        if (!element || element.status !== 'OK') {
            throw new Error('No valid route found between these locations');
        }

        return response.data.rows[0].elements[0];

    } catch (error) {
        if (error.response) {
            // Log the error response for debugging
            console.error('API Error Response:', error.response.data);
            throw new Error(`API Error: ${error.response.data.error_message || 'Unknown API error'}`);
        }
        throw new Error(`Error getting distance and time: ${error.message}`);
    }
}

module.exports.getAutoSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_API;

    const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error('No suggestions found');
        }
    } catch (error) {
        console.error(error);
        throw new Error(`Error getting suggestions: ${error.message}`);
    }

}