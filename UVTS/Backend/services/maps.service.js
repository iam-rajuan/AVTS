// const axios = require('axios');
// const captainModel = require('../models/captain.model');

// module.exports.getAddressCoordinate = async (address) => {
//     const apiKey = process.env.GOOGLE_MAPS_API;
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {
//             const location = response.data.results[ 0 ].geometry.location;
//             return {
//                 ltd: location.lat,
//                 lng: location.lng
//             };
//         } else {
//             throw new Error('Unable to fetch coordinates');
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// module.exports.getDistanceTime = async (origin, destination) => {
//     if (!origin || !destination) {
//         throw new Error('Origin and destination are required');
//     }

//     const apiKey = process.env.GOOGLE_MAPS_API;

//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

//     try {


//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {

//             if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
//                 throw new Error('No routes found');
//             }

//             return response.data.rows[ 0 ].elements[ 0 ];
//         } else {
//             throw new Error('Unable to fetch distance and time');
//         }

//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }

// module.exports.getAutoCompleteSuggestions = async (input) => {
//     if (!input) {
//         throw new Error('query is required');
//     }

//     const apiKey = process.env.GOOGLE_MAPS_API;
//     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.status === 'OK') {
//             return response.data.predictions.map(prediction => prediction.description).filter(value => value);
//         } else {
//             throw new Error('Unable to fetch suggestions');
//         }
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }

// module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

//     // radius in km


//     const captains = await captainModel.find({
//         location: {
//             $geoWithin: {
//                 $centerSphere: [ [ ltd, lng ], radius / 6371 ]
//             }
//         }
//     });

//     return captains;


// }








// services/maps.service.js
const axios = require('axios');
const captainModel = require('../models/captain.model');

const MAPBOX_API_KEY = process.env.MAPBOX_API;

// Get coordinates from an address
module.exports.getAddressCoordinate = async (address) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.features.length > 0) {
            const location = response.data.features[0].center;
            return {
                lng: location[0],
                ltd: location[1]
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Get distance and time between two locations
module.exports.getDistanceTime = async (origin, destination) => {
    const originCoord = await module.exports.getAddressCoordinate(origin);
    const destinationCoord = await module.exports.getAddressCoordinate(destination);

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoord.lng},${originCoord.ltd};${destinationCoord.lng},${destinationCoord.ltd}?access_token=${MAPBOX_API_KEY}&geometries=geojson`;

    try {
        const response = await axios.get(url);
        if (response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                distance: { value: route.distance }, // in meters
                duration: { value: route.duration }  // in seconds
            };
        } else {
            throw new Error('No routes found');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Get autocomplete suggestions
module.exports.getAutoCompleteSuggestions = async (input) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${MAPBOX_API_KEY}&autocomplete=true&limit=5`;

    try {
        const response = await axios.get(url);
        return response.data.features.map(item => item.place_name);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Find captains within a radius
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371]
            }
        }
    });
    return captains;
};
