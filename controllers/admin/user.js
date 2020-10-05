const { validationResult } = require('express-validator');
const User = require('../../models/user');
const fileHelper = require('../../util/file');

exports.getProfile = async (req, res, next) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        res.render('admin/users/profile', { user });
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};
exports.saveProfile = async (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const image = req.file;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.session.errorsMessage = errors.array();
            req.session.formData = {
                firstName,
                lastName,
                email,
                mobile
            };
            return res.redirect('/admin/users/profile')
        }
        const id = req.user._id;
        const user = await User.findById(id);
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.mobile = mobile;
        if(image) {
            if(user.imageUrl) fileHelper.fileDelete(user.imageUrl);
            user.imageUrl = image.path;
        }
        await user.save();
        req.user = req.session.user = user;
        res.redirect('/admin/users/profile')
    } catch(err) {
        const errors = new Error(err);
        errors.httpStatusCode = 500;
        next(errors)
    }
};
