const { body, check } = require('express-validator');
const translate = require('./translate');

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
