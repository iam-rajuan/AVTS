const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', authController.validators.signup, authController.signup);
router.post('/login', authController.validators.login, authController.login);
router.get('/profile', authMiddleware.requireAuth, authController.profile);
router.post('/logout', authMiddleware.requireAuth, authController.logout);

module.exports = router;
