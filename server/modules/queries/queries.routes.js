const express = require('express');
const router = express.Router();
const controller = require('./queries.controller');
const { protect, adminOnly } = require('../../middleware/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', protect, controller.create);
router.post('/:id/reply', protect, controller.addReply);
router.put('/:id/resolve', protect, controller.markResolved);
router.delete('/:id', protect, adminOnly, controller.remove);

module.exports = router;
