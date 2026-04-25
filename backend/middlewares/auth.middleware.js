const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');
const captainModel = require('../models/captain.model');

const modelByRole = {
    user: userModel,
    captain: captainModel
};

async function resolveAuth(req) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) {
        return { error: { status: 401, body: { message: 'Unauthorized' } } };
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token });

    if (isBlacklisted) {
        return { error: { status: 401, body: { message: 'Unauthorized' } } };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const role = decoded.role;
        const Model = modelByRole[ role ];

        if (!Model) {
            return { error: { status: 401, body: { message: 'Unauthorized' } } };
        }

        const account = await Model.findById(decoded.sub || decoded._id);

        if (!account) {
            return { error: { status: 401, body: { message: 'Unauthorized' } } };
        }

        return { token, decoded, role, account };
    } catch (err) {
        return { error: { status: 401, body: { message: 'Unauthorized' } } };
    }
}

module.exports.requireAuth = async (req, res, next) => {
    const result = await resolveAuth(req);

    if (result.error) {
        return res.status(result.error.status).json(result.error.body);
    }

    req.auth = {
        token: result.token,
        role: result.role,
        account: result.account
    };

    req.user = result.role === 'user' ? result.account : undefined;
    req.captain = result.role === 'captain' ? result.account : undefined;

    return next();
}

module.exports.requireRole = (role) => async (req, res, next) => {
    const result = await resolveAuth(req);

    if (result.error) {
        return res.status(result.error.status).json(result.error.body);
    }

    if (result.role !== role) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    req.auth = {
        token: result.token,
        role: result.role,
        account: result.account
    };

    req.user = role === 'user' ? result.account : undefined;
    req.captain = role === 'captain' ? result.account : undefined;

    return next();
}

module.exports.authUser = async (req, res, next) => {
    return module.exports.requireRole('user')(req, res, next);
}

module.exports.authCaptain = async (req, res, next) => {
    return module.exports.requireRole('captain')(req, res, next);
}
