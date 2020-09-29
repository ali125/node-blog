const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminPostRouters = require('./post');
const adminAuthController = require('../../controllers/admin/auth');
const adminIndexController = require('../../controllers/admin/index');

router.use('/posts', auth, adminPostRouters);

router.get('/', auth, adminIndexController.getDashboard);
router.get('/login', adminAuthController.getLogin);
router.post('/login', adminAuthController.postLogin);

module.exports = router;
