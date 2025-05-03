// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middlewares/auth.middleware');
// const mapController = require('../controllers/map.controller');
// const { query } = require('express-validator');

// router.get('/get-coordinates',
//     query('address').isString().isLength({ min: 3 }),
//     authMiddleware.authUser,
//     mapController.getCoordinates
// );

// router.get('/get-distance-time',
//     query('origin').isString().isLength({ min: 3 }),
//     query('destination').isString().isLength({ min: 3 }),
//     authMiddleware.authUser,
//     mapController.getDistanceTime
// )

// router.get('/get-suggestions',
//     query('input').isString().isLength({ min: 3 }),
//     authMiddleware.authUser,
//     mapController.getAutoCompleteSuggestions
// )



// module.exports = router;






const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');
const DriverLocation = require('../models/driverLocation.model');

// Existing routes
router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getCoordinates
);

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getDistanceTime
);

router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
);

// New driver location routes
router.get('/driver-locations',
    authMiddleware.authUser,
    async (req, res) => {
        try {
            const locations = await DriverLocation.find();
            res.json(locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
            res.status(500).send('Server Error');
        }
    }
);

router.get('/driver-location/:vehicleId',
    authMiddleware.authUser,
    async (req, res) => {
        try {
            const location = await DriverLocation.findOne({ vehicleId: req.params.vehicleId });
            if (!location) {
                return res.status(404).json({ message: 'Driver location not found' });
            }
            res.json(location);
        } catch (error) {
            console.error('Error fetching location:', error);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;