const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const { protect } = require('../../middleware/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', protect, controller.getMe);
router.post('/send-otp', controller.sendOtp);
router.post('/verify-otp', controller.verifyOtp);

module.exports = router;
