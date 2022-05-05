"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidation = exports.profileValidation = exports.updateUserValidation = exports.userValidation = exports.tagValidation = exports.categoryValidation = exports.postValidation = exports.resetPasswordValidation = exports.resetValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
exports.registerValidation = [
    (0, express_validator_1.body)('email', 'Please fill the email field correctly')
        .isEmail()
        .trim()
        .custom((value) => {
        return user_1.default.findOne({ where: { email: value } }).then((user) => {
            if (user) {
                return Promise.reject('Email exists already, Please pick a different one.');
            }
        });
    }),
    (0, express_validator_1.body)('password', 'Please fill the password field')
        .isLength({ min: 5 })
        .withMessage('Password length should have at lease 5 charachters')
        .trim(),
    (0, express_validator_1.body)('firstName', 'Please fill the first name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name length should have at lease 2 charachters'),
    (0, express_validator_1.body)('lastName', 'Please fill the last name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name length should have at lease 2 charachters'),
];
exports.loginValidation = [
    (0, express_validator_1.body)('email', 'Please fill the email field correctly')
        .isEmail()
        .trim(),
    (0, express_validator_1.body)('password', 'Please fill the password field')
        .trim(),
];
exports.resetValidation = [
    (0, express_validator_1.body)('email', 'Please fill the email field correctly')
        .isEmail()
        .trim(),
];
exports.resetPasswordValidation = [
    (0, express_validator_1.body)('newPassword', 'Please fill the new password field')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password length should have at lease 5 charachters'),
    (0, express_validator_1.body)('confirmPassword', 'Please fill the last name field')
        .trim()
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match new password');
        }
        return true;
    })
];
exports.postValidation = [
    (0, express_validator_1.body)('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title length should have at lease 3 charachters'),
    (0, express_validator_1.body)('content', 'Please fill the content field')
        .isString()
        .trim()
        .isLength({ min: 5 })
        .withMessage('Content length should have at lease 5 charachters'),
    (0, express_validator_1.body)('status', 'Please select valid status choice')
        .isIn(['draft', 'published'])
];
exports.categoryValidation = [
    (0, express_validator_1.body)('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title length should have at lease 3 charachters'),
    (0, express_validator_1.body)('status', 'Please select valid status choice')
        .isIn(['draft', 'published'])
];
exports.tagValidation = [
    (0, express_validator_1.body)('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title length should have at lease 3 charachters'),
    (0, express_validator_1.body)('status', 'Please select valid status choice')
        .isIn(['draft', 'published'])
];
exports.userValidation = [
    (0, express_validator_1.body)('email', 'Please fill the email field correctly')
        .isEmail()
        .trim()
        .custom((value) => {
        return user_1.default.findOne({ where: { email: value } }).then((user) => {
            if (user) {
                return Promise.reject('Email exists already, Please pick a different one.');
            }
        });
    }),
    (0, express_validator_1.body)('firstName', 'Please fill the first name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name length should have at lease 2 charachters'),
    (0, express_validator_1.body)('lastName', 'Please fill the last name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name length should have at lease 2 charachters'),
    (0, express_validator_1.body)('password', 'Please fill the password field')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password length should have at lease 5 charachters'),
];
exports.updateUserValidation = [
    (0, express_validator_1.body)('email', 'Please fill the email field correctly')
        .isEmail()
        .trim(),
    (0, express_validator_1.body)('firstName', 'Please fill the first name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name length should have at lease 2 charachters'),
    (0, express_validator_1.body)('lastName', 'Please fill the last name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name length should have at lease 2 charachters'),
];
exports.profileValidation = [
    (0, express_validator_1.body)('email', 'Please fill the email field correctly')
        .isEmail()
        .trim(),
    (0, express_validator_1.body)('firstName', 'Please fill the first name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name length should have at lease 2 charachters'),
    (0, express_validator_1.body)('lastName', 'Please fill the last name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name length should have at lease 2 charachters'),
];
exports.changePasswordValidation = [
    (0, express_validator_1.body)('currentPassword', 'Please fill the current password field')
        .trim(),
    (0, express_validator_1.body)('newPassword', 'Please fill the new password field')
        .trim()
        .isLength({ min: 5 })
        .withMessage('New password length should have at lease 5 charachters'),
    (0, express_validator_1.body)('confirmPassword', 'Please fill the last name field')
        .trim()
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match new password');
        }
        return true;
    })
];
