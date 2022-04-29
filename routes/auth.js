const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const { loginValidation, registerValidation, resetValidation, resetPasswordValidation } = require('../middleware/validations');

const isLoggedIn = (req, res, next) => {
    try {
        const isLoggedIn = req.session.isLoggedIn;
        if(isLoggedIn) return res.redirect('/dashboard');
        next();
    } catch(e) {
        next();
    }
}

router.get('/login', isLoggedIn, authController.loginView);
router.post('/login', isLoggedIn, loginValidation, authController.login);

router.get('/register', isLoggedIn, authController.registerView);
router.post('/register', isLoggedIn, registerValidation, authController.register);

router.get('/reset', isLoggedIn, authController.resetView);
router.post('/reset', isLoggedIn, resetValidation, authController.reset);

router.get('/reset/:resetToken', isLoggedIn, authController.resetPasswordView);
router.post('/reset/:resetToken', isLoggedIn, resetPasswordValidation, authController.resetPassword);

router.get('/logout', authController.logout);

module.exports = router;
