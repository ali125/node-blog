const { body } = require('express-validator');
const translate = require('./translate');

exports.userValidation = [
    body('firstName', translate.FILL_FIELD_FIRST_NAME['en'])
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('lastName', translate.FILL_FIELD_LAST_NAME['en'])
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('email', translate.FILL_FIELD_EMAIL['en'])
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('mobile', translate.FILL_FIELD_MOBILE['en'])
        .isString()
        .trim()
        .isLength({ min: 3 }),
];

exports.postValidation = [
    body('title', translate.FILL_FIELD_TITLE['en'])
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('content', translate.FILL_FIELD_CONTENT['en'])
        .isString()
        .trim()
        .isLength({ min: 5 })
];

exports.commentPostValidation = [
    body('name', translate.FILL_FIELD_NAME['en'])
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('email', translate.FILL_FIELD_EMAIL['en'])
        .isEmail()
        .trim()
        .isLength({ min: 3 }),
    body('content', translate.FILL_FIELD_CONTENT['en'])
        .isString()
        .trim()
        .isLength({ min: 2 })
];

exports.messageValidation = [
    body('title', translate.FILL_FIELD_TITLE['en'])
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('name', translate.FILL_FIELD_NAME['en'])
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('email', translate.FILL_FIELD_EMAIL['en'])
        .isEmail()
        .trim()
        .isLength({ min: 3 }),
    body('content', translate.FILL_FIELD_CONTENT['en'])
        .isString()
        .trim()
        .isLength({ min: 2 })
];


exports.replyMessageValidation = [
    body('content', translate.FILL_FIELD_CONTENT['en'])
        .isString()
        .trim()
        .isLength({ min: 2 })
];
