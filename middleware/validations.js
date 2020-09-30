const { body, check } = require('express-validator/check');
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
