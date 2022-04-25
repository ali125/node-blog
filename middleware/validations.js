const { body } = require('express-validator');

exports.categoryValidation = [
    body('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('status', 'Please select valid status choice')
        .isIn(['draft', 'published'])
];

exports.tagValidation = [
    body('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('status', 'Please select valid status choice')
        .isIn(['draft', 'published'])
]