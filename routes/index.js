const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuthController = require('../controllers/admin/auth');
const PostRouter = require('./post');
const PageRouter = require('./page');
const AdminRouter = require('./admin/index');

router.get('/', (req, res, next) => {
    res.send('Index Router');
});

router.use('/pages', PageRouter);
router.use('/posts', PostRouter);
router.use('/admin', auth, AdminRouter);

router.get('/login', adminAuthController.getLogin);
router.post('/login', adminAuthController.postLogin);

module.exports = router;
