const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');
const DriverLocation = require('../models/driverLocation.model');
const { broadcastCaptainUpdate } = require('../socket');

function serializeCaptain(captain) {
    const fullName = [ captain.fullname.firstname, captain.fullname.lastname ].filter(Boolean).join(' ').trim();

    return {
        captainId: captain._id,
        vehicleId: captain.vehicle.plate,
        captainName: fullName || captain.fullname.firstname,
        vehicle: captain.vehicle,
        currentLoad: captain.currentLoad,
        customLoadLabel: captain.customLoadLabel,
        isAvailable: captain.currentLoad !== 'full_load',
        latitude: captain.location?.ltd ?? null,
        longitude: captain.location?.lng ?? null,
        lastUpdatedAt: new Date().toISOString()
    };
}

async function resolveCaptainProfile(location) {
    if (!location) {
        return null;
    }

    const captainId = location.captainId;
    const vehicleId = location.vehicleId;
    const captain = captainId
        ? await captainModel.findById(captainId)
        : await captainModel.findOne({ 'vehicle.plate': vehicleId });

    return captain;
}

function normalizeLiveState(location, captain) {
    const captainName = location.captainName
        || [ captain?.fullname?.firstname, captain?.fullname?.lastname ].filter(Boolean).join(' ').trim()
        || captain?.fullname?.firstname
        || 'Unknown captain';

    const vehicle = location.vehicle || captain?.vehicle || {};

    return {
        captainId: location.captainId || captain?._id || null,
        vehicleId: location.vehicleId || vehicle.plate || null,
        captainName,
        vehicle: {
            plate: vehicle.plate || location.vehicleId || 'Unknown',
            color: vehicle.color || 'Unknown',
            capacity: vehicle.capacity ?? null,
            vehicleType: vehicle.vehicleType || 'Unknown',
        },
        currentLoad: location.currentLoad || captain?.currentLoad || 'no_load',
        customLoadLabel: location.customLoadLabel || captain?.customLoadLabel || '',
        isAvailable: typeof location.isAvailable === 'boolean'
            ? location.isAvailable
            : (captain ? captain.currentLoad !== 'full_load' : true),
        latitude: location.latitude ?? captain?.location?.ltd ?? null,
        longitude: location.longitude ?? captain?.location?.lng ?? null,
        lastUpdatedAt: location.lastUpdatedAt || location.updatedAt || new Date(),
    };
}

async function syncCaptainLiveState(captain, coords) {
    const latitude = coords?.latitude ?? captain.location?.ltd ?? 0;
    const longitude = coords?.longitude ?? captain.location?.lng ?? 0;
    const payload = {
        captainId: captain._id,
        vehicleId: captain.vehicle.plate,
        captainName: [ captain.fullname.firstname, captain.fullname.lastname ].filter(Boolean).join(' ').trim(),
        vehicle: captain.vehicle,
        currentLoad: captain.currentLoad,
        customLoadLabel: captain.customLoadLabel,
        isAvailable: captain.currentLoad !== 'full_load',
        latitude,
        longitude,
        location: {
            type: 'Point',
            coordinates: [ longitude, latitude ]
        },
        lastUpdatedAt: new Date()
    };

    const liveState = await DriverLocation.findOneAndUpdate(
        {
            $or: [
                { captainId: captain._id },
                { vehicleId: captain.vehicle.plate }
            ]
        },
        payload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    broadcastCaptainUpdate({
        captainId: liveState.captainId,
        vehicleId: liveState.vehicleId,
        captainName: liveState.captainName,
        vehicle: liveState.vehicle,
        currentLoad: liveState.currentLoad,
        customLoadLabel: liveState.customLoadLabel,
        isAvailable: liveState.isAvailable,
        latitude: liveState.latitude,
        longitude: liveState.longitude,
        lastUpdatedAt: liveState.lastUpdatedAt
    });

    return liveState;
}


module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

module.exports.updateCaptainStatus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { currentLoad, customLoadLabel = '' } = req.body;

        req.captain.currentLoad = currentLoad;
        req.captain.customLoadLabel = currentLoad === 'custom' ? customLoadLabel : '';
        await req.captain.save();

        const liveState = await syncCaptainLiveState(req.captain);

        return res.status(200).json({
            success: true,
            data: {
                captain: req.captain,
                liveState
            }
        });
    } catch (error) {
        console.error('Failed to update captain status:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to update captain status'
        });
    }
};

module.exports.updateCaptainLocation = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { latitude, longitude } = req.body;

        req.captain.location = {
            ltd: latitude,
            lng: longitude
        };
        req.captain.status = 'active';
        await req.captain.save();

        const liveState = await syncCaptainLiveState(req.captain, { latitude, longitude });

        return res.status(200).json({
            success: true,
            data: liveState
        });
    } catch (error) {
        console.error('Failed to update captain location:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to update live location'
        });
    }
};

module.exports.getAvailableCaptains = async (req, res) => {
    const liveCaptains = await DriverLocation.find({}).sort({ lastUpdatedAt: -1 });
    const normalizedCaptains = await Promise.all(
        liveCaptains.map(async (location) => {
            const captain = await resolveCaptainProfile(location);
            return normalizeLiveState(location, captain);
        })
    );

    return res.status(200).json({
        success: true,
        data: normalizedCaptains
    });
};
