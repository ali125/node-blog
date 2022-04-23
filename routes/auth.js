const express = require('express');
const multer = require('multer');
const router = express.Router();

const userController = require('../controllers/user');

// const { imageDirectory } = require('../../config');
// const upload = multer({ dest: imageDirectory })

router.get('/login', userController.loginView);
router.post('/login', userController.login);

router.get('/register', userController.registerView);
router.post('/register', userController.register);

router.get('/logout', userController.logout);

module.exports = router;
