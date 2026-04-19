const express = require('express');
const router = express.Router();
const controller = require('./bookings.controller');
const { protect, adminOnly } = require('../../middleware/auth');

router.post('/', protect, controller.create);
router.get('/my', protect, controller.getMyBookings);
router.get('/track/:bookingId', controller.trackBooking);
router.get('/', protect, adminOnly, controller.getAllBookings);
router.put('/:id/status', protect, adminOnly, controller.updateStatus);

module.exports = router;
