const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/admin/auth');

router.get('/', (req, res, next) => {
    res.send('Index Router');
});

router.get('/login', adminAuthController.getLogin);
router.post('/login', adminAuthController.postLogin);

module.exports = router;
