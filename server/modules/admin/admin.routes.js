const express = require('express');
const router = express.Router();
const controller = require('./admin.controller');
const { protect, adminOnly } = require('../../middleware/auth');

router.get('/stats', protect, adminOnly, controller.getStats);
router.get('/users', protect, adminOnly, controller.getAllUsers);
router.delete('/users/:id', protect, adminOnly, controller.deleteUser);

module.exports = router;
