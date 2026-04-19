const express = require('express');
const router = express.Router();
const controller = require('./payment.controller');
const { protect } = require('../../middleware/auth');

router.post('/create-order', protect, controller.createOrder);
router.post('/verify', protect, controller.verifyPayment);

module.exports = router;
