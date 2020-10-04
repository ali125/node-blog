const { validationResult } = require('express-validator');
const Message = require('../models/message');

exports.getMessage = async (req, res, next) => {
    try {
        res.render('pages/contact-us');
    } catch(err) {
        console.log('err', err);
    }
};
exports.saveMessage = async (req, res, next) => {
    try {
        const title = req.body.title;
        const name = req.body.name;
        const email = req.body.email;
        const content = req.body.content;
        const body = {
            title,
            name,
            email,
            content,
            createdAt: new Date(),
        };

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.session.errorsMessage = errors.array();
            req.session.formData = {
                title,
                name,
                email,
                content,
            };
            return res.redirect('/pages/contact-us');
        }

        const message = await Message(body);
        await message.save();
        req.session.successMessage = "پیام با موفقیت ارسال شد.";
        res.redirect('/pages/contact-us')
    } catch(err) {
        console.log('err', err);
    }
};
