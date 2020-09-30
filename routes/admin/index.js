const express = require('express');
const router = express.Router();

const adminPostRouters = require('./post');
const adminIndexController = require('../../controllers/admin/index');

router.use('/posts', adminPostRouters);

router.get('/', adminIndexController.getDashboard);

module.exports = router;
