const express = require('express');
const router = express.Router();

const adminUserRouters = require('./user');
const adminPostRouters = require('./post');
const adminMessageRouters = require('./message');
const adminIndexController = require('../../controllers/admin/index');

router.use('/users', adminUserRouters);
router.use('/posts', adminPostRouters);
router.use('/messages', adminMessageRouters);

router.get('/', adminIndexController.getDashboard);

module.exports = router;
