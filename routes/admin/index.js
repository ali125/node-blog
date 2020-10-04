const express = require('express');
const router = express.Router();

const adminPostRouters = require('./post');
const adminMessageRouters = require('./message');
const adminIndexController = require('../../controllers/admin/index');

router.use('/posts', adminPostRouters);
router.use('/messages', adminMessageRouters);

router.get('/', adminIndexController.getDashboard);

module.exports = router;
