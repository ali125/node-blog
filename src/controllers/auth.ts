import { RequestHandler } from "express";
import crypto from 'crypto';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import User from '../models/user';
import { sendMail } from "../utils/mail";

export const resetView: RequestHandler = async (req, res, next) => {
    try {
        res.render('auth/reset', { title: 'News and Stories' });
    } catch (e: any) {
        next(e);
    }
}
export const reset: RequestHandler = async (req, res, next) => {
    try {
        const email = req.body.email;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                email
            }
            return res.status(400).render('auth/reset', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            req.flash('error', 'No account with that email found.');
            res.redirect('/auth/reset');
        } else {
            crypto.randomBytes(32, async (err, buffer) => {
                if (err) {
                  console.log(err);
                  return res.redirect('auth/reset');
                }
                const resetToken = buffer.toString('hex');
                const resetTokenExpiration = new Date(Date.now() + 3600000);
                await User.update({ resetToken, resetTokenExpiration }, { where: { id: user.id } });
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
                sendMail(msg, (err, res) => {
                  if (err) {
                    console.error(err);
                  }
                  console.log('Email Should Sent', res);
                });
            });
        }
    } catch (e: any) {
        console.log(e);
        req.flash('error', e.toString());
        res.redirect('/auth/reset');
    }
}

export const resetPasswordView: RequestHandler = async (req, res, next) => {
    try {
        const resetToken = req.params.resetToken;
        const user = await User.findOne({ where: { resetToken, resetTokenExpiration: { [Op.gt]: Date.now() } } });
        if (!user) {
            throw new Error('Reset token is invalid or expired!');
        }
        res.render('auth/resetPassword', { title: 'News and Stories' });
    } catch (e: any) {
        next(e);
    }
}
export const resetPassword: RequestHandler = async (req, res, next) => {
    const resetToken = req.params.resetToken;
    try {
        
        const password = req.body.newPassword;
        const user = await User.findOne({ where: { resetToken, resetTokenExpiration: { [Op.gt]: Date.now() } } });
        if (!user) {
            throw new Error('Reset token is invalid or expired!');
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('auth/resetPassword', { title: 'News and Stories', errorMessages: errors.array() });
        }
        await User.update({ resetToken: null, resetTokenExpiration: null, password }, { where: { id: user.id } });
        req.flash('success', 'Password changed successfully!');
        res.redirect(`/auth/login`);
    } catch (e: any) {
        console.log(e);
        req.flash('error', e.toString());
        res.redirect(`/auth/reset/${resetToken}`);
    }
}

export const loginView: RequestHandler = async (req, res, next) => {
    try {
        res.render('auth/login', { title: 'News and Stories' });
    } catch (e: any) {
        next(e);
    }
}
export const login: RequestHandler = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                email
            }
            return res.status(400).render('auth/login', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        const user = await User.findByCredentials(email, password);
        if (user) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/dashboard');
        } else {
            req.flash('error', 'email or password is incorrect!');
            res.redirect('/auth/login');
        }
    } catch (e: any) {
        console.log(e);
        req.flash('error', e.toString());
        res.redirect('/auth/login');
    }
}

export const registerView: RequestHandler = async (req, res, next) => {
    try {
        res.render('auth/register', { title: 'News and Stories' });
    } catch (e) {
        next(e);
    }
}
export const register: RequestHandler = async (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                firstName,
                lastName,
                email
            }
            return res.status(400).render('auth/register', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });
        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect('/dashboard');
    } catch (e: any) {
        res.redirect('/auth/register');
    }
}

export const logout: RequestHandler = async (req, res, next) => {
    try {
        req.session.isLoggedIn = false;
        req.session.user = null;
        res.redirect('/auth/login');
    } catch (e: any) {
        next(e);
    }
}