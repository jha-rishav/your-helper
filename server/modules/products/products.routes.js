const express = require('express');
const router = express.Router();
const controller = require('./products.controller');
const { protect, adminOnly } = require('../../middleware/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', protect, adminOnly, controller.create);
router.put('/:id', protect, adminOnly, controller.update);
router.delete('/:id', protect, adminOnly, controller.remove);

module.exports = router;
