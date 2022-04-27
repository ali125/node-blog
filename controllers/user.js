const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.profileView = async (req, res, next) => {
    try {
        const user = req.user;
        res.render('dashboard/settings/profile', { title: 'News and Stories', user });
    } catch (e) {
        next(e);
    }
}
exports.profileSave = async (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const about = req.body.about;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const inputValues = {
                firstName,
                lastName,
                email,
                phoneNumber,
                about
            }
            return res.status(400).render('dashboard/settings/profile', { title: 'News and Stories', inputValues, errorMessages: errors.array() });
        }
        const image = req.file;
        const user = await User.update({
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
            plain: true
        });
        req.session.user = user[1];
        res.redirect('/dashboard/settings/profile');
    } catch (e) {
        next(e);
    }
}


exports.changePasswordView = async (req, res, next) => {
    try {
        res.render('dashboard/settings/change-password', { title: 'News and Stories' });
    } catch (e) {
        next(e);
    }
}
exports.changePasswordSave = async (req, res, next) => {
    try {
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('dashboard/settings/change-password', { title: 'News and Stories', errorMessages: errors.array() });
        }

        try {
            const validPassword = await User.checkPassword(req.user.id, currentPassword);
            if (validPassword) {
                await User.update({
                    password: newPassword
                }, {
                    where: {
                        id: req.user.id
                    }
                });
                req.flash('success', 'Password successfully changed!')
                res.redirect('/dashboard/settings/change-password');
            }
        } catch (er) {
            req.flash('error', er.toString());
            res.redirect('/dashboard/settings/change-password');
        }
        
    } catch (e) {
        next(e);
    }
}
