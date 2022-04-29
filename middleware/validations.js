const { body } = require('express-validator');

exports.registerValidation = [
    body('email', 'Please fill the email field correctly')
        .isEmail()
        .trim(),
    body('password', 'Please fill the password field')
        .isLength({ min: 5 })
        .withMessage('Password length should have at lease 5 charachters')
        .trim(),
    body('firstName', 'Please fill the first name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name length should have at lease 2 charachters'),
    body('lastName', 'Please fill the last name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name length should have at lease 2 charachters'),
];

exports.loginValidation = [
    body('email', 'Please fill the email field correctly')
        .isEmail()
        .trim(),
    body('password', 'Please fill the password field')
        .trim(),
];

exports.resetValidation = [
    body('email', 'Please fill the email field correctly')
        .isEmail()
        .trim(),
];

exports.resetPasswordValidation = [
    body('newPassword', 'Please fill the new password field')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password length should have at lease 5 charachters'),
    body('confirmPassword', 'Please fill the last name field')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match new password');
            }
            return true;
        })
];

exports.postValidation = [
    body('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title length should have at lease 3 charachters'),
    body('content', 'Please fill the content field')
        .isString()
        .trim()
        .isLength({ min: 5 })
        .withMessage('Content length should have at lease 5 charachters'),
    body('status', 'Please select valid status choice')
        .isIn(['draft', 'published'])
];

exports.categoryValidation = [
    body('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title length should have at lease 3 charachters'),
    body('status', 'Please select valid status choice')
        .isIn(['draft', 'published'])
];

exports.tagValidation = [
    body('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title length should have at lease 3 charachters'),
    body('status', 'Please select valid status choice')
        .isIn(['draft', 'published'])
];

exports.profileValidation = [
    body('email', 'Please fill the email field correctly')
        .isEmail()
        .trim(),
    body('firstName', 'Please fill the first name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name length should have at lease 2 charachters'),
    body('lastName', 'Please fill the last name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name length should have at lease 2 charachters'),
];

exports.changePasswordValidation = [
    body('currentPassword', 'Please fill the current password field')
        .trim(),
    body('newPassword', 'Please fill the new password field')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password length should have at lease 5 charachters'),
    body('confirmPassword', 'Please fill the last name field')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match new password');
            }
            return true;
        })
];