const { validationResult } = require('express-validator');
const Message = require('../../models/message');

exports.getMessages = async (req, res, next) => {
    try {
        const data = await Message.find();
        res.render('admin/messages/list', { data });
    } catch(err) {
        console.log('err', err);
    }
};

exports.getMessage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Message.findById(id).populate('replies.userId').exec();
        res.render('admin/messages/single', { data });
    } catch(err) {
        console.log('err', err);
    }
};

exports.saveReply = async (req, res, next) => {
    try {
        const id = req.params.id;
        const content = req.body.content;
        const body = {
            userId: req.user._id,
            content,
            createdAt: new Date(),
        };

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.session.errorsMessage = errors.array();
            req.session.formData = { content };
            return res.redirect('/admin/messages/'+id);
        }

        const message = await Message.findById(id);
        message.replies = [...message.replies, body];
        await message.save();
        req.session.successMessage = "پاسخ با موفقیت ارسال شد.";
        res.redirect('/admin/messages/'+id)
    } catch(err) {
        console.log('err', err);
    }
};


