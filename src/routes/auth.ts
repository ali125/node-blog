import { Router, Request, Response, NextFunction } from 'express';

import * as authController from '../controllers/auth';
import { loginValidation, registerValidation, resetValidation, resetPasswordValidation } from '../middleware/validations';

const router = Router();

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
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

export default router;
