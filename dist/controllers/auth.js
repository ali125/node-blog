"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.register = exports.registerView = exports.login = exports.loginView = exports.resetPassword = exports.resetPasswordView = exports.reset = exports.resetView = void 0;
const crypto_1 = __importDefault(require("crypto"));
const sequelize_1 = require("sequelize");
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const mail_1 = require("../utils/mail");
const resetView = async (req, res, next) => {
    try {
        res.render('auth/reset', { title: 'News and Stories' });
    }
    catch (e) {
        next(e);
    }
};
exports.resetView = resetView;
const reset = async (req, res, next) => {
    try {
        const email = req.body.email;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                email
            };
            return res.status(400).render('auth/reset', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        const user = await user_1.default.findOne({ where: { email } });
        if (!user) {
            req.flash('error', 'No account with that email found.');
            res.redirect('/auth/reset');
        }
        else {
            crypto_1.default.randomBytes(32, async (err, buffer) => {
                if (err) {
                    console.log(err);
                    return res.redirect('auth/reset');
                }
                const resetToken = buffer.toString('hex');
                const resetTokenExpiration = new Date(Date.now() + 3600000);
                await user_1.default.update({ resetToken, resetTokenExpiration }, { where: { id: user.id } });
                req.flash('success', 'Reset password email has sent. Check your inbox');
                res.redirect('/');
                const msg = {
                    to: email,
                    subject: 'Password reset',
                    text: 'You requested a password reset',
                    html: `
                     <p>You requested a password reset</p>
                     <p>Click this <a href="http://localhost:3000/reset/${resetToken}">Link</a> to set a new password</p>
                    `,
                };
                (0, mail_1.sendMail)(msg, (err, res) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log('Email Should Sent', res);
                });
            });
        }
    }
    catch (e) {
        console.log(e);
        req.flash('error', e.toString());
        res.redirect('/auth/reset');
    }
};
exports.reset = reset;
const resetPasswordView = async (req, res, next) => {
    try {
        const resetToken = req.params.resetToken;
        const user = await user_1.default.findOne({ where: { resetToken, resetTokenExpiration: { [sequelize_1.Op.gt]: Date.now() } } });
        if (!user) {
            throw new Error('Reset token is invalid or expired!');
        }
        res.render('auth/resetPassword', { title: 'News and Stories' });
    }
    catch (e) {
        next(e);
    }
};
exports.resetPasswordView = resetPasswordView;
const resetPassword = async (req, res, next) => {
    const resetToken = req.params.resetToken;
    try {
        const password = req.body.newPassword;
        const user = await user_1.default.findOne({ where: { resetToken, resetTokenExpiration: { [sequelize_1.Op.gt]: Date.now() } } });
        if (!user) {
            throw new Error('Reset token is invalid or expired!');
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('auth/resetPassword', { title: 'News and Stories', errorMessages: errors.array() });
        }
        await user_1.default.update({ resetToken: null, resetTokenExpiration: null, password }, { where: { id: user.id } });
        req.flash('success', 'Password changed successfully!');
        res.redirect(`/auth/login`);
    }
    catch (e) {
        console.log(e);
        req.flash('error', e.toString());
        res.redirect(`/auth/reset/${resetToken}`);
    }
};
exports.resetPassword = resetPassword;
const loginView = async (req, res, next) => {
    try {
        res.render('auth/login', { title: 'News and Stories' });
    }
    catch (e) {
        next(e);
    }
};
exports.loginView = loginView;
const login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                email
            };
            return res.status(400).render('auth/login', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        const user = await user_1.default.findByCredentials(email, password);
        if (user) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/dashboard');
        }
        else {
            req.flash('error', 'email or password is incorrect!');
            res.redirect('/auth/login');
        }
    }
    catch (e) {
        console.log(e);
        req.flash('error', e.toString());
        res.redirect('/auth/login');
    }
};
exports.login = login;
const registerView = async (req, res, next) => {
    try {
        res.render('auth/register', { title: 'News and Stories' });
    }
    catch (e) {
        next(e);
    }
};
exports.registerView = registerView;
const register = async (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                firstName,
                lastName,
                email
            };
            return res.status(400).render('auth/register', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        const user = await user_1.default.create({
            firstName,
            lastName,
            email,
            password
        });
        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect('/dashboard');
    }
    catch (e) {
        res.redirect('/auth/register');
    }
};
exports.register = register;
const logout = async (req, res, next) => {
    try {
        req.session.isLoggedIn = false;
        req.session.user = null;
        res.redirect('/auth/login');
    }
    catch (e) {
        next(e);
    }
};
exports.logout = logout;
