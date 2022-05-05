"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePasswordSave = exports.changePasswordView = exports.profileSave = exports.profileView = exports.destroy = exports.update = exports.edit = exports.save = exports.create = exports.all = void 0;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../../models/user"));
const all = async (req, res, next) => {
    try {
        const users = await user_1.default.findAll({});
        res.render('dashboard/users', { title: 'News and Stories', users });
    }
    catch (e) {
        next(e);
    }
};
exports.all = all;
const create = async (req, res, next) => {
    try {
        res.render('dashboard/users/form', { title: 'News and Stories' });
    }
    catch (e) {
        next(e);
    }
};
exports.create = create;
const save = async (req, res, next) => {
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
            return res.status(400).render('dashboard/users/form', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        await user_1.default.create({
            firstName,
            lastName,
            email,
            password
        });
        req.flash('success', 'New user created successfully!');
        res.redirect('/dashboard/users');
    }
    catch (e) {
        // console.log(e);
        next(e);
    }
};
exports.save = save;
const edit = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await user_1.default.findByPk(userId);
        if (user) {
            res.render('dashboard/users/form', { title: 'News and Stories', user });
        }
        else {
            next(new Error('Tag not found!'));
        }
    }
    catch (e) {
        next(e);
    }
};
exports.edit = edit;
const update = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await user_1.default.findByPk(userId);
        if (user && req.user) {
            if (+userId === req.user.id) {
                throw new Error('You cannot edit yourself in here!');
            }
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const inputValues = {
                    firstName,
                    lastName,
                    email
                };
                return res.status(400).render('dashboard/users/form', { title: 'News and Stories', user, inputValues, errorMessages: errors.array() });
            }
            await user_1.default.update({
                firstName,
                lastName,
                email
            }, {
                where: {
                    id: userId
                }
            });
            req.flash('success', 'User updated successfully!');
            res.redirect('/dashboard/users');
        }
        else {
            next(new Error('User not found!'));
        }
    }
    catch (e) {
        next(e);
    }
};
exports.update = update;
const destroy = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        if (req.user && +userId === req.user.id) {
            req.flash('error', 'You cannot delete yourself in here!');
            return res.json({ message: 'You cannot delete yourself in here!', status: 403 });
        }
        const user = await user_1.default.findByPk(userId);
        if (user) {
            await user_1.default.destroy({ where: { id: userId }, individualHooks: true });
            req.flash('success', 'User deleted successfully!');
            res.json({ message: 'Deleting user succeed!', status: 204 });
        }
        else {
            res.status(404).json({ message: 'User not found!', status: 404 });
        }
    }
    catch (e) {
        next(e);
    }
};
exports.destroy = destroy;
const profileView = async (req, res, next) => {
    try {
        const user = req.user;
        res.render('dashboard/settings/profile', { title: 'News and Stories', user });
    }
    catch (e) {
        next(e);
    }
};
exports.profileView = profileView;
const profileSave = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const about = req.body.about;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                firstName,
                lastName,
                email,
                phoneNumber,
                about
            };
            return res.status(400).render('dashboard/settings/profile', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        const image = req.file;
        const user = await user_1.default.update({
            firstName,
            lastName,
            email,
            phoneNumber,
            about,
            avatar: image ? image.path.replace('public', '') : undefined,
        }, {
            where: {
                id: req.user.id
            },
            returning: true,
            // plain: true
        });
        console.log('user', user);
        // req.session.user = user[1];
        req.flash('success', 'User information successfully changed!');
        res.redirect('/dashboard/settings/profile');
    }
    catch (e) {
        next(e);
    }
};
exports.profileSave = profileSave;
const changePasswordView = async (req, res, next) => {
    try {
        res.render('dashboard/settings/change-password', { title: 'News and Stories' });
    }
    catch (e) {
        next(e);
    }
};
exports.changePasswordView = changePasswordView;
const changePasswordSave = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('dashboard/settings/change-password', { title: 'News and Stories', errorMessages: errors.array() });
        }
        try {
            const validPassword = await user_1.default.checkPassword(req.user.id, currentPassword);
            if (validPassword) {
                await user_1.default.update({
                    password: newPassword
                }, {
                    where: {
                        id: req.user.id
                    }
                });
                req.flash('success', 'Password successfully changed!');
                res.redirect('/dashboard/settings/change-password');
            }
        }
        catch (er) {
            req.flash('error', er.toString());
            res.redirect('/dashboard/settings/change-password');
        }
    }
    catch (e) {
        next(e);
    }
};
exports.changePasswordSave = changePasswordSave;
const deleteAccount = async (req, res, next) => {
    try {
        if (!req.user)
            return res.status(401).send({ error: 'Please authenticate.' });
        await user_1.default.destroy({ where: { id: req.user.id }, individualHooks: true });
        req.flash('success', 'User deleted successfully!');
        req.session.isLoggedIn = false;
        req.session.user = null;
        req.user = null;
        res.json({ message: 'Deleting category succeed!', status: 204 });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteAccount = deleteAccount;
