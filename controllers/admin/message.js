const { validationResult } = require('express-validator');
const mailHelper = require('../../util/mail');
const stringHelper = require('../../util/string');
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

        let text = '';
        text += message.title + "\n";
        text += "Name: "+message.name+" \n";
        text += "Email: "+message.email+" \n";
        text += "Message: "+message.content+" \n";
        text += stringHelper.formatDate(message.createdAt);
        text += " \n\n\n ==================== \n\n\n";
        text += "Reply: \n";
        text += content;
        const mailData = {
            to: message.email,
            subject: 'Ali Mortazavi Site',
            text,
            html: `
                <h4>${message.title}</h4>
                <p>
                    <strong>Name: </strong>
                    <span>${message.name}</span>
                </p>
                <p>
                    <strong>Email: </strong>
                    <span>${message.email}</span>
                </p>
                <p>${message.content}</p>
                <p>
                    <span>${stringHelper.formatDate(message.createdAt)}</span>
                </p>
                <hr />
                <h4>Reply: </h4>
                <p>${content}</p>
            `
        };
        mailHelper.sendMail(mailData, (err) => {
            if(err) throw new Error(err);
            req.session.successMessage = "پاسخ با موفقیت ارسال شد.";
            res.redirect('/admin/messages/'+id)
        });
    } catch(err) {
        console.log('err', err);
    }
};


