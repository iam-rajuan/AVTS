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
        const tokenSubject = decoded.sub || decoded._id;
        let role = decoded.role;
        let account = null;

        if (role && modelByRole[ role ]) {
            account = await modelByRole[ role ].findById(tokenSubject);
        }

        if (!account) {
            const userAccount = await userModel.findById(tokenSubject);
            if (userAccount) {
                role = 'user';
                account = userAccount;
            }
        }

        if (!account) {
            const captainAccount = await captainModel.findById(tokenSubject);
            if (captainAccount) {
                role = 'captain';
                account = captainAccount;
            }
        }

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
