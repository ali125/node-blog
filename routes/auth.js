const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// const { imageDirectory } = require('../../config');
// const upload = multer({ dest: imageDirectory })

router.get('/login', authController.loginView);
router.post('/login', authController.login);

router.get('/register', authController.registerView);
router.post('/register', authController.register);

router.get('/logout', authController.logout);

module.exports = router;
