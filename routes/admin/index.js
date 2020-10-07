const express = require('express');
const router = express.Router();

const adminUserRouters = require('./user');
const adminPostRouters = require('./post');
const adminMessageRouters = require('./message');
const adminCommentRouters = require('./comment');
const adminIndexController = require('../../controllers/admin/index');

router.use('/users', adminUserRouters);
router.use('/posts', adminPostRouters);
router.use('/messages', adminMessageRouters);
router.use('/comments', adminCommentRouters);

router.get('/', adminIndexController.getDashboard);

module.exports = router;
