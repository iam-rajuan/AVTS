const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const userService = require('../services/user.service');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');

const allowedRoles = [ 'user', 'captain' ];

const authValidators = {
    signup: [
        body('role').isIn(allowedRoles).withMessage('Role must be selected'),
        body('email').isEmail().withMessage('Invalid Email'),
        body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('vehicle.color').if(body('role').equals('captain')).isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
        body('vehicle.plate').if(body('role').equals('captain')).isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
        body('vehicle.capacity').if(body('role').equals('captain')).isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
        body('vehicle.vehicleType').if(body('role').equals('captain')).isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')
    ],
    login: [
        body('role').isIn(allowedRoles).withMessage('Role must be selected'),
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ]
};

function normalizeProfile(account) {
    const plain = account.toObject ? account.toObject() : account;
    return {
        ...plain,
        role: plain.role
    };
}

module.exports.validators = authValidators;

module.exports.signup = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { role, fullname, email, password, vehicle } = req.body;

    const existingUser = await userModel.findOne({ email });
    const existingCaptain = await captainModel.findOne({ email });

    if (existingUser || existingCaptain) {
        return res.status(400).json({ success: false, message: 'Account already exists for this email' });
    }

    if (role === 'user') {
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        return res.status(201).json({
            success: true,
            data: {
                token,
                role: 'user',
                profile: normalizeProfile(user)
            }
        });
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

    return res.status(201).json({
        success: true,
        data: {
            token,
            role: 'captain',
            profile: normalizeProfile(captain)
        }
    });
};

module.exports.login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { role, email, password } = req.body;
    const Model = role === 'user' ? userModel : captainModel;
    const account = await Model.findOne({ email }).select('+password');

    if (!account) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await account.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = account.generateAuthToken();
    res.cookie('token', token);

    return res.status(200).json({
        success: true,
        data: {
            token,
            role,
            profile: normalizeProfile(account)
        }
    });
};

module.exports.profile = async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            role: req.auth.role,
            profile: normalizeProfile(req.auth.account)
        }
    });
};

module.exports.logout = async (req, res) => {
    res.clearCookie('token');

    if (req.auth?.token) {
        await blackListTokenModel.create({ token: req.auth.token });
    }

    return res.status(200).json({
        success: true,
        message: 'Logged out'
    });
};
