"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("../controllers/auth"));
const validations_1 = require("../middleware/validations");
const router = (0, express_1.Router)();
const isLoggedIn = (req, res, next) => {
    try {
        const isLoggedIn = req.session.isLoggedIn;
        if (isLoggedIn)
            return res.redirect('/dashboard');
        next();
    }
    catch (e) {
        next();
    }
};
router.get('/login', isLoggedIn, authController.loginView);
router.post('/login', isLoggedIn, validations_1.loginValidation, authController.login);
router.get('/register', isLoggedIn, authController.registerView);
router.post('/register', isLoggedIn, validations_1.registerValidation, authController.register);
router.get('/reset', isLoggedIn, authController.resetView);
router.post('/reset', isLoggedIn, validations_1.resetValidation, authController.reset);
router.get('/reset/:resetToken', isLoggedIn, authController.resetPasswordView);
router.post('/reset/:resetToken', isLoggedIn, validations_1.resetPasswordValidation, authController.resetPassword);
router.get('/logout', authController.logout);
exports.default = router;
